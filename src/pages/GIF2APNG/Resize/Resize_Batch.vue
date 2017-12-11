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
                :autofocus="changeDirConfigDialog.autofocus"
                :confirm-button-text="changeDirConfigDialog.confirmButtonText"
                :deny-button-text="changeDirConfigDialog.denyButtonText"
                :ref="changeDirConfigDialog.ref"
                :title="changeDirConfigDialog.title"
                class="page__toolbar-app-doc__change__batch"

                @confirm="changeDirConfigDialog.callbackConfirm"
                @deny="changeDirConfigDialog.callbackDeny"
                @open="changeDirConfigDialog.callbackOpen"
                @close="changeDirConfigDialog.callbackClose"
                >
                <div class="page__toolbar-app-doc__change-dimensions">
                    <div class="page__toolbar-app-doc__change-dimensions__content">
                        <div class="page__toolbar-app-doc__change-dimensions__size">
                            <div class="page__toolbar-app-doc__change-dimensions__width">
                                <span class="page__toolbar-app-doc__change-dimensions__width__percentage">{{ $t('pages.resize.dialog-config-change.width') }}</span>
                                <input  type="text" class="widthRange"
                                        :disabled="!applyAllFileTask" 
                                        v-model.number ="inputWidthAll"
                                        @focus="ValidateWidthNumber"
                                        v-number-only 
                                        minLength = 1 maxLength = 4        
                                >
                                <span class="page__toolbar-app-doc__change-dimensions__width__unit">{{ $t('pages.resize.dialog-config-change.pixel') }}</span>
                            </div>
                            <div class="page__toolbar-app-doc__change-dimensions__height">
                                <span class="page__toolbar-app-doc__change-dimensions__height__percentage">{{ $t('pages.resize.dialog-config-change.height') }}</span>
                                <input  type="text" class="heightRange"
                                        :disabled="!applyAllFileTask"  
                                        v-model.number ="inputHeightAll"
                                        @focus="ValidateHeightNumber"                                        
                                        v-number-only 
                                        minLength = 1 maxLength = 4 
                                >
                                <span class="page__toolbar-app-doc__change-dimensions__height__unit">{{ $t('pages.resize.dialog-config-change.pixel') }}</span>
                            </div>
                        </div>
                        <div class="page__toolbar-app-doc__change-dimensions__setting">
                            <div class="change-dimensions__setting__second">
                                <ui-checkbox
                                    v-model="PercentageConversion"
                                    @change="CheckboxPercentActive"
                                    >
                                    {{ $t('pages.resize.dialog-config-change.percent') }}
                                </ui-checkbox>                                
                            </div>   
                            <div class="change-dimensions__setting__first">
                                <ui-checkbox
                                    v-model="WidthHeightConversion"
                                    @change="CheckboxSizeActive"                                                              
                                    >
                                    {{ $t('pages.resize.dialog-config-change.width-height') }}
                                </ui-checkbox>                            
                            </div>
                            <div class="change-dimensions__setting__third">
                                <ui-checkbox
                                    v-model="onHandleTheTask"
                                    :disabled="!WidthHeightConversion"                                                            
                                    >
                                    {{ $t('pages.resize.dialog-config-change.handle-task') }}
                                </ui-checkbox>                            
                            </div>    
                            <div class="change-dimensions__setting__lock">
                                <ui-switch
                                    v-model="onBtnLock"
                                    :disabled="!WidthHeightConversion"
                                    switch-position="right"                                                             
                                    >
                                </ui-switch>
                                <span class="change-dimensions__setting__lock__title" v-show="onBtnLock">{{ $t('pages.resize.dialog-config-change.lock') }}</span>
                                <span class="change-dimensions__setting__unlock__title" v-show="!onBtnLock">{{ $t('pages.resize.dialog-config-change.unlock') }}</span>                            
                            </div>                                                   
                        </div>
                    </div>
                    <div class="page__toolbar-app-doc__change-dimensions__adjust">
                        <span class="change-dimensions__adjust__percentage">{{ $t('pages.resize.dialog-config-change.percentage') }}</span>
                        <input type="range" min="1" max="100" v-model.number="percentage" class="sliderRange">
                        <span class="change-dimensions__adjust__maximum">{{percentage +'%'}}</span>
                    </div>
                </div>
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
                        <span class="preview__info__image__before">{{ $t('pages.resize.dialog-config-preview.before') }}</span>
                        <img :src="afterPath" width="64" height="64" viewBox="0 0 64 64" />
                        <span class="preview__info__image__afrer">{{ $t('pages.resize.dialog-config-preview.after') }}</span>
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
                <div class="page__examples-app-doc__item" :data-taskid="item.id">
                    <div class="ui-toolbar__top">
                        <div class="ui-toolbar__top__metainfo">
                            <img :src="item.thumb" width="48" height="48" viewBox="0 0 48 48" />
                            <strong class="ui-toolbar__top__fileName" :title=" $t('pages.resize.task-item.file-name') +  item.name">
                                {{ item.omitName }}
                                <sup class="ui-toolbar__top__fileSize" :title=" $t('pages.resize.task-item.file-size') +  item.size ">
                                    {{ item.dimensions ? '(' + item.dimensions.data.width + 'x' + item.dimensions.data.height  + ')' : '' }}
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
                                <span class="fa fa-folder-open-o fa-lg fa-fw" :title=" $t('pages.resize.task-item.open-parent-dir') "></span>
                            </ui-icon-button>

                            <ui-icon-button
                                @click="onPreviewFile(item)"
                                type="secondary"
                                color="black"
                                size="small"
                                v-if="item.stateInfo.state == 1 && checkOutputPathIsFile(item.fixpath)"
                                >
                                <span class="fa fa-eye fa-lg fa-fw" :title=" $t('pages.resize.task-item.review-in-file') "></span>
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
                        <span class="ui-toolbar__body__filePath" :title=" $t('pages.resize.task-item.file-path') + item.path">{{ item.omitPath }}</span>
                    </div>
                    <div class="ui-toolbar__bottom">
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
</template>

<script>
import { BS, Util, _ , lodash } from 'dove.max.sdk'
import {UiIcon, UiSelect, UiTabs, UiTab, UiConfirm, UiButton, UiIconButton, UiAlert, UiToolbar, UiProgressLinear,UiCheckbox,UiTextbox,UiSwitch,UiModal} from 'keen-ui'
import {Transfer} from '../../../bridge/transfer'
import echarts from "echarts"

var baseID = "__page__resize__action__"
var baseIDIndex = -1


const taskPrefix = 'resize-page-image-id-' + _.now()
class Task {
    constructor(thumb, name, path, size, dimensions,omitName,omitPath){
        this.id = _.uniqueId(taskPrefix);
        this.thumb = thumb;   // 缩略图
        this.name = name;     // 图像文件名称
        this.path = path;     // 图像文件的路径
        this.size = size;     // 图像文件的存储大小
        ////----- 图片尺寸相关相关
        this.dimensions = dimensions
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
        this.stateInfo = {          // 修改运行状态
            state: 0,               // 修改是否成功 0. 没有修改， 1，修改成功， -1修改失败 ,2 取消转换
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
///////  预览
var beforePath = ''      // 原图片地址
var afterPath = ''       //修改后图片地址
//////
var inputActive;         // 输入框是否处于激活状态
var inputWidthAll;       // 文件夹类型输入框显示宽度
var inputHeightAll;      // 文件夹类型输入框显示高度
var finalPercentage;     // 确认时百分比
var finalInputWidth;     // 确认时输入框内宽度
var finalInputHeight;    // 确认时输入框内高度
///// 修改图片尺寸的弹出框
var initialInputWidth;                   //初始（宽度输入框）
var initialInputHeight;                  //初始（宽度输入框）
var initialPercentage;                   //初始（百分比）
var initialPtConversion;                 //初始（按比例转换）
var initialW_HConversion;                //初始（按宽高转换）
var initialHandleTask;                   //初始（是否处理大于原始尺寸的值）
var initialBtnLock;                      //初始（是否锁定宽高比）
var initialState;                        //初始（输入框是否处于激活状态）
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export default {

    data() {
        var that = this
        var defaultSides = 100
        var stats = Array.apply(null, { length: defaultSides }).map(function () { return 100 })
        console.log("Resize.vue call data()")
        return {
            welcomeContentID:'page__resize__welcome__id',
            openEchartsId:'info_echart_id',
            beforePath:beforePath,
            afterPath:afterPath,
            curWidth:0,
            curHeight:0,
            defaultCurWidth:0,
            defaultCurHeight:0,
            stats : stats,
            percentage:defaultSides,
            finalPercentage:finalPercentage,
            finalInputWidth:finalInputWidth,
            finalInputHeight:finalInputHeight,   
            inputWidthAll:0,
            inputHeightAll:0,
            applyAllFileTask:false,
            WidthHeightConversion:false,
            PercentageConversion:true,
            onBtnLock:true,
            onHandleTheTask:false,
            initialInputWidth:initialInputWidth,
            initialInputHeight:initialInputHeight,
            initialPercentage:initialPercentage,          
            initialPtConversion:initialPtConversion,
            initialW_HConversion:initialW_HConversion,             
            initialHandleTask:initialHandleTask,               
            initialBtnLock:initialBtnLock,                     
            planSelectModel: '',
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
            changeDirConfigDialog:{
                ref: 'changeDirConfigDialog',
                autofocus: 'none',
                confirmButtonText: 'Confirm',
                denyButtonText: 'Deny',
                title: '',
                callbackConfirm: ()=>{},
                callbackDeny: ()=>{},
                callbackOpen: ()=>{},
                callbackClose: ()=>{},
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
                if(that.$route.path.match(/resize_batch/)){
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
                {id:'action-importDir', visiable:true, color:"black", icon:"fa fa-folder-open-o fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.resize.toolbar.importDir"},
                {id:'action-outputFolder', visiable:true, color:"black", icon:"fa fa-cog fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.resize.toolbar.outputFolder"},
                {id:'action-resize', visiable:true, color:"black", icon:"fa fa-cogs fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.resize.toolbar.adjustSize"},
                {id:'action-do', visiable:true, color:"black", icon:"fa fa-play-circle-o fa-lg fa-fw", size:"small", type:"secondary",  tooltip:"pages.resize.toolbar.fix"},
                {id:'action-stop', visiable:true, color:"black", icon:"fa fa-stop-circle-o fa-lg fa-fw", size:"small", type:"secondary",  tooltip:"pages.resize.toolbar.chancel"},
                {id:'action-remove', visiable:true, color:"black", icon:"fa fa-trash-o fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.resize.toolbar.remove"}
           ]
        }
    },
    /////  限制输入框输入内容
    directives: {
        numberOnly: {
            bind: function(el) {
                el.handler = function() {
                    el.value = el.value.replace(/\D+/, '')
                }
                el.addEventListener('input', el.handler)
            },
            unbind: function(el) {
                el.removeEventListener('input', el.handler)
            }
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
            }else if(item.id === 'action-resize'){
                this.onBtnFitImageClick()
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
                    // Test[1]: Windows 本地实际数据
                    var _prx = "N_X" 
                    var i = 0
                    while(i < 50){
                        _prx += "N_X"
                        ++i
                    }
                    _.each([
                        {fileName: 'RAW_NIKON_D7100.NEF' + _prx, filePath:'D:\\TestResource\\exif_sample_images\\Nikon\\corrupted\\RAW_NIKON_D7100.NEF' + _prx, fileSize: '27.5MB',fileDimensions:{data:{width:250,height:150}}},
                        {fileName: 'YDSC_0021.NEF', filePath:'D:\\TestResource\\exif_sample_images\\Nikon\\corrupted\\YDSC_0021.NEF', fileSize: '10.7MB',fileDimensions:{data:{width:512,height:512}}}
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
                        let taskObj = new Task("images/picture.svg", ele.fileName, ele.filePath, ele.fileSize ,ele.fileDimensions,ele.omitName,ele.omitPath)
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
                title: this.$t('pages.resize.dialog-import-dir-images.title'),
                prompt: this.$t('pages.resize.dialog-import-dir-images.prompt'),
                allowMulSelection: true
            }, function(){
                for(let i =0; i < 5; ++i){
                    var taskObj = new Task("images/folder.svg", "ImagesDir" + i, "/url/imageDir" + i, i + '22.2MB',"","ImagesDir" + i,"/url/imageDir" + i)
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

        onBtnFitImageClick(){
            var that = this
            that.initialInputWidth = that.inputWidthAll
            that.initialInputHeight = that.inputHeightAll
            that.initialPercentage = that.percentage       
            that.initialPtConversion = that.PercentageConversion
            that.initialW_HConversion = that.WidthHeightConversion        
            that.initialHandleTask = that.onHandleTheTask 
            that.initialBtnLock = that.onBtnLock
            that.initialState = that.applyAllFileTask
            var $ = Util.util.getJQuery$()
            const cdg = that.changeDirConfigDialog
            cdg.title = that.$t('pages.resize.dialog-config-change.title')
            cdg.confirmButtonText = that.$t('pages.resize.dialog-config-change.btnConfirm')
            cdg.denyButtonText = that.$t('pages.resize.dialog-config-change.btnDeny')
            cdg.callbackConfirm = () => { that.recordedDirDataValue() }
            cdg.callbackDeny = () => { that.resetDirDataValue() }
            
            var dialog = that.$refs[cdg.ref]
            if(that.PercentageConversion){
                $('.sliderRange').css('background-size', that.percentage +'% 100%' )
            }
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
            if(that.percentage == 100 && that.PercentageConversion){
                BS.b$.Notice.alert({
                    message: that.$t('pages.resize.notice-no-prompt.message')
                })
                that.initialInputWidth = that.inputWidthAll
                that.initialInputHeight = that.inputHeightAll
                that.initialPercentage = that.percentage       
                that.initialPtConversion = that.PercentageConversion
                that.initialW_HConversion = that.WidthHeightConversion        
                that.initialHandleTask = that.onHandleTheTask 
                that.initialBtnLock = that.onBtnLock
                that.initialState = that.applyAllFileTask
                var $ = Util.util.getJQuery$()
                const cdg = that.changeDirConfigDialog
                cdg.title = that.$t('pages.resize.dialog-config-change.title')
                cdg.confirmButtonText = that.$t('pages.resize.dialog-config-change.btnConfirm')
                cdg.denyButtonText = that.$t('pages.resize.dialog-config-change.btnDeny')
                cdg.callbackConfirm = () => { 
                    that.recordedDirDataValue() 
                    that.__checkTheLastOutputPathIsExist()
                }
                cdg.callbackDeny = () => { that.resetDirDataValue() }

                var dialog = that.$refs[cdg.ref]
                if(that.PercentageConversion){
                    $('.sliderRange').css('background-size', that.percentage +'% 100%' )
                }
                dialog.open()                            
            } else {
              that.__checkTheLastOutputPathIsExist()
            }
        },
        __checkTheLastOutputPathIsExist(){
            var that = this 
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
                        var dimensions = {}
                        BS.b$.Binary.getImageFileInfo(
                            {path:fileObj.filePath}
                            ,function(info){
                                dimensions.data = info.data
                        })
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
                            let taskObj = new Task("file://" + fileObj.filePath, fileObj.fileName, fileObj.filePath, fileObj.fileSizeStr,dimensions,fileObj.omitName,fileObj.omitPath)
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
                            let taskObj = new Task(imgPath, fileObj.fileName, fileObj.filePath,"","",fileObj.omitName,fileObj.omitPath)
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
                _.each(that.taskList,(taskObj) => {
                    taskObj.stateInfo.state = 0
                    taskObj.stateInfo.progress = 0
                })
                if(that.PercentageConversion){
                    _.each(that.taskList, (taskObj, index) => {
                        that.__abi__start_ResizeGifTask(taskObj.id, {
                            src: taskObj.path,
                            dest: that.lastOutputPath,
                            enableIncludeMinImage: that.onHandleTheTask ? true : false,
                            overwrite: that.enableOverWriteOutput ? true : false,
                            IsPercentValue:true,
                            width: that.finalPercentage/100,
                            height: 0
                        }, (data) => {
                            if (data.infoType === 'type_calltask_log'){
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
                                    message: that.$t('pages.resize.notice-no-cancel.message')
                                })
                            }
                            // window.log('[x] infoType ===' + data.infoType)
                            // check converting
                            that.__checkTaskStateInfo()
                        } )
                    })
                }else if(that.WidthHeightConversion && that.onBtnLock){
                    if(isNaN(that.finalInputWidth)){
                        if(that.finalInputHeight < 16){
                           that.finalInputHeight = 16 
                        }
                        _.each(that.taskList, (taskObj, index) => {
                            that.__abi__start_ResizeGifTask(taskObj.id, {
                                src: taskObj.path,
                                dest: that.lastOutputPath,
                                enableIncludeMinImage: that.onHandleTheTask ? true : false,
                                overwrite: that.enableOverWriteOutput ? true : false,
                                IsPercentValue:false,
                                width: 0,
                                height: that.finalInputHeight
                            }, (data) => {
                                if (data.infoType === 'type_calltask_log'){
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
                                        message: that.$t('pages.resize.notice-no-cancel.message')
                                    })
                                }

                                // window.log('[x] infoType ===' + data.infoType)
                                
                                // check converting
                                that.__checkTaskStateInfo()
                            } )
                        })
                    }else if(isNaN(that.finalInputHeight)){
                        if(that.finalInputWidth < 16){
                           that.finalInputWidth = 16 
                        }                        
                        _.each(that.taskList, (taskObj, index) => {
                            that.__abi__start_ResizeGifTask(taskObj.id, {
                                src: taskObj.path,
                                dest: that.lastOutputPath,
                                enableIncludeMinImage: that.onHandleTheTask ? true : false,
                                overwrite: that.enableOverWriteOutput ? true : false,
                                IsPercentValue:false,
                                width: that.finalInputWidth,
                                height: 0
                            }, (data) => {
                                if (data.infoType === 'type_calltask_log'){
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
                                        message: that.$t('pages.resize.notice-no-cancel.message')
                                    })
                                }

                                // window.log('[x] infoType ===' + data.infoType)

                                // check converting
                                that.__checkTaskStateInfo()
                            } )
                        })
                    }
                }else if(that.WidthHeightConversion && that.onBtnLock == false){
                    if(that.finalInputWidth < 16){
                        that.finalInputWidth = 16 
                    }
                    if(that.finalInputHeight < 16){
                        that.finalInputHeight = 16 
                    }
                    _.each(that.taskList, (taskObj, index) => {
                        that.__abi__start_ResizeGifTask(taskObj.id, {
                            src: taskObj.path,
                            dest: that.lastOutputPath,
                            enableIncludeMinImage: that.onHandleTheTask ? true : false,
                            overwrite: that.enableOverWriteOutput ? true : false,
                            IsPercentValue:false,
                            width: that.finalInputWidth,
                            height: that.finalInputHeight
                        }, (data) => {
                            if (data.infoType === 'type_calltask_log'){
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
                                    message: that.$t('pages.resize.notice-no-cancel.message')
                                })
                            }

                            // window.log('[x] infoType ===' + data.infoType)

                            // check converting
                            that.__checkTaskStateInfo()
                        } )
                    })                    
                }
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
            console.assert(BS.b$.App.checkPathIsExist(_config.src))
            console.assert(BS.b$.App.checkPathIsExist(_config.dest))

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
            item.stateInfo.state = 0
            item.stateInfo.message = 0
            taskID2taskObj[item.id] = null

            // remove from taskList
            that.taskList.splice(index, 1)
        },

        onRemoveTaskItem(item, index) {
            console.log('item: ', item, 'index: ', index)
            var that = this
            // notice to server
            that.__abi__cancel_Gif2apngTask(item.id)
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
        },

        recordedDirDataValue(){
            var that = this
            var $ = Util.util.getJQuery$()
            if(that.WidthHeightConversion && that.onBtnLock){
                if(that.inputWidthAll == ''){
                    that.inputWidthAll = 0
                    that.finalInputWidth = 0
                }else if(that.inputHeightAll == ''){
                    that.inputHeightAll = 0
                    that.finalInputHeight = 0
                }else if(isNaN(that.inputHeightAll)){
                    that.finalInputHeight = 'Locked ratio'
                    that.finalInputWidth = that.inputWidthAll
                }else if(isNaN(that.inputWidthAll)){
                    that.finalInputWidth = 'Locked ratio'
                    that.finalInputHeight = that.inputHeightAll
                }
            }else if(that.WidthHeightConversion && !that.onBtnLock){
                if(that.inputWidthAll == ''){
                    that.inputWidthAll = 0
                    that.finalInputWidth = 0
                }else if(that.inputHeightAll == ''){
                    that.inputHeightAll = 0
                    that.finalInputHeight = 0
                }else {
                    that.finalInputWidth = that.inputWidthAll
                    that.finalInputHeight = that.inputHeightAll
                }
            }else if(that.PercentageConversion){
                that.percentage = that.percentage
            }
        },
        resetDirDataValue(){
            var that = this
            var $ = Util.util.getJQuery$()
            that.inputWidthAll = that.initialInputWidth
            that.inputHeightAll = that.initialInputHeight
            that.percentage = that.initialPercentage       
            that.PercentageConversion = that.initialPtConversion
            that.WidthHeightConversion = that.initialW_HConversion      
            that.onHandleTheTask = that.initialHandleTask
            that.onBtnLock = that.initialBtnLock
            that.applyAllFileTask = that.initialState
            $(".widthRange").attr("disabled",that.PercentageConversion)
            $(".heightRange").attr("disabled",that.PercentageConversion)
            $(".sliderRange").attr("disabled",that.WidthHeightConversion)
        },

        ValidateWidthNumber(){
            var that = this
            if(that.onBtnLock){
                that.inputHeightAll = that.$t('pages.resize.dialog-config-change.input-lock')
                that.inputWidthAll = ''
            }
        },
        ValidateHeightNumber(){
            var that = this
            if(that.onBtnLock){
                that.inputWidthAll = that.$t('pages.resize.dialog-config-change.input-lock')
                that.inputHeightAll = ''
            }
        },
        CheckboxSizeActive(value, e){
            var that = this
            var $ = Util.util.getJQuery$()
            that.PercentageConversion = !e.target.checked
            if(e.target.checked == true){
                $(".sliderRange").attr("disabled",true)
                $('.sliderRange').css('background-size', '0% 100%')
                $(".widthRange").attr("disabled",false)
                $(".heightRange").attr("disabled",false)
            }else{
                $(".sliderRange").attr("disabled",false)
                $('.sliderRange').css('background-size', that.percentage +'% 100%')
                $(".widthRange").attr("disabled",true)
                $(".heightRange").attr("disabled",true)
                that.inputWidthAll = 0
                that.inputHeightAll = 0          
            }            
        },

        CheckboxPercentActive(value, e){
            var that = this
            var $ = Util.util.getJQuery$()
            that.WidthHeightConversion = !e.target.checked          
            if(e.target.checked == true){
                $(".widthRange").attr("disabled",true)
                $(".heightRange").attr("disabled",true)
                $(".sliderRange").attr("disabled",false)
                $('.sliderRange').css('background-size', that.percentage +'% 100%') 
                that.inputWidthAll = 0
                that.inputHeightAll = 0
            }else {
                $(".widthRange").attr("disabled",false)
                $(".heightRange").attr("disabled",false)
                $(".sliderRange").attr("disabled",true)
                $('.sliderRange').css('background-size', '0% 100%')
            }
        },
        onOpenParentDir(dir){
            var that = this
            BS.b$.revealInFinder(dir,(data) => {})
        },
        onPreviewFile(item){
            var that = this
            const cdg = that.previewConfirmDialog
            cdg.title = that.$t('pages.resize.dialog-config-preview.title')
            cdg.confirmButtonText = that.$t('pages.resize.dialog-config-preview.btnConfirm')
            cdg.denyButtonText = that.$t('pages.resize.dialog-config-preview.btnDeny')
            var dialog = that.$refs[cdg.ref]
            dialog.open()
            that.drawLineChart(item)
            that.openBeforeModificationThumb(item)
            that.openAfterModificationThumb(item)
        },
        ///// 转化为KB/////////////////////////
        bytesToSize(bytes) {
                var k = 1000
                var i = Math.floor(Math.log(bytes) / Math.log(k))
                return (bytes / Math.pow(k, i))
            },
        //  信息对比绘制////////////////////////////////////////////////////////////////////////////////////////////////
        drawLineChart(item){
            var that = this
            var myChart = echarts.init(document.getElementById('info_echart_id'))
            var beforeSize = BS.b$.App.fileSizeAtPath(item.path)
            var afterSize = BS.b$.App.fileSizeAtPath(item.fixpath)
            var beforeSizeBytes = parseInt(beforeSize)
            var afterSizeBytes = parseInt(afterSize)
            var beforeModificationSize = that.bytesToSize(beforeSizeBytes)
            var afterModificationSize = that.bytesToSize(afterSizeBytes)
            myChart.setOption({
                title: {
                    text: '数据对比图'
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
                    data: ['文件大小']
                },
                yAxis: {
                    type : 'value',
                    axisLabel: {
                        formatter:'{value}KB',
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
    watch:{
        percentage(newSides, oldSides){
            var $ = Util.util.getJQuery$()
            this.finalPercentage = newSides
            $('.sliderRange').css('background-size', newSides +'% 100%' )
            var sidesDifference = newSides - oldSides
            if (sidesDifference > 0) {
                for (var i = 1; i <= sidesDifference; i++) {
                    this.stats.push(100)
                }
            } else {
                var absoluteSidesDifference = Math.abs(sidesDifference)
                for (var i = 1; i <= absoluteSidesDifference; i++) {
                    this.stats.shift()
                }
            }                 
        },
        onBtnLock(newSwich, oldSwich){
            var that = this
            if(newSwich){
                that.inputWidthAll = 0
                that.inputHeightAll = that.$t('pages.resize.dialog-config-change.input-lock')                
            }else {
                that.inputWidthAll = 0
                that.inputHeightAll = 0
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
        UiCheckbox,
        UiTextbox,
        UiSwitch,
        UiModal
    }
}
</script>
