<template>
  <section class="page page-app-doc">
    <div class="page__examples page__examples-app-doc">
        <div class="page__examples-app-doc__convert__content">
            <div class="page__examples-app-doc__convert__title-top">{{$t('pages.convert.title.top')}}</div>
            <div class="page__examples-app-doc__convert__title-botton">{{$t('pages.convert.title.botton')}}</div>
            <div class="page__examples-app-doc__convert__button">
                <ui-button
                    @click="onToolBtnClick(index, item)"
                    type="secondary"
                    :key="item.id"
                    v-if="item.visiable"
                    v-for="(item, index) in actionList"
                    >
                        <img :src='item.icon' width="64" height="64" viewBox="0 0 64 64"/>
                        <span class="page__examples-app-doc__convert__button__size">{{ $t(item.tooltip) }}</span>
                </ui-button>            
            </div>            
        </div>
        <div class="page__examples-app-doc__convert__content-router">
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
import { SysConfig } from '../../../data/sys-config.js'

export default{
    data(){
        return {
            gif2apngIcon:IconsRef.iconSet.gif2apng,
            apng2gifIcon:IconsRef.iconSet.apng2gif,
            rootID:SysConfig.appID,
            showGif2Apng:true,
            showApng2Gif:true
        }
    },
    computed:{
        actionList() {
            var that = this
            if (that.rootID === 'com.gmagon.app.macos.gmagongif' || that.rootID === 'com.romanysoft.app.macos.giftools' || that.rootID === 'com.romanysoft.app.macos.xdebugapp') {
                that.showGif2Apng = true
                that.showApng2Gif = true
            } else if (that.rootID === 'com.romanysoft.app.macos.APNGToGifConverter') {
                that.showGif2Apng = false
                that.showApng2Gif = true
            } else if (that.rootID === 'com.romanysoft.app.macos.GifToAPNGConverter'){
                that.showGif2Apng = true
                that.showApng2Gif = false
            }
            return [
                 {id:'action-gif2apng', visiable:that.showGif2Apng, icon:that.gif2apngIcon, type:"secondary",tooltip:"pages.convert.content.tooltip_gif2apng"},
                 {id:'action-apng2gif', visiable:that.showApng2Gif, icon:that.apng2gifIcon, type:"secondary",tooltip:"pages.convert.content.tooltip_apng2gif"}
            ]
        }
    },
    methods:{
        onToolBtnClick(index, item){
            console.log('onToolBtnClick', index)
            if(item.id === 'action-gif2apng') {
                this.onBtnGifToApngClick()
            }else if (item.id === 'action-apng2gif') {
                this.onBtnApngToGifClick()
            }
        }, 
        onBtnApngToGifClick(){
            var that = this
            that.$router.push({name:'Convert_apng2gif'})
        },
        onBtnGifToApngClick(){
            var that = this
            that.$router.push({name:'Convert_gif2apng'})
        }               
    },
    components: {
        UiButton
    }
}
</script>
