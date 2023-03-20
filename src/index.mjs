import { cac } from 'cac'
import chalk from 'chalk';
import { ApiTest } from './main.mjs';
import { readConfigFromYaml } from './util.mjs';

const { red } = chalk;

(() => {
  const data = readConfigFromYaml();

  if (!data) {
    console.log(red(`配置文件不存在或格式错误，请检查；配置文件路径为 ${'.api_test.yml'}`));
    return;
  }

  const { origin, dbpath, apis } = data;

  if (!origin) {
    console.log(red(`配置文件缺失 origin 字段，请检查配置文件`));
    return;
  }

  if (!apis) {
    console.log(red(`配置文件缺失 apis 字段，请检查配置文件`));
    return;
  }

  if (!dbpath) {
    console.log(red(`配置文件缺失 dbpath 字段，请检查配置文件`));
    return;
  }

  const apiTest = new ApiTest(
    origin,
    apis,
    dbpath
  )

  const cli = cac();

  cli.command('run', '开始接口测试').action(() => apiTest.run());
  cli.command('update', '更新本地快照').action(() => apiTest.update());
  cli.help();
  cli.parse();
})();