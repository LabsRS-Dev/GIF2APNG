<template>
    <div class="children__router__content__recommendation">
        <div class="children__router__content__recommendation__slideshow">
            <swiper :options="swiperOption" ref="mySwiper" v-show="showSlideLoading">
                <swiper-slide v-for="ele in slideList" :key="ele.id"><img :src="ele.thumb"></swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
            <div class="children__router__content__recommendation__slideshow__loading" v-show="!showSlideLoading">
                <v-loading></v-loading>
            </div>
        </div>
        <div class="children__router__content__recommendation__showImage">
            <span class ="children__router__content__recommendation__showImage__title">{{$t('pages.discover.recommend.types')}}</span>
            <dl v-show="showImgLoading">
                <image-cover
                    :imageName="item.name" :img-src="item.image" :img-url="item.imgUrl"
                    :introduce="item.introduce" :previewCount="item.previewCount"
                    :shareCount="item.shareCount" :downloadCount="item.downloadCount"
                    :collectionCount="item.collectionCount" :url="item.urlPostfix"
                    v-for="item in imageList" v-show="$route.path.match(/recommendation/)"
                    :key="item.id"
                    >
                </image-cover>
            </dl>
            <div class="children__router__content__recommendation__showImage__loading" v-show="!showImgLoading">
                <v-loading></v-loading>
            </div>
        </div>
    </div>
</template>
<script>
import ImageCover from './imageCover.vue'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { _ } from 'dove.max.sdk'
import { Transfer } from '../../../bridge/transfer'
import VLoading from './loading.vue'
require('swiper/dist/css/swiper.css')

const taskPrefix = 'children-recommendation-image-id-' + _.now()
class Listbox {
  constructor (
    name,
    image,
    imgUrl,
    introduce,
    previewCount,
    shareCount,
    downloadCount,
    collectionCount,
    urlPostfix
  ) {
    this.id = _.uniqueId(taskPrefix)
    this.name = name // 图像文件名称
    this.image = image // 图像文件的缩略图
    this.imgUrl = imgUrl // 图像文件的路径
    this.introduce = introduce // 图片文件的描述
    this.previewCount = previewCount // 图片文件浏览次数
    this.shareCount = shareCount // 图片文件分享次数
    this.downloadCount = downloadCount // 图片文件下载次数
    this.collectionCount = collectionCount // 图片文件收藏次数
    this.urlPostfix = urlPostfix // 图片文件跳转地址后缀
  }
}
//
const slidePrefix = 'children-recommendation-slide-id-' + _.now()
class Slidebox {
  constructor (thumb, introduce) {
    this.id = _.uniqueId(slidePrefix)
    this.thumb = thumb // 图像文件的路径
    this.introduce = introduce // 图片文件的描述
  }
}
//
var imageList = []
var hasInited = false
//
var slideList = []
var slideFormat = []
var recommendList = []

export default {
  data () {
    return {
      imageList: imageList,
      slideList: slideList,
      slideFormat: slideFormat,
      recommendList: recommendList,
      showImgLoading: false,
      showSlideLoading: false,
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
          slideShadows: true
        }
      }
    }
  },
  computed: {
    swiper () {
      var that = this
      return that.$refs.mySwiper.swiper
    }
  },
  mounted () {
    var that = this
    if (!hasInited) {
      hasInited = true
      Transfer.http.call(
        'get.data_sys_push',
        { where: { name: 'default.sys.push.recommend.carousel.data' } },
        info => {
          _.each(info.data, function (ele) {
            that.slideFormat = JSON.parse(ele.content)
          })
          _.each(that.slideFormat, function (ele) {
            var fileThunb = ele.thumb
            var fileIntroduce = ele.description
            const slideObj = new Slidebox(fileThunb, fileIntroduce)
            that.slideList.push(slideObj)
          })
          that.swiper.slideTo(2, 1000, false)
          that.showSlideLoading = !that.showSlideLoading
        }
      )
      Transfer.http.call(
        'get.data_sys_push',
        { where: { name: 'default.sys.push.recommend.sets.data' } },
        info => {
          _.each(info.data, function (ele) {
            that.recommendList = JSON.parse(ele.content)
            var str_tmp = ' id in (' + that.recommendList.join(',') + ')'
            //
            var tmp_where = {
              where: str_tmp
            }
            // format the where = options {}
            Transfer.http.call('get.data_sets', tmp_where, info => {
              _.each(info.data, function (ele) {
                var fileName = ele.name
                var fileImage = ele.thumb
                var fileImgUrl = ele.url
                var fileIntroduce = ele.description
                var filePreviewCount = ele.preview_quantity
                var fileShareCount = ele.share_quantity
                var fileDownloadCount = ele.download_quantity
                var fileCollectionCount = ele.collection_quantity
                var fileUrlPostfix = ele.id
                const imageObj = new Listbox(
                  fileName,
                  fileImage,
                  fileImgUrl,
                  fileIntroduce,
                  filePreviewCount,
                  fileShareCount,
                  fileDownloadCount,
                  fileCollectionCount,
                  fileUrlPostfix
                )
                that.imageList.push(imageObj)
              })
            })
          })
          that.showImgLoading = !that.showImgLoading
        }
      )
    }
  },
  methods: {},
  components: {
    ImageCover,
    swiper,
    swiperSlide,
    VLoading
  }
}
</script>
