import Convert from '../../../src/pages/GIF2APNG/Convert.vue'

describe('test Convert.vue', () => {
  it('组件加载后，data', () => {
    expect(typeof (Convert.data)).toBe('function')
    expect(typeof (Convert.data().enableOverWriteOutput)).toBe('boolean')
  })
  it('组件加载后，actionList数量', () => {
    expect(Convert.computed.actionList().length).toEqual(6)
  })
})
