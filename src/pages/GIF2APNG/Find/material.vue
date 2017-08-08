<template>
    <div class="children__router__content__material">
        <ui-confirm
            :autofocus="itemsConfirmDialog.autofocus"
            :confirm-button-text="itemsConfirmDialog.confirmButtonText"
            :deny-button-text="itemsConfirmDialog.denyButtonText"
            :ref="itemsConfirmDialog.ref"
            :title="itemsConfirmDialog.title"

            @confirm="itemsConfirmDialog.callbackConfirm"
            @deny="itemsConfirmDialog.callbackDeny"
            @open="itemsConfirmDialog.callbackOpen"
            @close="itemsConfirmDialog.callbackClose"
            >
            <div class="children__router__content__material__content__preview">
                <img :src="imagePreview">
            </div>
            <div class="children__router__content__material__content__button">
                <ui-icon-button
                    @click=""
                    :type="item.type"
                    :size="item.size"
                    :key="item.id"
                    :title="$t(item.tooltip)"
                    raised
                    v-if="item.visiable"
                    v-for="(item, index) in actionList"
                    >
                    <span :class="item.icon"></span>
                </ui-icon-button>
            </div>
        </ui-confirm>
        <div class="children__router__content__material__label">
            <div class="children__router__content__material__label__input">
                <a ref="triggerPopover" class="label__popover__trigger">{{labelButton}}</a>
                <span class="label__popover__sort"><i class="fa fa-sort-desc fa-lg"></i></span>
                <ui-popover class="label__popover__custom" trigger="triggerPopover" ref="popover">
                    <div class="label__popover__custom__title">{{$t('pages.discover.task-item.select')}}</div>
                    <div class="label__popover__custom__content">
                        <div class="label__popover__custom__content__all" @click="getCheckAllTagStyle()">
                            <span class="label__popover__custom__content__title">{{$t('pages.discover.task-item.types')}}</span>
                            <span class="label__popover__custom__content__select"><i class="fa fa-check fa-lg"></i></span>
                        </div>
                        <div class="label__popover__custom__content__category" v-for="item in materialList" :key="item.id">
                            <div class="label__popover__custom__content__category__icon">
                                <img :src="item.thumb" width="32" height="32" viewBox="0 0 32 32" />
                                <span class="label__popover__custom__content__category__title">{{item.name}}</span>
                            </div>
                            <div class="label__popover__custom__content__category__tag">
                                <div class="label__popover__custom__content__category__tag__all" v-for="el in item.tags" @click="getCheckTagStyle($event,el)" :key="el.id">
                                    <span class="label__popover__custom__content__content">{{el.name}}</span>
                                    <span class="label__popover__custom__content__tag__space"></span>
                                    <span class="label__popover__custom__content__tag__select"><i class="fa fa-check fa-lg"></i></span>
                                    <span class="label__popover__custom__content__tag__hot" v-show="cheackButtonSwitch(el)">{{$t('pages.discover.task-item.hot')}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </ui-popover>
            </div>
        </div>
        <div class="children__router__content__material__hot">
            <span class ="children__router__content__material__hot__label">{{$t('pages.discover.task-item.label')}}</span>
            <div class ="children__router__content__material__hot__all">
                <div class="children__router__content__material__hot__content" v-for="ele in hotList" :key="ele.id">
                    <span class="children__router__content__material__hot__text" @click="getLabelChange(ele)">{{ele.name}}</span>
                </div>
            </div>
        </div>
        <div class="children__router__content__material__content">
            <dl v-show="showLoading">
                <dd class="children__recommendation__showImage__imageCover" v-for="item in labelList" :key="item.id">
                    <div class="showImage__imageCover__viewCount">
                        <span class="showImage__imageCover__viewCount__icon"><i class="fa fa-eye fa-lg"></i></span>
                        <span class="showImage__imageCover__viewCount__content">{{item.previewCount}}</span>
                    </div>
                    <img :src="item.image" @click="getItemsEnlargeFigureImage(item)" @mouseenter="autoShowButton($event)" @mouseleave="autoDisplayButton($event)">
                    <div class="showImage__imageCover__viewCount__button" @mouseenter="autoShowButtonAgain($event)" @mouseleave="autoDisplayButtonAgain($event)">
                        <ui-icon-button
                            @click=""
                            :type="item.type"
                            :size="item.size"
                            :key="item.id"
                            :title="$t(item.tooltip)"
                            raised
                            v-if="item.visiable"
                            v-for="(item, index) in actionList"
                            >
                            <span :class="item.icon"></span>
                        </ui-icon-button>
                    </div>
                    <span class="showImage__imageCover__introduce">{{item.introduce}}</span>
                </dd>
            </dl>
            <div class="children__router__content__material__loading" v-show="!showLoading">
                <v-loading></v-loading>
            </div>
            <div class="children__router__content__material__pagination" v-show="showLoading && total > display">
                <pagination :total="total" :display="display" :current-page='current' @pagechange="pagechange"></pagination>
            </div>
        </div>
    </div>
</template>
<script>
    import Pagination from '../Search/pagination.vue'
    import { BS, Util, _ } from 'dove.max.sdk'
    import {UiPopover,UiConfirm,UiIconButton} from 'keen-ui'
    import IconsRef from '../../../data/icon.js'
    import VLoading from './loading.vue'

    const imgPrefix = 'children-material-image-id-' + _.now()
    class Label {
        constructor(name, image,introduce,previewCount){
            this.id = _.uniqueId(imgPrefix);
            this.name = name;                  // 图像名称
            this.image = image;                // 图像的路径
            this.introduce = introduce;        // 图片的描述
            this.previewCount = previewCount;        // 图片浏览次数
        }
    }
    /////
    const materialPrefix = 'material-id-' + _.now()
    class Material{
        constructor(thumb,name,tags){
            this.id = _.uniqueId(materialPrefix);
            this.thumb = thumb;     // 分类图标
            this.name = name;       // 分类名称
            this.tags = tags;       // 标签类
        }
    }

    /////
    const LPage = {
        TagPage: 10
    }
    var current_logic_page = "";
    var click_logic_page = "";

    /////
    var labelList = [];
    var materialList = [];
    var hotList = [];
    var hasInited = false;
    var total;
    var current ;
    var imagePreview ='';
    export default{
        data(){
            return{
                labelButton:"所有类型",
                labelList:labelList,
                hotList:hotList,
                hotLabelList:{},
                materialList:materialList,
                imagePreview:imagePreview,
                total: total,             // 记录总条数
                display: 20,              // 每页显示条数
                current: current,         // 当前的页数
                showLoading:false,
                itemsConfirmDialog:{
                    ref:'itemsConfirmDialog',
                    autofocus: 'none',
                    confirmButtonText: 'Confirm',
                    denyButtonText: 'Deny',
                    title: '',
                    callbackConfirm: ()=>{},
                    callbackDeny: ()=>{},
                    callbackOpen: ()=>{},
                    callbackClose: ()=>{}
                }
            }
        },
        mounted(){
            var that = this
            if(!hasInited){
                hasInited = true
                Transfer.http.call('get.data_categories_tags_item',{},(info) => {
                    _.each(info.data,function(ele){
                        var fileThumb = ele.thumb
                        var fileName = ele.name
                        var fileTags = ele.tags
                        let materialObj = new Material(fileThumb,fileName,fileTags)
                        that.materialList.push(materialObj)
                        that.hotLabelList[materialObj.id] = materialObj
                    })
                    that.getHotLabelList()
                })
                Transfer.http.call('get.items',{"page":1,"per_page":that.display},(info) => {
                    _.each(info.data,function(ele){
                        var fileName = ele.name
                        var fileImage = ele.url
                        var fileIntroduce = ele.description
                        var filePreviewCount = ele.preview_quantity
                        let labelObj = new Label(fileName,fileImage,fileIntroduce,filePreviewCount)
                        that.labelList.push(labelObj)
                    })
                    that.showLoading = !that.showLoading
                    that.total = info.paginate.total
                })
            }
        },
        computed:{
            actionList() {
                var that = this
                return [
                    {id:'action-share',name:'分享', visiable:true, icon:"fa fa-share-square-o fa-lg fa-fw", size:"normal", type:"secondary",tooltip:"pages.discover.toolbar.import-share"},
                    {id:'action-collect',name:'收藏', visiable:true, icon:"fa fa-user-plus fa-lg fa-fw", size:"normal", type:"secondary",tooltip:"pages.discover.toolbar.import-collect"},
                    {id:'action-download', name:'下载',visiable:true, icon:"fa fa-download fa-lg fa-fw", size:"normal", type:"secondary",tooltip:"pages.discover.toolbar.import-download"}
                ]
            }
        },
        methods:{
            getHotLabelList(){
                var that = this
                var tagsArr = []
                _.each(materialList,(ele) => {
                    let cdg = that.hotLabelList[ele.id].tags
                    tagsArr.push(cdg)
                })
                let tagsLists = _.flatten(tagsArr,true)
                let labelArr = _.sortBy(tagsLists,'download').reverse().slice(0,8)
                _.each(labelArr,(ele) => {
                    that.hotList.push(ele)
                })
            },
            cheackButtonSwitch(el){
                var that = this
                var checkHot = []
                _.each(hotList,(ele) => {
                   checkHot.push(ele.name)
                })
                if(checkHot.indexOf(el.name) != -1){
                    return true
                }else {
                    return false
                }
            },
            getLabelChange(ele){
                var that = this
                that.labelButton = ele.name
                that.__UpdateTheDataList(ele.id)
            },
            getCheckAllTagStyle(){
                var that = this
                var $ = Util.util.getJQuery$()
                $('.label__popover__custom__content__tag__space').css('opacity','0')
                $('.label__popover__custom__content__tag__select').css('opacity','0')
                $('.label__popover__custom__content__title').css('border','1px solid #2196f3')
                $('.label__popover__custom__content__select').css('opacity','1')
                that.labelButton = that.$t('pages.discover.task-item.types')
                that.$refs.popover.close()
                that.labelList.length = 0
                that.showLoading = false
                Transfer.http.call('get.items',{"page":1,"per_page":that.display},(info) => {
                    _.each(info.data,function(ele){
                        var fileName = ele.name
                        var fileImage = ele.url
                        var fileIntroduce = ele.description
                        var filePreviewCount = ele.preview_quantity
                        let labelObj = new Label(fileName,fileImage,fileIntroduce,filePreviewCount)
                        that.labelList.push(labelObj)
                    })
                    that.showLoading = !that.showLoading
                    that.total = info.paginate.total
                })
                current_logic_page = ''
            },
            getCheckTagStyle($event,ele){
                var that = this
                var $ = Util.util.getJQuery$()
                $("span").filter(".label__popover__custom__content__tag__space").css('opacity','0')
                $("span").filter(".label__popover__custom__content__tag__select").css('opacity','0')
                $(event.target).css('opacity','1')
                $(event.target).next().css('opacity','1')
                $('.label__popover__custom__content__title').css('border','1px solid #e0e0e0')
                $('.label__popover__custom__content__select').css('opacity','0')
                current_logic_page = LPage.TagPage
                click_logic_page = ele.id
                that.labelButton = ele.name
                that.__UpdateTheDataList(ele.id, 1)
                that.$refs.popover.close()
            },
            autoShowButton($event){
                var that = this
                var $ = Util.util.getJQuery$()
                $(event.target).next().css({'opacity':'1'})
            },
            autoDisplayButton($event){
                var that = this
                var $ = Util.util.getJQuery$()
                $(event.target).next().css({'opacity':'0'})
            },
            autoShowButtonAgain($event){
                var that = this
                var $ = Util.util.getJQuery$()
                $(event.target).css({'opacity':'1'})
            },
            autoDisplayButtonAgain($event){
                var that = this
                var $ = Util.util.getJQuery$()
                $(event.target).css({'opacity':'0'})
            },
            getItemsEnlargeFigureImage(item){
                var that = this
                const cdg = that.itemsConfirmDialog
                cdg.title = that.$t('pages.discover.dialog-confirm.title')
                cdg.confirmButtonText = that.$t('pages.discover.dialog-confirm.btnConfirm')
                cdg.denyButtonText = that.$t('pages.discover.dialog-confirm.btnDeny')
                var dialog = that.$refs[cdg.ref]
                that.imagePreview = item.image
                dialog.open()
            },
            __UpdateTheDataList(el, curPage){
                var that = this
                that.labelList.length = 0
                that.showLoading = false
                Transfer.http.callEx('get.items_tag_id',{url:el},{"page":that.curPage,"per_page":that.display},(info) => {
                    _.each(info.data,function(ele){
                        var fileName = ele.name
                        var fileImage = ele.url
                        var fileIntroduce = ele.description
                        var filePreviewCount = ele.preview_quantity
                        let labelObj = new Label(fileName,fileImage,fileIntroduce,filePreviewCount)
                        that.labelList.push(labelObj)
                    })
                    that.showLoading = !that.showLoading
                    that.total = info.paginate.total
                    that.current = curPage
                })
            },
            pagechange(currentPage){
                var that = this
                that.current = currentPage
                if (current_logic_page == LPage.TagPage) {
                    that.__UpdateTheDataList(click_logic_page, that.current)
                }else {
                    that.labelList.length = 0
                    that.showLoading = false
                    Transfer.http.call('get.items',{"page":that.current,"per_page":that.display},(info) => {
                        _.each(info.data,function(ele){
                            var fileName = ele.name
                            var fileImage = ele.url
                            var fileIntroduce = ele.description
                            var filePreviewCount = ele.preview_quantity
                            let labelObj = new Label(fileName,fileImage,fileIntroduce,filePreviewCount)
                            that.labelList.push(labelObj)
                        })
                        that.showLoading = !that.showLoading
                    })
                }
            }
        },
        components:{
            UiPopover,
            UiConfirm,
            Pagination,
            UiIconButton,
            VLoading
        }
    }
</script>