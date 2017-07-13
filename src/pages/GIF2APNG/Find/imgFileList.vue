<template>
  <div class="imageList__router__content__image__browse__info">
    <div class="imageList__router__content__image__browse__message" v-for="item in formList">
      <span class="imageList__router__content__image__browse__message__name">{{item.introduce}}</span>
      <span class="imageList__router__content__image__browse__message__icon"><img :src="item.thumb"></img></span>
    </div>
  </div>
</template>
<script>

   import { BS, Util, _ } from 'dove.max.sdk'

   const formPrefix ='form-image-id-' + _.now()
   class Form {
       constructor(name,thumb,introduce,browse,download,share,collect){
           this.id = _.uniqueId(formPrefix);
           this.name = name              // 图片文件名称
           this.thumb = thumb            // 图片文件图标
           this.introduce = introduce    // 图片描述
           this.browse = browse          // 图片文件浏览次数
           this.download = download      // 图片文件下载次数
           this.share = share            // 图片文件分享次数
           this.collect = collect        // 图片文件收藏次数
       }
   }
   var formList =[];
   var hasInited = false;

   export default{
     data(){
         return{
           formList:formList
         }
     },
     mounted(){
         var that = this
         if(!hasInited){
             hasInited = true
             that.drawFormRetrieval()
         }
     },
     methods:{
         drawFormRetrieval(){
             var that = this
             _.each([
                 {fileName: 'gif001', fileThumb:'http://bbs.uc.cn/data/attachment/forum/month_0807/20080706_d162e4910d0a301fb136NkPw7m39KEOc.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileBrowse:80,fileDownload:3,fileShare:2,fileCollect:98},
                 {fileName: 'gif002', fileThumb:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileBrowse:98,fileDownload:12,fileShare:11,fileCollect:89},
                 {fileName: 'gif003', fileThumb:'http://worldcup.sznews.com/humor/attachement/gif/site3/20140721/4487fcd7fc661537068e36.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileBrowse:66,fileDownload:33,fileShare:32,fileCollect:68},
                 {fileName: 'gif004', fileThumb:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileBrowse:55,fileDownload:44,fileShare:43,fileCollect:57},
                 {fileName: 'gif005', fileThumb:'http://images6.fanpop.com/image/photos/35300000/cal-cal-calum-hood-35346616-180-240.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileBrowse:74,fileDownload:28,fileShare:27,fileCollect:73},
                 {fileName: 'gif006', fileThumb:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Candle-light-animated.gif/180px-Candle-light-animated.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileBrowse:12,fileDownload:80,fileShare:79,fileCollect:21},
                 {fileName: 'gif007', fileThumb:'http://img0.pconline.com.cn/pconline/1404/08/4571216_2012043023524670421_thumb.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileBrowse:46,fileDownload:54,fileShare:53,fileCollect:47},
                 {fileName: 'gif008', fileThumb:'https://media.giphy.com/media/5yydxkVxY9tcc/giphy.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileBrowse:18,fileDownload:82,fileShare:81,fileCollect:19},
                 {fileName: 'gif009', fileThumb:'http://bbs.uc.cn/data/attachment/forum/month_0807/20080706_d162e4910d0a301fb136NkPw7m39KEOc.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileBrowse:5,fileDownload:95,fileShare:94,fileCollect:6},
                 {fileName: 'gif010', fileThumb:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileBrowse:2,fileDownload:98,fileShare:97,fileCollect:3}
             ],function(ele){
                 let formObj = new Form(ele.fileName,ele.fileThumb,ele.fileIntroduce,ele.fileBrowse,ele.fileDownload,ele.fileShare,ele.fileCollect)
                 that.formList.push(formObj)
             })
         }
     }
   }
</script>