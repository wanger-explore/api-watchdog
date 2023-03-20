import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path'
import fetch from 'node-fetch';
import chalk from 'chalk';
import { snapshotDB } from './db.mjs';
import dayjs from 'dayjs';
import { sendMarkdown } from './dingtalk.mjs';
import { __dirname, normalizeData, dataDiff, genObjectKeyType } from './util.mjs';

const { blue, green, red } = chalk;

/**
 * @param {string} origin 服务端地址
 * @param {string[]} apis 待测试接口地址列表
 * @param {string} dbpath 快照持久化路径
 * @param {string} logpath 日志持久化路径
 */
export class ApiTest {
  constructor(
    origin,
    apis,
    dbpath,
  ) {
    this.origin = origin;
    this.apis = apis;
    this.dbpath = dbpath;
    this.db = new snapshotDB(join(__dirname, dbpath));
  }

  // 获取接口全路径
  get apiFullUrlList() {
    return this.apis.map((url) => `${this.origin}${url}`);
  }

  // 启动测试
  async run() {
    console.log(blue('服务端拉取数据中...'));
    const data = await this.getDataFromServer();
    const old = this.getSnapShot();
    console.log(blue('开始比对快照...'));
    const diffData = await this.compareSnapShot(old, data);
    if (!diffData) {
      console.log('🎉🎉🎉', green('一切正常，快照数据一致'));
    } else {
      const logDir = resolve(process.cwd(), 'log');
      if (!existsSync(logDir)) {
        mkdirSync(logDir, { recursive: true });
      }
      const logPath = resolve(logDir, `log-${dayjs().format('YYYY-MM-DD-HH-mm-ss')}.json`);
      console.log('❌❌❌', red(`服务接和当前快照不一致，似乎有变化，详情已写入 ${logPath} 请检查`));
      const diffDataString = JSON.stringify(diffData, null, 2);
      // const markdownDataString = '> ' + diffDataString.split('\n').join('\n> ');
      // 注释掉钉钉通知
      // await sendMarkdown(`## API接口数据变化\n\n\ ${markdownDataString}\n`);

      writeFileSync(logPath, diffDataString);
    }
  }

  // 新旧快照对比
  async compareSnapShot(old, current, option) {
    return dataDiff(old, current, option);
  }

  /**
   * 从服务端获取数据
   * 
   * @param {boolean} option.concurrent 是否并发请求，默认为 true
   * @returns 
   */
  async getDataFromServer(option) {
    const { concurrent = true } = option || {};
    const data = {};

    if (!concurrent) {
      // 串型请求接口
      for (const url of this.apiFullUrlList) {
        let jsonData;
        try {
          const response = await fetch(url);
          jsonData = await response.json();
        } catch (e) {
          data[url] = { networkError: '网络请求异常，接口可能不存在' };
          console.error(`getDataFromServer networkError: url:${url}, error:${String(e)}`);
          continue;
        }
        try {
          const normalizedData = normalizeData(jsonData);
          data[url] = genObjectKeyType(normalizedData);
        } catch (e) {
          data[url] = { handleError: `数据处理异常，请联系开发者；报错原因：${String(e)}, 原始数据：${JSON.stringify(jsonData)}` };
          console.error(`getDataFromServer handleError: url:${url}, error:${String(e)}`);
          continue;
        }
      }
    } else {
      // 并发请求接口
      const promises = this.apiFullUrlList.map(async (url) => await fetch(url));
      for (const [index, promise] of promises.entries()) {
        const url = this.apiFullUrlList[index];
        let jsonData;
        try {
          const response = await promise;
          jsonData = await response.json();
        } catch (e) {
          data[url] = { networkError: '网络请求异常，接口可能不存在' };
          console.error(`getDataFromServer networkError: url:${url}, error:${String(e)}`);
          continue;
        }
        try {
          const normalizedData = normalizeData(jsonData);
          data[url] = genObjectKeyType(normalizedData);
        } catch (e) {
          data[url] = { handleError: `数据处理异常，请联系开发者；报错原因：${String(e)}, 原始数据：${JSON.stringify(jsonData)}` };
          console.error(`getDataFromServer handleError: url:${url}, error:${String(e)}`);
          continue;
        }
      }
    }
    return data;
  }

  // 根据请求的接口数据来更新快照
  async updateSnapShot() {
    const data = await this.getDataFromServer();
    this.setSnapShot(data);
    console.log('🎉🎉🎉', green('快照更新成功'));
  }

  // updateSnapShot 的别名
  async update() {
    this.updateSnapShot();
  }

  // 读取快照
  getSnapShot() {
    return this.db.data;
  }

  // 设置快照
  setSnapShot(data) {
    if (!data) {
      console.error('data is required');
      return;
    }
    this.db.write(data);
  }
}