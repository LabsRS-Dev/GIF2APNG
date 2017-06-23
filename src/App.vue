<template>
  <!-- app -->
  <div id="app" class="dove-docs">
        <Sidebar class="is-desktop"></Sidebar>

        <transition name="transition-fade">
            <div
                class="dove-docs-mobile-sidebar__backdrop"
                @click="showSidebar = false"
                v-show="showSidebar"
            ></div>
        </transition>

        <transition name="transition-slide">
            <sidebar class="is-mobile" v-show="showSidebar"></sidebar>
        </transition>

        <section class="dove-docs-content">
            <div class="dove-docs-content__toolbar">
                <div class="dove-docs-content__toolbar-content">
                    <ui-icon-button
                        class="dove-docs-content__toolbar-menu-button"
                        color="white"
                        icon="≡"
                        type="clear"

                        @click="showSidebar = true"
                    ></ui-icon-button>

                    <h1
                        class="dove-docs-content__toolbar-title"
                        @mouseenter="autoShowTip()"
                        @mouseleave="autoShowTip()"
                        >
                        {{ $t($route.meta.title) }}
                    </h1>
                    <transition name="toolbar-title__sub_fade">
                        <p class="dove-docs-content__toolbar-title__sub"
                            v-show="$route.meta.tipAsSubTitle && showTip"
                        > >> {{ $t($route.meta.tip) }}</p>
                    </transition>

                    <a
                        class="dove-docs-content__toolbar-action"
                        rel="noopener"
                        target="_blank"
                        :href="'https://github.com/JosephusPaye/Keen-UI/blob/master/' + $route.meta.sourceUrl"
                        v-if="$route.meta.sourceUrl"
                    >View Source</a>
                </div>
                <div
                    class="dove-docs-content__toolbar-search"
                    v-if="$route.path == '/' + appName +'/Discover'"
                    >
                        <ui-textbox
                            v-model="searchContent"
                            @focus="startMoveing()"
                            @blur="startMoveing()"
                            >
                        </ui-textbox>
                        <transition name="icon-slide-fade" mode="out-in">
                            <span class="search__placeholder__icon" v-if="moveingIcon"><i class="fa fa-search fa-lg fa-fw"></i></span>
                        </transition>
                        <transition name="content-slide-fade" mode="out-in">
                            <span class="search__placeholder__content" v-if="moveingIcon">{{$t('routes.common.search')}}</span>
                        </transition>
                        <span class="search__placeholder__icon__left"  v-if="!moveingIcon"><i class="fa fa-search fa-lg fa-fw"></i></span>
                        <span class="search__placeholder__content__left"  v-if="!moveingIcon">{{$t('routes.common.search')}}</span>
                </div>
            </div>
            <div class="dove-docs-content__page-content" ref="pageContent">
                <router-view></router-view>
            </div>
        </section>
  </div>
</template>

<script>
    import VueI18n from 'vue-i18n'
    import {UiIcon,UiButton,UiIconButton,UiTextbox} from 'keen-ui'
    import { SysConfig } from './data/sys-config.js'
    import Sidebar from './pages/Sidebar.vue'


    export default {
        data() {
            return {
                showSidebar: false,
                showTip: false,
                searchContent:'',
                appName:SysConfig.appName,
                moveingIcon:true,
            }
        },

        computed: {

        },

        methods:{
            autoShowTip(){
                var that = this
                that.showTip = !that.showTip
            },
            startMoveing(){
                var that = this
                that.moveingIcon = !that.moveingIcon
            }
        },
        components: {
            VueI18n,
            UiIcon,
            UiButton,
            UiIconButton,
            UiTextbox,
            Sidebar
        },

        beforeCreate(){
            console.log('App.Vue');
        }

    }
</script>

<style lang="scss">
    @import './styles/index.scss'
</style>