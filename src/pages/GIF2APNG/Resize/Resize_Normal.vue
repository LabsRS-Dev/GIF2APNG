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
                <ui-confirm
                    :autofocus="addRatioConfirmDialog.autofocus"
                    :confirm-button-text="addRatioConfirmDialog.confirmButtonText"
                    :deny-button-text="addRatioConfirmDialog.denyButtonText"
                    :ref="addRatioConfirmDialog.ref"
                    :title="addRatioConfirmDialog.title"

                    @confirm="addRatioConfirmDialog.callbackConfirm"
                    @deny="addRatioConfirmDialog.callbackDeny"
                    @open="addRatioConfirmDialog.callbackOpen"
                    @close="addRatioConfirmDialog.callbackClose"
                    >
                    <div class="page__toolbar-app-doc__input-addRatio">
                        <div class="page__toolbar-app-doc__input-complete">
                            <span class="input-complete-group-addon" v-show = "aspectType">{{ $t('pages.resize.dialog-config-addRatio.ratio') }}</span>
                            <span class="input-complete-group-addon" v-show = "!aspectType">{{ $t('pages.resize.dialog-config-addRatio.aspect') }}</span>
                            <input
                                type="text"
                                :value ="newWidthRatio"
                                @input = "handleInput"
                                @blur = "getFinalWidth"
                                minLength = 1 maxLength = 4
                                >
                            </input>
                            <ui-select
                                :options="availableSymbolList"
                                v-model="lastsymbol"
                                >
                            </ui-select>
                            <input
                                type ="text"
                                v-show = "!aspectType"
                                @input = "handleInput"
                                :value ="newHeightRatio"
                                @blur = "getFinalHeight"
                                minLength = 1 maxLength = 4
                                >
                            </input>
                        </div>
                        <div class="page__toolbar-app-doc__input-checkbox">
                            <div class="page__toolbar-app-doc__input-allRatio">
                                <ui-checkbox
                                    v-model="enableApplyAllItems"
                                    >
                                </ui-checkbox>
                                <span class="input-allRatio-group-addon">{{ $t('pages.resize.dialog-config-addRatio.allRatio') }}</span>
                            </div>
                            <div class="page__toolbar-app-doc__input-commonRatio">
                                <ui-checkbox
                                    v-model="enableAddUsualRatio"
                                    >
                                </ui-checkbox>
                                <span class="input-commonRatio-group-addon">{{ $t('pages.resize.dialog-config-addRatio.commonRatio') }}</span>
                            </div>
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
                        v-for="(item, index) in $t('pages.resize.welcomeNormal')">
                    </p>
                </div>
                <ui-alert
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
                            </div>
                            <div class="ui-toolbar-normal__top__selsct">
                                <ui-alert
                                    :class="getItemStyleClass(ele)"
                                    :type="ele.style.type"
                                    :key="ele.id"
                                    v-show="ele.style.show"
                                    @dismiss="onRemoveRatioItem(item, ele, index)"
                                    v-for="(ele, index) in item.ratioCommon"
                                    >
                                    <ui-progress-circular color="multi-color" v-show="getImageProgressShow(ele)"></ui-progress-circular>
                                    <ui-autocomplete
                                        :suggestions="selectRatioList"
                                        v-model="ele.commonRatio"
                                        @blur="checkTheInputIsCorrect(ele,$event)"
                                        :autofocus = "true"
                                        >
                                    </ui-autocomplete>
                                    <span class="ui-toolbar-normal__top__selsct__prompt" v-show = "ele.style.showToolTip">{{ $t('pages.resize.toolbar.tooltip')}}</span>
                                </ui-alert>
                                <ui-fab 
                                    size="small"
                                    :title="$t('pages.resize.toolbar.addRatio')" 
                                    @click = "onAddRatioClick(item,event)"
                                    >
                                    <span class="ui-toolbar-normal__top__selsct__icon"><i class="fa fa-plus fa-lg fa-fw"></i></span>
                                </ui-fab>
                            </div>
                        </div>
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
    import { UiIcon, UiSelect, UiTabs, UiTab, UiConfirm, UiButton, UiIconButton, UiAlert, UiToolbar, UiProgressLinear, UiProgressCircular, UiCheckbox, UiTextbox, UiCollapsible, UiAutocomplete, UiFab } from 'keen-ui'
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
                showToolTip:false,
                type: "info"
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
    var lastResizeValue;   //        最终输入后台的字符串

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
                selectRatio:['10%','50%','75%'],
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
                autocomplete: null,
                newWidthRatio:0,
                newHeightRatio:0,
                lastResizeValue:lastResizeValue,
                enableOverWriteOutput: $LS$.data.enableOverwriteOutput,
                enableApplyAllItems:false,
                enableAddUsualRatio:false,
                taskID2taskObj: {},
                lastOutputPath: $LS$.data.lastSelectOutputPath,
                availableOutputPathList: $LS$.data.outputPaths,
                selectRatioList: $LS$.data.selectRatio,
                aspectType:true,
                availableSymbolList:['%','x'],
                lastsymbol:'%',
                transferIsNormal: Transfer.isRunning,  // Is transfer is working normal?
                progressInterval: null,                // 进度条轮询
                isResizeWorking: false,
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
                addRatioConfirmDialog:{
                    ref: 'addRatioConfirmDialog',
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
            handleInput(e){
                var that = this
                e.target.value = e.target.value.replace(/[^\d]/g,'')
            },
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
            getItemStyleClass(ele){
                var _styleClass = ['page__resize__task__item']
                if (ele.stateInfo) {

                    if (ele.stateInfo.state == -1) {
                        _styleClass.push('isFixFailed')
                        ele.style.type = "error"
                    }
                    if (ele.stateInfo.state == 1) {
                        _styleClass.push('isFixedSuccess')
                        ele.style.type = "success"
                    }
                    if (ele.stateInfo.state == 2) {
                        _styleClass.push('isFixedCancel')
                        ele.style.type = "warning"
                    }
                }

                return _styleClass
            },

            getImageProgressShow(ele) {
                return ele.isWorking
            },

            onRemoveTaskItem(item, index) {
                console.log('item: ', item, 'index: ', index)
                var that = this
                _.each(item.ratioCommon,(ele)=>{
                    that.__abi__cancel_Gif2apngTask(ele.id)
                })
                that.__removeTaskItem(item, index)
            },

            // for task item
            __removeTaskItem(item, index) {
                var that = this

                _.each(item.ratioCommon,(ele) => {
                    ele.isWorking = false;
                    ele.progress = 0
                    ele.stateInfo.state = 0
                    ele.stateInfo.message = 0
                })
                _.omit(taskID2taskObj, [item.id])
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

                var dialog = that.$refs[cdg.ref]
                dialog.open()
            },

            onBtnDoClick(){
                var that = this
                if(that.taskList.length === 0) {
                    return BS.b$.Notice.alert({
                        message: that.$t('pages.resize.notice-no-items.message')
                    })
                }
                console.log("-------------------- call export dir")
                that.__checkTheLastOutputPathIsExist()
            },

            __checkTheLastOutputPathIsExist(){
                var that = this
                if(that.lastOutputPath == ""){
                    const cdg = that.outputConfigDialog
                    cdg.title = that.$t('pages.resize.dialog-config-output.title')
                    cdg.confirmButtonText = that.$t('pages.resize.dialog-config-output.btnConfirm')
                    cdg.denyButtonText = that.$t('pages.resize.dialog-config-output.btnDeny')
                    cdg.callbackConfirm = () => {
                        that.saveOutputSettings()
                        that.startDo()
                    }
                    cdg.callbackDeny = () => { that.resetOutputSettings() }
                    var dialog = that.$refs[cdg.ref]
                    dialog.open()
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
                const cdg = that.addRatioConfirmDialog
                cdg.title = that.$t('pages.resize.dialog-config-addRatio.title')
                cdg.confirmButtonText = that.$t('pages.resize.dialog-config-addRatio.btnConfirm')
                cdg.denyButtonText = that.$t('pages.resize.dialog-config-addRatio.btnDeny')
                var dialog = that.$refs[cdg.ref]
                cdg.callbackConfirm = () => { that.__addAllRatioItem(item) }
                cdg.callbackDeny = () => { that.__resetRatioItem()}
                dialog.open()
            },

            __addAllRatioItem(item){
                var that = this
                if(that.lastsymbol === 'x') {
                    if(that.enableApplyAllItems){
                        if(that.newWidthRatio !== 0 && that.newHeightRatio !== 0){
                            let spliceString = that.newWidthRatio + that.lastsymbol + that.newHeightRatio
                            _.each(that.taskList,(ele) => {
                                let list = []
                                _.each(ele.ratioCommon,(el) => {
                                    list.push(el.commonRatio)
                                })
                                let index = _.indexOf(list,spliceString)
                                if(index == -1){
                                    let length = ele.ratioCommon.length
                                    let ratioObj = new Ratio(spliceString)
                                    that.$set(ele.ratioCommon,length,ratioObj)
                                }
                            })
                        }else {
                            _.each(that.taskList,(ele) => {
                                let length = ele.ratioCommon.length
                                let ratioObj = new Ratio('')
                                that.$set(ele.ratioCommon,length,ratioObj)
                            })
                        }
                    }else {
                        if(that.newWidthRatio !== 0 && that.newHeightRatio !== 0){
                            let spliceString = that.newWidthRatio + that.lastsymbol + that.newHeightRatio
                            let list = []
                            _.each(item.ratioCommon,(el) => {
                                list.push(el.commonRatio)
                            })
                            let index = _.indexOf(list,spliceString)
                            if(index == -1){
                                let length = item.ratioCommon.length
                                let ratioObj = new Ratio(spliceString)
                                that.$set(item.ratioCommon,length,ratioObj)                            
                            }

                        }else {
                            let length = item.ratioCommon.length
                            let ratioObj = new Ratio('')
                            that.$set(item.ratioCommon,length,ratioObj)
                        }
                    }
                    if(that.enableAddUsualRatio && that.newWidthRatio !== 0 && that.newHeightRatio !== 0){
                        let spliceString = that.newWidthRatio + that.lastsymbol + that.newHeightRatio
                        $LS$.data.selectRatio.push(spliceString)
                        $LS$.save()
                    }                        
                } else {
                    if(that.enableApplyAllItems){
                        if(that.newWidthRatio !== 0){
                            let spliceString = that.newWidthRatio + that.lastsymbol
                            _.each(that.taskList,(ele) => {
                                let list = []
                                _.each(ele.ratioCommon,(el) => {
                                    list.push(el.commonRatio)
                                })
                                let index = _.indexOf(list,spliceString)
                                if(index == -1){
                                    let length = ele.ratioCommon.length
                                    let ratioObj = new Ratio(spliceString)
                                    that.$set(ele.ratioCommon,length,ratioObj)
                                }
                            })
                        }else {
                            _.each(that.taskList,(ele) => {
                                let length = ele.ratioCommon.length
                                let ratioObj = new Ratio('')
                                that.$set(ele.ratioCommon,length,ratioObj)
                            })
                        }
                    }else {
                        if(that.newWidthRatio !== 0){
                            let spliceString = that.newWidthRatio + that.lastsymbol
                            let list = []
                            _.each(item.ratioCommon,(el) => {
                                list.push(el.commonRatio)
                            })
                            let index = _.indexOf(list,spliceString)
                            if(index == -1){
                                let length = item.ratioCommon.length
                                let ratioObj = new Ratio(spliceString)
                                that.$set(item.ratioCommon,length,ratioObj)                            
                            }

                        }else {
                            let length = item.ratioCommon.length
                            let ratioObj = new Ratio('')
                            that.$set(item.ratioCommon,length,ratioObj)
                        }
                    }
                    if(that.enableAddUsualRatio && that.newWidthRatio !== 0){
                        let spliceString = that.newWidthRatio + that.lastsymbol
                        $LS$.data.selectRatio.push(spliceString)
                        $LS$.save()
                    }
                }
                that.newWidthRatio = 0
                that.newHeightRatio = 0
                that.enableApplyAllItems = false
                that.enableAddUsualRatio = false
                that.lastsymbol = '%'
            },

            __resetRatioItem(){
                var that = this
                that.newWidthRatio = 0
                that.newHeightRatio = 0
                that.enableApplyAllItems = false
                that.enableAddUsualRatio = false
                that.lastsymbol = '%'
            },

            checkTheInputIsCorrect(ele,$event){
                var that = this 
                if(/^(100|[1-9]?\d(\.\d\d?\d?)?)%$/.test(ele.commonRatio) || /^\d+x\d+$/.test(ele.commonRatio) || ele.commonRatio == ''){
                    $($event.target).css('border', '1px solid #adadad')
                    ele.style.showToolTip = false
                    ele.style.type = "info"
                } else {
                    $($event.target).css('border', '2px solid rgb(255, 100, 0)')
                    ele.style.showToolTip = true
                }
            },

            getFinalWidth(e){
                var that = this
                that.newWidthRatio = e.target.value
            },

            getFinalHeight(e){
                var that = this
                that.newHeightRatio = e.target.value
            },

            onRemoveRatioItem(item, ele, index) {
                var that = this
                console.log('item: ', item, 'ele: ', ele, 'index: ', index)
                var currentRatio = []
                var deletRatio = [ele]
                _.each(that.taskList,(el)=>{
                    var returns = _.intersectionBy(deletRatio, el.ratioCommon, 'commonRatio')
                    if(returns.length > 0){
                        currentRatio.push(returns)
                    }
                })

                if(currentRatio.length > 1){
                    const cdg = that.confirmDialog
                    cdg.title = that.$t('pages.resize.dialog-confirm-remove-all.title')
                    cdg.content = that.$t('pages.resize.dialog-confirm-remove-all.allRatio')
                    cdg.confirmButtonText = that.$t('pages.resize.dialog-confirm-remove-all.btnConfirm')
                    cdg.denyButtonText = that.$t('pages.resize.dialog-confirm-remove-all.btnDeny')
                    var dialog = that.$refs[cdg.ref]
                    cdg.callbackConfirm = () => { that.__removeAllRatioItem(ele) }
                    cdg.callbackDeny = () => { that.__removeRatioItem(item, ele, index) }
                    dialog.open()
                    // notice to server
                    that.__abi__cancel_Gif2apngTask(ele.id)
                }else {
                    that.__removeRatioItem(item, ele, index)
                }   
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

            __removeAllRatioItem(ele){
                var that = this
                var ratio = ele.commonRatio
                _.each(that.taskList,(el) => {
                    var index;
                    _.each(el.ratioCommon,(attr,exp) => {
                        if(attr.commonRatio === ratio){
                            console.log(attr,exp)
                            index = exp
                            attr.isWorking = false;
                            // TODO：remove it from taskList.ratioCommon
                            attr.progress = 0
                            attr.stateInfo.state = 0
                            attr.stateInfo.message = 0
                        }
                    })
                    if(index !== undefined){
                        el.ratioCommon.splice(index, 1)                        
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

            __updateTaskObj(taskID, data = {}, extendHandler = (taskObj) => {}) {
                var that = this
                let curInfoWithTaskObj;
                _.each(taskList,(el) => {
                    _.each(el.ratioCommon,(ele,index) => {
                        if(ele.id === taskID){
                            curInfoWithTaskObj = ele
                        }
                    })                    
                })
                if (curInfoWithTaskObj) {
                    curInfoWithTaskObj = _.extend(curInfoWithTaskObj, data)
                    extendHandler && extendHandler(curInfoWithTaskObj)
                    console.dir(curInfoWithTaskObj)
                }
            },

            __updateInfoWithGif2apngTask(taskObjID,taskID, data) {
                var that = this
                let curInfoWithTaskObj
                _.each(taskID2taskObj[taskObjID].ratioCommon,(ele,index) => {
                    if(ele.id === taskID){
                        curInfoWithTaskObj = ele
                    }
                })
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
                    _.each(taskObj.ratioCommon,(ele) => {
                        if (ele.isWorking){
                            state = true
                            return false
                        }
                    })
                })

                that.isResizeWorking = state
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

            startDo(){
                var that = this
                if(that.taskList.length > 0){
                    _.each(that.taskList,(taskObj) => {
                        _.each(taskObj.ratioCommon,(ele) => {
                            ele.style.type = "info"
                            ele.stateInfo.state = 0
                            ele.stateInfo.progress = 0
                        })
                    })
                    _.each(that.taskList, (taskObj, index) => {
                        if(taskObj.ratioCommon.length !== 0){
                            let name = BS.b$.App.getFileNameWithoutExt(taskObj.path)
                            _.each(taskObj.ratioCommon,(ele,exp) => {
                                if(ele.style.showToolTip || ele.commonRatio == ''){
                                    ele.style.type = "error"
                                }else{
                                    that.lastResizeValue = ele.commonRatio
                                    let lastWidth;
                                    let lastHeight;
                                    let currentAspectType;
                                    let cursorOne = ele.commonRatio.indexOf('%')
                                    let cursorTwo = ele.commonRatio.indexOf('x')
                                    if( cursorOne !== -1){
                                        let length = ele.commonRatio.length
                                        lastWidth = parseInt(ele.commonRatio.substring(0,cursorOne))/100
                                        lastHeight = 0
                                        currentAspectType = true
                                    } else if(cursorTwo !== -1){
                                        let length = ele.commonRatio.length
                                        lastWidth = parseInt(ele.commonRatio.substring(0,cursorTwo))
                                        lastHeight = parseInt(ele.commonRatio.substring(cursorTwo + 1,length))
                                        currentAspectType = false
                                    }
                                    if(currentAspectType == true && lastWidth == 0){
                                        ele.style.type = "error"
                                    }else if(currentAspectType == false && (lastWidth == 0 || lastHeight ==0)){
                                        ele.style.type = "error"
                                    }else {
                                        that.__abi__start_ResizeGifTask(ele.id, {
                                            src: taskObj.path,
                                            dest: that.lastOutputPath + '/'+ name + '('+ ele.commonRatio +').gif',
                                            enableIncludeMinImage:true,
                                            overwrite: that.enableOverWriteOutput ? true : false,
                                            IsPercentValue:currentAspectType ? true : false,
                                            width: lastWidth,
                                            height: lastHeight
                                        }, (data) => {
                                            if (data.infoType === 'type_calltask_log'){
                                                that.__updateInfoWithGif2apngTask(taskObj.id,ele.id, {
                                                    progress: 50,
                                                    state:0
                                                })
                                            }else if (data.infoType === 'type_calltask_success'){
                                                that.__updateInfoWithGif2apngTask(taskObj.id, ele.id, {
                                                    progress: 100,
                                                    state: 1
                                                })
                                            }else if (data.infoType === 'type_calltask_error'){
                                                that.__updateInfoWithGif2apngTask(taskObj.id, ele.id, {
                                                    progress: 100,
                                                    state: -1,
                                                    message: data.detail_error || 'error'
                                                })
                                            }else if (data.infoType === 'type_calltask_cancel') {
                                                that.__updateInfoWithGif2apngTask(taskObj.id, ele.id, {
                                                    progress: 100,
                                                    state: 2,
                                                    message: that.$t('pages.resize.notice-no-cancel.message')
                                                })
                                            }
                                            // window.log('[x] infoType ===' + data.infoType)
                                            // check converting
                                            that.__checkTaskStateInfo()
                                        } )                                          
                                    }                                      
                                }
                            })                            
                        }
                    })
                }
            },

            stopDo(notice = true){
                var that = this
                // send stop message to server
                if(!notice) return
                if(that.taskList.length > 0 && that.isResizeWorking) {
                    _.each(that.taskList, (taskObj, index) => {
                        _.each(taskObj.ratioCommon,(ele,exp) => {
                            that.__abi__cancel_Gif2apngTask(ele.id,(data) => {
                                // check converting
                                if (data.infoType === 'type_calltask_cancel'){
                                    that.__updateInfoWithGif2apngTask(taskObj.id, ele.id, {
                                        progress: 100,
                                        state:2
                                    })
                                }
                                that.__checkTaskStateInfo()
                            })
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
                    src: '',                        // 要处理的文件或者目录的路径
                    dest: '',                       // 输出目录
                    overwrite: false,               // 是否覆盖已有文件
                    IsPercentValue: false,          // 确认是具体值还是百分比,false就是具体值,true就是百分比
                    enableIncludeMinImage: false,   // 确认是否需要处理客户输入尺寸大于图片原始尺寸的文件
                    width: 100,                     // resize 后的宽度
                    height: 0,                      // resize 后的高度，0 为只适应按照原宽度比
                }, config)

                // 检查必要数值
                console.assert(taskID)
                // console.assert(BS.b$.App.checkPathIsExist(_config.src))
                // console.assert(BS.b$.App.checkPathIsExist(_config.dest))

                var _command = []
                var _dest = _config.dest
                
                const transferTaskID =  _.uniqueId('(T.NO') + ')-' + taskID + _.now()
                that.__updateTaskObj(taskID, {fixOutDir:_dest}, (taskObj) => { taskObj.associatedTransferTaskIds.push(transferTaskID)})

                // Fix when the task is file obj
                if (BS.b$.App.checkPathIsFile(_config.src)) {
                    _dest = _config.dest + '/' + BS.b$.App.getFileNameWithoutExt(_config.src) + '.gif'
                    that.__updateTaskObj(taskID, {fixOutDir:_dest}, (taskObj) => { taskObj.associatedTransferTaskIds.push(transferTaskID)})
                }

                // -- 声明输出json的路径
                var jsonFilePath = BS.b$.App.getNewTempFilePath(taskID + '.json') || "/usr/test.json"

                // -- 命令行参数格式化
                const commandFormat = '["-mode=gifresziejson","-cfg=%input%"]'
                var fm_command = commandFormat
                fm_command = fm_command.replace(/%input%/g, jsonFilePath)
                _command = window.eval(fm_command)

                //DEBUG
                console.log("jsonfile = ", jsonFilePath)
                // window.log("jsonfile = "+jsonFilePath)

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
                let curTaskObj;
                _.each(taskList,(el) => {
                    _.each(el.ratioCommon,(ele,index) => {
                        if(ele.id === taskID){
                            curTaskObj = ele
                        }
                    })                    
                })
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
            }

        },
        watch:{
            lastsymbol(newVal,oldVal){
                var that = this
                if(newVal === 'x'){
                    that.aspectType = false
                }else if(newVal === '%'){
                    that.aspectType = true
                }
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
            UiProgressCircular,
            UiCheckbox,
            UiTextbox,
            UiCollapsible,
            UiAutocomplete,
            UiFab
        }
    }
</script>
