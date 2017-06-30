<template>
    <dd class="children__recommendation__showImage__imageCover" @click="">
      <img v-bind:src="imgSrc">
    </dd>
</template>
<script >


export default {
  name: 'image-cover',
  props: {
    imgSrc: {
      required: true
    },
    image:String
  },
  data () {
    return {

    }
  },
  components:{

  }
}
</script>
