import About from '../../../src/pages/About.vue'
import { BS } from 'dove.max.sdk'

describe('test About.vue', () => {
  it('组件加载后，appName', () => {
    const name = BS.b$.App.getAppName() || 'GMagon GIF'
    expect(About.data().appName).toEqual(name)
  })
  it('组件加载后，version', () => {
    const edition = BS.b$.App.getAppVersion() || '20171210.10.35'
    expect(About.data().version).toEqual(edition)
  })
  it('组件加载后，companyName', () => {
    const vendor = BS.b$.App.getVendorName() || 'GMagon'
    expect(About.data().companyName).toEqual(vendor)
  })
  it('组件加载后，companyWebsiteHomepage', () => {
    const webSiteURL = BS.b$.App.getVendorWebSiteURL() || 'https://gmagon.com'
    expect(About.data().companyWebsiteHomepage).toEqual(webSiteURL)
  })
  it('组件加载后，homepage', () => {
    const homeURL = BS.b$.App.getHomePageURL() || 'https://gmagon.com/products/store/gmagon_gif/index.html'
    expect(About.data().homepage).toEqual(homeURL)
  })
  it('组件加载后，support', () => {
    const supportURL = BS.b$.App.getSupportPageURL() || 'http://gmagon.com/support'
    expect(About.data().support).toEqual(supportURL)
  })
  it('组件加载后，imgIcon应该是images/logo_64x64.png', () => {
    expect(About.data().imgIcon).toEqual('images/logo_64x64.png')
  })
})
