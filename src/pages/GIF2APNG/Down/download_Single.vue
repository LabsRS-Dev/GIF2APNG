<template>
    <div class="page__download__router__content__single">
        <div class="page__download__router__content__single__title">
            <ui-icon-button
                @click="onToolBtnClick(index, item)"
                :type="item.type"
                :size="item.size"
                :color="item.color"
                :key="item.id"
                v-if="item.visiable"
                v-for="(item, index) in actionList"
                >
                    <span :class="item.icon" :title="$t(item.tooltip)"></span>
            </ui-icon-button>

            <ui-confirm
                :autofocus="confirmDialog.autofocus"
                :confirm-button-text="confirmDialog.confirmButtonText"
                :deny-button-text="confirmDialog.denyButtonText"
                :ref="confirmDialog.ref"
                :title="confirmDialog.title"

                @confirm="confirmDialog.callbackConfirm"
                @deny="confirmDialog.callbackDeny"
                @open="confirmDialog.callbackOpen"
                @close="confirmDialog.callbackClose"
                >
                {{ confirmDialog.content }}
            </ui-confirm>
            <ui-confirm
                :autofocus="outputConfigDialog.autofocus"
                :confirm-button-text="outputConfigDialog.confirmButtonText"
                :deny-button-text="outputConfigDialog.denyButtonText"
                :ref="outputConfigDialog.ref"
                :title="outputConfigDialog.title"

                @confirm="outputConfigDialog.callbackConfirm"
                @deny="outputConfigDialog.callbackDeny"
                @open="outputConfigDialog.callbackOpen"
                @close="outputConfigDialog.callbackClose"
                >
                <div class="page__download__router__content__single__title__input-group">
                    <div class="page__download__router__content__single__title__input-browse">
                        <span class="input-group-addon">{{ $t('pages.download.dialog-config-output.path') }}</span>
                        <ui-select
                            :options="availableOutputPathList"
                            v-model="lastOutputPath"
                            >
                        </ui-select>
                        <ui-button
                            type="secondary"
                            size="small"
                            color="primary"
                            @click="onOpenSelectOutDir()"
                            >
                            <i class="fa fa-folder-open fa-lg"></i>
                        </ui-button>
                    </div>
                    <div class="page__download__router__content__single__title__input-cover">
                        <ui-checkbox
                            v-model="enableOverWriteOutput"
                            >
                        </ui-checkbox>
                        <span class="input-group-cover">{{ $t('pages.download.dialog-config-output.cover') }}</span>
                    </div>
                </div>
            </ui-confirm>
        </div>
        <div class="page__download__router__content__single__content">
            <svg
                :id="welcomeContentID"
                class="page__download__router__content__single__content__welcome"
                v-show="downloadList.length <= 0"
            />
             <ui-alert
                :class="getItemStyleClass(item)"
                :type="item.style.type"
                :key="item.id"
                removeIcon
                @dismiss="onRemoveTaskItem(item, index)"
                v-show="item.style.show"
                v-for="(item, index) in downloadList">
                 <div class="page__download__router__content__single__content__item">
                    <div class="ui-toolbar__top">
                        <div class="ui-toolbar__top__metainfo">
                            <img :src="item.thumb" width="48" height="48" viewBox="0 0 48 48" />
                            <strong class="ui-toolbar__top__fileName" :title=" $t('pages.convert.task-item.file-name') +  item.name">
                                {{ item.name }}
                                <sup class="ui-toolbar__top__fileSize" :title=" $t('pages.convert.task-item.file-size') +  item.size ">
                                    {{ item.size ? '(' + item.size + 'MB)' : '' }}
                                </sup>
                            </strong>
                        </div>
                        <div class="ui-toolbar__top__metainfo__toolbar">
                            <ui-icon-button
                                @click="onOpenParentDir(item.fixOutDir)"
                                type="secondary"
                                color="black"
                                size="small"
                                v-if="item.stateInfo.state > 0"
                                >
                                <span class="fa fa-folder-open-o fa-lg fa-fw" :title=" $t('pages.convert.task-item.open-parent-dir') "></span>
                            </ui-icon-button>

                            <ui-icon-button
                                @click="onPreviewFile(item)"
                                type="secondary"
                                color="black"
                                size="small"
                                v-if="item.stateInfo.state > 0 && checkOutputPathIsFile(item.fixpath)"
                                >
                                <span class="fa fa-eye fa-lg fa-fw" :title=" $t('pages.convert.task-item.review-in-file') "></span>
                            </ui-icon-button>
                        </div>
                    </div>
                    <div class="ui-toolbar__body">
                        <span
                            :class="['ui-toolbar__top__taskMessage', item.stateInfo.state < 0 ? 'task-item-has-error': '']"
                            :title="item.stateInfo.message"
                            v-show="item.stateInfo.state < 0"
                            >
                            {{ item.stateInfo.message }}
                        </span>
                        <span class="ui-toolbar__body__filePath" :title=" $t('pages.convert.task-item.file-path') + item.introduce">{{ item.introduce }}</span>
                    </div>
                    <div class="ui-toolbar__bottom">
                        <ui-progress-linear
                            :color="getItemProgressStyle(item)"
                            :progress="item.progress"
                            v-show="getImageProgressShow(item)"
                            :title=" $t('pages.convert.task-item.progress') + item.progress"
                            >
                        </ui-progress-linear>
                    </div>
                </div> 
            </ui-alert> 
        </div>
    </div>
</template>
<script>
  import { BS, Util, _ } from 'dove.max.sdk'
  import {UiIcon, UiSelect, UiTabs, UiTab, UiConfirm, UiButton, UiIconButton, UiAlert, UiToolbar, UiProgressLinear,UiCheckbox} from 'keen-ui'
  import Vue from 'vue'
  import {DownloadHandler} from '../../../data/downlaod-manager'
  ////
  var downloadList = [];
  var hasInited = false;     // 是否初始过
  ////
  const downPrefix = 'download-page-image-id-' + _.now()
  class Down {
      constructor(thumb, name, image, size,introduce,imgID){
        this.id = _.uniqueId(downPrefix);
        this.thumb = thumb;                            // 图像缩略图
        this.name = name;                              // 图像名称
        this.image = image;                            // 图像的路径
        this.size = size;                              // 图像的存储大小
        this.introduce = introduce;                    // 图片的描述
        this.imgID = imgID;                            // 图片的id

        /// ----- 展示样式相关
        this.style = {
            show: true,
            type: "success"
        };

        /// ----- 下载的情况
        this.isWorking = false;                         // 是否正在下载中
        this.progress = 0;                              // 下载进度(100为单位)
        this.fixOutDir = "";                            // 指定的下载输出目录
        this.fixpath = "";                              // 下载成功的文件路径
        this.stateInfo = {                              // 下载运行状态
            state: 0,                                   // 下载是否成功 0. 没有修改， 1，修改成功， -1修改失败
            message: ""                                 // 下载结果的描述，如果是错误，描述错误，如果是成功，描述其定义内容
        }
      }
  }
  //// 与设置相关的处理
  class Settings {
      static key = "download-page-settings"

      static instance = null
      static shareInstance(){
          if (!Settings.instance){
              Settings.instance = new Settings()
          }
          return Settings.instance
      }

      constructor(){
          this.data = {
              outputPaths: [],
              lastSelectOutputPath: "",
              enableOverwriteOutput: false,
              maxSaveOutputPathCount: 5
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
  export default{
    data(){
      return{
        downloadList:downloadList,
        welcomeContentID:"page__download__welcome__id",
        enableOverWriteOutput: $LS$.data.enableOverwriteOutput,
        lastOutputPath: $LS$.data.lastSelectOutputPath,
        availableOutputPathList: $LS$.data.outputPaths,
        downloadID2downloadObj:{},
        confirmDialog:{
            ref: 'default',
            autofocus: 'none',
            confirmButtonText: 'Confirm',
            denyButtonText: 'Deny',
            title: '',
            content: '',
            callbackConfirm: ()=>{},
            callbackDeny: ()=>{},
            callbackOpen: ()=>{},
            callbackClose: ()=>{}
        },
        outputConfigDialog:{
            ref: 'outputConfigDialog',
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
    mounted(){
        var that = this
        var downloadMgr = DownloadHandler.getAll()
        that.drawWelcome()
        if (!hasInited && downloadMgr.length !== 0){
            hasInited = true
            that.getDownloadListInfo()
        }
    },
    beforeDestroy() {
      this.saveOutputSettings()
    },
    computed:{
        actionList() {
          var that = this
          return [
            {id:'action-outputFolder', visiable:true, color:"primary", icon:"fa fa-folder fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.download.toolbar.outputFolder"},
            {id:'action-remove', visiable:true, color:"black", icon:"fa fa-trash-o fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.download.toolbar.remove"},
            {id:'action-redownload', visiable:true, color:"black", icon:"fa fa-download fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.download.toolbar.redownload"},
            {id:'action-redownloadFailed', visiable:true, color:"black", icon:"fa fa-tasks fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.download.toolbar.redownloadFailed"},
          ]
        }
    },
    methods:{
        // ------------------------- Welcome content
        drawWelcome(){
            var that = this
            var SnapRef = Util.util.getSnapSVG$()
            if (SnapRef) {
                var s = SnapRef('#' + that.welcomeContentID)

                // 创建一个盒子
                var rect = s.rect('8%', '8%', '84%', '84%', 14)
                rect.attr({
                    fill: "none",
                    "fill-opacity": 0.5,
                    "stroke-linecap": "round",
                    "stroke-linejoin": "bevel",
                    "stroke-dasharray" : "5,5",
                    stroke: "#adadad",
                    strokeWidth: 1
                })

                // 创建一个文字盒子
                var description = s.text('12%', '20%', that.$t('pages.download.welcome.description'))
                var step1 = s.text('12%', '30%', that.$t('pages.download.welcome.step1'))
                var step2 = s.text('15%', '40%', that.$t('pages.download.welcome.step2'))
                var step3 = s.text('15%', '50%', that.$t('pages.download.welcome.step3'))
                var step4 = s.text('15%', '60%', that.$t('pages.download.welcome.step4'))
                var step5 = s.text('15%', '70%', that.$t('pages.download.welcome.step5'))

                // 修饰一下文字
                description.attr({
                    "font-weight": "bold"
                })
            }
        },
        // ------------------------- Style
        getItemStyleClass(item){
            var _styleClass = ['page__download-single__task__item']
            if (item.stateInfo) {
                if (item.stateInfo.state < 0) {
                    _styleClass.push('isFixFailed')
                }
                if (item.stateInfo.state > 0) {
                    _styleClass.push('isFixedSuccess')
                }
            }
            return _styleClass
        },
        // -------------------------- Tool bar
        onToolBtnClick(index, item){
            if (item.id === 'action-remove') {
                this.onBtnRemoveAllClick()
            }else if (item.id === 'action-outputFolder') {
                this.onBtnOutputFolderClick()
            }else if (item.id === 'action-redownload') {
                this.onBtnRedownloadClick()
            }else if (item.id === 'action-redownloadFailed') {
                this.onBtnRedownloadFailedClick()
            }
        },
        onBtnRemoveAllClick(){
            var that = this

            if(that.downloadList.length > 0) {
                const cdg = that.confirmDialog
                cdg.title = that.$t('pages.download.dialog-confirm-remove-all.title')
                cdg.content = that.$t('pages.download.dialog-confirm-remove-all.message')
                cdg.confirmButtonText = that.$t('pages.download.dialog-confirm-remove-all.btnConfirm')
                cdg.denyButtonText = that.$t('pages.download.dialog-confirm-remove-all.btnDeny')

                var dialog = that.$refs[cdg.ref]
                cdg.callbackConfirm = () =>{
                    //that.stopDo()
                    that.downloadList.splice(0, that.downloadList.length)
                }
                dialog.open()
                DownloadHandler.removeAll()
            }
        },
        onBtnRedownloadClick(){

        },
        onBtnRedownloadFailedClick(){

        },
        onBtnOutputFolderClick(){
            var that = this
            console.log("-------------------- call output dir")

            console.dir(that.availableOutputPathList)

            const cdg = that.outputConfigDialog
            cdg.title = that.$t('pages.download.dialog-config-output.title')
            cdg.confirmButtonText = that.$t('pages.download.dialog-config-output.btnConfirm')
            cdg.denyButtonText = that.$t('pages.download.dialog-config-output.btnDeny')
            cdg.callbackConfirm = () => { that.saveOutputSettings() 
                                          that.getDownloadList()
                                        }
            cdg.callbackDeny = () => { that.resetOutputSettings() }
            cdg.callbackClose = () => { that.resetOutputSettings() }

            var dialog = that.$refs[cdg.ref]
            dialog.open()
        },
        // ------------------------- LocalStorage
        saveOutputSettings(){
            var that = this

            console.assert(_.isString(that.lastOutputPath))
            console.assert(_.isBoolean(that.enableOverWriteOutput))

            $LS$.data.enableOverwriteOutput = that.enableOverWriteOutput
            $LS$.data.lastSelectOutputPath = that.lastOutputPath
            $LS$.data.outputPaths = that.availableOutputPathList

            $LS$.save()
        },
        resetOutputSettings(){
            var that = this
            that.enableOverWriteOutput = $LS$.data.enableOverwriteOutput
            that.lastOutputPath = $LS$.data.lastSelectOutputPath
            that.availableOutputPathList = $LS$.data.outputPaths
        },
        onOpenSelectOutDir(dir){
            var that = this
            console.log("-------------------- start location path")

            BS.b$.selectOutDir({
                title: that.$t('pages.convert.dialog-select-outdir.title'),
                prompt: that.$t('pages.convert.dialog-select-outdir.prompt'),
                canCreateDir: true
            },()=>{
                var list = []
                for(let i =0; i < 10; ++i){
                    list.push("/url/imageDir" + i)
                }
                var index = Math.floor((Math.random()*list.length))
                that.lastOutputPath = list[index].toString()
                that.__autoUpdateAvailableOutputPathList(that.lastOutputPath)
            },(data)=>{
                if(data.success) {
                    that.lastOutputPath = data.filesArray[0].filePath
                    that.__autoUpdateAvailableOutputPathList(that.lastOutputPath)
                }
            })
        },
        __autoUpdateAvailableOutputPathList(path){
            var that = this
            var specList = that.availableOutputPathList
            if (_.isString(path) && path !== "") {
                if (specList.indexOf(path) == -1){
                    specList.unshift(path)
                    if (specList.length > $LS$.data.maxSaveOutputPathCount) {
                        specList.splice($LS$.data.maxSaveOutputPathCount, 1)
                    }
                }
            }
            console.log("-------------------- __autoUpdateAvailableOutputPathList")
            console.dir(that.availableOutputPathList)
        },
        ///// 转化为MB,并且只保留两位小数/////////////////////////
        bytesToSize(bytes) {
                var k = 1000
                var i = Math.floor(Math.log(bytes) / Math.log(k))
                return (bytes / Math.pow(k, i)).toFixed(2)
        },
        getDownloadList(){
            var that = this
            var downloadMgr = DownloadHandler.getAll()
            _.each(downloadMgr,(ele) => {
                var index = _.findIndex(that.downloadList, {imgID:ele.imgID}, true)
                if (index == -1) {
                    var fileName = ele.name
                    var fileThumb = ele.thumb
                    var fileSize = that.bytesToSize(ele.size)
                    var fileImage = ele.image
                    var fileIntroduce = ele.introduce
                    var fileImgID = ele.imgID
                    let downloadObj = new Down(fileThumb,fileName,fileImage,fileSize,fileIntroduce,fileImgID)
                    that.downloadList.push(downloadObj)
                    that.downloadID2downloadObj[downloadObj.id] = downloadObj
                    that.__updateInfoWithGifDownload(downloadObj.id, {progress: 10,state:0})
                }
            })
        },
        getDownloadListInfo(){
            var that = this
            const cdg = that.outputConfigDialog
            // if(that.downloadList.length === 0) {
            //     return BS.b$.Notice.alert({
            //         message: that.$t('pages.convert.notice-no-items.message')
            //     })
            // }
            if(that.lastOutputPath == ""){
                cdg.callbackConfirm = () => {
                    cdg.callbackConfirm && cdg.callbackConfirm()
                }
                that.onBtnOutputFolderClick()   
            }else {
                that.getDownloadList()
            }
        },
        __updateInfoWithGifDownload(downloadID, data){
            var that = this
            let curInfoWithDownloadObj = that.downloadID2downloadObj[downloadID]
            if (curInfoWithDownloadObj) {
                curInfoWithDownloadObj.isWorking = data.progress >= 100 ? false : true
                curInfoWithDownloadObj.progress = data.progress >= 100 ? 100: data.progress
                curInfoWithDownloadObj.stateInfo.state = data.state
                curInfoWithDownloadObj.stateInfo.message = data.message || ''
            }
        },
        onRemoveTaskItem(item, index){
            var that = this
            that.__removeTaskItem(item, index)
        },
        // for task item
        __removeTaskItem(item, index) {
            var that = this
            var downloadMgr = DownloadHandler.getAll()
            item.isWorking = false;
            // TODO：remove it from downloadList
            item.progress = 0
            item.stateInfo.state = 0

            // remove from downloadList
            that.downloadList.splice(index, 1)

            var info = _.findIndex(downloadMgr,{image:item.image}, true)
            DownloadHandler.remove(info)
        },
        onOpenParentDir(){

        },
        onPreviewFile(){

        },
        checkOutputPathIsFile(){

        },
        getItemProgressStyle(item){
            var that = this
            var progressStyle = 'black' // item.stateInfo.state === 0
            if (item.stateInfo) {
                if (item.stateInfo.state < 0) progressStyle = 'accent'
                if (item.stateInfo.state > 0) progressStyle = 'primary'
            }

            return progressStyle
        },
        getImageProgressShow(item){
            return item.isWorking
        }
    },
    watch:{
        '$route'(to,from){
          var that = this
          let path = that.$route.path
          var downloadMgr = DownloadHandler.getAll()
          if(path.match(/Download_Single/) && downloadMgr.length !== 0){
            that.getDownloadListInfo()
          }
        }
    },
    components:{
      UiIcon,
      UiTabs,
      UiTab,
      UiButton,
      UiIconButton,
      UiAlert,
      UiToolbar,
      UiSelect,
      UiConfirm,
      UiProgressLinear,
      UiCheckbox      
    }
  }
</script>
