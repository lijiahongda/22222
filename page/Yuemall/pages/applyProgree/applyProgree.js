// page/My/pages/orderDetail/orderDetail.js
import { get, post } from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderProcess: [],
    ordersn:'',
    list:[],
    imgs: [],
    image: [],
    reasonDesc:'',
    items: [],
    services:false,//弹窗
    saveBtn:true,
    wxImg:''
  },
  LogisticsNum:function(e){
    this.setData({
      logisticsNum:e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      goods: JSON.parse(options.goods),
      ordersn: options.ordersn,
    })
    console.log(this.data.goods)
    this.getList(options.ordersn)
  },
  // 列表
  getList: function (subOrderSn){
    let that = this
    post('/app/member/refundTips', {
      subOrderSn: subOrderSn
    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          items: res.data.data.reasons,
          tips: res.data.data.tips,
          refundPrice: res.data.data.refundPrice,
          isMemberGoods: res.data.data.isMemberGoods
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  // 上传图片
  upload: function () {
    let that = this
    if (that.data.image.length >= 6) {
      wx.showToast({
        title: '最多6张',
      })
      return false;
    }
    wx.chooseImage({
      count: 6,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        for(let i=0;i<res.tempFilePaths.length;i++){
          wx.getFileSystemManager().readFile({
            filePath: res.tempFilePaths[i], //选择图片返回的相对路径
            encoding: 'base64', //编码格式
            success: resNew => { //成功的回调
              that.urlTobase64('data:image/jpg;base64,' + resNew.data)
            }
          })
        }
      }
    })
  },
  urlTobase64(url, type) {
    let that = this
    wx.request({
      url: 'https://api2.yuelvhui.com/common/uploadBase64', //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        file: url
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.data.image.push(res.data.url)
        that.setData({
          image: that.data.image
        })
      }
    })
  },
  // 删除图片
  deleteImg: function (e) {
    var image = this.data.image;
    var index = e.currentTarget.dataset.index;
    image.splice(index, 1);
    this.setData({
      image: image
    });
  },
  radioChange: function (e) {
    for (let i = 0; i < this.data.items.length;i++){
      if (this.data.items[i].type == e.detail.value){
        this.setData({
          reasonText: this.data.items[i].info,
          reason: e.detail.value
        })
      }
    }
  },
  // 关闭弹窗
  closeService:function(){
    this.setData({
      services: !this.data.services
    })
  },
  bindinput:function(e){
    console.log(e)
    this.setData({
      reasonDesc: e.detail.value
    })
  },
  // 提交
  save:function(){
    let that = this
    if (!that.data.reason){
      wx.showToast({
        title: '选择退款原因',
        icon:'none'
      })
      return
    }
    if (that.data.image.length == 0){
      wx.showToast({
        title: '选上传凭证',
        icon: 'none'
      })
      return
    }
    if (that.data.logisticsNum == ''){
      wx.showToast({
        title: '请填写物流单号',
        icon: 'none'
      })
      return
    }
    let obj = {
      orderNo: that.data.ordersn,
      reason: that.data.reason ,//-- 退款原因： 1= 商品质量问题 2= 物流太慢 3= 7天内退货 4 = 不想要了 5= 其他
      reasonDesc: that.data.reasonDesc ,//"退款详细说明"
      refundPrice: that.data.refundPrice ,//"申请退款金额"
      picPath: that.data.image ,//"上传的图片地址"
      logisticsNum: that.data.logisticsNum
    }
    // return
    post('/app/member/refundOrder', obj, (res) => {
      if (res.data.code == 200) {
        that.setData({
          saveBtn:false
        })
        wx.showToast({
          title: res.data.msg,
          success:function(){
            setTimeout(function(){
              wx.redirectTo({
                url: '/page/Yuemall/pages/afterSaleProgree/afterSaleProgree?ordersn=' + that.data.ordersn,
              })
            },2000)
          }
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  }

})