// page/My/pages/orderDetail/orderDetail.js
import { get, post } from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderProcess: [],
    ordersn:'',
    list:[]
// 0未申请过
// 31待审核
// 33审核不通过
// 35审核通过
// 40退款中
// 45已处理但不退款
// 47退款失败
// 50退款完成
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      ordersn: options.ordersn
    })
    this.getList()
  },
  
  // 列表
  getList:function(){
    let that = this
    post('/app/member/refundDetail', {
      orderNo: that.data.ordersn
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          list: res.data.data[0],
        })
        console.log(that.data.list, 'wwwww----')
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  // 复制
  copyText: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success(res) {
        wx.getClipboardData({
          success(res) {
          }
        })
      },
      complete(res) {
      }
    })
  },
 

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  }

})