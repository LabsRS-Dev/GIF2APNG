<template>
  <section  class="page page-app-doc">
      <div class="page__toolbar-app-doc__imageList__router__head">
        <img :src="route_params.image" class="imageList__router__head__imageCover">
        <div class="imageList__router__head__content">
          <span class="imageList__router__head__content__title">{{route_params.name}}</span>
          <div class="imageList__router__head__content__button">
            <ui-icon-button
                @click="getWritePermission(ele,route_params.id,imageList)"
                :type="ele.type"
                :size="ele.size"
                :color="ele.color"
                :key="ele.id"
                :title = "ele.name"
                raised
                v-if="ele.visiable"
                v-for="ele in actionList"
                >
                  <span :class="ele.icon"></span>
            </ui-icon-button>
          </div>
          <!-- <div class="imageList__router__head__content__tags"><span class="imageList__router__head__content__tags__title">标签:</span>{{route_params.tag}}</div> -->
          <div class="imageList__router__head__content__introduce"><span class="imageList__router__head__content__introduce__title">{{$t('pages.discover.image-list.title')}}</span>{{route_params.introduce}}</div>
        </div>
      </div>
      <div class="page__toolbar-app-doc__imageList__router__content">
          <div class="imageList__router__content__router">
            <dl>
                <router-link :to="'/Gmagon Gif/Find/ImageList/'+ route_params.id +'/imgFileList'"><dd :class="{choosed: topName =='imgFileList'}">列表</dd></router-link>
                <!-- <router-link :to="'/Gmagon Gif/Find/ImageList/'+ route_params.id +'/discuss'"><dd :class="{choosed: topName =='discuss'}">评论</dd></router-link>
                <router-link :to="'/Gmagon Gif/Find/ImageList/'+ route_params.id +'/collector'"><dd :class="{choosed: topName =='collector'}">收藏者</dd></router-link> -->
            </dl>
          </div>
          <div class="imageList__router__content__image__browse" v-show="showLoading">
            <router-view @data-loading = "getLoadingInfo"></router-view>
          </div>
          <div class="imageList__router__content__image__browse__loading" v-show="!showLoading">
              <v-loading></v-loading>
          </div>
      </div>
  </section>
</template>

<script>
import { BS, _ } from 'dove.max.sdk'
import { Transfer } from '../../../bridge/transfer'
import { UiButton, UiIconButton } from 'keen-ui'
import VLoading from './loading.vue'
import { DownloadAlbum } from '../../../data/downlaod-manager'

var imageList = []
export default {
  data () {
    return {
      imageList: imageList,
      showLoading: false,
      route_params: {
        browse: '',
        download: '',
        share: '',
        collect: '',
        image: '',
        imgUrl: '',
        name: '',
        introduce: '',
        id: ''
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.route_params.browse = to.params.attributes.browse
      vm.route_params.download = to.params.attributes.download
      vm.route_params.share = to.params.attributes.share
      vm.route_params.collect = to.params.attributes.collection
      vm.route_params.name = to.params.attributes.name
      vm.route_params.introduce = to.params.attributes.introduce
      vm.route_params.image = to.params.attributes.img
      vm.route_params.imgUrl = to.params.attributes.imgUrl
      vm.route_params.id = to.params.id
      vm.imageList.push({
        browse: vm.route_params.browse,
        download: vm.route_params.download,
        share: vm.route_params.share,
        collect: vm.route_params.collect,
        name: vm.route_params.name,
        introduce: vm.route_params.introduce,
        image: vm.route_params.image,
        imgUrl: vm.route_params.imgUrl,
        id: vm.route_params.id
      })
      return
    })
  },
  beforeRouteUpdate (to, from, next) {
    var that = this
    _.each(that.imageList, function (ele) {
      that.route_params.browse = ele.browse
      that.route_params.download = ele.download
      that.route_params.share = ele.share
      that.route_params.collect = ele.collect
      that.route_params.name = ele.name
      that.route_params.introduce = ele.introduce
      that.route_params.image = ele.image
      that.route_params.imgUrl = to.params.attributes.imgUrl
      that.route_params.id = ele.id
    })
    next()
  },
  computed: {
    actionList () {
      var that = this
      return [
        // {id:'action-browse',name:'浏览', visiable:true, color:"black", icon:"fa fa-eye fa-lg fa-fw", size:"large", type:"secondary",time:that.route_params.browse},
        // {id:'action-share',name:'分享', visiable:true, color:"black", icon:"fa fa-share-square-o fa-lg fa-fw", size:"large", type:"secondary",time:that.route_params.share},
        // {id:'action-collect',name:'收藏', visiable:true, color:"black", icon:"fa fa-user-plus fa-lg fa-fw", size:"large", type:"secondary",time:that.route_params.collect},
        {
          id: 'action-download',
          name: 'download',
          visiable: true,
          color: 'black',
          icon: 'fa fa-download fa-lg fa-fw',
          size: 'large',
          type: 'secondary',
          time: that.route_params.download
        }
      ]
    },
    topName () {
      var that = this
      let path = that.$route.path
      path = path.substr(path.lastIndexOf('/') + 1)
      return path
    }
  },
  methods: {
    getWritePermission (ele, index, item) {
      var that = this
      if (ele.id === 'action-share') {
        that.getShareCountWritePermission(index, item)
      } else if (ele.id === 'action-collect') {
        that.getCollectCountWritePermission(index, item)
      } else if (ele.id === 'action-download') {
        that.getDownloadCountWritePermission(index, item)
      }
    },
    getShareCountWritePermission (index, item) {
      //   记录分享次数
      const machineCode = BS.b$.App.getSerialNumber()
      Transfer.http.call(
        'get.sets_share',
        { machine_id: machineCode, id: index },
        info => {
          console.log('记录成功')
        }
      )
    },
    getCollectCountWritePermission (index, item) {
      //   记录收藏次数
      const machineCode = BS.b$.App.getSerialNumber()
      Transfer.http.call(
        'get.sets_collection',
        { machine_id: machineCode, id: index },
        info => {
          console.log('记录成功')
        }
      )
    },
    getDownloadCountWritePermission (index, item) {
      var that = this
      //   记录下载次数
      const machineCode = BS.b$.App.getSerialNumber()
      Transfer.http.call(
        'get.sets_download',
        { machine_id: machineCode, id: index },
        info => {
          console.log('记录成功')
        }
      )
      var unique = _.uniq(item, true, function (ele) {
        return ele.id
      }) //  去除数组中id相同的重叠项
      DownloadAlbum.add(unique)
      that.imageList.length = 0
    },
    getLoadingInfo (showLoading) {
      var that = this
      that.showLoading = showLoading
    }
  },
  components: {
    UiButton,
    UiIconButton,
    VLoading
  }
}
</script>
