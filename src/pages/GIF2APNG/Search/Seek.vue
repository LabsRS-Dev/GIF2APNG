<template>
  <section  class="page page-app-doc">
      <h4>搜索<span class="page__toolbar-app-doc__searchname">"{{params}}"</span><span>,共找到{{}}{{tail[topName]}}</span></h4>
      <div class="page__toolbar page__toolbar-app-doc">
        <div class="page__toolbar-app-doc__children__router navigation">
          <dl>
              <router-link :to="{name:'Single'}"><dd :class="{choosed: topName == 'Single'}">单个图片</dd></router-link>
              <router-link :to="{name:'Album'}"><dd :class="{choosed: topName == 'Album'}">图片专辑</dd></router-link>
          </dl>
        </div>
      </div>
      <div class="page__examples page__examples-app-doc">
        <div class="page__toolbar-app-doc__children__router__content">
          <router-view></router-view>
        </div>
      </div>
  </section>
</template>
<script>

  export default{
    props: ['params'],
    data(){
      return{
        tail:{
          'Single':'张图片',
          'Album':'个图集'
        }
      }
    },
    computed:{
      topName() {
        let path = this.$route.path
        path = path.substr(path.lastIndexOf('/') + 1)
        return path
      }
    }
  }
</script>
