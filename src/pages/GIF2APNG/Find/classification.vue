<template>
    <div class="children__router__content__classification">
        <div class="children__router__content__classification__label">
            <div class="children__router__content__classification__label__input">
                <a ref="triggerPopover" class="label__popover__trigger">{{app}}</a>
                <span class="label__popover__sort"><i class="fa fa-sort-desc fa-lg"></i></span>
                <ui-popover class="label__popover__custom" trigger="triggerPopover">
                    哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈
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

    const taskPrefix = 'children-page-image-id-' + _.now()
    class Label {
        constructor(name, image){
            this.id = _.uniqueId(taskPrefix);
            this.name = name;       // 图像文件名称
            this.image = image;     // 图像文件的路径
        }
    }
    /////
    var labelList = [];
    var hasInited = false;
        export default{
        data(){
            return{
                app:"所有类型",
                labelList:labelList
            }
        },
        mounted(){
            var that = this
            if(!hasInited){
                hasInited = true
                that.drawLabelCover()
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
                    {fileName: 'gif007', fileImage:'http://wayqq.cn/article/UploadPic/2015-9/20159192240617578.gif'},
                    {fileName: 'gif008', fileImage:'http://img0.pconline.com.cn/pconline/1404/08/4571216_2012043023524670421_thumb.gif'},
                    {fileName: 'gif009', fileImage:'https://media.giphy.com/media/5yydxkVxY9tcc/giphy.gif'},
                    {fileName: 'gif010', fileImage:'http://bbs.uc.cn/data/attachment/forum/month_0807/20080706_d162e4910d0a301fb136NkPw7m39KEOc.gif'},
                    {fileName: 'gif011', fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif'},
                    {fileName: 'gif012', fileImage:'http://worldcup.sznews.com/humor/attachement/gif/site3/20140721/4487fcd7fc661537068e36.gif'},
                    {fileName: 'gif013', fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif'},
                    {fileName: 'gif014', fileImage:'http://images6.fanpop.com/image/photos/35300000/cal-cal-calum-hood-35346616-180-240.gif'},
                    {fileName: 'gif015', fileImage:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Candle-light-animated.gif/180px-Candle-light-animated.gif'},
                    {fileName: 'gif016', fileImage:'http://wayqq.cn/article/UploadPic/2015-9/20159192240617578.gif'},
                    {fileName: 'gif017', fileImage:'http://img0.pconline.com.cn/pconline/1404/08/4571216_2012043023524670421_thumb.gif'},
                    {fileName: 'gif018', fileImage:'https://media.giphy.com/media/5yydxkVxY9tcc/giphy.gif'}
                ],function(ele){
                    let labelObj = new Label(ele.fileName,ele.fileImage)
                    that.labelList.push(labelObj)
                })
                return labelList
            }
        },
        components:{
            ImageCover,
            UiPopover
        }
    }

</script>