<template>
    <div class="page__download__router__content__single">
        <div class="page__download__router__content__single__title">
            <ui-icon-button
                @click="onToolBtnClick(index, item)"
                :type="item.type"
                :size="item.size"
                :color="item.color"
                :key="item.id"
                v-if="item.visiable"
                v-for="(item, index) in actionList"
                >
                    <span :class="item.icon" :title="$t(item.tooltip)"></span>
            </ui-icon-button>
        </div>
    </div>
</template>
<script>
  import { BS, Util, _ } from 'dove.max.sdk'
  import {UiIcon, UiSelect, UiTabs, UiTab, UiConfirm, UiButton, UiIconButton, UiAlert, UiToolbar, UiProgressLinear,UiCheckbox} from 'keen-ui'

  export default{
    data(){
      return{
      }
    },
    mounted(){

    },
    computed:{
        actionList() {
          var that = this
          return [
            {id:'action-outputFolder', visiable:true, color:"primary", icon:"fa fa-folder fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.convert.toolbar.outputFolder"},
            {id:'action-remove', visiable:true, color:"black", icon:"fa fa-trash-o fa-lg fa-fw", size:"small", type:"secondary", tooltip:"pages.convert.toolbar.remove"},
          ]
        }
    },
    methods:{

    },
    components:{
      UiIcon,
      UiTabs,
      UiTab,
      UiButton,
      UiIconButton,
      UiAlert,
      UiToolbar,
      UiSelect,
      UiConfirm,
      UiProgressLinear,
      UiCheckbox
    }
  }
</script>
