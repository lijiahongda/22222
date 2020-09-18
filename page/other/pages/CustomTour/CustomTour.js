import { get, post,  } from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: [],
    currentTab: 0, //预设当前项的值
    items: [
      { name: '可调整', value: '可调整' }
    ],
    uid: '',
    token: '',
    url: '../../../../images/EntityCard/title.png',
    have: '#f4aa11',
    not: '#fff',
    ide: '私人订制',
    selcetTime: '游玩时间',

    departTime: '',//出发
    returnTime: '',//返回
    leavecity:'北京',
    aimcity:'',
    adjusttime:"",
    adultnum:'',
    childnum:'',
    budget:'',
    adjustbudget:'',
    color:'#ccc',
    isColor:true,
    list:[1,2,3],
    page:1,
    pageSize:10
  },
  CustomTourDetails:function(e){
    wx.navigateTo({
      url: '../../../yueMember/pages/CustomTourDetails/CustomTourDetails?customized_id='+e.currentTarget.dataset.id,
    })
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //起始地
  bindleavecity:function(e){
    this.setData({
      leavecity: e.detail.value
    })
  },
  //目的地
  bindaimcity:function(e){
    this.setData({
      aimcity: e.detail.value
    })
  },
  //游玩时间可调整
  checkboxadjusttime: function(e) {
    this.setData({
      adjusttime: e.detail.value
    })
  }, 
  //成人数量
  bindadultnum:function(e) {
    this.setData({
      adultnum: e.detail.value
    })
  },
  //儿童数量
  bindchildnum: function (e) {
    this.setData({
      childnum: e.detail.value
    })
  },
  //人均预算
  bindbudget: function (e) {
    this.setData({
      budget: e.detail.value
    })
  },
  //人均预算可调整
  checkboxadjustbudget: function (e) {
    // debugger
    this.setData({
      adjustbudget: e.detail.value
    })
  }, 
  complete:function(e){
    this.setData({
      adultnum: e.detail.value+'成人'
    })
  },
  clear:function(e){
    this.setData({
      adultnum: ''
    })
  },
  completeChild: function (e) {
    this.setData({
      childnum: e.detail.value + '儿童'
    })
  },
  clearChild: function (e) {
    this.setData({
      childnum: ''
    })
  },
  BlurBudget:function(e){
    this.setData({
      color:'#f4aa11',
      isColor:false
    })
  },
  title: function (e) {
    let val = e.currentTarget.dataset.title
    if (val == '私人订制') {
      this.setData({
        url: '../../../../images/EntityCard/title.png',
        have: '#f4aa11',
        not: '#fff',
        ide: val
      })
    } else if (val == '企业定制') {
      this.setData({
        url: '../../../../images/EntityCard/titleAfter.png',
        have: '#fff',
        not: '#f4aa11',
        ide: val
      })
    }
  },
  nextStepPrivate: function (e) {
    if (this.data.adjusttime == ''){
      this.setData({
        adjusttime:0
      })
    }else{
      this.setData({
        adjusttime: 1
      })
    }
    if (this.data.adjustbudget == '') {
      this.setData({
        adjustbudget: 0
      })
    } else {
      this.setData({
        adjustbudget: 1
      })
    }
    if (this.data.bindleavecity == undefined || this.data.bindleavecity == ''){
      this.setData({
        bindleavecity:'北京'
      })
    }
    if (this.data.bindleavecity == ''){
      wx.showToast({
        title: '起始地不能为空',
        icon: 'none',
        duration: 1000
      });
      return false
    }
    if (this.data.aimcity == '') {
      wx.showToast({
        title: '目的地不能为空',
        icon: 'none',
        duration: 1000
      });
      return false
    }
    if (this.data.departTime == '') {
      wx.showToast({
        title: '游玩时间不能为空',
        icon: 'none',
        duration: 1000
      });
      return false
    }
    if (this.data.adultnum == '') {
      wx.showToast({
        title: '成人数不能为空',
        icon: 'none',
        duration: 1000
      });
      return false
    }
    if (this.data.budget == '') {
      wx.showToast({
        title: '人均预算不能为空',
        icon: 'none',
        duration: 1000
      });
      return false
    }
    wx.navigateTo({
      url: 'Private/Private?ide=' + this.data.ide + '&leavecity=' + this.data.leavecity + '&aimcity=' + this.data.aimcity + '&adjusttime=' + this.data.adjusttime + '&adultnum=' + this.data.adultnum + '&childnum=' + this.data.childnum + '&budget=' + this.data.budget + '&adjustbudget=' + this.data.adjustbudget + '&starttime=' + this.data.departTime + '&endtime=' + this.data.returnTime
    })

  },

  pushSelcetTime: function (e) {
    wx.navigateTo({
      url: '../../../hotel/pages/home/hotel/selectTime/index?type=3',
    })
  },

  onLoad: function (options) {
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
    })
    let that = this
    wx.getStorage({
      key: 'uid',
      success: function (res) {
        that.setData({
          uid: res.data
        })
        wx.getStorage({
          key: 'token',
          success: function (res) {
            that.setData({
              token: res.data
            })
            get('/app/customized/list/' + that.data.page +'/'+that.data.pageSize, {}, (res) => {
              if (res.data.code === 200) {
                that.setData({
                  list: res.data.data.data,
                  page: that.data.page + 1
                })
              } else if (res.code === 400) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                })
              } else {
                wx.showToast({
                  title: '网络错误 ',
                  icon: 'none',
                  duration: 1000
                })
              }
            }, 1, that.data.token, true, that.data.uid)
          },
        })
      },
    });
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  onShow: function () {
    
  }
})