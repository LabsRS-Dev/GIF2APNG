import { BS, Observable, Util, _ } from 'dove.max.sdk'
import Vue from 'vue'


const __$g$ = {
  eventBus: new Vue(),
  data: [],

  find: function () {
  },
  getAll: function () {
    return this.data
  },
  add: function (opt) {
    var index = _.findIndex(this.data, opt, true)
    if (index == -1) {
      this.data.push(opt)
    }
    console.log(this.data)
  },
  remove: function (index) {
    this.data.splice(index, 1)
  },
  removeAll: function (opt) {
    this.data.length = 0
  },
  update: function (opt) {

  }
}

const __$m$ = {
  dataList: [],
  find: function () {
  },
  getAll: function () {
    var t$ = this
    return t$.dataList
  },
  add: function (opt) {
    var t$ = this
    var index = _.findIndex(t$.dataList, opt, true)
    if (index == -1) {
      t$.dataList.push(opt)
    }
    console.log(t$.dataList)
  },
  remove: function (index) {
    var t$ = this
    t$.dataList.splice(index, 1)
  },
  removeAll: function (opt) {
    var t$ = this
    t$.dataList.length = 0
  },
  update: function (opt) {
  }
}

var DownloadMgrClass = Observable.extend(__$g$)
var DownloadHandler = new DownloadMgrClass()
var DownloadAlbClass = Observable.extend(__$m$)
var DownloadAlbum = new DownloadAlbClass()


/**
 * 初始化启动
 */
var $ = Util.util.getJQuery$()
$(document).ready(function () {
  window.DownloadHandler = DownloadHandler
  window.DownloadAlbum = DownloadAlbum
})

export {
  DownloadHandler,
  DownloadAlbum
}


