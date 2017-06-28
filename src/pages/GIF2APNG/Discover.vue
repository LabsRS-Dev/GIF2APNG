<template>
  <section class="page page-app-doc">
    <div class="page__toolbar page__toolbar-app-doc">
      <ui-tabs
        :type="text"
        fullwidth
        >
        <ui-tab
          @click = "onToolBtnClick(index,item)"
          :key="item.id"
          :title ="$t(item.tooltip)"
          v-if="item.visiable"
          v-for="item, index in actionList"
          >
        </ui-tab>
      </ui-tabs>
    </div>
    <div class="page__examples page__examples-app-doc">

    </div>
  </section>
</template>

<script>
import { BS, Util, _ } from 'dove.max.sdk'
import {UiIcon, UiTabs, UiTab, UiConfirm, UiButton, UiIconButton, UiAlert, UiToolbar, UiProgressLinear} from 'keen-ui';
import {Transfer} from '../../bridge/transfer'
import {SysConfig} from '../../data/sys-config'

////////////////////////////////////////////////////////

export default {
  data(){
    return {

    }
  },

  beforeCreate(){

  },

  mounted(){

  },

  computed: {
    actionList() {
      var that = this
      return [
        {id:'action-recommendation', visiable:true, tooltip:"pages.discover.toolbar.recommendation"},
        {id:'action-classification', visiable:true, tooltip:"pages.discover.toolbar.classification"},
        {id:'action-material',visiable:true, tooltip:"pages.discover.toolbar.pictureMaterial"},
        {id:'action-hot', visiable:true, tooltip:"pages.discover.toolbar.topRanking"}
      ]
    }
  },

  methods:{
    // -------------------------- Tool bar
    onToolBtnClick(index, item){
      console.log('onToolBtnClick', index)

      if(item.id === 'action-recommendation') {
          this.onBtnRecommendationClick()
      }else if (item.id === 'action-classification') {
          this.onBtnClassificationClick()
      }else if (item.id === 'action-material') {
          this.onBtnPictureMaterialClick()
      }else if (item.id === 'action-hot') {
          this.onBtnTopRankingClick()
      }
    },
    onBtnRecommendationClick(){
      var that = this
      console.log("---------------")

    },
    onBtnClassificationClick(){
      var that = this

    },
    onBtnPictureMaterialClick(){
      var that = this

    },
    onBtnTopRankingClick(){
      var that = this

    }
  },

  components: {
      UiIcon,
      UiTabs,
      UiTab,
      UiButton,
      UiIconButton,
      UiAlert,
      UiToolbar,
      UiConfirm,
      UiProgressLinear
  }
}


</script>