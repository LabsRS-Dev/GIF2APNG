<template>
  <section  class="page page-app-doc">
      <div class="page__toolbar-app-doc__imageList__router__head">
        <img :src="route_params.image" class="imageList__router__head__imageCover">
        <div class="imageList__router__head__content">
          <span class="imageList__router__head__content__title">{{route_params.name}}</span>
          <div class="imageList__router__head__content__button">
            <ui-icon-button
                @click=""
                :type="item.type"
                :size="item.size"
                :color="item.color"
                :key="item.id"
                raised
                v-if="item.visiable"
                v-for="item, index in actionList"
                >
                  <span :class="item.icon"></span>
                  {{item.name}}({{item.time}})
            </ui-icon-button>
          </div>
          <div class="imageList__router__head__content__tags"><span class="imageList__router__head__content__tags__title">标签:</span>{{route_params.tag}}</div>
          <div class="imageList__router__head__content__introduce"><span class="imageList__router__head__content__introduce__title">简介:</span>{{route_params.introduce}}</div>
        </div>
      </div>
      <div class="page__toolbar-app-doc__imageList__router__content">
          <div class="imageList__router__content__router">
            <dl>
                <router-link :to="'/Gmagon Gif/Find/ImageList/'+ route_params.id +'/imgFileList'"><dd :class="{choosed: topName =='imgFileList'}">列表</dd></router-link>
                <router-link :to="'/Gmagon Gif/Find/ImageList/'+ route_params.id +'/discuss'"><dd :class="{choosed: topName =='discuss'}">评论</dd></router-link>
                <router-link :to="'/Gmagon Gif/Find/ImageList/'+ route_params.id +'/collector'"><dd :class="{choosed: topName =='collector'}">收藏者</dd></router-link>
            </dl>
          </div>
          <div class="imageList__router__content__image__browse">
            <router-view></router-view>
          </div>
      </div>
  </section>
</template>

<script>
  import { BS, Util, _ } from 'dove.max.sdk'
  import {UiButton,UiIconButton} from 'keen-ui'

  const imagePrefix = 'children-imageList-image-id-' + _.now()
  class Listbox {
      constructor(name, image,introduce,browse,download,share,collect,tag){
          this.id = _.uniqueId(imagePrefix);
          this.name = name;                  // 图像文件名称
          this.image = image;                // 图像文件的路径
          this.introduce = introduce;        // 图片文件的描述
          this.browse = browse;              // 图片文件浏览次数
          this.download = download;          // 图片文件下载次数
          this.share = share;                // 图片文件分享次数
          this.collect = collect;            // 图片文件收藏次数
          this.tag = tag;                    // 图片文件标签名称
      }
  }
  var imageList = [];
  var hasInited = false;

  export default{
    data () {
      return{
        imageList:imageList,
        route_params:{
          tag:'',
          browse:'',
          download:'',
          share:'',
          collect:'',
          image: '',
          name: '',
          introduce: '',
          id: ''
        }
      }
    },
    beforeRouteEnter (to, from, next) {
        var img = to.params.attributes && to.params.attributes.img
        var id = to.params.id
        next((vm) => {
          _.each(vm.imageList,(ele) => {
            if(img == ele.image){
              vm.route_params.tag = ele.tag
              vm.route_params.browse = ele.browse
              vm.route_params.download = ele.download
              vm.route_params.share = ele.share
              vm.route_params.collect = ele.collect
              vm.route_params.name = ele.name
              vm.route_params.introduce = ele.introduce
              vm.route_params.image = img
              vm.route_params.id = id
              return
            }
          })
        })
    },
    beforeRouteUpdate (to, from, next) {
        var that = this
        var img = to.params.attributes && to.params.attributes.img
        var id = to.params.id
        _.each(that.imageList,(ele) => {
          if(img == ele.image){
              that.route_params.tag = ele.tag
              that.route_params.browse = ele.browse
              that.route_params.download = ele.download
              that.route_params.share = ele.share
              that.route_params.collect = ele.collect
              that.route_params.name = ele.name
              that.route_params.introduce = ele.introduce
              that.route_params.image = img
              that.route_params.id = id
              return
          }
        })
        next()
    },
    mounted(){
      var that = this
      if(!hasInited){
        hasInited = true
        that.getList()
      }
    },
    computed:{
        actionList() {
           var that = this
           return [
                {id:'action-browse',name:'浏览', visiable:true, color:"black", icon:"fa fa-eye fa-lg fa-fw", size:"large", type:"secondary",time:that.route_params.browse},
                {id:'action-share',name:'分享', visiable:true, color:"black", icon:"fa fa-share-square-o fa-lg fa-fw", size:"large", type:"secondary",time:that.route_params.share},
                {id:'action-collect',name:'收藏', visiable:true, color:"black", icon:"fa fa-user-plus fa-lg fa-fw", size:"large", type:"secondary",time:that.route_params.collect},
                {id:'action-download', name:'下载',visiable:true, color:"black", icon:"fa fa-download fa-lg fa-fw", size:"large", type:"secondary",time:that.route_params.download}
           ]
        },
        topName() {
          var that = this
          let path = that.$route.path
          path = path.substr(path.lastIndexOf('/') + 1)
          return path
        }
    },
    methods:{
      getList(){
        var that = this
        _.each([
          {fileName: '愿岁月静好，现世安稳', fileImage:'http://bbs.uc.cn/data/attachment/forum/month_0807/20080706_d162e4910d0a301fb136NkPw7m39KEOc.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileTag:'风景',fileBrowse:80,fileDownload:3,fileShare:2,fileCollect:98},
          {fileName: '愿岁月静好，现世安稳', fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileTag:'人物',fileBrowse:98,fileDownload:12,fileShare:11,fileCollect:89},
          {fileName: '愿岁月静好，现世安稳', fileImage:'http://worldcup.sznews.com/humor/attachement/gif/site3/20140721/4487fcd7fc661537068e36.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileTag:'搞笑',fileBrowse:66,fileDownload:33,fileShare:32,fileCollect:68},
          {fileName: '愿岁月静好，现世安稳', fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileTag:'美女',fileBrowse:55,fileDownload:44,fileShare:43,fileCollect:57},
          {fileName: '愿岁月静好，现世安稳', fileImage:'http://images6.fanpop.com/image/photos/35300000/cal-cal-calum-hood-35346616-180-240.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileTag:'宠物',fileBrowse:74,fileDownload:28,fileShare:27,fileCollect:73},
          {fileName: '愿岁月静好，现世安稳', fileImage:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Candle-light-animated.gif/180px-Candle-light-animated.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileTag:'蜡烛',fileBrowse:12,fileDownload:80,fileShare:79,fileCollect:21},
          {fileName: '愿岁月静好，现世安稳', fileImage:'http://img0.pconline.com.cn/pconline/1404/08/4571216_2012043023524670421_thumb.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileTag:'遗失',fileBrowse:46,fileDownload:54,fileShare:53,fileCollect:47},
          {fileName: '愿岁月静好，现世安稳', fileImage:'http://img.zcool.cn/community/01d579578e4bed0000018c1b7c42ab.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.',fileTag:'笑容',fileBrowse:18,fileDownload:82,fileShare:81,fileCollect:19}
        ],function(ele){
              let imageObj = new Listbox(ele.fileName,ele.fileImage,ele.fileIntroduce,ele.fileBrowse,ele.fileDownload,ele.fileShare,ele.fileCollect,ele.fileTag)
              that.imageList.push(imageObj)
          })
          return imageList
      }
    },
    components: {
        UiButton,
        UiIconButton
    }
  }
</script>