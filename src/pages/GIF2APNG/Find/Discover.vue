<template>
  <section  class="page page-app-doc">
      <div class="page__toolbar page__toolbar-app-doc">
        <div class="page__toolbar-app-doc__children__router navigation">
          <dl>
              <router-link to="/Gmagon Gif/Find/recommendation"><dd :class="{choosed: topName =='recommendation'}">{{$t("pages.discover.toolbar.recommendation")}}</dd></router-link>
              <router-link to="/Gmagon Gif/Find/classification"><dd :class="{choosed: topName =='classification'}">{{$t("pages.discover.toolbar.classification")}}</dd></router-link>
              <router-link to="/Gmagon Gif/Find/material"><dd :class="{choosed: topName =='material'}">{{$t("pages.discover.toolbar.pictureMaterial")}}</dd></router-link>
              <router-link to="/Gmagon Gif/Find/topRank"><dd :class="{choosed: topName =='topRank'}">{{$t("pages.discover.toolbar.topRanking")}}</dd></router-link>
          </dl>
        </div>
        <router-view></router-view>
      </div>
  </section>
</template>
<script>
////////////////////////////////////////////////////////

export default {
  name:'navigation',
  computed: {
    topName() {
      var that = this
      let path = that.$route.path
      path = path.substr(path.lastIndexOf('/') + 1)
      return path
    }
  }
}
</script>