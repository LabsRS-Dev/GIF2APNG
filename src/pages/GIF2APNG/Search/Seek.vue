<template>
  <section  class="page page-app-doc">
      <h4>{{$t('pages.search.content.search')}}
        <span class="page__toolbar-app-doc__searchname">"{{inputValue}}"</span>
        <span>{{$t('pages.search.content.find')}}</span>
        <span class="page__toolbar-app-doc__space">{{dataType}}</span>
        <span>{{tail[topName]}}</span>
      </h4>
      <div class="page__toolbar page__toolbar-app-doc">
        <div class="page__toolbar-app-doc__children__router navigation">
          <dl>
              <router-link :to="{name:'Single'}"><dd :class="{choosed: topName == 'Single'}">{{$t('pages.search.content.img')}}</dd></router-link>
              <router-link :to="{name:'Album',params:{attributes:{input:inputValue}}}"><dd :class="{choosed: topName == 'Album'}">{{$t('pages.search.content.collection')}}</dd></router-link>
          </dl>
        </div>
      </div>
      <div class="page__examples page__examples-app-doc">
        <div class="page__toolbar-app-doc__children__router__content">
          <keep-alive>
            <router-view @data-info="getDataInfo" :getValue="inputValue"></router-view>
          </keep-alive>
        </div>
      </div>
  </section>
</template>
<script>
  var dataType;
  export default{
    props: ['inputValue'],
    data(){
      return{
        dataType:dataType,
        tail:{
          'Single':'',
          'Album':''
        }
      }
    },
    methods:{
      getDataInfo(type){
        var that = this
        that.dataType = type
      }
    },
    computed:{
      topName() {
        var that = this
        let path = that.$route.path
        path = path.substr(path.lastIndexOf('/') + 1)
        that.tail.Single = that.$t('pages.search.content.img')
        that.tail.Album = that.$t('pages.search.content.collection')
        return path
      }
    }
  }
</script>
