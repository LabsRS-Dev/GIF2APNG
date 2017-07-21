<template>
    <div class="page__children__router__content__single">
      <ui-confirm
          :autofocus="enlargeConfirmDialog.autofocus"
          :confirm-button-text="enlargeConfirmDialog.confirmButtonText"
          :deny-button-text="enlargeConfirmDialog.denyButtonText"
          :ref="enlargeConfirmDialog.ref"
          :title="enlargeConfirmDialog.title"

          @confirm="enlargeConfirmDialog.callbackConfirm"
          @deny="enlargeConfirmDialog.callbackDeny"
          @open="enlargeConfirmDialog.callbackOpen"
          @close="enlargeConfirmDialog.callbackClose"
          >
          <div class="page__children__router__content__single__preview">
            <img :src="imagePreview">
          </div>
      </ui-confirm>
      <div class="page__children__router__content__single__content" v-for='item in paginationList'>
        <div class="page__single__content__thumb">
          <img :src="item.thumb" width="64" height="64" viewBox="0 0 64 64" @click='getEnlargeFigureImage(item)'/>
        </div>
        <div class="page__single__content__info">
          <span class="page__single__content__info__name">{{item.name}}</span>
          <span class="page__single__content__info__size">{{item.size}}</span>
        </div>
        <div class="page__single__content__dimension"><span>{{item.dimension}}</span></div>
        <div class="page__single__content__introduce"><span>{{item.introduce}}</span></div>
        <div class="page__single__content__handle__icon">
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
      <div class="page__children__router__content__single__pagination">
        <pagination :total="total" :display="display" :current-page='current' @pagechange="pagechange"></pagination>
      </div>
    </div>
</template>
<script>

  import { BS, Util, _ } from 'dove.max.sdk'
  import { UiIconButton,UiConfirm} from 'keen-ui'
  import Pagination from './pagination.vue'

  var singleList = [];
  var hasInited = false;
  var imagePreview = '';
  var total;
  var paginationList = [];

  const singlePrefix = 'children-single-image-id-' + _.now()
  class Eattedit {
      constructor(name,size,dimension,thumb,introduce){
          this.id = _.uniqueId(singlePrefix);
          this.name = name;                  // 图片名称
          this.size = size;                  // 图片大小
          this.thumb = thumb;                // 图片缩略图
          this.introduce = introduce;        // 图片简介
          this.dimension = dimension;        // 图片尺寸
      }
  }

  export default{
    data(){
      return{
        singleList:singleList,
        imagePreview:imagePreview,
        dataType:0,
        enlargeConfirmDialog:{
            ref: 'enlargeConfirmDialog',
            autofocus: 'none',
            confirmButtonText: 'Confirm',
            denyButtonText: 'Deny',
            title: '',
            callbackConfirm: ()=>{},
            callbackDeny: ()=>{},
            callbackOpen: ()=>{},
            callbackClose: ()=>{}
        },
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
          that.getSingleListInfo()
      }
      that.getDataInfo(that.singleList.length)
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
      getSingleListInfo(){
          var that = this
          _.each([
              {fileName: 'gif009', fileSize:'1.5MB',fileDimension:'240x320',fileImage:'http://bbs.uc.cn/data/attachment/forum/month_0807/20080706_d162e4910d0a301fb136NkPw7m39KEOc.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileSize:'2.3MB',fileDimension:'135x180',fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif011', fileSize:'3.4MB',fileDimension:'200x215',fileImage:'http://worldcup.sznews.com/humor/attachement/gif/site3/20140721/4487fcd7fc661537068e36.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileSize:'1.7MB',fileDimension:'192x256',fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif013', fileSize:'905KB',fileDimension:'180x240',fileImage:'http://images6.fanpop.com/image/photos/35300000/cal-cal-calum-hood-35346616-180-240.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif014', fileSize:'3.8MB',fileDimension:'180x240',fileImage:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Candle-light-animated.gif/180px-Candle-light-animated.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif015', fileSize:'2.1MB',fileDimension:'180x240',fileImage:'http://img0.pconline.com.cn/pconline/1404/08/4571216_2012043023524670421_thumb.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif016', fileSize:'1.2MB',fileDimension:'192x256',fileImage:'http://img.zcool.cn/community/01d579578e4bed0000018c1b7c42ab.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif017', fileSize:'1.5MB',fileDimension:'240x320',fileImage:'http://bbs.uc.cn/data/attachment/forum/month_0807/20080706_d162e4910d0a301fb136NkPw7m39KEOc.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif018', fileSize:'2.3MB',fileDimension:'135x180',fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif019', fileSize:'3.4MB',fileDimension:'200x215',fileImage:'http://worldcup.sznews.com/humor/attachement/gif/site3/20140721/4487fcd7fc661537068e36.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif020', fileSize:'1.7MB',fileDimension:'192x256',fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif021', fileSize:'905KB',fileDimension:'180x240',fileImage:'http://images6.fanpop.com/image/photos/35300000/cal-cal-calum-hood-35346616-180-240.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif022', fileSize:'3.8MB',fileDimension:'180x240',fileImage:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Candle-light-animated.gif/180px-Candle-light-animated.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif023', fileSize:'2.1MB',fileDimension:'180x240',fileImage:'http://img0.pconline.com.cn/pconline/1404/08/4571216_2012043023524670421_thumb.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif024', fileSize:'1.2MB',fileDimension:'192x256',fileImage:'http://img.zcool.cn/community/01d579578e4bed0000018c1b7c42ab.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileSize:'2.3MB',fileDimension:'135x180',fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileSize:'2.3MB',fileDimension:'135x180',fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileSize:'2.3MB',fileDimension:'135x180',fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileSize:'2.3MB',fileDimension:'135x180',fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileSize:'2.3MB',fileDimension:'135x180',fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileSize:'2.3MB',fileDimension:'135x180',fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileSize:'2.3MB',fileDimension:'135x180',fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileSize:'2.3MB',fileDimension:'135x180',fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileSize:'2.3MB',fileDimension:'135x180',fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileSize:'2.3MB',fileDimension:'135x180',fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileSize:'2.3MB',fileDimension:'135x180',fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileSize:'2.3MB',fileDimension:'135x180',fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileSize:'2.3MB',fileDimension:'135x180',fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileSize:'2.3MB',fileDimension:'135x180',fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileSize:'2.3MB',fileDimension:'135x180',fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif010', fileSize:'2.3MB',fileDimension:'135x180',fileImage:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileSize:'1.7MB',fileDimension:'192x256',fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileSize:'1.7MB',fileDimension:'192x256',fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileSize:'1.7MB',fileDimension:'192x256',fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileSize:'1.7MB',fileDimension:'192x256',fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileSize:'1.7MB',fileDimension:'192x256',fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileSize:'1.7MB',fileDimension:'192x256',fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileSize:'1.7MB',fileDimension:'192x256',fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileSize:'1.7MB',fileDimension:'192x256',fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileSize:'1.7MB',fileDimension:'192x256',fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileSize:'1.7MB',fileDimension:'192x256',fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileSize:'1.7MB',fileDimension:'192x256',fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileSize:'1.7MB',fileDimension:'192x256',fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileSize:'1.7MB',fileDimension:'192x256',fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileSize:'1.7MB',fileDimension:'192x256',fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileSize:'1.7MB',fileDimension:'192x256',fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'},
              {fileName: 'gif012', fileSize:'1.7MB',fileDimension:'192x256',fileImage:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileIntroduce:'掬水月在手,弄花香满衣,云在青天水在瓶.'}
          ],function(ele){
              let singleObj = new Eattedit(ele.fileName,ele.fileSize,ele.fileDimension,ele.fileImage,ele.fileIntroduce)
              that.singleList.push(singleObj)
          })
          that.total = that.singleList.length
          that.paginationList = that.singleList.slice(0, that.display)
          return singleList
      },
      getDataInfo(type){
        var that = this
        that.dataType = type
        that.$emit('data-info', type)
      },
      getEnlargeFigureImage(item){
          var that = this
          const cdg = that.enlargeConfirmDialog
          cdg.title = that.$t('pages.search.dialog-confirm.title')
          cdg.confirmButtonText = that.$t('pages.search.dialog-confirm.btnConfirm')
          cdg.denyButtonText = that.$t('pages.search.dialog-confirm.btnDeny')
          var dialog = that.$refs[cdg.ref]
          that.imagePreview = item.thumb
          dialog.open()
      },
      pagechange(currentPage){
          var that = this
          console.log(currentPage)
          let page = currentPage
          let curLimit = that.display
          that.paginationList = that.singleList.slice(curLimit * (page-1), curLimit * page )
          return paginationList
      }
    },
    components:{
      UiIconButton,
      UiConfirm,
      Pagination
    }
  }
</script>
