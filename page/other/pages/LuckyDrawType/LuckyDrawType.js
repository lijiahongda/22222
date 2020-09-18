import {
  get,
  post,
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'',
    itemLenght: 0,
    toTop: 0,
    maxNum: 5,
    list: [],
    title:'消费抽奖码',
    resultTitle: '', //中奖结果如下
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.showLoading()
    that.setData({
      type:options.type,
      title:options.text
    })
    wx.setNavigationBarTitle({
      title: options.text+'消费抽奖码'
    })
    that.getList()  //列表
  },
  getList: function () {
    var that = this
    get('/app/member/prize/result/'+ that.data.type, {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          listCont: res.data.data,
          list: res.data.data.list,
          resultTitle: res.data.data.resultTitle,
          itemLenght: res.data.data.list.length
        })
        that.scrollTopText()
        wx.hideLoading()
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'));
  },
  gotoLuckCode(){//查看我的消费码
    wx.navigateTo({
      url: '/page/other/pages/LotteryYards/LotteryYards?title=' + this.data.title + '&status=' + this.data.type
    })
  },
  gotoLuckRule(){
    //查看抽奖规则
    wx.navigateTo({
      url:'/page/other/pages/RuleDescription/RuleDescription'
    })
  },
  scrollTopText(){
    let that = this
    if (that.data.itemLenght > that.data.maxNum) {
      setInterval(() => {
        let toTop = that.data.toTop + 1
        if (toTop >= that.data.itemLenght - 4) {
          that.setData({
            toTop: 0
          })
        }
        else {
          that.setData({
            toTop: toTop
          })
        }
      }, 2000)
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },


})