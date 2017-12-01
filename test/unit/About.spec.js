import About from '../../src/pages/About.vue'

describe('test Sidebar.vue', () => {
  it('组件加载后，appName应该是Gmagon Gif', () => {
    expect(About.data().appName).toEqual('GMagon Gif')
  })
  it('组件加载后，version应该是2.0.0', () => {
    expect(About.data().version).toEqual('2.0.0')
  })
  it('组件加载后，appReleaseDate应该是2017/06/16', () => {
    expect(About.data().appReleaseDate).toEqual('2017/06/16')
  })
  it('组件加载后，companyName应该是GMagon', () => {
    expect(About.data().companyName).toEqual('GMagon')
  })
  it('组件加载后，companyWebsiteHomepage应该是https://gmagon.com', () => {
    expect(About.data().companyWebsiteHomepage).toEqual('https://gmagon.com')
  })
  it('组件加载后，homepage应该是https://gmagon.com/products/store/gmagon_gif/index.html', () => {
    expect(About.data().homepage).toEqual('https://gmagon.com/products/store/gmagon_gif/index.html')
  })
  it('组件加载后，support应该是http://gmagon.com/support', () => {
    expect(About.data().support).toEqual('http://gmagon.com/support')
  })
  it('组件加载后，imgIcon应该是images/logo_64x64.png', () => {
    expect(About.data().imgIcon).toEqual('images/logo_64x64.png')
  })
})
