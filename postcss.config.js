// 处理CSS的兼容性的 Autoprefixer:一个以最好的方式处理浏览器前缀的后处理程序
// https://npm.taobao.org/package/autoprefixer
const postcss_autoprefixer = require('autoprefixer')
const postcss_cssnext = require('postcss-cssnext')
const postcss_viewport_units = require('postcss-viewport-units')
const postcss_vmin = require('postcss-vmin')
const postcss_import = require('postcss-import')

const compatible_browsers = [
  'last 10 version',
  'last 10 Chrome versions',
  'ios >= 4',
  'ie > 8',
  'Firefox ESR',
  'android >= 4.0',
  'Firefox >= 3',
  'Safari >= 2'
]

module.exports = {
  plugins: [
    postcss_import,
    postcss_cssnext({
      warnForDuplicates: false,
      browsers: compatible_browsers
    }),
    postcss_viewport_units,
    postcss_vmin,
    postcss_autoprefixer({
      browsers: compatible_browsers
    })
  ]
}

