import Sidebar from '../../../src/pages/Sidebar.vue'
import { BS } from 'dove.max.sdk'

describe('test Sidebar.vue', () => {
  it('组件加载后，appName', () => {
    const name = BS.b$.App.getAppName() || 'GMagon GIF'
    expect(Sidebar.data().appName).toEqual(name)
  })
  it('组件加载后，version', () => {
    const edition = BS.b$.App.getAppVersion() || '20171210.10.35'
    expect(Sidebar.data().version).toEqual(edition)
  })
  it('组件加载后，homepage', () => {
    const homeURL = BS.b$.App.getHomePageURL() || 'https://gmagon.com/products/store/gmagon_gif/index.html'
    expect(Sidebar.data().homepage).toEqual(homeURL)
  })
})
