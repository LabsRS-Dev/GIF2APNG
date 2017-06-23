<template>
  <section class="page page-app-doc">
    <div class="page__toolbar page__toolbar-app-doc">
            <ui-icon-button
                @click="onToolBtnClick(index, item)"
                :type="item.type"
                :size="item.size"
                :color="item.color"
                :key="item.id"
                v-if="item.visiable"
                v-for="item, index in actionList"
                >
                    <span :class="item.icon" :title="$t(item.tooltip)"></span>
            </ui-icon-button>

            <ui-confirm
                :autofocus="optionsConfigDialog.autofocus"
                :confirm-button-text="optionsConfigDialog.confirmButtonText"
                :deny-button-text="optionsConfigDialog.denyButtonText"
                :ref="optionsConfigDialog.ref"
                :title="optionsConfigDialog.title"

                @confirm="optionsConfigDialog.callbackConfirm"
                @deny="optionsConfigDialog.callbackDeny"
                @open="optionsConfigDialog.callbackOpen"
                @close="optionsConfigDialog.callbackClose"
                >
                <div class="page__toolbar-app-doc__options">
                    <span class="page__toolbar-app-doc__options__language">{{ $t('pages.welcome.options.language') }}</span>
                    <ui-select
                        :options="availableLanguageList"
                        v-model="lastLanguageSetting"
                        >
                    </ui-select>
                </div>
            </ui-confirm>
    </div>
    <div class="page__examples page__examples-app-doc">
      <div class="page__app__welcome">
        <div class="page__examples-app-doc__welcome"
            v-show="newsList.length <= 0"
            >
        </div>
        <ui-alert
            :dismissible="false"
            :class="getItemStyleClass(item)"
            :type="item.style.type"
            v-show="item.style.show"
            :key="item"
            v-for="item, index in newsList">
            <div class="page__examples-app-doc__item">
                <div class="ui-toolbar__top">
                    <div class="ui-toolbar__top__metainfo">
                        <img :src="item.thumb" width="48" height="48" viewBox="0 0 48 48" />
                        <strong class="ui-toolbar__top__news__title">
                            {{ item.title }}
                            <sup class="ui-toolbar__top__news__date">
                            {{ item.date ? '(' + item.date + ')' : '' }}
                            </sup>
                        </strong>
                    </div>
                    <div class="ui-toolbar__top__metainfo__toolbar">
                        <ui-icon-button
                            @click="onOpenLink(item.link)"
                            type="secondary"
                            color="black"
                            size="small"
                            >
                            <span class="fa fa-link fa-lg fa-fw" :title=" $t('pages.welcome.task-item.onOpenLink') "></span>
                        </ui-icon-button>
                    </div>
                </div>
                <div class="ui-toolbar__body">
                    <p class="ui-toolbar__body__news__description">{{ item.description }}</p>
                </div>
                <div class="ui-toolbar__bottom">
                </div>
            </div>
        </ui-alert>
      </div>
    </div>
  </section>
</template>

<script>
import { BS, Util, _ } from 'dove.max.sdk'
import {UiIcon, UiTabs, UiTab, UiConfirm, UiButton, UiIconButton, UiAlert, UiToolbar, UiProgressLinear} from 'keen-ui';
import {Transfer} from '../../bridge/transfer'
import {SysConfig} from '../../data/sys-config'
import { languageConfiguration } from '../../extern.js'


var store_newsList = []
class News {
  constructor(thumb, title, date, description, link) {
    this.id = _.uniqueId('welcome-news-id-')
    this.thumb = thumb             // 缩略图
    this.title = title             // 新闻标题
    this.date = date               // 新闻创建的时间
    this.description = description // 新闻描述
    this.link = link               // 新闻的链接地址

    /// ------- 展示样式相关
    this.style = {
      show: true,
      type: "success"
    }
  }
}

//// 与设置相关的处理
class Settings {
    static key = "welcome-page-settings"

    static instance = null
    static shareInstance(){
        if (!Settings.instance){
            Settings.instance = new Settings()
        }
        return Settings.instance
    }

    constructor(){
        this.data = {
            lastSelectLanguage: ""
        }
    }

    restore(){
        var ls = window.localStorage
        var local = {}
        if(ls){
            var str = ls.getItem(Settings.key)
            if(_.isString(str)){
                local = JSON.parse(str)
                this.data = _.extend(this.data, local)
            }
        }
    }

    save(){
        var ls = window.localStorage;
        if(ls){
            ls.setItem(Settings.key, JSON.stringify(this.data))
        }
    }
}

var $LS$ = Settings.shareInstance()
///
var hasInited = false;     // 是否初始过
////////////////////////////////////////////////////////

export default {
  data(){
    return {
      newsList: store_newsList,
      lastLanguageSetting: $LS$.data.lastSelectLanguage,
      availableLanguageList: languageConfiguration.languageInfoMap(),
      optionsConfigDialog:{
          ref: 'optionsConfigDialog',
          autofocus: 'none',
          confirmButtonText: 'Confirm',
          denyButtonText: 'Deny',
          title: '',
          callbackConfirm: ()=>{},
          callbackDeny: ()=>{},
          callbackOpen: ()=>{},
          callbackClose: ()=>{},
      }
    }
  },
  beforeCreate(){
      $LS$.restore()
  },
  mounted(){
    var that = this
    if(!hasInited){
      hasInited = true
      that.initFirstNews()
      that.getNewList()
    }
  },
  computed: {
    actionList() {
      var that = this
      return [
        {id:'action-setting', visiable:true, color:"black", icon:"fa fa-cog fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.welcome.toolbar.setting"},
        {id:'action-online-doc', visiable:true, color:"black", icon:"fa fa-book fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.welcome.toolbar.onlineDoc"},
        {id:'action-online-room', visiable:true, color:"black", icon:"fa fa-users fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.welcome.toolbar.onlineRoom"},
        {id:'action-update-news', visiable:true, color:"black", icon:"fa fa-rss fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.welcome.toolbar.updateNews"}
      ]
    }
  },
  methods:{
    initFirstNews(){
      console.log('initFirstNews')
      var that = this
      var list = []
      list.push({
          title: SysConfig.appName + '\t' + SysConfig.version ,
          date:'',
          description:`
            Welcome to Gmagon.com
          `,
          link: SysConfig.companyWebsiteHomepage
      })
      _.each(list, function(ele){
          let newsObj = new News(ele.thumb || "images/logo_64x64.png", ele.title, ele.date, ele.description, ele.link)
          that.newsList.push(newsObj)
      })
      store_newsList = that.newsList
    },
    getNewList(){
      var that = this
      const newsUrl = SysConfig.newsDataUrl
      var $ = Util.util.getJQuery$()
      $.getJSON(newsUrl, function(data){
        that.newsList = []
        that.initFirstNews()
        _.each(data.list, function(ele){
            let newsObj = new News(ele.thumb || "images/picture.svg", ele.title, ele.date, ele.description, ele.link)
            that.newsList.push(newsObj)
        })
        store_newsList = that.newsList
      })
    },
    // ------------------------- Style
    getItemStyleClass(item){
      var _styleClass = ['']
      return _styleClass
    },

    onOpenLink(link){
      BS.b$.App.open(link)
    },

    // -------------------------- Tool bar
    onToolBtnClick(index, item){
        console.log('onToolBtnClick', index)

        if(item.id === 'action-setting') {
            this.onBtnSettingClick()
        }else if (item.id === 'action-online-doc') {
            this.onBtnOnlineDocClick()
        }else if (item.id === 'action-online-room') {
            this.onBtnOnlineSupportClick()
        }else if (item.id === 'action-update-news') {
            this.getNewList()
        }
    },

    onBtnSettingClick(){
      var that = this
      console.log("-------------------- call options dir")
      const cdg = that.optionsConfigDialog
      cdg.title = that.$t('pages.welcome.dialog-config-output.title')
      cdg.confirmButtonText = that.$t('pages.welcome.dialog-config-output.btnConfirm')
      cdg.denyButtonText = that.$t('pages.welcome.dialog-config-output.btnDeny')
      cdg.callbackConfirm = () => { that.saveLanguageSettings() }
      cdg.callbackDeny = () => { that.resetLanguageSettings() }
      cdg.callbackClose = () => { that.resetLanguageSettings() }
      var dialog = that.$refs[cdg.ref]
      dialog.open()
    },
    __switchLanguageSettings(){
        var that = this
        var languageInfo = BS.b$.App.getCompatibleGoogleLanguageInfo().local
        var infoKeys =  Object.getOwnPropertyNames(languageInfo)
        var languageMap = BS.b$.App.nativeApple2WebKitLanguageMap
        var mapKeys = Object.getOwnPropertyNames(languageMap)
        var localLanguagePackList = ['en-US','zh-CN']
        var langInfo
        var lastLangInfo
        var valueList = []
        for(var i = 0;i<infoKeys.length;i++){
            if(languageInfo[infoKeys[i]] == that.lastLanguageSetting){
                langInfo = infoKeys[i]
                break;
            }
        }
        for(var i = 0;i<mapKeys.length;i++){
            valueList = languageMap[mapKeys[i]]
            if(valueList.indexOf(langInfo) > -1){
                 lastLangInfo = _.intersection(valueList,localLanguagePackList).toString()
                break;
            }
        }
        return lastLangInfo
    },

    saveLanguageSettings(){
        var that = this
        $LS$.data.lastSelectLanguage = that.lastLanguageSetting
        $LS$.save()
        var switchLanguageMap = that.__switchLanguageSettings()
        languageConfiguration.switchLanguage(switchLanguageMap)
    },
    resetLanguageSettings(){
        var that = this
        that.lastLanguageSetting = $LS$.data.lastSelectLanguage
    },

    onBtnOnlineDocClick(){
      console.log(SysConfig.docPage)
      BS.b$.App.open(SysConfig.docPage)
    },

    onBtnOnlineSupportClick(){
      console.log(SysConfig.support)
      BS.b$.App.open(SysConfig.support)
    },

    // -------------------------- Page UiButton
    onPageBtnClick(index, item){
      console.log('onPageBtnClick', index)
    }
  },
  components: {
      UiIcon,
      UiTabs,
      UiTab,
      UiButton,
      UiIconButton,
      UiAlert,
      UiToolbar,
      UiConfirm,
      UiProgressLinear
  }
}


</script>