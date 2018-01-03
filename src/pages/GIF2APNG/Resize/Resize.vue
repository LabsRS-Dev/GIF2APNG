<template>
  <section class="page page-app-doc">
    <div class="page__examples page__examples-app-doc">
        <div class="page__examples-app-doc__resize__content">
            <div class="page__examples-app-doc__resize__title-top">{{$t('pages.resize.title.top')}}</div>
            <div class="page__examples-app-doc__resize__title-botton">{{$t('pages.resize.title.botton')}}</div>
            <div class="page__examples-app-doc__resize__button">
                <ui-button
                    @click="onToolBtnClick(index, item)"
                    type="secondary"
                    :key="item.id"
                    v-if="item.visiable"
                    v-for="(item, index) in actionList"
                    >
                        <img :src='item.icon' width="64" height="64" viewBox="0 0 64 64"/>
                        <span class="page__examples-app-doc__resize__button__size">{{ $t(item.tooltip) }}</span>
                </ui-button>            
            </div>            
        </div>
        <div class="page__examples-app-doc__resize__content-router">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </div>
    </div>
  </section>
</template>

<script>
import {UiButton} from 'keen-ui';
import IconsRef from '../../../data/icon.js'

export default{
    data(){
        return {
            singleIcon:IconsRef.iconSet.process_single,
            batchIcon:IconsRef.iconSet.process_batch,
            normalIcon:IconsRef.iconSet.process_normal
        }
    },
    computed:{
        actionList() {
           var that = this
           return [
                {id:'action-single', visiable:true, icon:that.singleIcon, type:"secondary",tooltip:"pages.resize.content.tooltip_single"},
                {id:'action-batch', visiable:true, icon:that.batchIcon, type:"secondary",tooltip:"pages.resize.content.tooltip_batch"},
                // {id:'action-normal', visiable:true, icon:that.normalIcon, type:"secondary",tooltip:"pages.resize.content.normal_batch"}
           ]
        }
    },
    methods:{
        onToolBtnClick(index, item){
            console.log('onToolBtnClick', index)
            if(item.id === 'action-single') {
                this.onBtnSingleFilesClick()
            }else if (item.id === 'action-batch') {
                this.onBtnBatchFilesClick()
            }else if (item.id === 'action-normal') {
                this.onBtnNormalFilesClick()
            }
        }, 
        onBtnSingleFilesClick(){
            var that = this
            that.$router.push({name:'Resize_Single'})
        },
        onBtnBatchFilesClick(){
            var that = this
            that.$router.push({name:'Resize_Batch'})
        },
        onBtnNormalFilesClick(){
            var that = this
            that.$router.push({name:'Resize_Normal'})           
        }
    },
    components: {
        UiButton
    }
}
</script>
