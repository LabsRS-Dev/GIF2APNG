/**
 * @description 这里统一引入外部，全局的扩展
 * @author ian sun
 */

// /-----------------------------------------------------------
// /CSS
import 'keen-ui-css'

// /JS
import './test/bridge/test_transfer.js'
//
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import { BS, Util, _ } from 'dove.max.sdk'


const obj = {}

const $ = Util.util.getJQuery$()
const languageList = BS.b$.App.getCompatibleWebkitLanguageList()
const localLanguagePackList = ['en-US','zh-CN']
const lang = _.intersection(languageList,localLanguagePackList).toString()


const languageConfiguration = {
    i18nVueObj: null,

    switchLanguage: function (lang) {
      var t$ = this
      t$.___useJQueryGet(lang, (lang, messages)=> {
          t$.i18nVueObj.setLocaleMessage(lang, messages)
          t$.i18nVueObj.locale = lang
      })
    },

    languageInfoMap: function(){
      var languageListInfo=[]
      _.each(localLanguagePackList,function(lang){
        var languageInfo = BS.b$.App.getCompatibleGoogleLanguageInfo().local
        var infoKeys =  Object.getOwnPropertyNames(languageInfo)
        var languageMap = BS.b$.App.nativeApple2WebKitLanguageMap
        var mapKeys = Object.getOwnPropertyNames(languageMap)

        var valueList = []
        for(var i = 0;i<mapKeys.length;i++){
          valueList = languageMap[mapKeys[i]]
          if(valueList.indexOf(lang) > -1){
            break;
          }else {
            valueList = []
          }
        }
        if(valueList.length > 0) {
          const lnm = _.intersection(infoKeys,valueList).toString()
          var languageList = BS.b$.App.getCompatibleGoogleLanguageInfo().local[lnm]
          languageListInfo.push(languageList)
        }
      })
      return languageListInfo
    },

      /**
     * 由于ES6 中的Fetch函数，暂时还不能使用Babel转换成ES5标准的，所以统一使用jQuery来处理
     * 参考：
     * 1. https://www.npmjs.com/package/isomorphic-fetch
     * 2. https://www.npmjs.com/package/fetch-polyfill
     */
    ___useES6Fetch:function (lang, cb) {
      var t$ = this
      Vue.locale(lang, () => {
        const langJsonFile = './locale/' + lang + '.json'
        return fetch(langJsonFile, {
          method: 'get',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        }).then(res => {
          return res.json()
        }).then(json => {
          if (Object.keys(json).length === 0) {
            return Promise.reject(new Error('locale empty !!'))
          }
          return Promise.resolve(json)
        }).catch(err => {
          console.error(err)
          return Promise.reject()
        })
      }, () => {
        console.log('set lang....')
        Vue.config.lang = lang
        cb()
      })
    },

    ___useJQueryGet:function (lang, cb) {
      var t$ = this
      const langJsonFile = './locale/' + lang + '.json'
      $.getJSON(langJsonFile, json => {
        console.log('set lang....')
        Vue.config.lang = lang
        const locales = {}
        locales[lang] = json

        if (!t$.i18nVueObj){
          t$.i18nVueObj = new VueI18n({
            locale: lang,
            messages: locales
          })
          cb && cb(t$.i18nVueObj)
        }else {
          cb && cb(lang, json)
        }
      }).fail(err => {
        console.error(err)
        cb(new VueI18n({
          locale: 'en-us',
          messages: {}
        }))
      })
    }
}

window.languageConfiguration = languageConfiguration
export default {
  obj
}

export { languageConfiguration }