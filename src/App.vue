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
                    v-if="$route.path.match(/Find/) || $route.path.match(/Search/)"
                    >
                        <div class="toolbar-search-wrap toolbar-search-desktop toolbar-search-light">
                            <input class="toolbar-search-input"
                                id="inputID"
                                type='text' placeholder='Search'
                                @focus="showHotSearch=true"
                                @blur="showHotSearch=false"
                                v-model="lastInputValue"
                                @keypress="getInputValues()"
                            >
                            <div class='toolbar-search-actions'>
                                <button class='toolbar-search-clear' @click="onClearInputValue()"></button>
                            </div>
                            <div class="dove-docs-content__toolbar-search__placeholder">
                                <div class="search__placeholder__icon"><i class="fa fa-search fa-lg fa-fw"></i></div>
                                <div class="search__placeholder__content">{{$t('routes.common.menu.search.title')}}</div>
                            </div>
                        </div>
                        <div class="dove-docs-content__toolbar-search__hotSearch" v-show = "showHotSearch">
                            <div class="dove-docs-content__toolbar-search__hotSearch__title">
                                <span class="hotSearch__title__name">{{$t('routes.common.menu.search.info')}}</span>
                            </div>
                            <div class="dove-docs-content__toolbar-search__hotSearch__content" v-for="(item,index) in searchRecordList" @click="chooseInputValue(item)">
                                <span class="hotSearch__content__number">{{index + 1}}</span>
                                <span class="hotSearch__content__name">{{item}}</span>
                            </div>
                        </div>
                </div>
            </div>
            <div class="dove-docs-content__page-content" ref="pageContent">
                <router-view :params="inputValue"></router-view>
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


//// 与设置相关的处理
class Search {
    static key = "search-page-setting"

    static result = null
    static shareResult(){
        if (!Search.result){
            Search.result = new Search()
        }
        return Search.result
    }

    constructor(){
        this.data = {
            searchList: [],
            lastSelectInputValue: "",
            maxSaveInputValueCount: 10
        }
    }

    restore(){
        var ls = window.localStorage
        var local = {}
        if(ls){
            var str = ls.getItem(Search.key)
            if(_.isString(str)){
                local = JSON.parse(str)
                this.data = _.extend(this.data, local)
            }
        }
    }

    save(){
        var ls = window.localStorage;
        if(ls){
            ls.setItem(Search.key, JSON.stringify(this.data))
        }
    }
}

var $LS$ = Search.shareResult()

    export default {
        data() {
            return {
                showSidebar: false,
                showHotSearch:false,
                showTip: false,
                appName:SysConfig.appName,
                searchRecordList:$LS$.data.searchList,
                lastInputValue:$LS$.data.lastSelectInputValue,
                inputValue:''
            }
        },
        beforeCreate(){
            var that = this
            console.log('App.Vue');
            $LS$.restore()
        },
        beforeDestroy() {
            this.saveSearchInputValue()
        },
        methods:{
            autoShowTip(){
                var that = this
                that.showTip = !that.showTip
            },
            onClearInputValue(){
                var that = this
                document.querySelector('.toolbar-search-clear').parentNode.previousElementSibling.value = ''
            },
            getInputValues(e){
                var that = this
                if(event.keyCode==13){
                    if(that.lastInputValue !== ""){
                        var lastValue = that.lastInputValue.toLocaleLowerCase().replace(/\s+/,' ')
                        that.inputValue=that.lastInputValue
                        if(that.searchRecordList.indexOf(lastValue) == -1){
                            that.searchRecordList.unshift(lastValue)
                            that.lastInputValue = ''
                            if(that.searchRecordList.length > $LS$.data.maxSaveInputValueCount){
                                that.searchRecordList.splice($LS$.data.maxSaveInputValueCount, 1)
                            }
                        }else{
                            that.lastInputValue = ''
                        }
                    }
                    that.searchInputValue(that.inputValue)
                    that.saveSearchInputValue()
                    var input = document.getElementById("inputID")
                    input.blur()
                    return false
                }
            },
            searchInputValue(){
                var that = this
                that.$router.push({name:'Single'})
            },
            saveSearchInputValue(){
                var  that = this
                $LS$.data.searchList = that.searchRecordList
                $LS$.save()
            },
            chooseInputValue(item){
                var that = this
                that.lastInputValue = item
            }
        },
        computed: {
            topName() {
                let path = this.$route.path
                path = path.substr(path.lastIndexOf('/') + 1)
                return path
            }
        },
        components: {
            VueI18n,
            UiIcon,
            UiButton,
            UiIconButton,
            UiTextbox,
            Sidebar
        }
    }
</script>

<style lang="scss">
    @import './styles/index.scss'
</style>