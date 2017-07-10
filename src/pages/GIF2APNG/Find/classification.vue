<template>
    <div class="children__router__content__classification">
        <div class="children__router__content__classification__label">
            <div class="children__router__content__classification__label__input">
                <a ref="triggerPopover" class="label__popover__trigger">{{labelButton}}</a>
                <span class="label__popover__sort"><i class="fa fa-sort-desc fa-lg"></i></span>
                <ui-popover class="label__popover__custom" trigger="triggerPopover">
                    <div class="label__popover__custom__title">{{app2}}</div>
                    <div class="label__popover__custom__content">
                        <div class="label__popover__custom__content__all" @click="getCheckAllTagStyle()">
                            <span class="label__popover__custom__content__title">{{app1}}</span>
                            <span class="label__popover__custom__content__select"><i class="fa fa-check fa-lg"></i></span>
                        </div>
                        <div class="label__popover__custom__content__category" v-for="item in categoryList">
                            <div class="label__popover__custom__content__category__icon">
                                <img :src="item.thumb" width="32" height="32" viewBox="0 0 32 32" />
                                <span class="label__popover__custom__content__category__title">{{item.name}}</span>
                            </div>
                            <div class="label__popover__custom__content__category__tag">
                                <div class="label__popover__custom__content__category__tag__all" v-for="el in item.tags" @click="getCheckTagStyle($event)">
                                    <span class="label__popover__custom__content__content">{{el.name}}</span>
                                    <span class="label__popover__custom__content__tag__space"></span>
                                    <span class="label__popover__custom__content__tag__select"><i class="fa fa-check fa-lg"></i></span>
                                    <span class="label__popover__custom__content__tag__hot" v-show="cheackButtonSwitch(el)">{{app3}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </ui-popover>
            </div>
        </div>
        <div class="children__router__content__classification__hot">
            <span class ="children__router__content__classification__hot__label">{{app4}}</span>
            <div class ="children__router__content__classification__hot__all">
                <div class="children__router__content__classification__hot__content" v-for="ele in hotList">
                    <span class="children__router__content__classification__hot__text" @click="getLabelChange(ele)">{{ele.name}}</span>
                </div>
            </div>
        </div>
        <div class="children__router__content__classification__content">
            <dl>
                <image-cover :img-src="item.image" :introduce="item.introduce" :viewCount="item.viewCount" :url="item.urlPostfix" v-for="item in labelList" v-show="$route.path.match(/classification/)"></image-cover>
            </dl>
        </div>
    </div>
</template>
<script>

    import ImageCover from './imageCover.vue'
    import { BS, Util, _ } from 'dove.max.sdk'
    import {UiPopover} from 'keen-ui'
    import IconsRef from '../../../data/icon.js'

    const labelPrefix = 'children-classification-image-id-' + _.now()
    class Label {
        constructor(name, image,introduce,viewCount,urlPostfix){
            this.id = _.uniqueId(labelPrefix);
            this.name = name;                  // 图像文件名称
            this.image = image;                // 图像文件的路径
            this.introduce = introduce;        // 图片文件的描述
            this.viewCount = viewCount;        // 图片文件浏览次数
            this.urlPostfix = urlPostfix;      // 图片文件跳转地址后缀
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
    var labelList = [];
    var categoryList = [];
    var hotList = [];
    var hasInited = false;
    export default{
        data(){
            return{
                labelButton:"所有类型",
                app1:"所有类型",
                app2:"选择标签",
                app3:"HOT",
                app4:"热门标签:",
                labelList:labelList,
                hotList:hotList,
                hotLabelList:{},
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
                    {fileName: 'gif001', fileImage:'http://bbs.uc.cn/data/attachment/forum/month_0807/20080706_d162e4910d0a301fb136NkPw7m39KEOc.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileViewCount:'54W',urlPostfix:'fcccc'},
                    {fileName: 'gif002', fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileViewCount:'105W',urlPostfix:'fbbbb'},
                    {fileName: 'gif003', fileImage:'http://worldcup.sznews.com/humor/attachement/gif/site3/20140721/4487fcd7fc661537068e36.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileViewCount:'3W',urlPostfix:'faaaa'},
                    {fileName: 'gif004', fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileViewCount:'1050W',urlPostfix:'fdddd'},
                    {fileName: 'gif005', fileImage:'http://images6.fanpop.com/image/photos/35300000/cal-cal-calum-hood-35346616-180-240.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileViewCount:'5W',urlPostfix:'feeee'},
                    {fileName: 'gif006', fileImage:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Candle-light-animated.gif/180px-Candle-light-animated.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileViewCount:'20W',urlPostfix:'fffff'},
                    {fileName: 'gif007', fileImage:'http://img0.pconline.com.cn/pconline/1404/08/4571216_2012043023524670421_thumb.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileViewCount:'80W',urlPostfix:'fgggg'},
                    {fileName: 'gif008', fileImage:'https://media.giphy.com/media/5yydxkVxY9tcc/giphy.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileViewCount:'100W',urlPostfix:'fhhhh'},
                    {fileName: 'gif009', fileImage:'http://bbs.uc.cn/data/attachment/forum/month_0807/20080706_d162e4910d0a301fb136NkPw7m39KEOc.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileViewCount:'54W',urlPostfix:'fiiii'},
                    {fileName: 'gif010', fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileViewCount:'105W',urlPostfix:'fjjjj'},
                    {fileName: 'gif011', fileImage:'http://worldcup.sznews.com/humor/attachement/gif/site3/20140721/4487fcd7fc661537068e36.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileViewCount:'3W',urlPostfix:'fkkkk'},
                    {fileName: 'gif012', fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileViewCount:'1050W',urlPostfix:'fllll'},
                    {fileName: 'gif013', fileImage:'http://images6.fanpop.com/image/photos/35300000/cal-cal-calum-hood-35346616-180-240.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileViewCount:'5W',urlPostfix:'fmmmm'},
                    {fileName: 'gif014', fileImage:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Candle-light-animated.gif/180px-Candle-light-animated.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileViewCount:'20W',urlPostfix:'fnnnn'},
                    {fileName: 'gif015', fileImage:'http://img0.pconline.com.cn/pconline/1404/08/4571216_2012043023524670421_thumb.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileViewCount:'80W',urlPostfix:'foooo'},
                    {fileName: 'gif016', fileImage:'https://media.giphy.com/media/5yydxkVxY9tcc/giphy.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileViewCount:'100W',urlPostfix:'fpppp'}
                ],function(ele){
                    let labelObj = new Label(ele.fileName,ele.fileImage,ele.fileIntroduce,ele.fileViewCount,ele.urlPostfix)
                    that.labelList.push(labelObj)
                })
                return labelList
            },
            getCategoryList(){
                var that = this
                _.each([
                    {fileThumb:that.img1Icon,fileName:'社会纪实', fileTags:[{name:'人物',downloadCount:10},{name:'事物',downloadCount:11},{name:'战争',downloadCount:50},{name:'贫困',downloadCount:20}]},
                    {fileThumb:that.img2Icon,fileName:'自然风光', fileTags:[{name:'山川',downloadCount:35},{name:'湖泊',downloadCount:72},{name:'海洋',downloadCount:22},{name:'岛屿',downloadCount:18},{name:'沙漠',downloadCount:26},{name:'草原',downloadCount:8},{name:'森林',downloadCount:56}]},
                    {fileThumb:that.img3Icon,fileName:'城市景观', fileTags:[{name:'城市鸟瞰',downloadCount:44},{name:'城市夜景',downloadCount:28},{name:'喷泉',downloadCount:15},{name:'雕塑',downloadCount:12}]},
                    {fileThumb:that.img4Icon,fileName:'文化娱乐', fileTags:[
                        {name:'民间文化',downloadCount:39},{name:'民间艺术',downloadCount:38},{name:'手工艺',downloadCount:37},{name:'电影',downloadCount:36},{name:'电视',downloadCount:49},{name:'新文化',downloadCount:55},{name:'油画',downloadCount:68},
                        {name:'展览',downloadCount:51},{name:'舞蹈',downloadCount:53},{name:'明星',downloadCount:100},{name:'演唱会',downloadCount:3},{name:'酒吧',downloadCount:89},{name:'俱乐部',downloadCount:4},{name:'媒体',downloadCount:9},{name:'高科技',downloadCount:95},{name:'卫星',downloadCount:98},
                        {name:'航空',downloadCount:77},{name:'科技产品',downloadCount:50},{name:'科技开发',downloadCount:55},{name:'图书',downloadCount:51},{name:'心理',downloadCount:48},{name:'教学',downloadCount:46},{name:'科学家',downloadCount:88},{name:'教授',downloadCount:34},{name:'知识',downloadCount:42}
                    ]},
                ],function(ele){
                    let categoryObj = new Category(ele.fileThumb,ele.fileName,ele.fileTags)
                    that.categoryList.push(categoryObj)
                    that.hotLabelList[categoryObj.id]=categoryObj
                })
                that.getHotLabelList()
                return categoryList
            },
            getHotLabelList(){
                var that = this
                var tagsArr = []
                _.each(categoryList,(ele) => {
                    let cdg = that.hotLabelList[ele.id].tags
                    tagsArr.push(cdg)
                })
                let tagsLists = _.flatten(tagsArr,true)
                let labelArr = _.sortBy(tagsLists,'downloadCount').reverse().slice(0,10)
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
            },
            getCheckAllTagStyle(){
                var that = this
                var $ = Util.util.getJQuery$()
                $('.label__popover__custom__content__title').css('border','1px solid #2196f3')
                $('.label__popover__custom__content__select').css('opacity','1')
            },
            getCheckTagStyle($event){
                var that = this
                var $ = Util.util.getJQuery$()
                $(event.target).css('opacity','1')
                $(event.target).next().css('opacity','1')
            }
        },
        components:{
            ImageCover,
            UiPopover
        }
    }

</script>