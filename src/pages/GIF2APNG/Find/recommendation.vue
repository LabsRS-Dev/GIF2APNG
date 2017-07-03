<template>
    <div class="children__router__content__recommendation">
        <div class="children__router__content__recommendation__slideshow">
            <slider v-bind="setting"></slider>
        </div>
        <div class="children__router__content__recommendation__showImage">
            <span class ="children__router__content__recommendation__showImage__title">个性推荐</span>
            <dl>
                <image-cover :img-src="item.image" v-for="item in imageList" v-show="$route.path.match(/recommendation/)"></image-cover>
            </dl>
        </div>
    </div>
</template>
<script>
    import Slider from 'vue-image-scroll'
    import ImageCover from './imageCover.vue'
    import { BS, Util, _ } from 'dove.max.sdk'

    const taskPrefix = 'children-page-image-id-' + _.now()
    class Listbox {
        constructor(name, image){
            this.id = _.uniqueId(taskPrefix);
            this.name = name;     // 图像文件名称
            this.image = image;     // 图像文件的路径
        }
    }
    /////
    var imageList = [];
    var hasInited = false;

    export default{
        data(){
            return{
                imageList:imageList,
                setting: {
                    styleObject: {
                        width: '750',
                        height: '250',
                        marginLeft:'auto',
                        marginRight:'auto'
                    },
                    image: [
                    {
                        src: 'http://images.missyuan.com/attachments/day_071229/20071229_cb2e4ccb1dfe4ea90fbefoPTVXxYlZ4x.gif',
                        tagName: '活动',
                        tagStyle: {
                        backgroundColor: 'blue'
                        }
                    },
                    {
                        src: 'http://userimage3.360doc.com/13/0319/17/9331441_201303191739590068.gif',
                        tagName: '活动',
                        tagStyle: {
                        backgroundColor: 'blue'
                        }
                    },
                    {
                        src: 'http://image101.360doc.cn/DownloadImg/2016/12/0108/85789533_8.gif',
                        tagName: '活动',
                        tagStyle: {
                        backgroundColor: 'blue'
                        }
                    },
                    {
                        src: 'http://pic.962.net/up/2013-2/2013022510023730088.gif',
                        tagName: '活动',
                        tagStyle: {
                        backgroundColor: 'blue'
                        }
                    },
                    {
                        src: 'http://img1.ph.126.net/GEJEx0n3nUp16KlNcAIPog==/6598226452889567098.gif',
                        tagName: '活动',
                        tagStyle: {
                        backgroundColor: 'blue'
                        }
                    }
                    ],
                    interval: 4000,
                    imgStyle: {
                        borderRadius: '20px'
                    },
                    autoRoll: true
                }
            }
        },
        mounted(){
            var that = this
            if(!hasInited){
                hasInited = true
                that.drawImageCover()
            }
        },
        methods:{
            drawImageCover(){
                var that = this
                _.each([
                    {fileName: 'gif001', fileImage:'http://bbs.uc.cn/data/attachment/forum/month_0807/20080706_d162e4910d0a301fb136NkPw7m39KEOc.gif'},
                    {fileName: 'gif002', fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif'},
                    {fileName: 'gif003', fileImage:'http://worldcup.sznews.com/humor/attachement/gif/site3/20140721/4487fcd7fc661537068e36.gif'},
                    {fileName: 'gif004', fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif'},
                    {fileName: 'gif005', fileImage:'http://images6.fanpop.com/image/photos/35300000/cal-cal-calum-hood-35346616-180-240.gif'},
                    {fileName: 'gif006', fileImage:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Candle-light-animated.gif/180px-Candle-light-animated.gif'},
                    {fileName: 'gif008', fileImage:'http://img0.pconline.com.cn/pconline/1404/08/4571216_2012043023524670421_thumb.gif'},
                    {fileName: 'gif009', fileImage:'https://media.giphy.com/media/5yydxkVxY9tcc/giphy.gif'}
                ],function(ele){
                    let imageObj = new Listbox(ele.fileName,ele.fileImage)
                    that.imageList.push(imageObj)
                })
                return imageList
            }
        },
        components:{
            Slider,
            ImageCover
        }
    }
</script>