<template>
    <div>
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

            <div class="page__examples page__examples-app-doc page__Resize-normal">
                <div
                    class="page__examples-app-doc__welcome"
                    v-show="taskList.length <= 0"
                    >
                    <p
                        v-html="item"
                        :key="index"
                        v-for="(item, index) in $t('pages.resize.welcome')">
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
                <div class="page__examples-app-doc-normal__item" :data-taskid="item.id">
                    <div class="ui-toolbar-normal__top">
                        <div class="ui-toolbar-normal__top__thumb">
                            <img :src="item.thumb" width="64" height="64" viewBox="0 0 64 64" />
                        </div>
                        <div class="ui-toolbar-normal__top__info">
                            <div class="ui-toolbar-normal__top__metainfo">
                                <strong class="ui-toolbar-normal__top__fileName" :title=" $t('pages.resize.task-item.file-name') +  item.name">
                                    {{ item.omitName }}
                                    <sup class="ui-toolbar-normal__top__fileSize" :title=" $t('pages.resize.task-item.file-size') +  item.size ">
                                        {{ item.dimensions ? '(' + item.dimensions.data.width + 'x' + item.dimensions.data.height  + ')' : '' }}
                                    </sup>
                                </strong>
                                <!-- <ui-textbox
                                    v-model="item.rename"
                                    >
                                </ui-textbox>                                    -->
                            </div>
                            <div class="ui-toolbar-normal__top__selsct">
                                <ui-alert
                                    :key="ele.id"
                                    v-show="ele.style.show"
                                    @dismiss="onRemoveRatioItem(item, ele, index)"
                                    v-for="(ele, index) in item.ratioCommon"
                                    >
                                    <ui-autocomplete
                                        :suggestions="selectRatioList"
                                        v-model="ele.commonRatio"
                                        @blur = "onApplieToAllItem()"
                                        >
                                    </ui-autocomplete>
                                </ui-alert>
                                <ui-fab 
                                    size="small"
                                    :title="$t('pages.resize.toolbar.addRatio')"
                                    @click = "onAddRatioClick(item)"
                                    >
                                    <span class="ui-toolbar-normal__top__selsct__icon"><i class="fa fa-plus fa-lg fa-fw"></i></span>
                                </ui-fab>
                            </div>
                        </div>
                    </div>
                    <div class="ui-toolbar-normal__bottom">
                        <ui-progress-linear
                            :color="getItemProgressStyle(item)"
                            :progress="item.progress"
                            v-show="getImageProgressShow(item)"
                            :title=" $t('pages.resize.task-item.progress') + item.progress"
                            >
                        </ui-progress-linear>
                    </div>
                </div>
            </ui-alert>
            </div>
    
            <div :class=" ['page__footbar page__footbar-app-doc', {transferNormal: transferIsNormal}, {working: isResizeWorking}]" v-if="taskList.length >= 0">
                <span>{{ $t('pages.resize.footbar.fileCount') }} : {{ taskList.length }} </span>
                <span>{{ $t('pages.resize.footbar.state') }} : {{ isResizeWorking ? $t('pages.resize.footbar.isResizeWorking') : $t('pages.resize.footbar.isWaiting') }} </span>
                <i :class="[isResizeWorking ? 'fa fa-spinner fa-spin fa-lg fa-fw':'fa fa-lg fa-fw' ]"/></i>
                <span>{{ $t('pages.resize.footbar.transferState') }} : {{ transferIsNormal ? $t('pages.resize.footbar.transferIsNormal') : $t('pages.resize.footbar.transferIsFault') }} </span>
            </div>
        </section>
    </div>   
</template>

<script>
    import { BS, Util, _ , lodash } from 'dove.max.sdk'
    import { UiIcon, UiSelect, UiTabs, UiTab, UiConfirm, UiButton, UiIconButton, UiAlert, UiToolbar, UiProgressLinear, UiCheckbox, UiTextbox, UiCollapsible, UiAutocomplete, UiFab } from 'keen-ui'
    import { Transfer } from '../../../bridge/transfer'

    var baseID = "__page__resize__action__"
    var baseIDIndex = -1
    const taskPrefix = 'resize-page-image-id-' + _.now()
    class Task {
        constructor(thumb, name, path, size, dimensions, omitName, rename, ratioCommon){
            this.id = _.uniqueId(taskPrefix);
            this.thumb = thumb;   // 缩略图
            this.name = name;     // 图像文件名称
            this.path = path;     // 图像文件的路径
            this.size = size;     // 图像文件的存储大小

            ////----- 图片尺寸相关相关
            this.dimensions = dimensions
            ////----- 名称缩略显示
            this.omitName = omitName;
            ////----- 重命名/选择器
            this.rename = rename;
            ////----- 常用比例
            this.ratioCommon = ratioCommon;            

            /// ----- 展示样式相关
            this.style = {
                show: true,
                type: "success"
            };

            /// ----- 修改工作的情况
            this.associatedTransferTaskIds = [];  // 关联到TransferTaskId,真正执行TaskIDs
            this.isWorking = false;               // 是否正在修改中
            this.progress = 0;                    // 修改进度(100为单位)
            this.fixOutDir = "";                  // 指定的修改输出目录
            this.fixpath = "";                    // 修改成功的文件路径
            this.stateInfo = {                    // 修改运行状态
                state: 0,                         // 修改是否成功 0. 没有修改， 1，修改成功， -1修改失败
                message: ""                       // 修改结果的描述，如果是错误，描述错误，如果是成功，描述其定义内容
            }
        }
    }

    const ratioPrefix = 'resize-ratio-page-image-id-' + _.now()
    class Ratio {
        constructor(commonRatio){
            this.id = _.uniqueId(ratioPrefix);
            this.commonRatio = commonRatio;       // 常用比例

            /// ----- 展示样式相关
            this.style = {
                show: true,
                type: "success"
            };

            /// ----- 修改工作的情况
            this.associatedTransferTaskIds = [];  // 关联到TransferTaskId,真正执行TaskIDs
            this.isWorking = false;               // 是否正在修改中
            this.progress = 0;                    // 修改进度(100为单位)
            this.fixOutDir = "";                  // 指定的修改输出目录
            this.fixpath = "";                    // 修改成功的文件路径
            this.stateInfo = {                    // 修改运行状态
                state: 0,                         // 修改是否成功 0. 没有修改， 1，修改成功， -1修改失败
                message: ""                       // 修改结果的描述，如果是错误，描述错误，如果是成功，描述其定义内容
            }
        }
    }

    var taskList = []
    var ratioList = []
    var taskID2taskObj =  {}

    //// 与设置相关的处理
    class Settings {
        static key = "resize_normal-page-settings"

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
                selectRatio:['1:1','3:2','4:3','15:7','16:9','25:17'],
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
    var hasInited = false     // 是否初始过

    export default {
        data() {
            return {
                taskList: taskList,
                ratioList:ratioList,
                RemoveSelsctList:'',
                autocomplete: null,
                widthRatio:'',
                heightRatio:'',
                enableOverWriteOutput: $LS$.data.enableOverwriteOutput,
                taskID2taskObj: {},
                lastOutputPath: $LS$.data.lastSelectOutputPath,
                availableOutputPathList: $LS$.data.outputPaths,
                selectRatioList: $LS$.data.selectRatio,
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
                ratioConfirmDialog:{
                    ref: 'ratioConfirmDialog',
                    autofocus: 'none',
                    confirmButtonText: 'Confirm',
                    denyButtonText: 'Deny',
                    title: '',
                    callbackConfirm: ()=>{},
                    callbackDeny: ()=>{},
                    callbackOpen: ()=>{},
                    callbackClose: ()=>{}
                },
                removeRatioConfirmDialog:{
                    ref: 'removeRatioConfirmDialog',
                    autofocus: 'none',
                    confirmButtonText: 'Confirm',
                    denyButtonText: 'Deny',
                    title: '',
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
                    if(that.$route.path.match(/resize_normal/)){
                        that.__importFilesOrDir(info.data)                    
                    }
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
                    {id:'action-outputFolder', visiable:true, color:"black", icon:"fa fa-cog fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.resize.toolbar.outputFolder"},
                    {id:'action-do', visiable:true, color:"black", icon:"fa fa-play-circle-o fa-lg fa-fw", size:"small", type:"secondary",  tooltip:"pages.resize.toolbar.fix"},
                    {id:'action-stop', visiable:true, color:"black", icon:"fa fa-stop-circle-o fa-lg fa-fw", size:"small", type:"secondary",  tooltip:"pages.resize.toolbar.chancel"},
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

            // ------------------------- Style
            getItemStyleClass(item){
                var _styleClass = ['page__resize__task__item']
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
                    if (item.stateInfo.state == -1) progressStyle = 'accent'
                    if (item.stateInfo.state == 1) progressStyle = 'primary'
                }

                return progressStyle
            },

            getImageProgressShow(item) {
                return item.isWorking
            },

            onRemoveTaskItem(item, index) {
                console.log('item: ', item, 'index: ', index)
                var that = this
                // notice to server
                that.__abi__cancel_Gif2apngTask(item.id)
                that.__removeTaskItem(item, index)
            },

            // for task item
            __removeTaskItem(item, index) {
                var that = this
                item.isWorking = false;
                // TODO：remove it from taskList
                item.progress = 0
                item.stateInfo.state = 0
                item.stateInfo.message = 0
                taskID2taskObj[item.id] = null

                // remove from taskList
                that.taskList.splice(index, 1)
            },

            // -------------------------- Tool bar
            onToolBtnClick(index, item) {
                console.log('onToolBtnClick', index)

                if(item.id === 'action-import') {
                    this.onBtnImportFilesClick()
                }else if (item.id === 'action-remove') {
                    this.onBtnRemoveAllClick()
                }else if (item.id === 'action-outputFolder') {
                    this.onBtnOutputFolderClick()
                }else if (item.id === 'action-do') {
                    // this.onBtnDoClick()
                }else if (item.id === 'action-stop') {
                    // this.onBtnStopDoClick()
                }
            },

            onBtnImportFilesClick(){
                var that = this
                console.log("-------------------- call import files")
                    // call bs
                BS.b$.importFiles({
                    title: this.$t('pages.resize.dialog-import-images.title'),
                    prompt: this.$t('pages.resize.dialog-import-images.prompt'),
                    allowMulSelection: true,
                    types:[] // Note: too many formats
                }, function(){ // Test code
                    // Test: Windows 本地实际数据
                    let list = [
                                {fileThumb:'http://img.mp.itc.cn/upload/20160323/22d014b2fcff4c199ed6f2e6ab4ae9fd.jpg',fileName: 'RAW_NIKON_D7100.NEF', filePath:'http://img.mp.itc.cn/upload/20160323/22d014b2fcff4c199ed6f2e6ab4ae9fd.jpg', fileSize: '5.5MB', fileDimensions:{data:{width:400,height:224}}},
                                {fileThumb:'http://img.mp.itc.cn/upload/20160322/62106ba2b7014f8d8814a999285548c7.jpg',fileName: 'RAW_NIKON_D7200.NEF', filePath:'http://img.mp.itc.cn/upload/20160322/62106ba2b7014f8d8814a999285548c7.jpg', fileSize: '8.2MB', fileDimensions:{data:{width:280,height:157}}},
                                {fileThumb:'http://image.xcar.com.cn/attachments/a/day_140304/2014030414_1165b02cf2320ee81f92CnORE7mRIuCm_sst_560.gif',fileName: 'RAW_NIKON_D7300.NEF', filePath:'http://image.xcar.com.cn/attachments/a/day_140304/2014030414_1165b02cf2320ee81f92CnORE7mRIuCm_sst_560.gif', fileSize: '7.9MB', fileDimensions:{data:{width:560,height:521}}},
                                {fileThumb:'http://p2.so.qhimgs1.com/t01a4723418f8de871e.gif',fileName: 'RAW_NIKON_D7400.NEF', filePath:'http://p2.so.qhimgs1.com/t01a4723418f8de871e.gif', fileSize: '3.4MB', fileDimensions:{data:{width:585,height:240}}},
                                {fileThumb:'http://www.tfedu.org//forum//data//attachment//forum//201402//05//152308tr8pyys87do18yo8.gif',fileName: 'RAW_NIKON_D7500.NEF', filePath:'http://www.tfedu.org//forum//data//attachment//forum//201402//05//152308tr8pyys87do18yo8.gif', fileSize: '6.1MB', fileDimensions:{data:{width:432,height:720}}}
                              ]
                    _.each(list,function(ele){
                        that.ratioList = []
                        var commonList = []
                        _.each(that.selectRatioList,function(ele){
                            commonList.push({fileCommonRatio:ele}) 
                        })
                        _.each(commonList,function(ele){
                            let ratioObj = new Ratio(ele.fileCommonRatio)
                            that.ratioList.push(ratioObj)
                        })
                        if(ele.fileName.length > 20){
                             ele.omitName = ele.fileName.substring(0,20) + "..."
                        }else {
                             ele.omitName = ele.fileName
                        }
                        let taskObj = new Task(ele.fileThumb,ele.fileName, ele.filePath, ele.fileSize, ele.fileDimensions, ele.omitName, "", that.ratioList)
                        that.taskList.push(taskObj)
                        taskID2taskObj[taskObj.id] = taskObj
                    })
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
                        // that.stopDo()
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
            },

            onAddRatioClick(item){
                var that = this
                var length = item.ratioCommon.length
                let ratioObj = new Ratio('')
                that.$set(item.ratioCommon,length,ratioObj)
                that.getAutofocus = true
            },

            onApplieToAllItem(){
                var that = this
                const cdg = that.confirmDialog
                cdg.title = that.$t('pages.resize.dialog-confirm-remove-all.title')
                cdg.content = that.$t('pages.resize.dialog-confirm-remove-all.message')
                cdg.confirmButtonText = that.$t('pages.resize.dialog-confirm-remove-all.btnConfirm')
                cdg.denyButtonText = that.$t('pages.resize.dialog-confirm-remove-all.btnDeny')
                var dialog = that.$refs[cdg.ref]
                dialog.open()
            },

            onRemoveRatioItem(item, ele, index) {
                var that = this
                console.log('item: ', item, 'ele: ', ele, 'index: ', index)
                // notice to server
                // that.__abi__cancel_Gif2apngTask(ele.id)
                that.__removeRatioItem(item, ele, index)
            },

            // for ratio ele
            __removeRatioItem(item, ele, index) {
                var that = this
                ele.isWorking = false;
                // TODO：remove it from taskList.ratioCommon
                ele.progress = 0
                ele.stateInfo.state = 0
                ele.stateInfo.message = 0

                // remove from taskList.ratioCommon
                item.ratioCommon.splice(index, 1)
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

            __importFilesOrDir(data){
                var that = this
                if(data.success) {
                    var imageFiles = data.filesArray
                    var checkFileExt
                    _.each(imageFiles,(fileObj, dinx) => {
                        that.ratioList = []
                        var commonList = []
                        _.each(that.selectRatioList,function(ele){
                            commonList.push({fileCommonRatio:ele}) 
                        })
                        _.each(commonList,function(ele){
                            let ratioObj = new Ratio(ele.fileCommonRatio)
                            that.ratioList.push(ratioObj)
                        })
                        checkFileExt = BS.b$.App.getFileExt(fileObj.filePath).toLowerCase()
                        if(BS.b$.App.checkPathIsFile(fileObj.filePath)){
                            var dimensions = {}
                            BS.b$.Binary.getImageFileInfo({path:fileObj.filePath},function(info){dimensions.data = info.data})
                            if (!that.__findTaskObjExistWithPath(fileObj.filePath) &&  checkFileExt == 'gif'){
                                if(fileObj.fileName.length > 20){
                                    fileObj.omitName = fileObj.fileName.substring(0,20) + "..."
                                }else {
                                    fileObj.omitName = fileObj.fileName
                                }                         
                                let taskObj = new Task("file://" + fileObj.filePath, fileObj.fileName, fileObj.filePath, fileObj.fileSizeStr,dimensions,fileObj.omitName, "", that.ratioList)
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
                                let taskObj = new Task(imgPath, fileObj.fileName, fileObj.filePath,"","",fileObj.omitName, "", that.ratioList)
                                that.taskList.push(taskObj)
                                taskID2taskObj[taskObj.id] = taskObj
                            }
                        }
                    })
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
            }
        },
        components: {
            UiIcon,
            UiSelect,
            UiTabs,
            UiTab,
            UiConfirm,
            UiButton,
            UiIconButton,
            UiAlert,
            UiToolbar,
            UiProgressLinear,
            UiCheckbox,
            UiTextbox,
            UiCollapsible,
            UiAutocomplete,
            UiFab
        }      
    }
</script>
