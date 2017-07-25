<template>
    <div class="page__children__router__content__album">
      <div class="page__children__router__content__album__content" v-for='item in paginationList'>
        <div class="page__album__content__thumb">
          <img :src="item.thumb" width="64" height="64" viewBox="0 0 64 64" />
        </div>
        <div class="page__album__content__info">
          <span class="page__album__content__info__name">{{item.name}}</span>
        </div>
        <div class="page__album__content__introduce">
          <span>{{item.introduce}}</span>
        </div>
        <div class="page__album__content__handle__icon">
            <ui-icon-button
                @click="onToolBtnClick(item)"
                :type="item.type"
                :size="item.size"
                :color="item.color"
                :key="item.id"
                v-if="item.visiable"
                v-for="item in actionList"
                >
                  <span :class="item.icon" :title="$t(item.tooltip)"></span>
            </ui-icon-button>
        </div>
      </div>
        <div class="page__children__router__content__album__pagination">
        <pagination :total="total" :display="display" :current-page='current' @pagechange="pagechange"></pagination>
      </div>
    </div>
</template>
<script>

  import { BS, Util, _ } from 'dove.max.sdk'
  import { UiIconButton} from 'keen-ui'
  import Pagination from './pagination.vue'

  var albumList = [];
  var hasInited = false;
  var total;
  var paginationList = [];

  const albumPrefix = 'children-album-image-id-' + _.now()
  class Eattedit {
      constructor(name,thumb,introduce){
          this.id = _.uniqueId(albumPrefix);
          this.name = name;                  // 图集名称
          this.thumb = thumb;                // 图集缩略图
          this.introduce = introduce;        // 图集简介
      }
  }

  export default{
    data(){
      return{
        albumList:albumList,
        dataType:0,
        total: total,       // 记录总条数
        display: 16,        // 每页显示条数
        current: 1,         // 当前的页数
        paginationList:paginationList
      }
    },
    mounted(){
      var that = this
      if(!hasInited){
          hasInited = true
          that.getAlbumListInfo()
      }
    },
    activated(){
      var that = this
      that.getDataInfo(that.albumList.length)
    },
    computed:{
      actionList() {
         var that = this
         return [
                //{id:'action-share',name:'分享', visiable:true, color:"black", icon:"fa fa-share-square-o fa-lg fa-fw", size:"normal", type:"secondary"},
                //{id:'action-collect',name:'收藏', visiable:true, color:"black", icon:"fa fa-user-plus fa-lg fa-fw", size:"normal", type:"secondary"},
                {id:'action-download', name:'下载',visiable:true, color:"black", icon:"fa fa-download fa-lg fa-fw", size:"normal", type:"secondary"}
         ]
      }
    },
    methods:{
      getAlbumListInfo(){
          var that = this
          _.each([
              {fileName: 'gif009', fileImage:'http://bbs.uc.cn/data/attachment/forum/month_0807/20080706_d162e4910d0a301fb136NkPw7m39KEOc.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif011', fileImage:'http://worldcup.sznews.com/humor/attachement/gif/site3/20140721/4487fcd7fc661537068e36.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif013', fileImage:'http://images6.fanpop.com/image/photos/35300000/cal-cal-calum-hood-35346616-180-240.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif014', fileImage:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Candle-light-animated.gif/180px-Candle-light-animated.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif015', fileImage:'http://img0.pconline.com.cn/pconline/1404/08/4571216_2012043023524670421_thumb.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif016', fileImage:'http://img.zcool.cn/community/01d579578e4bed0000018c1b7c42ab.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif017', fileImage:'http://bbs.uc.cn/data/attachment/forum/month_0807/20080706_d162e4910d0a301fb136NkPw7m39KEOc.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif018', fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif019', fileImage:'http://worldcup.sznews.com/humor/attachement/gif/site3/20140721/4487fcd7fc661537068e36.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif020', fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif021', fileImage:'http://images6.fanpop.com/image/photos/35300000/cal-cal-calum-hood-35346616-180-240.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif022', fileImage:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Candle-light-animated.gif/180px-Candle-light-animated.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif023', fileImage:'http://img0.pconline.com.cn/pconline/1404/08/4571216_2012043023524670421_thumb.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'}
          ],function(ele){
              let albumObj = new Eattedit(ele.fileName,ele.fileImage,ele.fileIntroduce)
              that.albumList.push(albumObj)
          })
          that.total = that.albumList.length
          that.paginationList = that.albumList.slice(0, that.display)
          return albumList
      },
      getDataInfo(type){
        var that = this
        that.dataType = type
        that.$emit('data-info', type)
      },
      pagechange(currentPage){
          var that = this
          console.log(currentPage)
          let page = currentPage
          let curLimit = that.display
          that.paginationList = that.albumList.slice(curLimit * (page-1), curLimit * page )
          return paginationList
      }
    },
    components:{
      UiIconButton,
      Pagination
    }
  }
</script>
