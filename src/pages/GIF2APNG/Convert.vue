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
        </div>

        <div class="page__examples page__examples-app-doc">
            <svg
                :id="welcomeContentID"
                class="page__examples-app-doc__welcome"
                v-show="taskList.length <= 0"
                />
            <ui-alert
                :class="getItemStyleClass(item)"
                :type="item.style.type"
                :key="item"
                removeIcon

                @dismiss="onRemoveTaskItem(item, index)"

                v-show="item.style.show"
                v-for="item, index in taskList">
                <div class="page__examples-app-doc__item">
                    <div class="ui-toolbar__top">
                        <div class="ui-toolbar__top__metainfo">
                            <img :src="item.thumb" width="48" height="48" viewBox="0 0 48 48" />
                            <strong class="ui-toolbar__top__fileName" :title=" $t('pages.convert.task-item.file-name') +  item.name">
                                {{ item.name }}
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
                                v-if="item.stateInfo.state > 0"
                                >
                                <span class="fa fa-folder-open-o fa-lg fa-fw" :title=" $t('pages.convert.task-item.open-parent-dir') "></span>
                            </ui-icon-button>

                            <ui-icon-button
                                @click="onPreviewFile(item.fixpath)"
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
                        <span class="ui-toolbar__body__filePath" :title=" $t('pages.convert.task-item.file-path') + item.path">{{ item.path }}</span>
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
import { BS, Util, _ } from 'dove.max.sdk'
import {UiIcon, UiSelect, UiTabs, UiTab, UiConfirm, UiButton, UiIconButton, UiAlert, UiToolbar, UiProgressLinear,UiCheckbox} from 'keen-ui'
import {Transfer} from '../../bridge/transfer'

var baseID = "__page__convert__action__"
var baseIDIndex = -1


const taskPrefix = 'convert-page-image-id-' + _.now()
class Task {
    constructor(thumb, name, path, size){
        this.id = _.uniqueId(taskPrefix);
        this.thumb = thumb;   // 缩略图
        this.name = name;     // 图像文件名称
        this.path = path;     // 图像文件的路径
        this.size = size;     // 图像文件的存储大小

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
    static key = "convert-page-settings"

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

//////////////////////////////////////////////////////////////////////////////////////////////////////////
export default {

    data() {
        var that = this
        console.log("convert.vue call data()")

        return {
            welcomeContentID:'page__convert__welcome__id',
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
            curFixTaskID: null       // 当前正在执行修改的整体任务ID
        }
    },

    beforeCreate(){
        var that = this
        console.log('Convert.vue beforeCreate')
        // restore settings
        $LS$.restore()
        // init handlers
        if (!hasInited){
            console.log('Convert.vue beforeCreate inited')
            hasInited = true
            Transfer.frontAgent.registerOnChannelFault(function () {
                that.onTransferIsFault()
            })

            Transfer.frontAgent.registerOnFinishBuildChannel(function (){
                that.onTransferIsNoraml()
            })

            Transfer.bind("onDropDragFiles", function(info){
                that.__importFilesOrDir(info.data)
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
        this.drawWelcome()
    },

    beforeDestroy() {
        console.log('Convert.vue beforeDestroy()')
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
                {id:'action-outputFolder', visiable:true, color:"primary", icon:"fa fa-folder fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.convert.toolbar.outputFolder"},
                {id:'action-do', visiable:!that.isConvertWorking, color:"green", icon:"fa fa-legal fa-lg fa-fw", size:"small", type:"secondary",  tooltip:"pages.convert.toolbar.fix"},
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
        drawWelcome(){
            var that = this
            var SnapRef = Util.util.getSnapSVG$()
            if (SnapRef) {
                var s = SnapRef('#' + that.welcomeContentID)

                // 创建一个盒子
                var rect = s.rect('8%', '8%', '84%', '84%', 16)
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
                var description = s.text('12%', '16%', that.$t('pages.convert.welcome.description'))
                var step1 = s.text('15%', '26%', that.$t('pages.convert.welcome.step1'))
                var step2 = s.text('15%', '36%', that.$t('pages.convert.welcome.step2'))
                var step3 = s.text('15%', '46%', that.$t('pages.convert.welcome.step3'))
                var step4 = s.text('15%', '56%', that.$t('pages.convert.welcome.step4'))

                // 修饰一下文字
                description.attr({
                    "font-weight": "bold"
                })

            }
        },

        // ------------------------- Style
        getItemStyleClass(item){
            var _styleClass = ['page__convert__task__item']
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

        getItemProgressStyle(item){
            var that = this
            var progressStyle = 'black' // item.stateInfo.state === 0
            if (item.stateInfo) {
                if (item.stateInfo.state < 0) progressStyle = 'accent'
                if (item.stateInfo.state > 0) progressStyle = 'primary'
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
                _.each([
                    {fileName: 'RAW_NIKON_D7100.NEF', filePath:'D:\\TestResource\\exif_sample_images\\Nikon\\corrupted\\RAW_NIKON_D7100.NEF', fileSize: '27.5MB'},
                    {fileName: 'YDSC_0021.NEF', filePath:'D:\\TestResource\\exif_sample_images\\Nikon\\corrupted\\YDSC_0021.NEF', fileSize: '10.7MB'}
                ], function(ele){
                    let taskObj = new Task("images/picture.svg", ele.fileName, ele.filePath, ele.fileSize)
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
                    var taskObj = new Task("images/folder.svg", "ImagesDir" + i, "/url/imageDir" + i, i + '22.2MB')
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
                cdg.callbackConfirm = () => { 
                    cdg.callbackConfirm && cdg.callbackConfirm()
                    that.startDo() 
                }
                that.onBtnOutputFolderClick()
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
                _.each(imageFiles,(fileObj, dinx) => {
                    if(BS.b$.App.checkPathIsFile(fileObj.filePath)){
                        // let taskObj = new Task("images/picture.svg", fileObj.fileName, fileObj.filePath, fileObj.fileSizeStr)
                        if (!that.__findTaskObjExistWithPath(fileObj.filePath)){
                            let taskObj = new Task("file://" + fileObj.filePath, fileObj.fileName, fileObj.filePath, fileObj.fileSizeStr)
                            that.taskList.push(taskObj)
                            taskID2taskObj[taskObj.id] = taskObj
                        }
                    }else{
                        // let taskObj = new Task("images/folder.svg", fileObj.fileName, fileObj.filePath,"")
                        let imgPath = BS.b$.App.getFileOrDirIconPath(fileObj.filePath)
                        if (!that.__findTaskObjExistWithPath(fileObj.filePath)){
                            let taskObj = new Task(imgPath, fileObj.fileName, fileObj.filePath,"")
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
                _.each(that.taskList, (taskObj, index) => {
                    that.__abi__start_Gif2apngTask(taskObj.id, {
                        src: taskObj.path,
                        out: that.lastOutputPath,
                        overwrite: that.enableOverWriteOutput || false
                    }, (data) => {
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
                                message: 'error'
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
            if(taskList.length > 0 && that.isConvertWorking) {
                _.each(that.taskList, (taskObj, index) => {
                    that.__abi__cancel_Gif2apngTask(taskObj.id,(data) => {
                        // check converting
                        if (data.infoType === 'type_calltask_cancel'){
                            that.__updateInfoWithGif2apngTask(taskObj.id, {
                                progress: 200,
                                state:0
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

            const transferTaskID =  _.uniqueId('onetask') + ',' + taskID
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
        onPreviewFile(path){
            BS.b$.previewFile({
                filePath: path
            },(data) => {})
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
