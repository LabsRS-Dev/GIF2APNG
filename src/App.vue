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
                    v-if="$route.path.match(/Find/)"
                    >
                        <div class="toolbar-search-wrap toolbar-search-desktop toolbar-search-light">
                            <input class="toolbar-search-input" type='text' placeholder='Search'>
                            <div class='toolbar-search-actions'>
                                <button class='toolbar-search-clear' @click="onClearInputValue()"></button>
                            </div>
                            <div class="dove-docs-content__toolbar-search__placeholder">
                                <div class="search__placeholder__icon"><i class="fa fa-search fa-lg fa-fw"></i></div>
                                <div class="search__placeholder__content">{{$t('routes.common.search')}}</div>
                            </div>
                        </div>
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
    import { BS, Util, _ } from 'dove.max.sdk'

    export default {
        data() {
            return {
                showSidebar: false,
                showTip: false,
                appName:SysConfig.appName
            }
        },

        computed: {

        },

        methods:{
            autoShowTip(){
                var that = this
                that.showTip = !that.showTip
            },
            onClearInputValue(){
                var that = this
                document.querySelector('.toolbar-search-clear').parentNode.previousElementSibling.value = ''
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