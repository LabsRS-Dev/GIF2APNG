<template>
    <div class="page__children__router__content__album">
      <div class="page__children__router__content__album__content" v-for='item in albumList' v-show="showLoading" :key="item.id">
        <div class="page__album__content__thumb">
          <img :src="item.thumb" width="64" height="64" viewBox="0 0 64 64" @click="$router.push({name:'ImageList',params:{id:item.urlPostfix,attributes:{img:item.image,name:item.name,introduce:item.introduce,browse:item.previewCount,share:item.shareCount,download:item.downloadCount,collection:item.collectionCount}}})"/>
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
      <div class="page__children__router__content__album__loading" v-show="!showLoading">
        <v-loading></v-loading>
      </div>
      <div class="page__children__router__content__album__pagination" v-show="showLoading && total > display">
        <pagination :total="total" :display="display" :current-page='current' @pagechange="pagechange"></pagination>
      </div>
    </div>
</template>
<script>

import { BS, Util, _ } from 'dove.max.sdk'
import { UiIconButton} from 'keen-ui'
import Pagination from './pagination.vue'
import VLoading from '../Find/loading.vue'

var albumList = [];
var hasInited = false;
var total;
var current;

const albumPrefix = 'children-album-image-id-' + _.now()
class Eattedit {
    constructor(name,thumb,image,introduce,previewCount,shareCount,downloadCount,collectionCount,urlPostfix){
        this.id = _.uniqueId(albumPrefix);
        this.name = name;                        // 图集名称
        this.thumb = thumb;                      // 图集缩略图
        this.image = image;                      // 图集展示图像
        this.introduce = introduce;              // 图集简介
        this.previewCount = previewCount;        // 图片文件浏览次数
        this.shareCount = shareCount;            // 图片文件分享次数
        this.downloadCount = downloadCount;      // 图片文件下载次数
        this.collectionCount = collectionCount;  // 图片文件收藏次数
        this.urlPostfix = urlPostfix;            // 图集文件跳转地址后缀
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
      albumList:albumList,
      total: total,       // 记录总条数
      display: 20,        // 每页显示条数
      current: current,         // 当前的页数
      showLoading:false
    }
  },
  mounted(){
    var that = this
    if(!hasInited){
        hasInited = true
      if(that.getBus){
        that.getBus.$on('to-album-data',function(in_data){
          that.albumList.length = 0
          _.each(in_data.data,function(ele){
          var fileName = ele.name
          var fileThumb = ele.thumb
          var fileImage = ele.url
          var fileIntroduce = ele.description
          var filePreviewCount = ele.preview_quantity
          var fileShareCount = ele.share_quantity
          var fileDownloadCount = ele.download_quantity
          var fileCollectionCount = ele.collection_quantity
          var fileUrlPostfix = ele.id
          let albumObj = new Eattedit(fileName,fileThumb,fileImage,fileIntroduce,filePreviewCount,fileShareCount,fileDownloadCount,fileCollectionCount,fileUrlPostfix)
          that.albumList.push(albumObj)
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
              //{id:'action-share',name:'分享', visiable:true, color:"black", icon:"fa fa-share-square-o fa-lg fa-fw", size:"normal", type:"secondary"},
              //{id:'action-collect',name:'收藏', visiable:true, color:"black", icon:"fa fa-user-plus fa-lg fa-fw", size:"normal", type:"secondary"},
              {id:'action-download', name:'下载',visiable:true, color:"black", icon:"fa fa-download fa-lg fa-fw", size:"normal", type:"secondary"}
        ]
    }
  },
  methods:{
    pagechange(currentPage){
        var that = this
        console.log(currentPage)
        that.showLoading = false
        that.current = currentPage
        that.albumList.length = 0
        var stt_tmp = "description like '%" +that.getValue+ "%'"
        var tmp_where = {
            "where": stt_tmp,
            "page" :that.current,
            "per_page":that.display
        }
        Transfer.http.call('get.data_sets',tmp_where,(info) => {
            console.log(info)
            _.each(info.data,function(ele){
            var fileName = ele.name
            var fileThumb = ele.thumb
            var fileImage = ele.url
            var fileIntroduce = ele.description
            var filePreviewCount = ele.preview_quantity
            var fileShareCount = ele.share_quantity
            var fileDownloadCount = ele.download_quantity
            var fileCollectionCount = ele.collection_quantity
            var fileUrlPostfix = ele.id
            let albumObj = new Eattedit(fileName,fileThumb,fileImage,fileIntroduce,filePreviewCount,fileShareCount,fileDownloadCount,fileCollectionCount,fileUrlPostfix)
            that.albumList.push(albumObj)
            })
            that.showLoading = !that.showLoading
        })
    }
  },
  components:{
    UiIconButton,
    Pagination,
    VLoading
  }
}
</script>
