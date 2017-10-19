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
            <router-view :getValue="inputValue" :getBus="bus"></router-view>
          </keep-alive>
        </div>
      </div>
  </section>
</template>
<script>
  var albumInfo;
  var dataType;
  var hasInited = false;
  export default{
    props:{
      inputValue:String,
      getDataType:Number,
      bus:{
        type: Object,
        default: null
      }
    },
    data(){
      return{
        albumInfo:albumInfo,
        dataType:dataType,
        tail:{
          'Single':'',
          'Album':''
        }
      }
    },
    methods:{
      getAlbumDataInfo(){
        var that = this
        var stt_tmp = "description like '%" +that.inputValue+ "%'"
        var tmp_where = {
            "where": stt_tmp,
            "page" :1,
            "per_page":20
        }
        Transfer.http.call('get.data_sets',tmp_where,(info) => {
            that.albumInfo = info
            that.dataType = info.paginate.total
            console.log(that.albumInfo)
            that.bus.$emit('to-album-data',that.albumInfo)
        })
      }
    },
    computed:{
      topName() {
        var that = this
        let path = that.$route.path
        that.dataType = that.getDataType
        path = path.substr(path.lastIndexOf('/') + 1)
        that.tail.Single = that.$t('pages.search.content.img')
        that.tail.Album = that.$t('pages.search.content.collection')
        return path
      }
    },
    watch:{
        topName(newVal) {
          var that = this
          let path = that.$route.path
          if(path.match(/Album/)){
            that.getAlbumDataInfo()
          }
        }
    }
  }
</script>
