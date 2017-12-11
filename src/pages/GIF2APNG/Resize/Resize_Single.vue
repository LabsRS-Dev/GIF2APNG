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
                class="page__confirm__dialog__isExist"
                :autofocus="isExistConfirmDialog.autofocus"
                :confirm-button-text="isExistConfirmDialog.confirmButtonText"
                :deny-button-text="isExistConfirmDialog.denyButtonText"
                :ref="isExistConfirmDialog.ref"
                :title="isExistConfirmDialog.title"

                @confirm="isExistConfirmDialog.callbackConfirm"
                @deny="isExistConfirmDialog.callbackDeny"
                @open="isExistConfirmDialog.callbackOpen"
                @close="isExistConfirmDialog.callbackClose"
                >
                {{ isExistConfirmDialog.content }}
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
            <div class="page__examples-app-doc__welcome__image" v-show="taskList.length >0">
                <div
                    class="page__examples-app-doc__welcome__image__single"
                    v-for="(item, index) in taskList" 
                    :key="item.id"
                    >
                        <div class="page__examples-app-doc__welcome__image__hint" v-show="enableCustomRatio">
                            <span class="image__single__hint__title">{{ $t('pages.resize.task-item.hint') }} : 1:{{imageScale}}</span>
                        </div>
                        <div class="page__examples-app-doc__welcome__image__top" v-show="showMaskLayer">
                            <img :src="item.path" class="imageBlur" v-show="showMaskLayer && !enableCustomRatio" draggable="false">
                            <img :src="item.path" class="imageCustomBlur" v-show="showMaskLayer && enableCustomRatio" draggable="false">
                            <ui-progress-linear
                                :color="getItemProgressStyle(item)"
                                :progress="item.progress"
                                v-show="getImageProgressShow(item)"
                                :title=" $t('pages.resize.task-item.progress') + item.progress"
                                >
                            </ui-progress-linear>
                            <div class="image__single__top__message">
                                <span
                                    class="fa fa-check fa-lg fa-fw"
                                    v-show="showMaskLayerSuccess"
                                    >
                                </span>
                                <span
                                    class="fa fa-exclamation fa-lg fa-fw"
                                    v-show="showMaskLayerError"
                                    >
                                </span>
                                <span
                                    class="fa fa-hand-paper-o fa-lg fa-fw"
                                    v-show="showMaskLayerCancel"
                                    >
                                </span>                              
                            </div>
                        </div>   
                        <div class="page__examples-app-doc__welcome__image__scale">                    
                            <img :src="item.path" class="sliderImage" draggable="false" v-show="!enableCustomRatio">
                            <img :src="item.path" class="sliderCustomImage" draggable="false" v-show="enableCustomRatio">   
                        </div>
                </div>
                <div class="page__examples-app-doc__welcome__image__setting">
                    <div class="page__examples-app-doc__welcome__image__setting__size">
                            <div class="page__examples-app-doc__welcome__image__setting__width">
                                <span class="page__examples-app-doc__welcome__image__setting__width__percentage">{{ $t('pages.resize.dialog-config-change.width') }}</span>
                                <input  type="text" class="widthRange"  
                                        v-model.number ="inputWidth" 
                                        @input="ValidateWidthNumber"
                                        @blur="changeInputActive()" 
                                        v-number-only 
                                        minLength = 1 maxLength = 4
                                >
                                <span class="page__examples-app-doc__welcome__image__setting__width__unit">{{ $t('pages.resize.dialog-config-change.pixel') }}</span>
                            </div>
                            <div class="page__examples-app-doc__welcome__image__setting__height">
                                <span class="page__examples-app-doc__welcome__image__setting__height__percentage">{{ $t('pages.resize.dialog-config-change.height') }}</span>
                                <input  type="text" class="heightRange" 
                                        v-model.number ="inputHeight" 
                                        @input="ValidateHeightNumber" 
                                        @blur="changeInputActive()" 
                                        v-number-only 
                                        minLength = 1 maxLength = 4
                                >
                                <span class="page__examples-app-doc__welcome__image__setting__height__unit">{{ $t('pages.resize.dialog-config-change.pixel') }}</span>
                            </div>
                    </div>
                    <div class="page__examples-app-doc__welcome__image__setting__adjust">
                        <span class="change-dimensions__adjust__percentage">{{ $t('pages.resize.dialog-config-change.percentage') }}</span>
                        <input type="range" min="5" max="100" step="1" v-model.number="percentage" :disabled="!enableMaintainAspectRatio" class="sliderRange" v-show="!isCustomRatio">
                        <input type="range" min="5" max="200" step="1" v-model.number="percentageCustom"  class="sliderCustomRange" v-show="isCustomRatio">
                        <span class="change-dimensions__adjust__maximum" v-show="!isCustomRatio">{{percentage +'%'}}</span>
                        <span class="change-dimensions__adjust__maximum" v-show="isCustomRatio">{{percentageCustom +'%'}}</span>
                    </div>
                    <div class="page__examples-app-doc__welcome__image__setting__button">
                        <div class="page__examples-app-doc__welcome__image__setting__keep">
                            <ui-checkbox
                                v-model="enableMaintainAspectRatio"
                                :disabled="enableCustomRatio"
                                @change="getCheckboxActive"
                                >
                                {{ $t('pages.resize.dialog-config-change.setting') }}
                            </ui-checkbox>
                            <ui-checkbox
                                v-model="enableCustomRatio"
                                @change="getCustomCheckboxActive"
                                >
                                {{ $t('pages.resize.dialog-config-change.custom') }}
                            </ui-checkbox>
                        </div>
                        <div class="page__examples-app-doc__welcome__image__setting__reply">
                            <ui-icon-button
                                @click="onToolReplayBtnClick()"
                                type="secondary"
                                size="small"
                                color="primary"
                                >
                                    <span class="fa fa-refresh fa-lg fa-fw" :title="$t('pages.resize.content.reply')"></span>
                            </ui-icon-button>                          
                        </div>                        
                    </div>

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
    static key = "resize_single-page-settings"

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
////
var inputWidth;           // 输入框显示宽度
var inputHeight;          // 输入框显示高度
var finalPercentage;      // 确认时百分比
var finalPercentageCustom;// 自定义最终确认百分比
var finalInputWidth;      // 确认时输入框内宽度
var finalInputHeight;     // 确认时输入框内高度
var changeOrgWidth;       // 切换到自定义之前保存的宽度
var changeOrgHeight;      // 切换到自定义之前保存的高度
var changeCustomWidth;    // 切换到原比例之前保存的宽度
var changeCustomHeight;   // 切换到原比例之前保存的高度


export default {
    data() {
        var that = this
        var defaultSides = 100
        var stats = Array.apply(null, { length: defaultSides }).map(function () { return 100 })
        return {
            taskList: taskList,
            enableOverWriteOutput: $LS$.data.enableOverwriteOutput,
            taskID2taskObj: {},
            isResizeWorking: false,
            showMaskLayer:false,
            showMaskLayerSuccess:false,
            showMaskLayerError:false,
            showMaskLayerCancel:false,
            transferIsNormal: Transfer.isRunning,  // Is transfer is working normal?
            progressInterval: null,  // 进度条轮询
            lastOutputPath: $LS$.data.lastSelectOutputPath,
            availableOutputPathList: $LS$.data.outputPaths,
            curWidth:Number,
            curHeight:Number,
            defaultCurWidth:Number,
            defaultCurHeight:Number,
            customWidth:Number,
            customHeight:Number,
            defaultCustomWidth:Number,
            defaultCustomHeight:Number,
            isCheckNumber:1,      // 检查是否第一次进入自定义界面
            isCheckPercent:1,     // 检查是否第一次拖动range
            firstCustomWidth:Number,      // 第一次拖动range  width  输入框的值
            firstCustomHeight:Number,     // 第一次拖动range  heiget 输入框的值
            imageScale:1,         // 默认图片比例
            defaultImageScale:1,  // 第一次进入自定义界面时的比例
            WidthFocus:false,
            HeightFocus:false,
            changeOrgWidth:changeOrgWidth,
            changeOrgHeight:changeOrgHeight,
            changeCustomWidth:changeCustomWidth,
            changeCustomHeight:changeCustomHeight,
            inputWidth:inputWidth,
            inputHeight:inputHeight,
            stats : stats,
            percentage:defaultSides,
            finalPercentage:defaultSides,
            percentageCustom:defaultSides,
            finalPercentageCustom:defaultSides,
            finalInputWidth:finalInputWidth,
            finalInputHeight:finalInputHeight,   
            enableMaintainAspectRatio:true,
            enableCustomRatio:false,
            onChangeTestFile:true,
            isCustomRatio:false,
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
            isExistConfirmDialog:{
                ref: 'isExistConfirmDialog',
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
                if(that.$route.path.match(/resize_single/)){
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
        onToolReplayBtnClick(){
            var that = this
            var clientWidth = document.body.clientWidth
            var clientHeight = document.body.clientHeight
            var $ = Util.util.getJQuery$()
            that.showMaskLayer = false
            that.showMaskLayerSuccess = false
            that.showMaskLayerError = false
            that.showMaskLayerCancel = false
            if(that.enableCustomRatio){
                that.isCheckPercent = 1
                that.imageScale = that.defaultImageScale
                if(that.percentageCustom !== 100){
                    that.onChangeTestFile = false
                    that.percentageCustom = 100
                }
                that.customWidth = that.defaultCustomWidth
                that.customHeight = that.defaultCustomHeight
                that.inputWidth = that.defaultCustomWidth
                that.inputHeight = that.defaultCustomHeight
                $('.sliderCustomImage').css('width',that.defaultCustomWidth)
                $('.sliderCustomImage').css('height',that.defaultCustomHeight)
                $('.imageCustomBlur').css('width',that.defaultCustomWidth)
                $('.imageCustomBlur').css('height',that.defaultCustomHeight)             
            }else {
                that.curWidth = that.defaultCurWidth
                that.curHeight = that.defaultCurHeight
                that.inputWidth = that.defaultCurWidth
                that.inputHeight = that.defaultCurHeight
                that.enableMaintainAspectRatio = true
                if(that.percentage !== 100){
                    that.onChangeTestFile = false
                    that.percentage = 100
                }
                if(that.defaultCurWidth < clientWidth*0.4 && that.defaultCurHeight < clientHeight*0.6){
                    $('.sliderImage').css('width',that.defaultCurWidth)
                    $('.sliderImage').css('height',that.defaultCurHeight)
                    $('.imageBlur').css('width',that.defaultCurWidth)
                    $('.imageBlur').css('height',that.defaultCurHeight)                                            
                }else if(that.defaultCurWidth < clientWidth*0.4 && that.defaultCurHeight > clientHeight*0.6){
                    let width = ((clientHeight*0.6)/that.defaultCurHeight)*that.defaultCurWidth
                    $('.sliderImage').css('width',width)
                    $('.sliderImage').css('height',clientHeight*0.6)
                    $('.imageBlur').css('width',width)
                    $('.imageBlur').css('height',clientHeight*0.6)
                }else if(that.defaultCurWidth > clientWidth*0.4 && that.defaultCurHeight < clientHeight*0.6){
                    let height = ((clientWidth*0.4)/that.defaultCurWidth)*that.defaultCurHeight
                    $('.sliderImage').css('width',clientWidth*0.4)
                    $('.sliderImage').css('height',height)
                    $('.imageBlur').css('width',clientWidth*0.4)
                    $('.imageBlur').css('height',height)
                }else if(that.defaultCurWidth > clientWidth*0.4 && that.defaultCurHeight > clientHeight*0.6){
                    let cliWidth = that.defaultCurWidth/(clientWidth*0.4)
                    let cliHeight = that.defaultCurHeight/(clientHeight*0.6)
                    if(cliWidth >= cliHeight){
                        let endWidth = clientWidth*0.4
                        let endHeight = that.defaultCurHeight/cliWidth
                        $('.sliderImage').css('width',endWidth)
                        $('.sliderImage').css('height',endHeight)
                        $('.imageBlur').css('width',endWidth)
                        $('.imageBlur').css('height',endHeight)
                    } else {
                        let endWidth = that.defaultCurWidth/cliHeight
                        let endHeight = clientHeight*0.6
                        $('.sliderImage').css('width',endWidth)
                        $('.sliderImage').css('height',endHeight)
                        $('.imageBlur').css('width',endWidth)
                        $('.imageBlur').css('height',endHeight)                    
                    }
                }                
            }
        },

        onBtnImportFilesClick(){
            var that = this
            that.taskList = []
            that.showMaskLayer = false
            that.showMaskLayerSuccess = false
            that.showMaskLayerError = false
            that.showMaskLayerCancel = false
            that.enableMaintainAspectRatio = true
            that.enableCustomRatio = false
            that.isCheckNumber = 1
            that.isCheckPercent = 1
            that.imageScale = 1
            that.defaultImageScale = 1
            console.log("-------------------- call import files")
                // call bs
            BS.b$.importFiles({
                title: this.$t('pages.resize.dialog-import-images.title'),
                prompt: this.$t('pages.resize.dialog-import-images.prompt'),
                allowMulSelection: false,
                types:[] // Note: too many formats
            }, function(){ // Test code
                // Test: Windows 本地实际数据
                var img = [
                            {path:'http://img.mp.itc.cn/upload/20160323/22d014b2fcff4c199ed6f2e6ab4ae9fd.jpg',width:400,height:224},
                            {path:'http://img.mp.itc.cn/upload/20160322/62106ba2b7014f8d8814a999285548c7.jpg',width:280,height:157},
                            {path:'http://image.xcar.com.cn/attachments/a/day_140304/2014030414_1165b02cf2320ee81f92CnORE7mRIuCm_sst_560.gif',width:560,height:521},
                            {path:'http://p2.so.qhimgs1.com/t01a4723418f8de871e.gif',width:585,height:240},
                            {path:'http://www.tfedu.org//forum//data//attachment//forum//201402//05//152308tr8pyys87do18yo8.gif',width:460,height:768}
                        ]
                var index = Math.floor(Math.random() * 5)
                let ele = {fileName: 'RAW_NIKON_D7100.NEF', filePath:img[index].path, fileSize: '27.5MB',fileDimensions:{data:{width:img[index].width,height:img[index].height}}}
                let taskObj = new Task("images/picture.svg", ele.fileName, ele.filePath, ele.fileSize ,ele.fileDimensions)
                that.taskList.push(taskObj)
                console.log('taskID-files=', taskObj.id)
                taskID2taskObj[taskObj.id] = taskObj
                that.curWidth = that.taskList[0].dimensions.data.width
                that.curHeight = that.taskList[0].dimensions.data.height
                that.defaultCurWidth = that.taskList[0].dimensions.data.width
                that.defaultCurHeight = that.taskList[0].dimensions.data.height
                that.inputWidth = Math.round(that.curWidth)
                that.inputHeight = Math.round(that.curHeight) 
                if(that.percentage !== 100){
                    that.onChangeTestFile = false
                    that.percentage = 100
                }  
                if(that.percentageCustom !== 100){
                    that.onChangeTestFile = false
                    that.percentageCustom = 100
                } 
                $('.sliderRange').css('background-size', that.percentage +'% 100%' )
                $('.sliderCustomRange').css('background-size', that.percentageCustom/2 +'% 100%' )
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
            if(that.taskList.length === 0) {
                return BS.b$.Notice.alert({
                    message: that.$t('pages.resize.notice-no-items.message')
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
            var $ = Util.util.getJQuery$()
            if(data.success) {
                var imageFiles = data.filesArray
                var dimensions = {}
                BS.b$.Binary.getImageFileInfo(
                    {path:imageFiles[0].filePath}
                    ,function(info){
                        dimensions.data = info.data
                })
                var checkFileExt
                _.each(imageFiles,(fileObj, dinx) => {
                    checkFileExt = BS.b$.App.getFileExt(fileObj.filePath).toLowerCase()
                    if(BS.b$.App.checkPathIsFile(fileObj.filePath)){
                        // let taskObj = new Task("images/picture.svg", fileObj.fileName, fileObj.filePath, fileObj.fileSizeStr)
                        if (!that.__findTaskObjExistWithPath(fileObj.filePath) &&  checkFileExt == 'gif'){
                            let taskObj = new Task("file://" + fileObj.filePath, fileObj.fileName, fileObj.filePath, fileObj.fileSizeStr,dimensions)
                            that.taskList.push(taskObj)
                            taskID2taskObj[taskObj.id] = taskObj
                        }
                        var length = that.taskList.length
                        that.taskList.splice(1,length-1)
                        that.curWidth = that.taskList[0].dimensions.data.width
                        that.curHeight = that.taskList[0].dimensions.data.height
                        that.defaultCurWidth = that.taskList[0].dimensions.data.width
                        that.defaultCurHeight = that.taskList[0].dimensions.data.height
                        that.inputWidth = Math.round(that.curWidth)
                        that.inputHeight = Math.round(that.curHeight) 
                        if(that.percentage !== 100){
                            that.onChangeTestFile = false
                            that.percentage = 100
                        }
                        if(that.percentageCustom !== 100){
                            that.onChangeTestFile = false
                            that.percentageCustom = 100
                        } 
                        $('.sliderRange').css('background-size', that.percentage +'% 100%' )
                        $('.sliderCustomRange').css('background-size', that.percentageCustom/2 +'% 100%' )
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
            var $ = Util.util.getJQuery$()
            console.log(that.enableOverWriteOutput)
            that.showMaskLayer = false
            that.showMaskLayerSuccess = false
            that.showMaskLayerError = false
            that.showMaskLayerCancel = false
            if(that.taskList.length > 0){
                _.each(that.taskList, (taskObj, index) => {
                    let fileName = BS.b$.App.getFileName(taskObj.path)
                    let filePath = that.lastOutputPath + '/' + fileName
                    if (that.enableOverWriteOutput == false && BS.b$.App.checkPathIsExist(filePath)){
                        const cdg = that.isExistConfirmDialog
                        cdg.title = that.$t('pages.resize.dialog-confirm-isExist.title')
                        cdg.content = that.$t('pages.resize.dialog-confirm-isExist.message')
                        cdg.confirmButtonText = that.$t('pages.resize.dialog-confirm-isExist.btnConfirm')
                        cdg.denyButtonText = that.$t('pages.resize.dialog-confirm-isExist.btnDeny')

                        var dialog = that.$refs[cdg.ref]
                        cdg.callbackConfirm = () =>{ 
                            that.__abi__start_ResizeGifTask(taskObj.id, {
                                src: taskObj.path,
                                dest: that.lastOutputPath,
                                overwrite: true,
                                enableIncludeMinImage:true,
                                IsPercentValue:false,
                                width: that.finalInputWidth,
                                height: that.finalInputHeight
                            }, (data) => {
                                if (data.infoType === 'type_calltask_log'){
                                    that.showMaskLayer = true
                                    that.__updateInfoWithGif2apngTask(taskObj.id, {
                                        progress: 50,
                                        state:0
                                    })
                                }else if (data.infoType === 'type_calltask_success'){
                                    that.showMaskLayerSuccess = true
                                    $('.image__single__top__message').css('background-color','rgba(0,0,0,0)')
                                    that.__updateInfoWithGif2apngTask(taskObj.id, {
                                        progress: 100,
                                        state: 1
                                    })
                                }else if (data.infoType === 'type_calltask_error'){
                                    that.showMaskLayerError = true
                                    $('.image__single__top__message').css('background-color','rgba(0,0,0,0)')
                                    that.__updateInfoWithGif2apngTask(taskObj.id, {
                                        progress: 100,
                                        state: -1
                                    })
                                }else if (data.infoType === 'type_calltask_cancel') {
                                    that.showMaskLayerCancel = true
                                    $('.image__single__top__message').css('background-color','rgba(0,0,0,0)')
                                    that.__updateInfoWithGif2apngTask(taskObj.id, {
                                        progress: 100,
                                        state: 0
                                    })
                                }
                                // window.log('[x] infoType ===' + data.infoType)
                                // check converting
                                that.__checkTaskStateInfo()
                            } )  
                        }
                        cdg.callbackDeny = () => { 
                            that.__abi__start_ResizeGifTask(taskObj.id, {
                                src: taskObj.path,
                                dest: that.lastOutputPath,
                                overwrite:false,
                                enableIncludeMinImage:true,
                                IsPercentValue:false,
                                width: that.finalInputWidth,
                                height: that.finalInputHeight
                            }, (data) => {
                                if (data.infoType === 'type_calltask_log'){
                                    that.showMaskLayer = true
                                    that.__updateInfoWithGif2apngTask(taskObj.id, {
                                        progress: 50,
                                        state:0
                                    })
                                }else if (data.infoType === 'type_calltask_success'){
                                    that.showMaskLayerSuccess = true
                                    $('.image__single__top__message').css('background-color','rgba(0,0,0,0)')
                                    that.__updateInfoWithGif2apngTask(taskObj.id, {
                                        progress: 100,
                                        state: 1
                                    })
                                }else if (data.infoType === 'type_calltask_error'){
                                    that.showMaskLayerError = true
                                    $('.image__single__top__message').css('background-color','rgba(0,0,0,0)')
                                    that.__updateInfoWithGif2apngTask(taskObj.id, {
                                        progress: 100,
                                        state: -1
                                    })
                                }else if (data.infoType === 'type_calltask_cancel') {
                                    that.showMaskLayerCancel = true
                                    $('.image__single__top__message').css('background-color','rgba(0,0,0,0)')
                                    that.__updateInfoWithGif2apngTask(taskObj.id, {
                                        progress: 100,
                                        state: 0
                                    })
                                }
                                // window.log('[x] infoType ===' + data.infoType)
                                // check converting
                                that.__checkTaskStateInfo()
                            } )  
                        }
                        dialog.open()
                    } else {
                        that.__abi__start_ResizeGifTask(taskObj.id, {
                            src: taskObj.path,
                            dest: that.lastOutputPath,
                            overwrite: that.enableOverWriteOutput ? true : false,
                            enableIncludeMinImage:true,
                            IsPercentValue:false,
                            width: that.finalInputWidth,
                            height: that.finalInputHeight
                        }, (data) => {
                            if (data.infoType === 'type_calltask_log'){
                                that.showMaskLayer = true
                                that.__updateInfoWithGif2apngTask(taskObj.id, {
                                    progress: 50,
                                    state:0
                                })
                            }else if (data.infoType === 'type_calltask_success'){
                                that.showMaskLayerSuccess = true
                                $('.image__single__top__message').css('background-color','rgba(0,0,0,0)')
                                that.__updateInfoWithGif2apngTask(taskObj.id, {
                                    progress: 100,
                                    state: 1
                                })
                            }else if (data.infoType === 'type_calltask_error'){
                                that.showMaskLayerError = true
                                $('.image__single__top__message').css('background-color','rgba(0,0,0,0)')
                                that.__updateInfoWithGif2apngTask(taskObj.id, {
                                    progress: 100,
                                    state: -1
                                })
                            }else if (data.infoType === 'type_calltask_cancel') {
                                that.showMaskLayerCancel = true
                                $('.image__single__top__message').css('background-color','rgba(0,0,0,0)')
                                that.__updateInfoWithGif2apngTask(taskObj.id, {
                                    progress: 100,
                                    state: 0
                                })
                            }
                            // window.log('[x] infoType ===' + data.infoType)
                            // check converting
                            that.__checkTaskStateInfo()
                        } )                        
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
                    that.__abi__cancel_Gif2apngTask(taskObj.id,(data) => {
                        // check converting
                        if (data.infoType === 'type_calltask_cancel'){
                            that.__updateInfoWithGif2apngTask(taskObj.id, {
                                progress: 100,
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

            const transferTaskID =  _.uniqueId('(T.NO') + ')-' + taskID + _.now()
            that.__updateTaskObj(taskID, {fixOutDir:_config.dest}, (taskObj) => { taskObj.associatedTransferTaskIds.push(transferTaskID)})

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
        },
        ValidateWidthNumber:_.debounce(function(e){
                var that = this
                var $ = Util.util.getJQuery$()
                var clientWidth = document.body.clientWidth
                var clientHeight = document.body.clientHeight
                var value = Number(e.target.value)
                if(that.enableMaintainAspectRatio == false){
                    that.WidthFocus = true                  
                }
                if(that.enableCustomRatio){
                    that.isCheckPercent = 1
                    if(that.percentageCustom !== 100){
                        that.onChangeTestFile = false
                        that.percentageCustom = 100
                    }
                    if(value >= 16) {
                         if(value > clientWidth*0.2){
                            var scale =  _.ceil(value/(clientWidth*0.2),1)
                            if(that.defaultImageScale < scale){
                                that.imageScale = scale
                                let scaling = 1/that.imageScale
                                $('.sliderCustomImage').css('transform','scale(' + scaling + ')')
                                $('.imageCustomBlur').css('transform','scale(' + scaling + ')')
                            }
                        }
                        that.customWidth = value
                        that.customHeight = that.finalInputHeight
                        that.inputWidth = Math.round(that.customWidth)
                        that.inputHeight = Math.round(that.customHeight)
                        $('.sliderCustomImage').css('width',that.customWidth)
                        $('.sliderCustomImage').css('height',that.customHeight)
                        $('.imageCustomBlur').css('width',that.customWidth)
                        $('.imageCustomBlur').css('height',that.customHeight)  
                    } else if(value < 16) {
                        that.customWidth = 16
                        that.customHeight = that.finalInputHeight
                        that.inputWidth = 16
                        that.inputHeight = Math.round(that.customHeight)
                        $('.sliderCustomImage').css('width',that.customWidth)
                        $('.sliderCustomImage').css('height',that.customHeight)
                        $('.imageCustomBlur').css('width',that.customWidth)
                        $('.imageCustomBlur').css('height',that.customHeight)
                    }
                }else {
                    if(value >= 16) {
                        if(that.enableMaintainAspectRatio == true){
                            that.inputActive = 10
                            that.curWidth = value
                            that.curHeight = (value/that.defaultCurWidth)*that.defaultCurHeight
                            that.inputHeight = Math.round(that.curHeight)
                            that.percentage  = Math.round((value/that.defaultCurWidth)*100)
                            if(that.curWidth < clientWidth*0.4 && that.curHeight < clientHeight*0.6){
                                $('.sliderImage').css('width',that.curWidth)
                                $('.sliderImage').css('height',that.curHeight)
                                $('.imageBlur').css('width',that.curWidth)
                                $('.imageBlur').css('height',that.curHeight)                              
                            }else if(that.curWidth < clientWidth*0.4 && that.curHeight > clientHeight*0.6){
                                let width = ((clientHeight*0.6)/that.defaultCurHeight)*that.defaultCurWidth
                                $('.sliderImage').css('width',width)
                                $('.sliderImage').css('height',clientHeight*0.6)
                                $('.imageBlur').css('width',width)
                                $('.imageBlur').css('height',clientHeight*0.6)
                            }else if(that.curWidth > clientWidth*0.4 && that.curHeight < clientHeight*0.6){
                                let height = ((clientWidth*0.4)/that.defaultCurWidth)*that.defaultCurHeight
                                $('.sliderImage').css('width',clientWidth*0.4)
                                $('.sliderImage').css('height',height)
                                $('.imageBlur').css('width',clientWidth*0.4)
                                $('.imageBlur').css('height',height)
                            }else if(that.curWidth > clientWidth*0.4 && that.curHeight > clientHeight*0.6){
                                let cliWidth = that.defaultCurWidth/(clientWidth*0.4)
                                let cliHeight = that.defaultCurHeight/(clientHeight*0.6)
                                if(cliWidth >= cliHeight){
                                    let endWidth = clientWidth*0.4
                                    let endHeight = that.defaultCurHeight/cliWidth
                                    $('.sliderImage').css('width',endWidth)
                                    $('.sliderImage').css('height',endHeight)
                                    $('.imageBlur').css('width',endWidth)
                                    $('.imageBlur').css('height',endHeight)
                                } else {
                                    let endWidth = that.defaultCurWidth/cliHeight
                                    let endHeight = clientHeight*0.6
                                    $('.sliderImage').css('width',endWidth)
                                    $('.sliderImage').css('height',endHeight)
                                    $('.imageBlur').css('width',endWidth)
                                    $('.imageBlur').css('height',endHeight)                      
                                }
                            }
                        }else {
                            that.inputActive = 10
                            that.curWidth = value
                            $('.sliderImage').css('width',that.curWidth)
                            $('.imageBlur').css('width',that.curWidth)
                        }                
                    } else if(value < 16){              
                        if(that.enableMaintainAspectRatio){
                            that.inputActive = 10
                            that.curWidth = 16
                            that.inputWidth = 16
                            that.curHeight = (16/that.defaultCurWidth)*that.defaultCurHeight
                            that.inputHeight = Math.round(that.curHeight)
                            that.percentage  = Math.round((16/that.defaultCurWidth)*100)
                            $('.sliderImage').css('width',that.curWidth)
                            $('.sliderImage').css('height',that.curHeight)
                            $('.imageBlur').css('width',that.curWidth)
                            $('.imageBlur').css('height',that.curHeight)   
                        } else {
                            that.inputActive = 10
                            that.curWidth = 16
                            that.inputWidth = 16
                            $('.sliderImage').css('width',that.curWidth)
                            $('.imageBlur').css('width',that.curWidth)                    
                        }
                    }                      
                }
            },1000),
        ValidateHeightNumber:_.debounce(function(e){
                var that = this
                var $ = Util.util.getJQuery$()
                var clientWidth = document.body.clientWidth
                var clientHeight = document.body.clientHeight
                var value = Number(e.target.value)
                if(that.enableMaintainAspectRatio == false){
                    that.HeightFocus = true
                }
                if(that.enableCustomRatio){
                    that.isCheckPercent = 1
                     if(value > clientHeight*0.3){
                        var scale =  _.ceil(value/(clientHeight*0.3),1)
                        if(that.defaultImageScale < scale){
                            that.imageScale = scale
                            let scaling = 1/that.imageScale
                            $('.sliderCustomImage').css('transform','scale(' + scaling + ')')
                            $('.imageCustomBlur').css('transform','scale(' + scaling + ')')
                        }
                    }
                    if(that.percentageCustom !== 100){
                        that.onChangeTestFile = false
                        that.percentageCustom = 100
                    }
                    if(value >= 16) {
                        that.customWidth = that.finalInputWidth
                        that.customHeight = value
                        that.inputWidth = Math.round(that.customWidth)
                        that.inputHeight = Math.round(that.customHeight)
                        $('.sliderCustomImage').css('width',that.customWidth)
                        $('.sliderCustomImage').css('height',that.customHeight)
                        $('.imageCustomBlur').css('width',that.customWidth)
                        $('.imageCustomBlur').css('height',that.customHeight) 
                    }else if(value < 16) {
                        that.customWidth = that.finalInputWidth
                        that.customHeight = 16
                        that.inputWidth = Math.round(that.customWidth)
                        that.inputHeight = 16
                        $('.sliderCustomImage').css('width',that.customWidth)
                        $('.sliderCustomImage').css('height',that.customHeight)
                        $('.imageCustomBlur').css('width',that.customWidth)
                        $('.imageCustomBlur').css('height',that.customHeight) 
                    }
                }else {
                    if(value >= 16){
                        if(that.enableMaintainAspectRatio == true){
                            that.inputActive = 100
                            that.curHeight = value
                            that.curWidth = (value/that.defaultCurHeight)*that.defaultCurWidth
                            that.inputWidth = Math.round(that.curWidth)
                            that.percentage  = Math.round((value/that.defaultCurHeight)*100)
                            if(that.curWidth < clientWidth*0.4 && that.curHeight < clientHeight*0.6){
                                $('.sliderImage').css('width',that.curWidth)
                                $('.sliderImage').css('height',that.curHeight)   
                                $('.imageBlur').css('width',that.curWidth)
                                $('.imageBlur').css('height',that.curHeight)                           
                            }else if(that.curWidth < clientWidth*0.4 && that.curHeight > clientHeight*0.6){
                                let width = ((clientHeight*0.6)/that.defaultCurHeight)*that.defaultCurWidth
                                $('.sliderImage').css('width',width)
                                $('.sliderImage').css('height',clientHeight*0.6)
                                $('.imageBlur').css('width',width)
                                $('.imageBlur').css('height',clientHeight*0.6)
                            }else if(that.curWidth > clientWidth*0.4 && that.curHeight < clientHeight*0.6){
                                let height = ((clientWidth*0.4)/that.defaultCurWidth)*that.defaultCurHeight
                                $('.sliderImage').css('width',clientWidth*0.4)
                                $('.sliderImage').css('height',height)
                                $('.imageBlur').css('width',clientWidth*0.4)
                                $('.imageBlur').css('height',height)
                            }else if(that.curWidth > clientWidth*0.4 && that.curHeight > clientHeight*0.6){
                                let cliWidth = that.defaultCurWidth/(clientWidth*0.4)
                                let cliHeight = that.defaultCurHeight/(clientHeight*0.6)
                                if(cliWidth >= cliHeight){
                                    let endWidth = clientWidth*0.4
                                    let endHeight = that.defaultCurHeight/cliWidth
                                    $('.sliderImage').css('width',endWidth)
                                    $('.sliderImage').css('height',endHeight)
                                    $('.imageBlur').css('width',endWidth)
                                    $('.imageBlur').css('height',endHeight)
                                } else {
                                    let endWidth = that.defaultCurWidth/cliHeight
                                    let endHeight = clientHeight*0.6
                                    $('.sliderImage').css('width',endWidth)
                                    $('.sliderImage').css('height',endHeight)
                                    $('.imageBlur').css('width',endWidth)
                                    $('.imageBlur').css('height',endHeight)                        
                                }
                            } 
                        }else {
                            that.inputActive = 100
                            that.curHeight = value
                            $('.sliderImage').css('height',that.curHeight)
                            $('.imageBlur').css('height',that.curHeight)
                        }
                    }else if(value < 16){
                        if(that.enableMaintainAspectRatio){
                            that.inputActive = 100
                            that.curHeight = 16
                            that.inputHeight = 16
                            that.curWidth = (16/that.defaultCurHeight)*that.defaultCurWidth
                            that.inputWidth = Math.round(that.curWidth)
                            that.percentage  = Math.round((16/that.defaultCurHeight)*100)
                            $('.sliderImage').css('width',that.curWidth)
                            $('.sliderImage').css('height',that.curHeight)   
                            $('.imageBlur').css('width',that.curWidth)
                            $('.imageBlur').css('height',that.curHeight)                      
                        } else {
                            that.inputActive = 100
                            that.curHeight = 16
                            that.inputHeight = 16
                            $('.sliderImage').css('height',that.curHeight)
                            $('.imageBlur').css('height',that.curHeight)
                        }
                    }                       
                }
            },1000),
        changeInputActive(){
            var that = this
            that.inputActive = 0
        },
        getCheckboxActive(value, e){
            var that = this 
            var $ = Util.util.getJQuery$()
            if(e.target.checked){
                $('.sliderRange').css('background-size', that.percentage +'% 100%')
            }else {
                $('.sliderRange').css('background-size', '0% 100%')
            }
        },
        getCustomCheckboxActive(value, e){
            var that = this 
            var $ = Util.util.getJQuery$()
            if(e.target.checked){
                $('.sliderCustomRange').css('background-size', that.percentageCustom/2 +'% 100%')
            }else {
                $('.sliderCustomRange').css('background-size', '0% 100%')
            }
        }     
    },
    watch:{
        percentage(newSides, oldSides){
            var that = this
            var clientWidth = document.body.clientWidth
            var clientHeight = document.body.clientHeight
            var $ = Util.util.getJQuery$()
            that.finalPercentage = newSides
            if(that.enableMaintainAspectRatio){
                $('.sliderRange').css('background-size', that.finalPercentage +'% 100%' )
            }else {
                $('.sliderRange').css('background-size', '0% 100%' )
            }
            if(that.inputActive == 10 || that.inputActive == 100){
                var sidesDifference = newSides - oldSides
                if (sidesDifference > 0) {
                    for (var i = 1; i <= sidesDifference; i++) {
                        that.stats.push(100)
                    }
                } else {
                    var absoluteSidesDifference = Math.abs(sidesDifference)
                    for (var i = 1; i <= absoluteSidesDifference; i++) {
                        that.stats.shift()
                    }
                }                
            } else {
                var sidesDifference = newSides - oldSides
                if(that.onChangeTestFile){
                    if (sidesDifference > 0 && that.enableMaintainAspectRatio == true) {
                        for (var i = 1; i <= sidesDifference; i++) {
                            that.stats.push(100)
                        }
                        that.curWidth = that.curWidth + (that.defaultCurWidth/100)*sidesDifference
                        that.curHeight = that.curHeight + (that.defaultCurHeight/100)*sidesDifference
                        that.inputWidth = Math.round(that.curWidth)
                        that.inputHeight = Math.round(that.curHeight)
                        if(that.curWidth <= clientWidth*0.4 && that.curHeight <= clientHeight*0.6){
                            $('.sliderImage').css('width',that.curWidth)
                            $('.sliderImage').css('height',that.curHeight)
                            $('.imageBlur').css('width',that.curWidth)
                            $('.imageBlur').css('height',that.curHeight)                             
                        }else if(that.curWidth > clientWidth*0.4 && that.curHeight < clientHeight*0.6){
                            var height = ((clientWidth*0.4)/that.defaultCurWidth)*that.defaultCurHeight
                            $('.sliderImage').css('width',clientWidth*0.4)
                            $('.sliderImage').css('height',height)
                            $('.imageBlur').css('width',clientWidth*0.4)
                            $('.imageBlur').css('height',height)
                        }else if(that.curWidth < clientWidth*0.4 && that.curHeight > clientHeight*0.6) {
                            var width = ((clientHeight*0.6)/that.defaultCurHeight)*that.defaultCurWidth
                            $('.sliderImage').css('width',width)
                            $('.sliderImage').css('height',clientHeight*0.6)
                            $('.imageBlur').css('width',width)
                            $('.imageBlur').css('height',clientHeight*0.6)                            
                        }
                    } else if(sidesDifference <= 0 && that.enableMaintainAspectRatio == true){
                        var absoluteSidesDifference = Math.abs(sidesDifference)
                        for (var i = 1; i <= absoluteSidesDifference; i++) {
                            that.stats.shift()
                        }
                        that.curWidth = that.curWidth - (that.defaultCurWidth/100)*absoluteSidesDifference
                        that.curHeight = that.curHeight - (that.defaultCurHeight/100)*absoluteSidesDifference
                        that.inputWidth = Math.round(that.curWidth)
                        that.inputHeight = Math.round(that.curHeight)
                        if(that.curWidth < clientWidth*0.4 && that.curHeight < clientHeight*0.6){
                            $('.sliderImage').css('width',that.curWidth)
                            $('.sliderImage').css('height',that.curHeight)
                            $('.imageBlur').css('width',that.curWidth)
                            $('.imageBlur').css('height',that.curHeight)                             
                        }else if(that.curWidth >= clientWidth*0.4 && that.curHeight < clientHeight*0.6){
                            var height = ((clientWidth*0.4)/that.defaultCurWidth)*that.defaultCurHeight
                            $('.sliderImage').css('width',clientWidth*0.4)
                            $('.sliderImage').css('height',height)
                            $('.imageBlur').css('width',clientWidth*0.4)
                            $('.imageBlur').css('height',height)
                        }else if(that.curWidth < clientWidth*0.4 && that.curHeight >= clientHeight*0.6) {
                            var width = ((clientHeight*0.6)/that.defaultCurHeight)*that.defaultCurWidth
                            $('.sliderImage').css('width',width)
                            $('.sliderImage').css('height',clientHeight*0.6)      
                            $('.imageBlur').css('width',width)
                            $('.imageBlur').css('height',clientHeight*0.6)                        
                        }
                    } 
                } else {
                    if (sidesDifference > 0) {
                        for (var i = 1; i <= sidesDifference; i++) {
                            this.stats.push(100)
                        }
                    } else if(sidesDifference <= 0){
                        var absoluteSidesDifference = Math.abs(sidesDifference)
                        for (var i = 1; i <= absoluteSidesDifference; i++) {
                            this.stats.shift()
                        }
                    }
                    that.onChangeTestFile = true
                }    
            }                
        },
        percentageCustom(newSides, oldSides){
            var that = this
            var clientWidth = document.body.clientWidth
            var clientHeight = document.body.clientHeight
            var $ = Util.util.getJQuery$()
            that.finalPercentageCustom = newSides
            if(that.enableCustomRatio){
                $('.sliderCustomRange').css('background-size', newSides/2 +'% 100%' )
            }
            var sidesDifference = newSides - oldSides
            if(that.onChangeTestFile){
                if (sidesDifference > 0) {
                    for (var i = 1; i <= sidesDifference; i++) {
                        that.stats.push(100)
                    }
                    if(that.isCheckPercent == 1){
                        that.isCheckPercent = that.isCheckPercent + 1
                        that.firstCustomWidth =  that.finalInputWidth
                        that.firstCustomHeight = that.finalInputHeight
                        that.customWidth = that.customWidth + (that.firstCustomWidth/100)*sidesDifference
                        that.customHeight = that.customHeight + (that.firstCustomHeight/100)*sidesDifference
                        that.inputWidth = Math.round(that.customWidth)
                        that.inputHeight = Math.round(that.customHeight)                 
                    } else {
                        that.customWidth = that.customWidth + (that.firstCustomWidth/100)*sidesDifference
                        that.customHeight = that.customHeight + (that.firstCustomHeight/100)*sidesDifference
                        that.inputWidth = Math.round(that.customWidth)
                        that.inputHeight = Math.round(that.customHeight)   
                    }
                    $('.sliderCustomImage').css('width',that.customWidth)
                    $('.sliderCustomImage').css('height',that.customHeight)
                    $('.imageCustomBlur').css('width',that.customWidth)
                    $('.imageCustomBlur').css('height',that.customHeight)   
                } else if(sidesDifference <= 0){
                    var absoluteSidesDifference = Math.abs(sidesDifference)
                    for (var i = 1; i <= absoluteSidesDifference; i++) {
                        that.stats.shift()
                    }
                    if(that.isCheckPercent == 1){
                        that.isCheckPercent = that.isCheckPercent + 1
                        that.firstCustomWidth =  that.finalInputWidth
                        that.firstCustomHeight = that.finalInputHeight
                        that.customWidth = that.customWidth - (that.firstCustomWidth/100)*absoluteSidesDifference
                        that.customHeight = that.customHeight - (that.firstCustomHeight/100)*absoluteSidesDifference
                        that.inputWidth = Math.round(that.customWidth)
                        that.inputHeight = Math.round(that.customHeight)                    
                    } else {
                        that.customWidth = that.customWidth - (that.firstCustomWidth/100)*absoluteSidesDifference
                        that.customHeight = that.customHeight - (that.firstCustomHeight/100)*absoluteSidesDifference
                        that.inputWidth = Math.round(that.customWidth)
                        that.inputHeight = Math.round(that.customHeight)   
                    }
                    $('.sliderCustomImage').css('width',that.customWidth)
                    $('.sliderCustomImage').css('height',that.customHeight)
                    $('.imageCustomBlur').css('width',that.customWidth)
                    $('.imageCustomBlur').css('height',that.customHeight)  
                } 
            } else {
                if (sidesDifference > 0) {
                    for (var i = 1; i <= sidesDifference; i++) {
                        this.stats.push(100)
                    }
                } else if(sidesDifference <= 0){
                    var absoluteSidesDifference = Math.abs(sidesDifference)
                    for (var i = 1; i <= absoluteSidesDifference; i++) {
                        this.stats.shift()
                    }
                }
                that.onChangeTestFile = true
            }     
        },
        inputWidth(val, oldVal){
            var that = this
            var clientWidth = document.body.clientWidth
            that.finalInputWidth = val
            if(that.enableCustomRatio){

            }else {
                if(val > that.defaultCurWidth){
                    that.inputWidth = that.defaultCurWidth
                    that.inputHeight = that.defaultCurHeight
                    that.percentage = 100
                }                
            }
        },
        inputHeight(val, oldVal){
            var that = this
            var clientHeight = document.body.clientHeight
            that.finalInputHeight = val
            if(that.enableCustomRatio){

            }else {
                if(val > that.defaultCurHeight){
                    that.inputWidth = that.defaultCurWidth
                    that.inputHeight = that.defaultCurHeight
                    that.percentage = 100
                }                  
            }
        },
        enableMaintainAspectRatio(val,oldVal){
            var that = this
            var $ = Util.util.getJQuery$()
            if(val == false){
                $("input[type=range]::-webkit-slider-thumb").css({'background':'red'})
            }
            if(that.WidthFocus){
                that.WidthFocus = false 
                that.curWidth = that.finalInputWidth
                that.curHeight = Math.round(that.defaultCurHeight*(that.finalInputWidth / that.defaultCurWidth))
                that.inputWidth = that.finalInputWidth
                that.inputHeight = Math.round(that.defaultCurHeight*(that.finalInputWidth / that.defaultCurWidth))
                that.percentage = Math.round(100*(that.finalInputWidth / that.defaultCurWidth))
                $('.sliderImage').css('height',that.inputHeight)
                $('.imageBlur').css('height',that.inputHeight) 
                that.onChangeTestFile = false
            } else if(that.HeightFocus){
                that.HeightFocus = false
                that.curWidth = Math.round(that.defaultCurWidth*(that.finalInputHeight / that.defaultCurHeight))
                that.curHeight = that.finalInputHeight
                that.inputWidth = Math.round(that.defaultCurWidth*(that.finalInputHeight / that.defaultCurHeight))
                that.inputHeight = that.finalInputHeight
                that.percentage = Math.round(100*(that.finalInputHeight / that.defaultCurHeight))
                $('.sliderImage').css('width',that.inputWidth)
                $('.imageBlur').css('width',that.inputWidth)
                that.onChangeTestFile = false 
            }
        },
        enableCustomRatio(val,oldVal){
            var that = this
            var clientWidth = document.body.clientWidth
            var clientHeight = document.body.clientHeight
            var $ = Util.util.getJQuery$()
            if(val){
                that.isCustomRatio = true
                that.showMaskLayer = false
                that.showMaskLayerSuccess = false
                that.showMaskLayerError = false
                that.showMaskLayerCancel = false
                ///  记录原比例转换的信息
                that.changeOrgWidth = that.finalInputWidth
                that.changeOrgHeight = that.finalInputHeight
                
                ///  切换到自定义转换页面获取的信息
                if(that.isCheckNumber == 1){
                    that.defaultCustomWidth = that.finalInputWidth
                    that.defaultCustomHeight =  that.finalInputHeight
                    that.customWidth = that.finalInputWidth
                    that.customHeight = that.finalInputHeight
                    that.inputWidth = Math.round(that.customWidth)
                    that.inputHeight = Math.round(that.customHeight)
                    $('.sliderCustomImage').css('width',that.customWidth)
                    $('.sliderCustomImage').css('height',that.customHeight)
                    if(that.customWidth <= clientWidth*0.2 && that.customHeight <= clientHeight*0.3){
                        that.imageScale = 1
                        $('.sliderCustomImage').css('transform','scale(1)')
                        $('.imageCustomBlur').css('transform','scale(1)')                     
                    }else if(that.customWidth <= clientWidth*0.2 && that.customHeight > clientHeight*0.3){
                        that.imageScale = _.ceil(that.customHeight/(clientHeight*0.3),1)
                        let scaling = 1/that.imageScale
                        $('.sliderCustomImage').css('transform','scale(' + scaling + ')')
                        $('.imageCustomBlur').css('transform','scale(' + scaling + ')')
                    }else if(that.customWidth > clientWidth*0.2 && that.customHeight <= clientHeight*0.3){
                        that.imageScale = _.ceil(that.customWidth/(clientWidth*0.2),1)
                        let scaling = 1/that.imageScale
                        $('.sliderCustomImage').css('transform','scale(' + scaling + ')')
                        $('.imageCustomBlur').css('transform','scale(' + scaling + ')')
                    }else if(that.customWidth > clientWidth*0.2 && that.customHeight > clientHeight*0.3){
                        let width = that.customWidth/(clientWidth*0.2)
                        let height = that.customHeight/(clientHeight*0.3)
                        if(width >= height){
                            that.imageScale = _.ceil(width,1)
                            let scaling = 1/that.imageScale
                            $('.sliderCustomImage').css('transform','scale(' + scaling + ')')
                            $('.imageCustomBlur').css('transform','scale(' + scaling + ')')
                        } else {
                            that.imageScale = _.ceil(height,1)
                            let scaling = 1/that.imageScale
                            $('.sliderCustomImage').css('transform','scale(' + scaling + ')')
                            $('.imageCustomBlur').css('transform','scale(' + scaling + ')')                      
                        }
                    }
                    that.defaultImageScale = that.imageScale
                    that.isCheckNumber  = that.isCheckNumber + 1
                }else {
                    that.customWidth = that.changeCustomWidth
                    that.customHeight = that.changeCustomHeight
                    that.inputWidth = Math.round(that.customWidth)
                    that.inputHeight = Math.round(that.customHeight)            
                }  
            }else {
                that.isCustomRatio = false
                that.showMaskLayer = false
                that.showMaskLayerSuccess = false
                that.showMaskLayerError = false
                that.showMaskLayerCancel = false
                ///  记录自定义转换的信息
                that.changeCustomWidth = that.finalInputWidth
                that.changeCustomHeight = that.finalInputHeight

                ///  切换到原比例转换页面获取的信息
                that.customWidth = that.changeOrgWidth
                that.customHeight = that.changeOrgHeight
                that.inputWidth = Math.round(that.customWidth)
                that.inputHeight = Math.round(that.customHeight)
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
        UiTextbox
    }
}
</script>
