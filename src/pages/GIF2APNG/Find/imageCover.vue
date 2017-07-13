<template>
  <dd class="children__recommendation__showImage__imageCover" @click="$router.push({name:'ImageList', params: { id : url, attributes:{img: imgSrc}}})">
      <div class="showImage__imageCover__viewCount">
        <span class="showImage__imageCover__viewCount__icon"><i class="fa fa-eye fa-lg"></i></span>
        <span class="showImage__imageCover__viewCount__content">{{viewCount}}</span>
      </div>
      <img v-bind:src="imgSrc">
      <span class="showImage__imageCover__introduce">{{introduce}}</span>
    </dd>
</template>
<script >


export default {
  props: {
    imgSrc: {
      required: true
    },
    introduce: {
      required: true
    },
    viewCount: {
      default: 0
    },
    url:{
      default:''
    },
    imageName:String
  },
  data () {
    return {

    }
  },
  components:{

  }
}
</script>
