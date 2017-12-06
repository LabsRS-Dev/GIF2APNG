<template>
  <section class="page page-app-doc">
    <div class="page__about__title">
      <h3>{{$t('pages.abouts.header.title')}}</h3>
    </div>
    <div class="page__about__body">
      <div class="page__about__feedback">
        <img :src='imgIcon'>
        <span class="page__about__title__matter">{{appName}}</span>
      </div>
      <div class="page__about__content__button">
        <ui-button
            raised
            size="small"
            type="secondary"
            @click="onHelpBtnClick"
            >
            {{$t('pages.abouts.buttons.title')}}
        </ui-button>
        <ui-button
            raised
            size="small"
            type="secondary"
            @click="onSupportBtnClick"
            >
            {{$t('pages.abouts.buttons.matter')}}
        </ui-button>
      </div>
      <div class="page__about__content__updata">
        <span class="page__about__content__release__new">
          {{$t('pages.abouts.releases.versions')}}
          <span class="page-about__release__overstriking">
            {{ version }}
          </span>
        </span>
      </div>
    </div>
    <div class="page__about__content__licenses">
      <span class="page-about__licenses__space">
        <span class="page-content__homepage__copyright">{{$t('pages.abouts.licenses.content')}}</span>
        <a class="page-content__homepage" target="_blank" :href="companyWebsiteHomepage">{{companyName}}</a>
        <span class="page-content__homepage__company">{{$t('pages.abouts.licenses.company')}}</span>
        <span class="page-content__homepage__reserved">{{$t('pages.abouts.licenses.reserved')}}</span>
      </span>
    </div>
  </section>
</template>

<script>
import { BS, Util, _ } from 'dove.max.sdk'
import {UiButton,UiTextbox,UiRadioGroup,UiSwitch} from 'keen-ui'
import Routes from './../routes.js'
import IconsRef from '../data/icon.js'

export default {
  data(){
    return {
        appName:  Routes.SysConfig.appName,
        version:  Routes.SysConfig.version,
        companyName:Routes.SysConfig.companyName,
        companyWebsiteHomepage:Routes.SysConfig.companyWebsiteHomepage,
        homepage:Routes.SysConfig.homepage,
        support:Routes.SysConfig.support,
        imgIcon:IconsRef.iconSet.reductIcon
    }
  },

  methods:{
    onHelpBtnClick(){
      BS.b$.App.open(this.homepage)
    },
    onSupportBtnClick(){
      BS.b$.App.open(this.support)
    }
  },

  components: {
        UiButton,
        UiTextbox,
        UiRadioGroup,
        UiSwitch
  }
}
</script>