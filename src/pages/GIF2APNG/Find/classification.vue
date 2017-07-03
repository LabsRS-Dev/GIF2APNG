<template>
    <div class="children__router__content__classification">
        <div class="children__router__content__classification__label">
            <div class="children__router__content__classification__label__input">
                <a ref="triggerPopover" class="label__popover__trigger">{{app1}}</a>
                <span class="label__popover__sort"><i class="fa fa-sort-desc fa-lg"></i></span>
                <ui-popover class="label__popover__custom" trigger="triggerPopover">
                    <div class="label__popover__custom__title">{{app2}}</div>
                    <div class="label__popover__custom__content">
                        <div class="label__popover__custom__content__all">{{app1}}</div>
                        <div class="label__popover__custom__content__category" v-for="item in categoryList">
                            <div class="label__popover__custom__content__category__icon">
                                <img :src="item.thumb" width="32" height="32" viewBox="0 0 32 32" />
                                <span class="label__popover__custom__content__category__title">{{item.name}}</span>
                            </div>
                            <div class="label__popover__custom__content__category__tag">
                                <div class="label__popover__custom__content__category__tag__content" v-for="el in item.tags">
                                    <span class="label__popover__custom__content__category__tag__title">{{el.name}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </ui-popover>
            </div>
        </div>
        <div class="children__router__content__classification__hot">
            <span class ="children__router__content__classification__hot__label">热门标签:</span>
        </div>
        <div class="children__router__content__classification__content">
            <dl>
                <image-cover :img-src="item.image" v-for="item in labelList" v-show="$route.path.match(/classification/)"></image-cover>
            </dl>
        </div>
    </div>
</template>
<script>

    import ImageCover from './imageCover.vue'
    import { BS, Util, _ } from 'dove.max.sdk'
    import {UiPopover} from 'keen-ui'
    import IconsRef from '../../../data/icon.js'

    const labelPrefix = 'children-page-image-id-' + _.now()
    class Label {
        constructor(name, image){
            this.id = _.uniqueId(labelPrefix);
            this.name = name;       // 图像文件名称
            this.image = image;     // 图像文件的路径
        }
    }
    /////
    const categoryPrefix = 'category-id-' + _.now()
    class Category{
        constructor(thumb,name,tags){
            this.id = _.uniqueId(categoryPrefix);
            this.thumb = thumb;     // 分类图标
            this.name = name;       // 分类名称
            this.tags = tags;                     // 标签类
        }
    }
    /////
    var labelList = [];
    var categoryList = [];
    var hasInited = false;
    export default{
        data(){
            return{
                app1:"所有类型",
                app2:"选择标签",
                labelList:labelList,
                categoryList:categoryList,
                img1Icon:IconsRef.iconSet.discover,
                img2Icon:IconsRef.iconSet.report,
                img3Icon:IconsRef.iconSet.adjust,
                img4Icon:IconsRef.iconSet.compare
            }
        },
        mounted(){
            var that = this
            if(!hasInited){
                hasInited = true
                that.drawLabelCover()
                that.getCategoryList()
            }
        },
        methods:{
            drawLabelCover(){
                var that = this
                _.each([
                    {fileName: 'gif001', fileImage:'http://bbs.uc.cn/data/attachment/forum/month_0807/20080706_d162e4910d0a301fb136NkPw7m39KEOc.gif'},
                    {fileName: 'gif002', fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif'},
                    {fileName: 'gif003', fileImage:'http://worldcup.sznews.com/humor/attachement/gif/site3/20140721/4487fcd7fc661537068e36.gif'},
                    {fileName: 'gif004', fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif'},
                    {fileName: 'gif005', fileImage:'http://images6.fanpop.com/image/photos/35300000/cal-cal-calum-hood-35346616-180-240.gif'},
                    {fileName: 'gif006', fileImage:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Candle-light-animated.gif/180px-Candle-light-animated.gif'},
                    {fileName: 'gif008', fileImage:'http://img0.pconline.com.cn/pconline/1404/08/4571216_2012043023524670421_thumb.gif'},
                    {fileName: 'gif009', fileImage:'https://media.giphy.com/media/5yydxkVxY9tcc/giphy.gif'},
                    {fileName: 'gif010', fileImage:'http://bbs.uc.cn/data/attachment/forum/month_0807/20080706_d162e4910d0a301fb136NkPw7m39KEOc.gif'},
                    {fileName: 'gif011', fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif'},
                    {fileName: 'gif012', fileImage:'http://worldcup.sznews.com/humor/attachement/gif/site3/20140721/4487fcd7fc661537068e36.gif'},
                    {fileName: 'gif013', fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif'},
                    {fileName: 'gif014', fileImage:'http://images6.fanpop.com/image/photos/35300000/cal-cal-calum-hood-35346616-180-240.gif'},
                    {fileName: 'gif015', fileImage:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Candle-light-animated.gif/180px-Candle-light-animated.gif'},
                    {fileName: 'gif017', fileImage:'http://img0.pconline.com.cn/pconline/1404/08/4571216_2012043023524670421_thumb.gif'},
                    {fileName: 'gif018', fileImage:'https://media.giphy.com/media/5yydxkVxY9tcc/giphy.gif'}
                ],function(ele){
                    let labelObj = new Label(ele.fileName,ele.fileImage)
                    that.labelList.push(labelObj)
                })
                return labelList
            },
            getCategoryList(){
                var that = this
                _.each([
                    {fileThumb:that.img1Icon,fileName:'社会纪实', fileTags:[{name:'人物'},{name:'事物'},{name:'战争'},{name:'贫困'}]},
                    {fileThumb:that.img2Icon,fileName:'自然风光', fileTags:[{name:'山川'},{name:'湖泊'},{name:'海洋'},{name:'岛屿'},{name:'沙漠'},{name:'草原'},{name:'森林'}]},
                    {fileThumb:that.img3Icon,fileName:'城市景观', fileTags:[{name:'城市鸟瞰'},{name:'城市夜景'},{name:'喷泉'},{name:'雕塑'}]},
                    {fileThumb:that.img4Icon,fileName:'文化娱乐', fileTags:[
                        {name:'民间文化'},{name:'民间艺术'},{name:'手工艺'},{name:'电影'},{name:'电影'},{name:'电视'},{name:'新文化'},{name:'油画'},
                        {name:'展览'},{name:'舞蹈'},{name:'明星'},{name:'演唱会'},{name:'酒吧'},{name:'俱乐部'},{name:'媒体'},{name:'高科技'},{name:'卫星'},
                        {name:'航空'},{name:'科技产品'},{name:'科技开发'},{name:'图书'},{name:'心理'},{name:'教学'},{name:'科学家'},{name:'教授'},{name:'知识'}
                    ]},
                    {fileThumb:that.img4Icon,fileName:'文化娱乐', fileTags:[
                        {name:'民间文化'},{name:'民间艺术'},{name:'手工艺'},{name:'电影'},{name:'电影'},{name:'电视'},{name:'新文化'},{name:'油画'},
                        {name:'展览'},{name:'舞蹈'},{name:'明星'},{name:'演唱会'},{name:'酒吧'},{name:'俱乐部'},{name:'媒体'},{name:'高科技'},{name:'卫星'},
                        {name:'航空'},{name:'科技产品'},{name:'科技开发'},{name:'图书'},{name:'心理'},{name:'教学'},{name:'科学家'},{name:'教授'},{name:'知识'}
                    ]},
                    {fileThumb:that.img4Icon,fileName:'文化娱乐', fileTags:[
                        {name:'民间文化'},{name:'民间艺术'},{name:'手工艺'},{name:'电影'},{name:'电影'},{name:'电视'},{name:'新文化'},{name:'油画'},
                        {name:'展览'},{name:'舞蹈'},{name:'明星'},{name:'演唱会'},{name:'酒吧'},{name:'俱乐部'},{name:'媒体'},{name:'高科技'},{name:'卫星'},
                        {name:'航空'},{name:'科技产品'},{name:'科技开发'},{name:'图书'},{name:'心理'},{name:'教学'},{name:'科学家'},{name:'教授'},{name:'知识'}
                    ]}
                ],function(ele){
                    let categoryObj = new Category(ele.fileThumb,ele.fileName,ele.fileTags)
                    that.categoryList.push(categoryObj)
                })
                console.log(that.categoryList)
                return categoryList
            }
        },
        components:{
            ImageCover,
            UiPopover
        }
    }

</script>