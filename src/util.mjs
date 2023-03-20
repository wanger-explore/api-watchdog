import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs';
import { get, isObject, isArray } from 'lodash-es';
import { diffString, diff } from 'json-diff';
import yaml from 'js-yaml';


const __dirname = dirname(fileURLToPath(import.meta.url));

const dafaultDbPath = join(__dirname, 'db.json');

/**
 * @description 根据接口的返回数据，整理出数据对象
 * 
 * @param {*} data 接口返回的数据
 * @returns {object | undefined} 的数据对象
 */
const normalizeData = (data) => {
  if (data.resultCode !== undefined && data.result && get(data, 'result.total') && get(data, 'result.items[0]')) {
    return get(data, 'result.items.[0]');
  }
  if (data.resultCode !== undefined && data.result && isObject(data.result)) {
    return data.result;
  }
  if (data.total !== undefined && get(data, 'items[0]')) {
    return get(data, 'items.[0]');
  }
  if (isObject(data)) {
    return data;
  }
  console.error(`normalizeData fn error, 原因：无法识别的数据格式，数据为：${JSON.stringify(data)}`);
}

/**
 * @description 将数据对象的 value 改为其类型
 * 
 * @example 
 *  { a: 1, b: 2, c: 3 } => { a: 'number', b: 'number', c: 'number' }
 * 
 * @param {object} object 
 */
const genObjectKeyType = (object) => {
  if (!isObject(object)) {
    return typeof object;
  };

  Object.entries(object).forEach(([key, value]) => {
    if (isArray(value)) {
      object[key] = genObjectKeyType([value[0]]);
    } else if (isObject(value)) {
      object[key] = genObjectKeyType(value);
    } else {
      object[key] = typeof value;
    }
  })

  return object;
}

/**
 * 新旧快照做个 diff
 * 
 * @param {*} old 老的快照数据
 * @param {*} current 新请求到的数据
 * @param {boolean} option.showDiff 是否显示 diff，默认为 true
 * @returns 
 */
const dataDiff = (old, current, option) => {
  const { showDiff = true } = option || {};
  if (showDiff) {
    console.log(diffString(old, current));
  }
  return diff(old, current);
}

/**
 * 读取 yml 配置文件中的配置， 默认配置文件为 .api_test.yml
 * 
 * @param {*} path 
 * @returns 
 */
const readConfigFromYaml = (path = join(process.cwd(), '.api_test.yml')) => {
  try {
    const config = yaml.load(readFileSync(path, 'utf8'));
    return config;
  } catch (e) {
    console.log(`读取配置文件异常，cause: ${String(e)}`);
  }
}

export {
  __dirname,
  dafaultDbPath,
  normalizeData,
  dataDiff,
  genObjectKeyType,
  readConfigFromYaml
}