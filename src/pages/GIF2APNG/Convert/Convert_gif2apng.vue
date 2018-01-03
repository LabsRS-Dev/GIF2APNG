<template>
    <section class="page page-app-doc">
        <div class="page__toolbar page__toolbar-app-doc">
            <ui-icon-button
                @click="onToolBtnClick(index, item)"
                :type="item.type"
                :size="item.size"
                :color="item.color"
                :key="item.id"
                :title="$t(item.tooltip)"
                v-if="item.visiable"
                v-for="(item, index) in actionList"
                >
                    <span :class="item.icon"></span>
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
                <div class="page__toolbar-app-doc__input-group">
                    <div class="page__toolbar-app-doc__input-browse">
                        <span class="input-group-addon">{{ $t('pages.convert.dialog-config-output.path') }}</span>
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
                    <div class="page__toolbar-app-doc__input-cover">
                        <ui-checkbox
                            v-model="enableOverWriteOutput"
                            >
                        </ui-checkbox>
                        <span class="input-group-cover">{{ $t('pages.convert.dialog-config-output.cover') }}</span>
                    </div>
                </div>
            </ui-confirm>

            <ui-confirm
                :autofocus="previewConfirmDialog.autofocus"
                :confirm-button-text="previewConfirmDialog.confirmButtonText"
                :deny-button-text="previewConfirmDialog.denyButtonText"
                :ref="previewConfirmDialog.ref"
                :title="previewConfirmDialog.title"

                @confirm="previewConfirmDialog.callbackConfirm"
                @deny="previewConfirmDialog.callbackDeny"
                @open="previewConfirmDialog.callbackOpen"
                @close="previewConfirmDialog.callbackClose"
                >
                <div class="page__toolbar-app-doc__preview__info">
                    <div class="page__toolbar-app-doc__preview__info__image">
                        <img :src="beforePath" width="64" height="64" viewBox="0 0 64 64" />
                        <span class="preview__info__image__before">{{ $t('pages.convert.dialog-config-gif2apng-preview.before') }}</span>
                        <img :src="afterPath" width="64" height="64" viewBox="0 0 64 64" />
                        <span class="preview__info__image__afrer">{{ $t('pages.convert.dialog-config-gif2apng-preview.after') }}</span>
                    </div>
                    <div class="page__toolbar-app-doc__preview__info__echart" :id='openEchartsId'></div>
                </div>
            </ui-confirm>
        </div>

        <div class="page__examples page__examples-app-doc">
            <div
                class="page__examples-app-doc__welcome"
                v-show="taskList.length <= 0"
                >
                <p 
                    v-html="item"
                    :key="index"
                    v-for="(item, index) in $t('pages.convert.welcome')">
                </p>
            </div>    
            <ui-alert
                :class="getItemStyleClass(item)"
                :type="item.style.type"
                :key="item.id"
                removeIcon

                @dismiss="onRemoveTaskItem(item, index)"

                v-show="item.style.show"
                v-for="(item, index) in taskList">
                <div class="page__examples-app-doc__item" :data-taskid="item.id">
                    <div class="ui-toolbar__top">
                        <div class="ui-toolbar__top__metainfo">
                            <img :src="item.thumb" width="48" height="48" viewBox="0 0 48 48" />
                            <strong class="ui-toolbar__top__fileName" :title=" $t('pages.convert.task-item.file-name') +  item.name">
                                {{ item.omitName }}
                                <sup class="ui-toolbar__top__fileSize" :title=" $t('pages.convert.task-item.file-size') +  item.size ">
                                    {{ item.size ? '(' + item.size + ')' : '' }}
                                </sup>
                            </strong>
                        </div>
                        <div class="ui-toolbar__top__metainfo__toolbar">
                            <ui-icon-button
                                @click="onOpenParentDir(item.fixOutDir)"
                                type="secondary"
                                color="black"
                                size="small"
                                v-if="item.stateInfo.state == 1"
                                >
                                <span class="fa fa-folder-open-o fa-lg fa-fw" :title=" $t('pages.convert.task-item.open-parent-dir') "></span>
                            </ui-icon-button>

                            <ui-icon-button
                                @click="onPreviewFile(item)"
                                type="secondary"
                                color="black"
                                size="small"
                                v-if="item.stateInfo.state == 1 && checkOutputPathIsFile(item.fixpath)"
                                >
                                <span class="fa fa-eye fa-lg fa-fw" :title=" $t('pages.convert.task-item.review-in-file') "></span>
                            </ui-icon-button>
                        </div>
                    </div>
                    <div class="ui-toolbar__body">
                        <span
                            :class="['ui-toolbar__top__taskMessage', item.stateInfo.state < 0 ? 'task-item-has-error':'task-item-has-cancel']"
                            :title="item.stateInfo.message"
                            v-show="item.stateInfo.state < 0 || item.stateInfo.state == 2"
                            >
                            {{ item.stateInfo.message }}
                        </span>
                        <span class="ui-toolbar__body__filePath" :title=" $t('pages.convert.task-item.file-path') + item.path">{{ item.omitPath }}</span>
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

        <div :class=" ['page__footbar page__footbar-app-doc', {transferNormal: transferIsNormal}, {working: isConvertWorking}]" v-if="taskList.length >= 0">
            <span>{{ $t('pages.convert.footbar.fileCount') }} : {{ taskList.length }} </span>
            <span>{{ $t('pages.convert.footbar.state') }} : {{ isConvertWorking ? $t('pages.convert.footbar.isConvertWorking') : $t('pages.convert.footbar.isWaiting') }} </span>
            <i :class="[isConvertWorking ? 'fa fa-spinner fa-spin fa-lg fa-fw':'fa fa-lg fa-fw' ]"/></i>
            <span>{{ $t('pages.convert.footbar.transferState') }} : {{ transferIsNormal ? $t('pages.convert.footbar.transferIsNormal') : $t('pages.convert.footbar.transferIsFault') }} </span>
        </div>
    </section>
</template>

<script>
import { BS, Util, _, lodash } from 'dove.max.sdk'
import {UiIcon, UiSelect, UiTabs, UiTab, UiConfirm, UiButton, UiIconButton, UiAlert, UiToolbar, UiProgressLinear,UiCheckbox, UiTextbox} from 'keen-ui'
import {Transfer} from '../../../bridge/transfer'
import echarts from 'echarts'

var baseID = "__gif2apng__convert__action__"
var baseIDIndex = -1


const taskPrefix = 'convert-gif2apng-image-id-' + _.now()
class Task {
    constructor(thumb, name, path, size, omitName, omitPath){
        this.id = _.uniqueId(taskPrefix);
        this.thumb = thumb;   // 缩略图
        this.name = name;     // 图像文件名称
        this.path = path;     // 图像文件的路径
        this.size = size;     // 图像文件的存储大小
        ////----- 名称以及地址缩略显示
        this.omitName = omitName;
        this.omitPath = omitPath;

        /// ----- 展示样式相关
        this.style = {
            show: true,
            type: "success"
        };

        /// ----- 修改工作的情况
        this.associatedTransferTaskIds = [];  // 关联到TransferTaskId,真正执行TaskIDs
        this.isWorking = false;     // 是否正在修改中
        this.progress = 0;          // 修改进度(100为单位)
        this.fixOutDir = "";        // 指定的修改输出目录
        this.fixpath = "";          // 修改成功的文件路径
        this.stateInfo = {           // 修改运行状态
            state: 0,               // 修改是否成功 0. 没有修改， 1，修改成功， -1修改失败
            message: ""             // 修改结果的描述，如果是错误，描述错误，如果是成功，描述其定义内容
        }
    }
}

var taskList = []
var taskID2taskObj = {}
//// 与设置相关的处理
class Settings {
    static key = "convert-gif2apng-settings"

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


////
var hasInited = false     // 是否初始过
///////  预览
var beforePath = ''      // 原图片地址
var afterPath = ''       //修改后图片地址
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export default {

    data() {
        var that = this
        console.log("convert_gif2apng.vue call data()")
        return {
            welcomeContentID:'gif2apng__convert__welcome__id',
            openEchartsId:'info_echart_id',
            beforePath:beforePath,
            afterPath:afterPath,
            planSelectModel: '',
            taskList: taskList,
            enableOverWriteOutput: $LS$.data.enableOverwriteOutput,
            isConvertWorking: false,
            transferIsNormal: Transfer.isRunning,  // Is transfer is working normal?
            progressInterval: null,  // 进度条轮询
            lastOutputPath: $LS$.data.lastSelectOutputPath,
            availableOutputPathList: $LS$.data.outputPaths,

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
            },
            previewConfirmDialog:{
                ref: 'previewConfirmDialog',
                autofocus: 'none',
                confirmButtonText: 'Confirm',
                denyButtonText: 'Deny',
                title: '',
                callbackConfirm: ()=>{},
                callbackDeny: ()=>{},
                callbackOpen: ()=>{},
                callbackClose: ()=>{},
            },
            curFixTaskID: null       // 当前正在执行修改的整体任务ID
        }
    },

    beforeCreate(){
        var that = this
        console.log('Convert_gif2apng.vue beforeCreate')
        // restore settings
        $LS$.restore()
        // init handlers
        if (!hasInited){
            console.log('Convert_gif2apng.vue beforeCreate inited')
            hasInited = true
            Transfer.frontAgent.registerOnChannelFault(function () {
                that.onTransferIsFault()
            })

            Transfer.frontAgent.registerOnFinishBuildChannel(function (){
                that.onTransferIsNoraml()
            })

            Transfer.bind("onDropDragFiles", function(info){
                if(that.$route.path.match(/convert_gif2apng/)){
                    that.__importFilesOrDir(info.data)                    
                }
            })

            //TESTCode

            Transfer['pageConvertTest'] = {
                updateTaskProcessInfo:(task_id) => {
                    let progressInterval = 0
                    let progressTask = setInterval(() =>{
                        let dateInfo  =Math.round(Math.random()*10)
                        console.log(dateInfo)
                        if(progressInterval < 100){
                            progressInterval += 5
                            Transfer.trigger('TestRunGif2apngTask', { data: {
                                taskID: task_id || that.taskList[0].id,
                                messagePackage:{
                                progress:progressInterval,
                                }
                            }})
                            if(dateInfo > 9){
                                window.clearInterval(progressTask)
                                Transfer.trigger('TestRunGif2apngTask', { data: {
                                    taskID: task_id || that.taskList[0].id,
                                    messagePackage:{
                                    progress:progressInterval,
                                    state: -1,
                                    message:'Error'
                                    }
                                }})
                            }
                        }else if(progressInterval = 100){
                            window.clearInterval(progressTask)
                            Transfer.trigger('TestRunGif2apngTask', { data: {
                                    taskID: task_id || that.taskList[0].id,
                                    messagePackage:{
                                    state: 1,
                                    message:'Success'
                                    }
                                }})
                            }
                    },400)
                }
            }


            Transfer.bind("TestRunGif2apngTask", function(info){
                const data = info.data
                that.__updateInfoWithGif2apngTask(data.taskID, data.messagePackage)
            })
        }
    },

    mounted(){

    },

    beforeDestroy() {
        console.log('Convert_gif2apng.vue beforeDestroy()')
        clearInterval(this.progressInterval);
        this.saveOutputSettings()
    },

    computed:{
        actionList() {
           var that = this
           return [
                {id:'action-import', visiable:true, color:"black", icon:"fa fa-file-image-o fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.convert.toolbar.import"},
                {id:'action-importDir', visiable:true, color:"black", icon:"fa fa-folder-open-o fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.convert.toolbar.importDir"},
                {id:'action-remove', visiable:true, color:"black", icon:"fa fa-trash-o fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.convert.toolbar.remove"},
                {id:'action-outputFolder', visiable:true, color:"black", icon:"fa fa-cog fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.convert.toolbar.outputFolder"},
                {id:'action-do', visiable:!that.isConvertWorking, color:"black", icon:"fa fa-play-circle-o fa-lg fa-fw", size:"small", type:"secondary",  tooltip:"pages.convert.toolbar.fix"},
                {id:'action-stop', visiable:that.isConvertWorking, color:"red", icon:"fa fa-hand-paper-o fa-lg fa-fw", size:"small", type:"secondary",  tooltip:"pages.convert.toolbar.chancel"}
           ]
        }
    },

    methods:{
        // ------------------------- on Transfer Events
        onTransferIsNoraml() {
            var that = this
            that.transferIsNormal = true
        },

        onTransferIsFault(){
            var that = this
            that.transferIsNormal = false
            that.isConvertWorking = false

            // All task list run working
            that.stopDo()
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

        // ------------------------- Welcome content

        // ------------------------- Style
        getItemStyleClass(item){
            var _styleClass = ['page__convert__task__item']
            if (item.stateInfo) {

                if (item.stateInfo.state == -1) {
                    _styleClass.push('isFixFailed')
                }
                if (item.stateInfo.state == 1) {
                    _styleClass.push('isFixedSuccess')
                }
                if (item.stateInfo.state == 2) {
                    _styleClass.push('isFixedCancel')
                }
            }

            return _styleClass
        },

        getItemProgressStyle(item){
            var that = this
            var progressStyle = 'black' // item.stateInfo.state === 0
            if (item.stateInfo) {
                if (item.stateInfo.state == -1 ) progressStyle = 'accent'
                if (item.stateInfo.state == 1 ) progressStyle = 'primary'
            }

            return progressStyle
        },

        getImageProgressShow(item) {
            return item.isWorking
        },

        // -------------------------- Tool bar
        onToolBtnClick(index, item){
            console.log('onToolBtnClick', index)

            if(item.id === 'action-import') {
                this.onBtnImportFilesClick()
            }else if (item.id === 'action-importDir') {
                this.onBtnImportDirClick()
            }else if (item.id === 'action-remove') {
                this.onBtnRemoveAllClick()
            }else if (item.id === 'action-outputFolder') {
                this.onBtnOutputFolderClick()
            }else if (item.id === 'action-do') {
                this.onBtnDoClick()
            }else if (item.id === 'action-stop') {
                this.onBtnStopDoClick()
            }
        },

        onBtnImportFilesClick(){
            var that = this

            console.log("-------------------- call import files")
            // call bs
            BS.b$.importFiles({
                title: this.$t('pages.convert.dialog-import-images.title'),
                prompt: this.$t('pages.convert.dialog-import-images.prompt'),
                allowMulSelection: true,
                types:[] // Note: too many formats
            }, function(){ // Test code
                // Test[1]: Windows 本地实际数据
                var _prx = "N_X" 
                var i = 0
                while(i < 50){
                    _prx += "N_X"
                    ++i
                }

                _.each([
                    {fileName: 'RAW_NIKON_D7100.NEF' + _prx, filePath:'D:\\TestResource\\exif_sample_images\\Nikon\\corrupted\\RAW_NIKON_D7100.NEF' + _prx, fileSize: '27.5MB'},
                    {fileName: 'YDSC_0021.NEF', filePath:'D:\\TestResource\\exif_sample_images\\Nikon\\corrupted\\YDSC_0021.NEF', fileSize: '10.7MB'}
                ], function(ele){
                    if(ele.fileName.length > 50){
                         ele.omitName = ele.fileName.substring(0,50) + "..."
                    }else {
                         ele.omitName = ele.fileName
                    }
                    if(ele.filePath.length > 50) {
                        ele.omitPath = ele.filePath.substring(0,50) + "..."
                    }else {
                        ele.omitPath = ele.filePath
                    }
                    let taskObj = new Task("images/picture.svg", ele.fileName, ele.filePath, ele.fileSize, ele.omitName, ele.omitPath)
                    that.taskList.push(taskObj)
                    console.log('taskID-files=', taskObj.id)
                    taskID2taskObj[taskObj.id] = taskObj
                })

                return

                // Test[2]: 测试很多的情况下的列表展示
                for (let i =0; i < 50; ++i){
                    let taskObj = new Task("images/picture.svg", "Images" + i, "/url/image" + i, i + '.2MB')
                    that.taskList.push(taskObj)
                    taskID2taskObj[taskObj.id] = taskObj
                }
            }, function(data){ // Normal code
                that.__importFilesOrDir(data)
            })
        },

        onBtnImportDirClick(){
            var that = this

            console.log("-------------------- call import dir")
            // call bs
            BS.b$.selectDir({
                title: this.$t('pages.convert.dialog-import-dir-images.title'),
                prompt: this.$t('pages.convert.dialog-import-dir-images.prompt'),
                allowMulSelection: true
            }, function(){
                for(let i =0; i < 5; ++i){
                    var taskObj = new Task("images/folder.svg", "ImagesDir" + i, "/url/imageDir" + i, i + '22.2MB',"ImagesDir" + i,"/url/imageDir" + i)
                    that.taskList.push(taskObj)
                    console.log('taskID-dir=', taskObj.id)
                    taskID2taskObj[taskObj.id] = taskObj
                }
            }, function(data){
                that.__importFilesOrDir(data)
            })
        },

        onBtnRemoveAllClick(){
            var that = this

            if(that.taskList.length > 0) {
                const cdg = that.confirmDialog
                cdg.title = that.$t('pages.convert.dialog-confirm-remove-all.title')
                cdg.content = that.$t('pages.convert.dialog-confirm-remove-all.message')
                cdg.confirmButtonText = that.$t('pages.convert.dialog-confirm-remove-all.btnConfirm')
                cdg.denyButtonText = that.$t('pages.convert.dialog-confirm-remove-all.btnDeny')

                var dialog = that.$refs[cdg.ref]
                cdg.callbackConfirm = () =>{
                    that.stopDo()
                    that.taskList.splice(0, that.taskList.length)
                }
                dialog.open()
            }
        },

        onBtnOutputFolderClick(){
            var that = this
            console.log("-------------------- call output dir")

            console.dir(that.availableOutputPathList)

            const cdg = that.outputConfigDialog
            cdg.title = that.$t('pages.convert.dialog-config-output.title')
            cdg.confirmButtonText = that.$t('pages.convert.dialog-config-output.btnConfirm')
            cdg.denyButtonText = that.$t('pages.convert.dialog-config-output.btnDeny')
            cdg.callbackConfirm = () => { that.saveOutputSettings() }
            cdg.callbackDeny = () => { that.resetOutputSettings() }
            cdg.callbackClose = () => { that.resetOutputSettings() }

            var dialog = that.$refs[cdg.ref]
            dialog.open()
        },

        onBtnDoClick(){
            var that = this
            const cdg = that.outputConfigDialog
            if(that.taskList.length === 0) {
                return BS.b$.Notice.alert({
                    message: that.$t('pages.convert.notice-no-items.message')
                })
            }

            console.log("-------------------- call export dir")
            if(that.lastOutputPath==""){
                const cdg = that.outputConfigDialog
                cdg.title = that.$t('pages.resize.dialog-config-output.title')
                cdg.confirmButtonText = that.$t('pages.resize.dialog-config-output.btnConfirm')
                cdg.denyButtonText = that.$t('pages.resize.dialog-config-output.btnDeny')
                cdg.callbackConfirm = () => {
                    that.saveOutputSettings()
                    that.startDo()
                }
                cdg.callbackDeny = () => { that.resetOutputSettings() }
                cdg.callbackClose = () => { that.resetOutputSettings() }
                var dialog = that.$refs[cdg.ref]
                dialog.open()
            }else{
                that.startDo()
            }
        },
        onBtnStopDoClick(){
            var that = this

            if(that.isConvertWorking) {
                const cdg = that.confirmDialog
                cdg.title = that.$t('pages.convert.dialog-confirm-stop-fix.title')
                cdg.content = that.$t('pages.convert.dialog-confirm-stop-fix.message')
                cdg.confirmButtonText = that.$t('pages.convert.dialog-confirm-stop-fix.btnConfirm')
                cdg.denyButtonText = that.$t('pages.convert.dialog-confirm-stop-fix.btnDeny')

                var dialog = that.$refs[cdg.ref]
                cdg.callbackConfirm = () =>{
                    that.stopDo()
                }
                dialog.open()
            }
        },

        __findTaskObjExistWithPath(filePath){
            var that = this
            var found = false
            _.each(that.taskList, function(taskObj, index){
                if (taskObj.path === filePath)
                return found = true
            })

            return found
        },

        __importFilesOrDir(data){
            var that = this
            if(data.success) {
                var imageFiles = data.filesArray
                var checkFileExt
                _.each(imageFiles,(fileObj, dinx) => {
                    checkFileExt = BS.b$.App.getFileExt(fileObj.filePath).toLowerCase()
                    if(BS.b$.App.checkPathIsFile(fileObj.filePath)){
                        // let taskObj = new Task("images/picture.svg", fileObj.fileName, fileObj.filePath, fileObj.fileSizeStr)
                        if (!that.__findTaskObjExistWithPath(fileObj.filePath) &&  checkFileExt == 'gif'){
                            if(fileObj.fileName.length > 50){
                                fileObj.omitName = fileObj.fileName.substring(0,50) + "..."
                            }else {
                                fileObj.omitName = fileObj.fileName
                            }
                            if(fileObj.filePath.length > 50) {
                                fileObj.omitPath = fileObj.filePath.substring(0,50) + "..."
                            }else {
                                fileObj.omitPath = fileObj.filePath
                            }
                            let taskObj = new Task("file://" + fileObj.filePath, fileObj.fileName, fileObj.filePath, fileObj.fileSizeStr, fileObj.omitName, fileObj.omitPath)
                            that.taskList.push(taskObj)
                            taskID2taskObj[taskObj.id] = taskObj
                        }
                    }else{
                        // let taskObj = new Task("images/folder.svg", fileObj.fileName, fileObj.filePath,"")
                        let imgPath = BS.b$.App.getFileOrDirIconPath(fileObj.filePath)
                        if (!that.__findTaskObjExistWithPath(fileObj.filePath)){
                            if(fileObj.fileName.length > 50){
                                fileObj.omitName = fileObj.fileName.substring(0,50) + "..."
                            }else {
                                fileObj.omitName = fileObj.fileName
                            }
                            if(fileObj.filePath.length > 50) {
                                fileObj.omitPath = fileObj.filePath.substring(0,50) + "..."
                            }else {
                                fileObj.omitPath = fileObj.filePath
                            } 
                            let taskObj = new Task(imgPath, fileObj.fileName, fileObj.filePath,"",fileObj.omitName,fileObj.omitPath)
                            that.taskList.push(taskObj)
                            taskID2taskObj[taskObj.id] = taskObj
                        }
                    }
                })
            }
        },

        __updateTaskObj(taskID, data = {}, extendHandler = (taskObj) => {}) {
            var that = this
            let curInfoWithTaskObj = taskID2taskObj[taskID]
            if (curInfoWithTaskObj) {
                curInfoWithTaskObj = _.extend(curInfoWithTaskObj, data)
                extendHandler && extendHandler(curInfoWithTaskObj)
                console.dir(curInfoWithTaskObj)
            }

        },

        __updateInfoWithGif2apngTask(taskID, data) {
            var that = this
            let curInfoWithTaskObj = taskID2taskObj[taskID]
            if (curInfoWithTaskObj) {
                curInfoWithTaskObj.isWorking = data.progress >= 100 ? false : true
                curInfoWithTaskObj.progress = data.progress >= 100 ? 100: data.progress
                curInfoWithTaskObj.stateInfo.state = data.state
                curInfoWithTaskObj.stateInfo.message = data.message || ''
            }
        },

        __checkTaskStateInfo(){
            var that = this
            var state = false
            _.each(that.taskList, (taskObj, index) => {
                if (taskObj.isWorking){
                    state = true
                    return false
                }
            })

            that.isConvertWorking = state
        },

        startDo(){
            var that = this
            if(that.taskList.length > 0){
                _.each(that.taskList,(taskObj) => {
                    taskObj.stateInfo.state = 0
                    taskObj.stateInfo.progress = 0
                })
                _.each(that.taskList, (taskObj, index) => {
                    that.__abi__start_Gif2apngTask(taskObj.id, {
                        src: taskObj.path,
                        out: that.lastOutputPath,
                        overwrite: that.enableOverWriteOutput ? true : false
                    }, (data) => {
                        console.warn('startDo data reback....')
                        console.dir(data)
                        // process 
                        if (data.infoType === 'type_calltask_start'){
                            that.__updateInfoWithGif2apngTask(taskObj.id, {
                                progress: 50,
                                state:0
                            })
                        }else if (data.infoType === 'type_calltask_success'){
                            that.__updateInfoWithGif2apngTask(taskObj.id, {
                                progress: 100,
                                state: 1
                            })
                        }else if (data.infoType === 'type_calltask_error'){
                            that.__updateInfoWithGif2apngTask(taskObj.id, {
                                progress: 100,
                                state: -1,
                                message: data.detail_error || 'error'
                            })
                        }else if (data.infoType === 'type_calltask_cancel') {
                            that.__updateInfoWithGif2apngTask(taskObj.id, {
                                progress: 100,
                                state: 2,
                                message: that.$t('pages.convert.notice-no-cancel.message')
                            })
                        }
                        // check converting
                        that.__checkTaskStateInfo()
                    } )
                })
            }
        },

        stopDo(notice = true){
            var that = this
            // send stop message to server
            if(!notice) return
            if(that.taskList.length > 0 && that.isConvertWorking) {
                _.each(that.taskList, (taskObj, index) => {
                    that.__abi__cancel_Gif2apngTask(taskObj.id,(data) => {
                        // check converting
                        if (data.infoType === 'type_calltask_cancel'){
                            that.__updateInfoWithGif2apngTask(taskObj.id, {
                                progress: 100,
                                state:2
                            })
                        }
                        that.__checkTaskStateInfo()
                    })
                })
            }
        },

        /**
        * @function __abi__start_Gif2apngTask   调用处理gif转换成apng格式任务
        * @param  {String/Number} taskID 指定任务ID
        * @param  {Object} config 调用的配置选项
        * @param  {Function} handler 回调处理
        * @return {Object} {this}
        */
        __abi__start_Gif2apngTask(taskID, config, handler = (data)=>{}){
            var that = this
            const _config = _.extend({
                src: '',  // 要处理的文件或者目录的路径
                out: '',  // 输出目录
                overwrite: false,      // 是否覆盖已有文件
                compression: '-z1',    // 压缩方式： -z0: zlib compression; -z1: 7zip compression (default); -z2: Zopfli compression
                iterations: '-i' + 15, // 迭代数量：-i##: number of iterations (default -i15) for 7zip and Zopfli
                keepPalette: false     // 保持调色信息
            }, config)

            // 检查必要数值
            console.assert(taskID)
            console.assert(BS.b$.App.checkPathIsExist(_config.src))
            console.assert(BS.b$.App.checkPathIsExist(_config.out))

            var _command = [],
                _dest = _config.out

            const transferTaskID =  _.uniqueId('onetask') + ',' + taskID + _.now()
            that.__updateTaskObj(taskID, {fixOutDir:_dest}, (taskObj) => { taskObj.associatedTransferTaskIds.push(transferTaskID)})

            // Fix when the task is file obj
            if (BS.b$.App.checkPathIsFile(_config.src)) {
                _dest = _config.out + '/' + BS.b$.App.getFileNameWithoutExt(_config.src) + '.png'
                that.__updateTaskObj(taskID, {fixOutDir:_dest, fixpath:_dest}, (taskObj) => { taskObj.associatedTransferTaskIds.push(transferTaskID)})
            }

            // -- 命令行参数格式化
            const commandFormat = '['   +
                                    '"' + _config.compression  + '",' +
                                    '"' + _config.iterations  + '",' +
                                    (_config.overwrite ? '"-ow",' : '') +
                                    (_config.keepPalette ? '"-kp",' : '') +
                                    '"%input%","%output%"]'
            var fm_command = commandFormat
            fm_command = fm_command.replace(/%input%/g, _config.src)
            fm_command = fm_command.replace(/%output%/g, _dest)
            _command = window.eval(fm_command)

            /// call process task
            Transfer.Tools.call('gif2apng', {
                taskID: transferTaskID,
                command: _command
            }, (data) => {
                 handler && handler(data)
            })

            return that
        },

        /**
        * @function __abi__cancel_Gif2apngTask 调用停止处理gif转换成apng格式任务
        * @param  {String/Number} taskID 指定任务ID
        * @param  {Function} handler 回调处理
        * @return {type} {description}
        */
        __abi__cancel_Gif2apngTask(taskID, handler = (data)=>{}){
            var that = this

            // 检查必要数值
            console.assert(taskID)         
            let curTaskObj = taskID2taskObj[taskID]
            _.each(curTaskObj.associatedTransferTaskIds, (transferTaskId) => {
                /// call process task
                Transfer.Tools.call('stop.gif2apng', {
                    taskID: transferTaskId
                }, (data) => {
                    handler && handler(data)
                })
            })
            curTaskObj.associatedTransferTaskIds = []

            return that
        },


        // for task item
        __removeTaskItem(item, index) {
            var that = this
            item.isWorking = false;
            // TODO：remove it from taskList
            item.progress = 0
            item.stateInfo = 0
            taskID2taskObj[item.id] = null

            // remove from taskList
            that.taskList.splice(index, 1)
        },

        onRemoveTaskItem(item, index) {
            console.log('item: ', item, 'index: ', index)
            var that = this

            if(item.isWorking) {
                // notice to server
                that.__abi__cancel_Gif2apngTask(item.id)
            }

            that.__removeTaskItem(item, index)
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
        onOpenParentDir(dir){
            var that = this
            BS.b$.revealInFinder(dir,(data) => {})
        },
        onPreviewFile(item){
            var that = this
            const cdg = that.previewConfirmDialog
            cdg.title = that.$t('pages.convert.dialog-config-preview.title')
            cdg.confirmButtonText = that.$t('pages.convert.dialog-config-preview.btnConfirm')
            cdg.denyButtonText = that.$t('pages.convert.dialog-config-preview.btnDeny')
            var dialog = that.$refs[cdg.ref]
            dialog.open()
            that.drawLineChart(item)
            that.openBeforeModificationThumb(item)
            that.openAfterModificationThumb(item)
        },
        ///// 字节转化为KB,MB/////////////////////////
        bytesToSize(bytes) {
            var size
            if(bytes < 1000 * 1000){                                             //小于1MB，则转化成KB
                size = (bytes/1000).toFixed(2) + "KB"
            }else if(bytes < 1000 * 1000 * 1000){                                //小于1GB，则转化成MB
                size = (bytes/(1000 * 1000)).toFixed(2) + "MB"
            }
            var sizeStr = size + ""                                                    //转成字符串
            var index = sizeStr.indexOf(".")                                           //获取小数点处的索引
            var dou = sizeStr.substr(index + 1 ,2)                                     //获取小数点后两位的值
            if(dou == "00"){                                                           //判断后两位是否为00，如果是则删除00                
                return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
            }
            return size
        },
        //  信息对比绘制////////////////////////////////////////////////////////////////////////////////////////////////
        drawLineChart(item){
            var that = this
            var myChart = echarts.init(document.getElementById('info_echart_id'))
            var beforeSize = BS.b$.App.fileSizeAtPath(item.path)
            var afterSize = BS.b$.App.fileSizeAtPath(item.fixpath)
            var beforeSizeBytes = that.bytesToSize(beforeSize)
            var afterSizeBytes = that.bytesToSize(afterSize)
            var unit = beforeSizeBytes.substring(beforeSizeBytes.length-2,beforeSizeBytes.length)
            
            var beforeModificationSize = Math.round(beforeSizeBytes.substring(0,beforeSizeBytes.length-2)*100)/100
            var afterModificationSize = Math.round(afterSizeBytes.substring(0,afterSizeBytes.length-2)*100)/100
            myChart.setOption({
                title: {
                    text: that.$t('pages.convert.dialog-config-preview.chartTitle')
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer :{
                        type : 'shadow'
                    }
                },
                legend: {
                    data:['.Gif','.Apng']
                },
                xAxis: {
                    type : 'category',
                    data: [that.$t('pages.convert.dialog-config-preview.xAxis')]
                },
                yAxis: {
                    type : 'value',
                    axisLabel: {
                        formatter:'{value}'+ unit,
                        textStyle:{
                            fontSize:'10'
                        }
                    }
                },
                series: [{
                    name: '.Gif',
                    type: 'bar',
                    data: [beforeModificationSize]
                },{
                    name: '.Apng',
                    type: 'bar',
                    data: [afterModificationSize]
                }]
            })
        },
        openBeforeModificationThumb(item){
            var that = this
            that.beforePath = "file://" + item.path
            return that.beforePath
        },
        openAfterModificationThumb(item){
            var that = this
            that.afterPath =  "file://" + item.fixpath
            return that.afterPath
        },
        checkOutputPathIsFile(path){
            if(BS.b$.App.checkPathIsFile(path)){
                return true
            }else {
                return false
            }
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
        UiSelect,
        UiConfirm,
        UiProgressLinear,
        UiCheckbox
    }
}
</script>
