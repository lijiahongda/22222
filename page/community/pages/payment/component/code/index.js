// page/payment/component/code/index.js
var Countdown
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
    userPhone:{
      value:'',
      type:''
    },
    userMsgIsNeed:{
      value: '',
      type: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 电话号
    phone:'',
    // 倒计时
    second:60,
    // code值
    codeValue:'',
    // 发送验证码开关
    sendSwitch:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 提供给父级的倒计时方法
    countdownFun(){
      if (this.data.sendSwitch){
        var reg = /(\d{3})\d{4}(\d{4})/;
        var tel = this.properties.userPhone.replace(reg, "$1****$2")
        this.setData({
          phone: tel,
        })
        // 刷新个人信息
        post('/app/auth/send', {"mobile": this.properties.userPhone}, (res) => {
          if (res.data.code == 200) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
            this.setData({
              phone: tel,
              second: 60,
              sendSwitch:false
            })
            Countdown=setInterval(()=>{
              var second = this.data.second
              second--
              if (second==0){
                clearInterval(Countdown)
                this.setCode({
                  sendSwitch: true
                })
              }
              this.setData({
                second
              })
            },1000)
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 1)
      }
    },
    // 右上角关闭
    closeMyself(){
      if (this.properties.userMsgIsNeed==0){
        clearInterval(Countdown)
        this.triggerEvent('closealert', '子组件的数据')
      }
    },
    // 输入code
    setCode(e){
      this.setData({
        codeValue: e.detail.value
      })
    },
    // 下一步
    nextAlert(){
      if(this.data.codeValue==''){
        return
      }
      post('/app/member/balance/checkMobileCode', 
        {
          "mobile": this.properties.userPhone,   //手机号
          "verifyCode": this.data.codeValue,   // 验证码
          "areaCode": 86    
        }, 
      (res) => {
        if (res.data.code == 200) {
          clearInterval(Countdown)
          this.triggerEvent('nextCom',1)
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
    }
  }
})
