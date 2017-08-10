<template>
  <section  class="page page-app-doc">
      <div class="page__toolbar page__toolbar-app-doc">
        <div class="page__toolbar-app-doc__download__router nav">
          <dl>
              <router-link :to="{name:'Download_Single'}"><dd :class="{choosed: topName == 'Download_Single'}">{{$t('pages.download.content.img')}}</dd></router-link>
              <router-link :to="{name:'Download_Album'}"><dd :class="{choosed: topName == 'Download_Album'}">{{$t('pages.download.content.collection')}}</dd></router-link>
          </dl>
        </div>
      </div>
      <div class="page__examples page__examples-app-doc">
        <div class="page__toolbar-app-doc__download__router__content">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </div>
      </div>
  </section>
</template>

<script>
  export default{
    name:'nav',
    computed:{
      topName() {
        var that = this
        let path = that.$route.path
        path = path.substr(path.lastIndexOf('/') + 1)
        return path
      }
    },
    watch:{
    }
  }
</script>
