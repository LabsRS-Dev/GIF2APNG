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
      <div class="page__children__router__content__single__content" v-for='item in singleList' v-show="showLoading" :key="item.id">
        <div class="page__single__content__thumb">
          <img :src="item.thumb" width="64" height="64" viewBox="0 0 64 64" @click='getEnlargeFigureImage(item)'/>
        </div>
        <div class="page__single__content__info">
          <span class="page__single__content__info__size">{{item.size}}</span>
        </div>
        <div class="page__single__content__dimension"><span>{{item.dimension}}</span></div>
        <div class="page__single__content__introduce"><span>{{item.introduce}}</span></div>
        <div class="page__single__content__handle__icon">
            <ui-icon-button
                @click="getWritePermission(ele,item)"
                :type="ele.type"
                :size="ele.size"
                :color="ele.color"
                :key="ele.id"
                v-if="ele.visiable"
                v-for="ele in actionList"
                >
                  <span :class="ele.icon" :title="$t(ele.tooltip)"></span>
            </ui-icon-button>
        </div>
      </div>
      <div class="page__children__router__content__single__loading" v-show="!showLoading">
        <v-loading></v-loading>
      </div>
      <div class="page__children__router__content__single__pagination" v-show="showLoading && total > display">
        <pagination :total="total" :display="display" :current-page='current' @pagechange="pagechange"></pagination>
      </div>
    </div>
</template>
<script>

  import { BS, Util, _ } from 'dove.max.sdk'
  import { UiIconButton,UiConfirm} from 'keen-ui'
  import Pagination from './pagination.vue'
  import VLoading from '../Find/loading.vue'
  import { DownloadHandler } from '../../../data/downlaod-manager'
  
  var singleList = [];
  var imagePreview = '';
  var hasInited = false ;
  var total;
  var current;

  const singlePrefix = 'children-single-image-id-' + _.now()
  class Eattedit {
      constructor(name,image,size,dimension,thumb,introduce,previewCount,downloadCount,shareCount,collectionCount,imgID){
          this.id = _.uniqueId(singlePrefix);
          this.name = name;                              // 图片名称
          this.image = image;                            // 图片名称
          this.size = size;                              // 图片大小
          this.thumb = thumb;                            // 图片缩略图
          this.introduce = introduce;                    // 图片简介
          this.dimension = dimension;                    // 图片尺寸
          this.previewCount = previewCount;              // 图片浏览次数
          this.downloadCount = downloadCount;            // 图片下载次数
          this.shareCount = shareCount;                  // 图片分享次数
          this.collectionCount = collectionCount;        // 图片收藏次数
          this.imgID = imgID;                            // 图片自身ID   
      }
  }

  export default{
    props:{
        getValue:String,
        getBus:{
          type: Object,
          default: null
        }
    },
    data(){
      return{
        singleList:singleList,
        imagePreview:imagePreview,
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
        display: 20,        // 每页显示条数
        current: current,    // 当前的页数
        showLoading:false
      }
    },
    mounted(){
      var that = this
      if(!hasInited){
        hasInited = true
        if(that.getBus){
          that.getBus.$on('to-single-data',function(in_data){
            that.singleList.length = 0
            _.each(in_data.data,function(ele){
              var fileName = ele.name
              var fileImage = ele.url
              var fileSize = ele.size
              var fileThumb = ele.thumb
              var fileIntroduce = ele.description
              var fileDimension = ele.dimensions
              var filePreviewCount = ele.preview_quantity
              var fileDownloadCount = ele.download_quantity
              var fileShareCount = ele.share_quantity
              var fileCollectionCount = ele.collection_quantity
              var fileImgID = ele.id
              let singleObj = new Eattedit(fileName,fileImage,fileSize,fileDimension,fileThumb,fileIntroduce,filePreviewCount,fileDownloadCount,fileShareCount,fileCollectionCount,fileImgID)
              that.singleList.push(singleObj)
            })
            that.total = in_data.paginate.total
          })
          that.showLoading = !that.showLoading
        }
      }
    },
    computed:{
      actionList() {
         var that = this
         return [
                //{id:'action-share',name:'分享', visiable:true, color:"black", icon:"fa fa-share-square-o fa-lg fa-fw", size:"normal", type:"secondary",tooltip:"pages.search.toolbar.import-share"},
                //{id:'action-collect',name:'收藏', visiable:true, color:"black", icon:"fa fa-user-plus fa-lg fa-fw", size:"normal", type:"secondary",tooltip:"pages.search.toolbar.import-collect"},
                {id:'action-download', name:'下载',visiable:true, color:"black", icon:"fa fa-download fa-lg fa-fw", size:"normal", type:"secondary",tooltip:"pages.search.toolbar.import-download"}
         ]
      }
    },
    methods:{
      getWritePermission(ele,item){
        var that = this
        if(ele.id === 'action-download') {
            that.getDownloadCountWritePermission(item)
        }
      },
      getDownloadCountWritePermission(item){
        var that = this
        //////////////////////////////////////////   记录下载次数
        let machineCode = BS.b$.App.getSerialNumber()
        Transfer.http.call('get.items_download',{"machine_id":machineCode,"id":item.imgID},(info) => {
            console.log('记录成功')
        })
        DownloadHandler.add(item)
      },
      getEnlargeFigureImage(item){
          var that = this
          //////////////////////////////////////////   记录浏览次数
          let machineCode = BS.b$.App.getSerialNumber()
          Transfer.http.call('get.items_preview',{"machine_id":machineCode,"id":item.imgID},(info) => {
              console.log('记录成功')
          })

          const cdg = that.enlargeConfirmDialog
          cdg.title = that.$t('pages.search.dialog-confirm.title')
          cdg.confirmButtonText = that.$t('pages.search.dialog-confirm.btnConfirm')
          cdg.denyButtonText = that.$t('pages.search.dialog-confirm.btnDeny')
          var dialog = that.$refs[cdg.ref]
          that.imagePreview = item.image
          dialog.open()
      },
      pagechange(currentPage){
          var that = this
          that.current = currentPage
          that.showLoading = false
          that.singleList.length = 0
          var stt_tmp = "description like '%" +that.getValue+ "%'"
          var tmp_where = {
              "where": stt_tmp,
              "page" :that.current,
              "per_page":that.display
          }
          Transfer.http.call('get.data_items',tmp_where,(info) => {
              _.each(info.data,function(ele){
              var fileName = ele.name
              var fileImage = ele.url
              var fileSize = ele.size
              var fileThumb = ele.thumb
              var fileIntroduce = ele.descriptions
              var fileDimension = ele.dimensions
              var filePreviewCount = ele.preview_quantity
              var fileDownloadCount = ele.download_quantity
              var fileShareCount = ele.share_quantity
              var fileCollectionCount = ele.collection_quantity
              var fileImgID = ele.id
              let singleObj = new Eattedit(fileName,fileImage,fileSize,fileDimension,fileThumb,fileIntroduce,filePreviewCount,fileDownloadCount,fileShareCount,fileCollectionCount,fileImgID)
              that.singleList.push(singleObj)
              })
              that.showLoading = !that.showLoading
          })
      }
    },
    components:{
      UiIconButton,
      UiConfirm,
      Pagination,
      VLoading
    }
  }
</script>
