import Welcome from '../../src/pages/GIF2APNG/Welcome.vue'

describe('test Welcome.vue', () => {
  it('组件加载后，availableLanguageList应该包含English和简体中文', () => {
    expect(Welcome.data().availableLanguageList).toContain('English')
    expect(Welcome.data().availableLanguageList).toContain('简体中文')
  })
  it('组件加载后，actionList数量', () => {
    expect(Welcome.computed.actionList().length).toEqual(4)
  })
})
