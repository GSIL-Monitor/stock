var path = require('path');
var config = require('./config');
var fs = require('fs');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

exports.assetsPath = function (_path, name, hash, ext) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory : config.dev.assetsSubDirectory;
  var color = process.env.THEME_COLOR;
  if (color == 'w') {
    if (ext == 'css') {
      // --- 不直接输出到最终目录是为了，在 rename 之后使得不同颜色的同一页面的 css 文件的 hash 值相同
      return path.posix.join(assetsSubDirectory, _path + '/../../dist/css' + name + '-w.' + ext)
    }
    // if(ext == '[ext]'){
    //     return path.posix.join(assetsSubDirectory, _path + name + '.' + ext)
    // }
  } else if (color == 'd') {
    if (ext == 'css') {
      // --- 不直接输出到最终目录是为了，在 rename 之后使得不同颜色的同一页面的 css 文件的 hash 值相同
      return path.posix.join(assetsSubDirectory, _path + '/../../dist/css' + name + '-d.' + ext)
    }
    // if(ext == '[ext]'){
    //     return path.posix.join(assetsSubDirectory, _path + name + '.' + ext)
    // }
  }
  // console.log(path.posix.join(assetsSubDirectory, _path + name + '.' + hash + '.' + ext));

  return path.posix.join(assetsSubDirectory, _path + name + '.' + hash + '.' + ext)
}

exports.cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    var loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}
