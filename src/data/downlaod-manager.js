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
  eventBus: new Vue(),
  data: [],
  find: function () {
  },
  getAll: function () {
    return this.data
  },
  add: function (opt) {
    _.each(opt, (ele) => {
      var index = _.findIndex(this.data, { id: ele.id }, true)
      if (index == -1) {
        this.data.push(ele)
      }
    })
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


