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
                <div class="page__toolbar-app-doc__input-group">
                    <div class="page__toolbar-app-doc__input-browse">
                        <span class="input-group-addon">{{ $t('pages.resize.dialog-config-output.path') }}</span>
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
                        <span class="input-group-cover">{{ $t('pages.resize.dialog-config-output.cover') }}</span>
                    </div>
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
                    v-for="(item, index) in $t('pages.resize.single.welcome')">
                </p>
            </div>
            <div class="page__examples-app-doc__welcome__image">
                <div
                    class="page__examples-app-doc__welcome__image__single" 
                    v-for="(item, index) in taskList" 
                    :key="item.id"
                    >
                        <img :src="item.path">
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { BS, Util, _ , lodash } from 'dove.max.sdk'
import {UiIcon, UiSelect, UiTabs, UiTab, UiConfirm, UiButton, UiIconButton, UiAlert, UiToolbar, UiProgressLinear,UiCheckbox,UiTextbox} from 'keen-ui'
import {Transfer} from '../../../bridge/transfer'
import echarts from "echarts"

var baseID = "__page__resize__action__"
var baseIDIndex = -1


const taskPrefix = 'resize-page-image-id-' + _.now()
class Task {
    constructor(thumb, name, path, size, dimensions){
        this.id = _.uniqueId(taskPrefix);
        this.thumb = thumb;   // 缩略图
        this.name = name;     // 图像文件名称
        this.path = path;     // 图像文件的路径
        this.size = size;     // 图像文件的存储大小
        ////----- 图片尺寸相关相关
        this.dimensions = dimensions

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
        this.stateInfo = {          // 修改运行状态
            state: 0,               // 修改是否成功 0. 没有修改， 1，修改成功， -1修改失败
            message: ""             // 修改结果的描述，如果是错误，描述错误，如果是成功，描述其定义内容
        }
    }
}

var taskList = []
var taskID2taskObj =  {}

//// 与设置相关的处理
class Settings {
    static key = "resize-page-settings"

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

export default {
    data() {
        return {
            taskList: taskList,
            enableOverWriteOutput: $LS$.data.enableOverwriteOutput,
            taskID2taskObj: {},
            isResizeWorking: false,
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
        console.log('Resize.vue beforeCreate')
        // restore settings
        $LS$.restore()
        // init handlers
        if (!hasInited){
            console.log('Resize.vue beforeCreate inited')
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

            Transfer['pageResizeTest'] = {
                updateTaskProcessInfo:(task_id) => {
                    let progressInterval = 0
                    let progressTask = setInterval(() =>{
                        let dateInfo  =Math.round(Math.random()*10)
                        console.log(dateInfo)
                        if(progressInterval < 100){
                            progressInterval += 10
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

    beforeDestroy() {
        console.log('Resize.vue beforeDestroy()')
        clearInterval(this.progressInterval);
        this.saveOutputSettings()
    },

    computed:{
        actionList() {
           var that = this
           return [
                {id:'action-import', visiable:true, color:"black", icon:"fa fa-file-image-o fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.resize.toolbar.import"},
                {id:'action-do', visiable:true, color:"black", icon:"fa fa-play-circle-o fa-lg fa-fw", size:"small", type:"secondary",  tooltip:"pages.resize.toolbar.fix"},
                {id:'action-stop', visiable:true, color:"black", icon:"fa fa-stop-circle-o fa-lg fa-fw", size:"small", type:"secondary",  tooltip:"pages.resize.toolbar.chancel"},
                {id:'action-outputFolder', visiable:true, color:"black", icon:"fa fa-cog fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.resize.toolbar.outputFolder"},
                {id:'action-remove', visiable:true, color:"black", icon:"fa fa-trash-o fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.resize.toolbar.remove"}
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
            that.isResizeWorking = false

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


        // -------------------------- Tool bar
        onToolBtnClick(index, item){
            console.log('onToolBtnClick', index)

            if(item.id === 'action-import') {
                this.onBtnImportFilesClick()
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
            that.taskList = []
            console.log("-------------------- call import files")
                // call bs
                BS.b$.importFiles({
                    title: this.$t('pages.resize.dialog-import-images.title'),
                    prompt: this.$t('pages.resize.dialog-import-images.prompt'),
                    allowMulSelection: true,
                    types:[] // Note: too many formats
                }, function(){ // Test code
                    // Test: Windows 本地实际数据
                    var img = [
                                'http://img.mp.itc.cn/upload/20160323/22d014b2fcff4c199ed6f2e6ab4ae9fd.jpg',
                                'http://img.mp.itc.cn/upload/20160322/62106ba2b7014f8d8814a999285548c7.jpg',
                                'http://pic.962.net/up/2012-8/2012082011125260036.gif',
                                'http://p2.so.qhimgs1.com/t01a4723418f8de871e.gif',
                                'http://www.tfedu.org//forum//data//attachment//forum//201402//05//152308tr8pyys87do18yo8.gif'
                            ]
                    var index = Math.floor(Math.random() * 5)
                    let ele = {fileName: 'RAW_NIKON_D7100.NEF', filePath:img[index], fileSize: '27.5MB',fileDimensions:{data:{width:250,height:150}}}
                    let taskObj = new Task("images/picture.svg", ele.fileName, ele.filePath, ele.fileSize ,ele.fileDimensions)
                    that.taskList.push(taskObj)
                    console.log('taskID-files=', taskObj.id)
                    taskID2taskObj[taskObj.id] = taskObj
                    return
                }, function(data){ // Normal code
                    that.__importFilesOrDir(data)
                })
        },

        onBtnRemoveAllClick(){
            var that = this

            if(that.taskList.length > 0) {
                const cdg = that.confirmDialog
                cdg.title = that.$t('pages.resize.dialog-confirm-remove-all.title')
                cdg.content = that.$t('pages.resize.dialog-confirm-remove-all.message')
                cdg.confirmButtonText = that.$t('pages.resize.dialog-confirm-remove-all.btnConfirm')
                cdg.denyButtonText = that.$t('pages.resize.dialog-confirm-remove-all.btnDeny')

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
            cdg.title = that.$t('pages.resize.dialog-config-output.title')
            cdg.confirmButtonText = that.$t('pages.resize.dialog-config-output.btnConfirm')
            cdg.denyButtonText = that.$t('pages.resize.dialog-config-output.btnDeny')
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
                    message: that.$t('pages.resize.notice-no-items.message')
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

            if(that.isResizeWorking) {
                const cdg = that.confirmDialog
                cdg.title = that.$t('pages.resize.dialog-confirm-stop-fix.title')
                cdg.content = that.$t('pages.resize.dialog-confirm-stop-fix.message')
                cdg.confirmButtonText = that.$t('pages.resize.dialog-confirm-stop-fix.btnConfirm')
                cdg.denyButtonText = that.$t('pages.resize.dialog-confirm-stop-fix.btnDeny')

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
                            let taskObj = new Task("file://" + fileObj.filePath, fileObj.fileName, fileObj.filePath, fileObj.fileSizeStr)
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

            that.isResizeWorking = state
        },

        startDo(){
            var that = this
            if(that.taskList.length > 0){
                _.each(that.taskList, (taskObj, index) => {
                    that.__abi__start_ResizeGifTask(taskObj.id, {
                        src: taskObj.path,
                        out: that.lastOutputPath,
                        overwrite: that.enableOverWriteOutput ? true : false,
                        width: that.finalInputWidth,
                        height: that.finalInputHeight
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
                                message: data.detail_error || 'error'
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
            if(that.taskList.length > 0 && that.isResizeWorking) {
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
        * @function __abi__start_ResizeGifTask   调用处理gif转换成gif尺寸
        * @param  {String/Number} taskID 指定任务ID
        * @param  {Object} config 调用的配置选项
        * @param  {Function} handler 回调处理
        * @return {Object} {this}
        */
        __abi__start_ResizeGifTask(taskID, config, handler = (data)=>{}){
            var that = this
            const _config = _.extend({
                src: '',  // 要处理的文件或者目录的路径
                out: '',  // 输出目录
                overwrite: false,      // 是否覆盖已有文件
                width: 100, // resize 后的宽度
                height: 0,  // resize 后的高度，0 为只适应按照原宽度比
            }, config)

            // 检查必要数值
            console.assert(taskID)
            console.assert(BS.b$.App.checkPathIsExist(_config.src))
            console.assert(BS.b$.App.checkPathIsExist(_config.out))

            var _command = []

            const transferTaskID =  _.uniqueId('(T.NO') + ')-' + taskID
            that.__updateTaskObj(taskID, {fixOutDir:_config.out}, (taskObj) => { taskObj.associatedTransferTaskIds.push(transferTaskID)})

            // -- 声明输出json的路径
            var jsonFilePath = BS.b$.App.getNewTempFilePath(taskID + '.json') || "/usr/test.json"

            // -- 命令行参数格式化
            const commandFormat = '["-cfg=%input%"]'
            var fm_command = commandFormat
            fm_command = fm_command.replace(/%input%/g, jsonFilePath)
            _command = window.eval(fm_command)

            //DEBUG
            console.log("jsonfile = ", jsonFilePath)

            // -- 生成json文件
            const jsonData = JSON.stringify({
                tasks: [_config]
            })
            BS.b$.Binary.createTextFile({
                filePath: jsonFilePath,
                text: jsonData
            }, function(){
                /// call process task
                Transfer.Tools.call('resize_gif', {
                    taskID: transferTaskID,
                    command: _command
                }, (data) => {
                    handler && handler(data)
                })
            })

            return that
        },

        /**
        * @function __abi__cancel_Gif2apngTask 调用停止处理gif转换尺寸
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
                Transfer.Tools.call('stop.resie_gif', {
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
                title: that.$t('pages.resize.dialog-select-outdir.title'),
                prompt: that.$t('pages.resize.dialog-select-outdir.prompt'),
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
        UiCheckbox,
        UiTextbox
    }
}
</script>
