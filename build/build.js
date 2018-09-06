// https://github.com/shelljs/shelljs
require('./check-versions')();

process.env.NODE_ENV = 'production';
process.env.THEME_COLOR = 'b';
var fs = require('fs');
var ora = require('ora');
var path = require('path');
var chalk = require('chalk');
var shell = require('shelljs');
var webpack = require('webpack');
var config = require('./config');
var webpackConfig = require('./webpack.prod.conf');

var spinner = ora('building for production...');
spinner.start();

var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory);
shell.rm('-rf', config.build.assetsRoot);//删除 cdn 到时候构建多个皮肤的时候 需要删除
// shell.mkdir('-p', assetsPath)
shell.config.silent = true;
// shell.cp('-R', 'public/static', assetsPath)
shell.rm(config.variablesStyleFileName.v);
shell.cp(config.variablesStyleFileName.b, config.variablesStyleFileName.v);
shell.config.silent = false;

webpack(webpackConfig, function (err, stats) {
  spinner.stop();
  if (err) throw err;
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n\n');

  console.log(chalk.red('------------------------------------------------------ Build' +
    chalk.blue.underline.bold(' blue theme ') +
    'complete ------------------------------------------------------------------------\n'));

});
