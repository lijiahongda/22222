// page/payment/component/moneyPsw/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    password: '',
    passwordR: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 右上角关闭
    closeMyself() {
      this.triggerEvent('closealert', '')
    },
    // 下一步
    nextAlert() {
      if (this.data.password.length != 6) {
        wx.showToast({
          title: '请输入6位密码',
          icon: 'none',
          duration: 2000
        })
        return
      }
      this.triggerEvent('into', this.data.password)
      // this.triggerEvent('nextCom', 2)
    },
    // 输入密码
    setPsw(e) {
      this.setData({
        password: e.detail.value
      })
    },
    // 忘记密码点击事件
    paswj(){
      this.triggerEvent('nextCom', 0)
    }
  }
})
