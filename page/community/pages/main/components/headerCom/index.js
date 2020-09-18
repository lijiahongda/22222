// page/community/pages/main/components/headerCom/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 用户名字
    nickName:{
      type: String,
      value: ''
    },
    // 用户头像
    litpic: {
      type: String,
      value: ''
    },
    // 等级图标
    memberImg: {
      type: String,
      value: ''
    },
    // 会员等级
    memberType: {
      type: String,
      value: ''
    },
    bgcolor:{
      type:'',
      value:''
    },
    headerTitle:{
      type: '',
      value: ''
    },
    isGroup:{
      type: '',
      value: ''
    },
    ERM: {
      type: Boolean,
      value: ''
    },
    member_count: {
      type: '',
      value: ''
    },
    clickCount: {
      type: '',
      value: ''
    },
    qrCode: {
      type: '',
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    top:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 初始化
    Initialization(){
      console.log(this.data.ERM)
      this.navTop((res) => {
        console.log(res)
        this.setData({
          top: res.navTop
        })
      })
    },
    zbackPage(){
      var pages = getCurrentPages();
      var pagelength = pages.length
      console.log(pagelength)
      if (pagelength>=2){
        wx.navigateBack({
          delta: 1
        })
      }
    },
    // 自定义导航头部高度计算
    navTop: function (callback) {
      let that = this
      let menuButtonObject = wx.getMenuButtonBoundingClientRect();
      wx.getSystemInfo({
        success: res => {
          let statusBarHeight = res.statusBarHeight,
            navTop = (menuButtonObject.top * 2) + 8, //胶囊按钮与顶部的距离
            navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2; //导航高度
          callback({
            navTop: navTop
          })
        },
        fail(err) {
          console.log(err);
        }
      })
    },
    show(){
      this.triggerEvent('show',{model:true})
    }
  }
})
