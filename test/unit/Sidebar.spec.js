import Sidebar from '../../src/pages/Sidebar.vue'

describe('test Sidebar.vue', () => {
  it('组件加载后，appName应该是Gmagon Gif', () => {
    expect(Sidebar.data().appName).toEqual('GMagon Gif')
  })
  it('组件加载后，version应该是2.0.0', () => {
    expect(Sidebar.data().version).toEqual('2.0.0')
  })
  it('组件加载后，homepage应该是https://gmagon.com/products/store/gmagon_gif/index.html', () => {
    expect(Sidebar.data().homepage).toEqual('https://gmagon.com/products/store/gmagon_gif/index.html')
  })
})
