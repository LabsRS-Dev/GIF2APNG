<template>
    <div class="children__router__content__recommendation">
        <div class="children__router__content__recommendation__slideshow">
            <swiper :options="swiperOption" ref="mySwiper">
                <swiper-slide v-for="ele in imageList"><img :src="ele.image"></swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
        </div>
        <div class="children__router__content__recommendation__showImage">
            <span class ="children__router__content__recommendation__showImage__title">个性推荐</span>
            <dl>
                <image-cover :imageName="item.name" :img-src="item.image" :introduce="item.introduce" :viewCount="item.viewCount" :url="item.urlPostfix" v-for="item in imageList" v-show="$route.path.match(/recommendation/)"></image-cover>
            </dl>
        </div>
    </div>
</template>
<script>
    import ImageCover from './imageCover.vue'
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    import { BS, Util, _ } from 'dove.max.sdk'

    const taskPrefix = 'children-recommendation-image-id-' + _.now()
    class Listbox {
        constructor(name, image,introduce,viewCount,urlPostfix){
            this.id = _.uniqueId(taskPrefix);
            this.name = name;                  // 图像文件名称
            this.image = image;                // 图像文件的路径
            this.introduce = introduce;        // 图片文件的描述
            this.viewCount = viewCount;        // 图片文件浏览次数
            this.urlPostfix = urlPostfix;      // 图片文件跳转地址后缀
        }
    }
    /////
    var imageList = [];
    var hasInited = false;

    export default{
        data(){
            return{
                imageList:imageList,
                swiperOption: {
                    notNextTick: true,
                    pagination: '.swiper-pagination',
                    effect: 'coverflow',
                    grabCursor: true,
                    centeredSlides: true,
                    slidesPerView: 'auto',
                    coverflow: {
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows : true
                    }
                }
            }
        },
        computed: {
            swiper() {
                var that = this
                return that.$refs.mySwiper.swiper
            }
        },
        mounted(){
            var that = this
            if(!hasInited){
                hasInited = true
                that.drawImageCover()
                that.swiper.slideTo(3, 1000, false)

            }
        },
        methods:{
            drawImageCover(){
                var that = this
                _.each([
                    {fileName: 'gif001', fileImage:'http://bbs.uc.cn/data/attachment/forum/month_0807/20080706_d162e4910d0a301fb136NkPw7m39KEOc.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileViewCount:'54W',urlPostfix:'ddddd'},
                    {fileName: 'gif002', fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileViewCount:'105W',urlPostfix:'cccc'},
                    {fileName: 'gif003', fileImage:'http://worldcup.sznews.com/humor/attachement/gif/site3/20140721/4487fcd7fc661537068e36.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileViewCount:'3W',urlPostfix:'vvvvv'},
                    {fileName: 'gif004', fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileViewCount:'1050W',urlPostfix:'bbbbb'},
                    {fileName: 'gif005', fileImage:'http://images6.fanpop.com/image/photos/35300000/cal-cal-calum-hood-35346616-180-240.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileViewCount:'5W',urlPostfix:'ddddqqqw'},
                    {fileName: 'gif006', fileImage:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Candle-light-animated.gif/180px-Candle-light-animated.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileViewCount:'20W',urlPostfix:'sdsdsda'},
                    {fileName: 'gif007', fileImage:'http://img0.pconline.com.cn/pconline/1404/08/4571216_2012043023524670421_thumb.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileViewCount:'80W',urlPostfix:'fffggr'},
                    {fileName: 'gif008', fileImage:'http://img.zcool.cn/community/01d579578e4bed0000018c1b7c42ab.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileViewCount:'100W',urlPostfix:'ddddffeffff'}
                ],function(ele){
                    let imageObj = new Listbox(ele.fileName,ele.fileImage,ele.fileIntroduce,ele.fileViewCount,ele.urlPostfix)
                    that.imageList.push(imageObj)
                })
                return imageList
            }
        },
        components:{
            ImageCover,
            swiper,
            swiperSlide
        }
    }
</script>