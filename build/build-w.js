// https://github.com/shelljs/shelljs
require('./check-versions')();

process.env.NODE_ENV = 'production';
process.env.THEME_COLOR = 'w';
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
//save css map file to dist
shell.rm('-rf', path.resolve(__dirname, '../dist/'));
shell.rm('-rf', config.build.assetsRoot);
shell.mkdir('-p', assetsPath);

shell.rm(config.variablesStyleFileName.v);
shell.cp(config.variablesStyleFileName.w, config.variablesStyleFileName.v);

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
    chalk.white.underline.bold(' white theme ') +
    'complete ------------------------------------------------------------------------\n'));

});
