<template>
    <div class="children__router__content__classification">
        <div class="children__router__content__classification__label">
            <div class="children__router__content__classification__label__input">
                <a ref="triggerPopover" class="label__popover__trigger">{{labelButton}}</a>
                <span class="label__popover__sort"><i class="fa fa-sort-desc fa-lg"></i></span>
                <ui-popover class="label__popover__custom" trigger="triggerPopover" ref="popover">
                    <div class="label__popover__custom__title">{{$t('pages.discover.task-item.select')}}</div>
                    <div class="label__popover__custom__content">
                        <div class="label__popover__custom__content__all" @click="getCheckAllTagStyle()">
                            <span class="label__popover__custom__content__title">{{$t('pages.discover.task-item.types')}}</span>
                            <span class="label__popover__custom__content__select"><i class="fa fa-check fa-lg"></i></span>
                        </div>
                        <div class="label__popover__custom__content__category" v-for="item in categoryList">
                            <div class="label__popover__custom__content__category__icon">
                                <img :src="item.thumb" width="32" height="32" viewBox="0 0 32 32" />
                                <span class="label__popover__custom__content__category__title">{{item.name}}</span>
                            </div>
                            <div class="label__popover__custom__content__category__tag">
                                <div class="label__popover__custom__content__category__tag__all" v-for="el in item.tags" @click="getCheckTagStyle($event,el)">
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
        <div class="children__router__content__classification__hot">
            <span class ="children__router__content__classification__hot__label">{{$t('pages.discover.task-item.label')}}</span>
            <div class ="children__router__content__classification__hot__all">
                <div class="children__router__content__classification__hot__content" v-for="ele in hotList">
                    <span class="children__router__content__classification__hot__text" @click="getLabelChange(ele)">{{ele.name}}</span>
                </div>
            </div>
        </div>
        <div class="children__router__content__classification__content">
            <dl v-show="showLoading">
                <image-cover
                    :imageName="item.name" :img-src="item.image"
                    :introduce="item.introduce" :previewCount="item.previewCount"
                    :shareCount="item.shareCount" :downloadCount="item.downloadCount"
                    :collectionCount="item.collectionCount" :url="item.urlPostfix"
                    v-for="item in labelList"
                    >
                </image-cover>
            </dl>
            <div class="children__router__content__classification__loading" v-show="!showLoading">
                <v-loading></v-loading>
            </div>
            <div class="children__router__content__classification__pagination" v-show="showLoading && total > display">
                <pagination :total="total" :display="display" :current-page='current' @pagechange="pagechange"></pagination>
            </div>
        </div>
    </div>
</template>
<script>

    import ImageCover from './imageCover.vue'
    import Pagination from '../Search/pagination.vue'
    import { BS, Util, _ } from 'dove.max.sdk'
    import {UiPopover} from 'keen-ui'
    import IconsRef from '../../../data/icon.js'
    import {Transfer} from '../../../bridge/transfer'
    import VLoading from './loading.vue'

    const labelPrefix = 'children-classification-image-id-' + _.now()
    class Label {
        constructor(name, image,introduce,previewCount,shareCount,downloadCount,collectionCount,urlPostfix){
            this.id = _.uniqueId(labelPrefix);
            this.name = name;                        // 图像文件名称
            this.image = image;                      // 图像文件的路径
            this.introduce = introduce;              // 图片文件的描述
            this.previewCount = previewCount;        // 图片文件浏览次数
            this.shareCount = shareCount;            // 图片文件分享次数
            this.downloadCount = downloadCount;      // 图片文件下载次数
            this.collectionCount = collectionCount;  // 图片文件收藏次数
            this.urlPostfix = urlPostfix;            // 图片文件跳转地址后缀
        }
    }
    /////
    const categoryPrefix = 'category-id-' + _.now()
    class Category{
        constructor(thumb,name,tags){
            this.id = _.uniqueId(categoryPrefix);
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
    var categoryList = [];
    var hotList = [];
    var hasInited = false;
    var total;
    var current;
    export default{
        data(){
            return{
                labelButton:"所有类型",
                labelList:labelList,
                hotList:hotList,
                hotLabelList:{},
                categoryList:categoryList,
                total: total,             // 记录总条数
                display: 20,              // 每页显示条数
                current: current,         // 当前的页数
                showLoading:false
            }
        },
        mounted(){
            var that = this
            if(!hasInited){
                hasInited = true
                Transfer.http.call('get.data_categories_tags_set',{},(info) => {
                    _.each(info.data,function(ele){
                        var fileThumb = ele.thumb
                        var fileName = ele.name
                        var fileTags = ele.tags
                        let categoryObj = new Category(fileThumb,fileName,fileTags)
                        that.categoryList.push(categoryObj)
                        console.log(categoryObj.id)
                        that.hotLabelList[categoryObj.id] = categoryObj
                    })
                    that.getHotLabelList()
                })
                Transfer.http.call('get.sets',{"page":1,"per_page":that.display},(info) => {
                    _.each(info.data,function(ele){
                        var fileName = ele.name
                        var fileImage = ele.thumb
                        var fileIntroduce = ele.description
                        var filePreviewCount = ele.preview_quantity
                        var fileShareCount = ele.share_quantity
                        var fileDownloadCount = ele.download_quantity
                        var fileCollectionCount = ele.collection_quantity
                        var fileUrlPostfix = ele.id
                        let labelObj = new Label(fileName,fileImage,fileIntroduce,filePreviewCount,fileShareCount,fileDownloadCount,fileCollectionCount,fileUrlPostfix)
                        that.labelList.push(labelObj)
                    })
                    that.showLoading = !that.showLoading
                    that.total = info.paginate.total
                })
            }
        },
        methods:{
            getHotLabelList(){
                var that = this
                var tagsArr = []
                _.each(categoryList,(ele) => {
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
                $('.label__popover__custom__content__title').css('border','1px solid #2196f3')
                $('.label__popover__custom__content__select').css('opacity','1')
                that.labelButton = that.$t('pages.discover.task-item.types')
                that.$refs.popover.close()
                that.labelList.length = 0
                that.showLoading = false
                Transfer.http.call('get.sets',{"page":1,"per_page":that.display},(info) => {
                    _.each(info.data,function(ele){
                        var fileName = ele.name
                        var fileImage = ele.thumb
                        var fileIntroduce = ele.description
                        var filePreviewCount = ele.preview_quantity
                        var fileShareCount = ele.share_quantity
                        var fileDownloadCount = ele.download_quantity
                        var fileCollectionCount = ele.collection_quantity
                        var fileUrlPostfix = ele.id
                        let labelObj = new Label(fileName,fileImage,fileIntroduce,filePreviewCount,fileShareCount,fileDownloadCount,fileCollectionCount,fileUrlPostfix)
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
                $(event.target).css('opacity','1')
                $(event.target).next().css('opacity','1')
                current_logic_page = LPage.TagPage
                click_logic_page = ele.id
                that.labelButton = ele.name
                that.__UpdateTheDataList(ele.id, 1)
                that.$refs.popover.close()
            },
            __UpdateTheDataList(el, curPage){
                var that = this
                that.labelList.length = 0
                that.showLoading = false
                Transfer.http.callEx('get.sets_tag_id',{url:el},{"page":that.curPage,"per_page":that.display},(info) => {
                    _.each(info.data,function(ele){
                        var fileName = ele.name
                        var fileImage = ele.thumb
                        var fileIntroduce = ele.description
                        var filePreviewCount = ele.preview_quantity
                        var fileShareCount = ele.share_quantity
                        var fileDownloadCount = ele.download_quantity
                        var fileCollectionCount = ele.collection_quantity
                        var fileUrlPostfix = ele.id
                        let labelObj = new Label(fileName,fileImage,fileIntroduce,filePreviewCount,fileShareCount,fileDownloadCount,fileCollectionCount,fileUrlPostfix)
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
                    Transfer.http.call('get.sets',{"page":that.current,"per_page":that.display},(info) => {
                        _.each(info.data,function(ele){
                            var fileName = ele.name
                            var fileImage = ele.thumb
                            var fileIntroduce = ele.description
                            var filePreviewCount = ele.preview_quantity
                            var fileShareCount = ele.share_quantity
                            var fileDownloadCount = ele.download_quantity
                            var fileCollectionCount = ele.collection_quantity
                            var fileUrlPostfix = ele.id
                            let labelObj = new Label(fileName,fileImage,fileIntroduce,filePreviewCount,fileShareCount,fileDownloadCount,fileCollectionCount,fileUrlPostfix)
                            that.labelList.push(labelObj)
                        })
                        that.showLoading = !that.showLoading
                    })
                }
            }
        },
        components:{
            ImageCover,
            UiPopover,
            Pagination,
            VLoading
        }
    }

</script>