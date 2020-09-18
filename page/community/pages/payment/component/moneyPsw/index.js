// page/payment/component/moneyPsw/index.js
import {
  get,
  post,
  retrunScene,
  relations
} from '../../../../../../utils/util.js';
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userMsgIsNeed: {
      value: '',
      type: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    password:'',
    passwordR:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 右上角关闭
    closeMyself() {
      if (this.properties.userMsgIsNeed == 0) {
        this.triggerEvent('closealert', '子组件的数据')
      }
    },
    // 下一步
    nextAlert() {
      console.log(this.data.password.length)
      if (this.data.password.length != 6) {
        wx.showToast({
          title: '请输入6位密码',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (this.data.password != this.data.passwordR) {
        wx.showToast({
          title: '两次输入的密码不同',
          icon: 'none',
          duration: 2000
        })
        return
      }
      post('/app/member/balance/setBalancePwd',
        {
          "word": this.data.password,   //手机号
          "passWord": this.data.passwordR,   // 验证码
        },
        (res) => {
          if (res.data.code == 200) {
            wx.showToast({
              title: '修改成功',
              icon: 'none',
              duration: 2000
            })
            this.triggerEvent('closealert', '')
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          } 
        }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'),1,'aes')
    },
    // 输入密码
    setPsw(e){
      // console.log(e.detail.value.length)
      // if (e.detail.value.length>6){
      //   return
      // }
      this.setData({
        password: e.detail.value
      })
    },
    // 重复输入密码
    setPswR(e) {
      // if (e.detail.value.length >= 6) {
      //   return
      // }
      this.setData({
        passwordR: e.detail.value
      })
    }
  }
})
