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
    price: '',
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
      if (this.data.price=='') {
        wx.showToast({
          title: '金额不能为空',
          icon: 'none',
          duration: 2000
        })
        return
      }
      this.triggerEvent('closealert', '')
      // this.triggerEvent('nextCom', 2)
    },
    // 输入密码
    setPre(e) {
      this.setData({
        price: e.detail.value
      })
    }
  }
})
