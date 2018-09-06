
var chalk = require('chalk')
var fs = require('fs')
var path = require('path')
var shell = require('shelljs')
// console.log(path.resolve(__dirname, '../cdn/static'));

var styleMapFilesArr = shell.find('./cdn').filter(function(file){return file.match(/\.css.map$/)})
// console.log(styleMapFilesArr);

var styleFilesArr = shell.find('./cdn').filter(function(file){return file.match(/\.css$/)})
// console.log(styleFilesArr);

// --- 处理 css map 文件
styleMapFilesArr.forEach(function (val, index, arr) {
    // console.log(val);
    // console.log(val.split('/')[3]);
    shell.cp(path.resolve(__dirname, '../dist/css/' + val.split('/')[2].replace(/\.[\w]+\./i,'.').replace(/[.]/i,'-w.')), path.resolve(__dirname, '../cdn/css/' + val.split('/')[2].replace(/[.]/i,'-w.')))
    shell.cp(path.resolve(__dirname, '../dist/css/' + val.split('/')[2].replace(/\.[\w]+\./i,'.').replace(/[.]/i,'-d.')), path.resolve(__dirname, '../cdn/css/' + val.split('/')[2].replace(/[.]/i,'-d.')))
})

// --- 处理 css 文件
styleFilesArr.forEach(function (val, index, arr) {
    // --- 文件名
    var fileName = val.split('/')[2]
    // --- 模块名
    var moduleName = fileName.split('.')[0]
    // --- hash
    var hash = fileName.split('.')[1]

    // --- 读取文件
    var fileData = fs.readFileSync(path.resolve(__dirname, '../dist/css/' + moduleName + '-w' + '.css'), 'utf-8')
    var fileData_d = fs.readFileSync(path.resolve(__dirname, '../dist/css/' + moduleName + '-d' + '.css'), 'utf-8')

    // ---w 处理文件
    var output = fileData.replace(/[\}]/g, ';}')
                    // .replace(/(?!(opacity))[\w-]+:[\w\-\%\"\!\.\s\(\)]+;/g, '')
                    .replace(/font-family:[\w\s\,\-\'\"]+;/g, '')
                    .replace(/[\.\#\w\-\>\[\]\=\:\(\)\*\,\s]+{}/g, '')
                    .replace(/;}/g, '}')
                    //tagResult.vue动画白版异常
                    .replace(/((\@keyframes)|(\@\-webkit\-keyframes))\s*[\w\_]+\{([\w\%]+\{\w*\})+\}/g,'')
    // ---d 处理文件
    var output_d = fileData_d.replace(/[\}]/g, ';}')
                    // .replace(/(?!(opacity))[\w-]+:[\w\-\%\"\!\.\s\(\)]+;/g, '')
                    .replace(/font-family:[\w\s\,\-\'\"]+;/g, '')
                    .replace(/[\.\#\w\-\>\[\]\=\:\(\)\*\,\s]+{}/g, '')
                    .replace(/;}/g, '}')
                    //tagResult.vue动画白版异常
                    .replace(/((\@keyframes)|(\@\-webkit\-keyframes))\s*[\w\_]+\{([\w\%]+\{\w*\})+\}/g,'')

    // --- w 写入文件
    fs.writeFileSync(path.resolve(__dirname, '../cdn/css/' + moduleName + '-w.' + hash + '.css'), output)
    // --- d 写入文件
    fs.writeFileSync(path.resolve(__dirname, '../cdn/css/' + moduleName + '-d.' + hash + '.css'), output_d)
});

//Rename white and dark theme to cdn/css/ 
console.log(chalk.cyan(' ------------------------------ Rename complete ------------------------------\n\n'))
