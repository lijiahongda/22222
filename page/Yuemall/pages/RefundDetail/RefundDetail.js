// page/My/pages/orderDetail/orderDetail.js
import { get, post } from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderProcess: [],
    ordersn: '',
    list: [],
    imgs: [],
    image: [],
    reasonDesc: '',
    items: [],
    services: false,//弹窗
    saveBtn: true,
    wxImg: '',
    severshow:false,
    pricegai:false
  },
  LogisticsNum: function (e) {
    this.setData({
      logisticsNum: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      changes:options.changes,
      ordersn:options.ordersn
    })
    this.getlist(options)
  },
  // 减少数量
  // delnum:function(){
  //   let that = this
  //   if(that.data.num<=1){
  //     that.setData({
  //       num:1
  //     })
  //   }else{
  //     that.data.num -= 1
  //     that.setData({
  //       num: that.data.num
  //     })
  //   }
  // },
  // 增加数量
  // addnum:function(){
  //   let that=this
  //   that.data.num+=1
  //   that.setData({
  //     num:that.data.num
  //   })
  // },
  // 上传图片
  upload: function () {
    let that = this
    if (that.data.image.length >= 3) {
      wx.showToast({
        title: '最多3张',
      })
      return false;
    }
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        for (let i = 0; i < res.tempFilePaths.length; i++) {
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
    let that = this
    for (let i = 0; i < this.data.expresslist.length; i++) {
      if (this.data.expresslist[i].type == e.detail.value) {
        this.setData({
          reasonText: this.data.expresslist[i].info,
          reason: e.detail.value
        })
      }
    }
    that.setData({
      services: false,
    })
  },
  // 关闭弹窗
  closeService: function () {
    this.setData({
      services: !this.data.services
    })
    let data={}
    post('/app/member/refundReasons',data,(res)=>{
     if(res.data.code==200){
       let expresslist=res.data.data
       expresslist.filter(item=>{
         item.checked=false
       })
       console.log(expresslist)
       this.setData({
         expresslist: expresslist
       })
     }else{
       wx.showToast({
         title: res.data.msg,
       })
     }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))

   
  },

  getlist(options) {
    let data = {
      subOrderNo: options.ordersn
    }
    post('/app/member/orderBrief', data, (res) => {
      if (res.data.code == 200) {

        this.setData({
          goodmsg: res.data.data,
          payPrice:res.data.data.payPrice,
          refundPrice: res.data.data.payPrice,
          num: res.data.data.goodsNum
        })
        console.log(res)
      } else {
        wx.showToast({
          title: res.data.msg,
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  pricegai:function(e){
    this.setData({
      pricegai:true
    })
  },
  bindinput: function (e) {
    console.log(e)
    this.setData({
      reasonDesc: e.detail.value
    })
  },
  // 提交
  save: function () {
    let that = this
    that.setData({
      severshow:true
    })
    
  },
  // 取消退款
  closeshow() {
    this.setData({
      severshow: false
    })
  },
  // 修改金额
  binchange(e){
    let that=this
    console.log(e.detail.value > that.data.payPrice)
    if (e.detail.value > that.data.payPrice||e.detail.value==''){
      wx.showToast({
        title: '不可大于支付金额',
      })
      this.setData({
        refundPrice:that.data.payPrice
      })
    }else{
      this.setData({
        refundPrice: e.detail.value
      })
    }
  },
  // 确认退款
  onfirmrend:function(){
    let that=this
    if (this.data.applyPrice > this.data.payPrice){
      wx.showToast({
        title: '不可大于支付金额',
        icon:'none'
      })
    }else{
      if (that.data.reason == ''){
        wx.showToast({
          title: '请填写退款原因',
          icon:'none'
        })
      }if(that.data.reasonDesc==''){
        wx.showToast({
          title: '请填写退款说明',
          icon: 'none'
        })
      }if(that.data.picPath==''){
        wx.showToast({
          title: '请填写退款凭证',
          icon: 'none'
        })
      }else{
        let obj = {
          subOrderNo: that.data.ordersn,
          reason: that.data.reason,//-- 退款原因： 1= 商品质量问题 2= 物流太慢 3= 7天内退货 4 = 不想要了 5= 其他
          reasonDesc: that.data.reasonDesc,//"退款详细说明"
          // refundPrice: that.data.refundPrice,//"申请退款金额"
          payPrice: that.data.payPrice,
          applyPrice: Number(that.data.refundPrice),
          picPath: that.data.image,//"上传的图片地址"
          applyNum: that.data.num,
          type: that.data.changes
        }
        post('/app/member/refundCommit', obj, (res) => {
          if (res.data.code == 200) {
            that.setData({
              severshow: false
            })
            wx.showToast({
              title: res.data.msg
            })
            wx.redirectTo({
              url: '/page/Yuemall/pages/RefundExamine/RefundExamine?changes=' + this.data.changes + '&ordersn=' + this.data.ordersn,
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
            wx.redirectTo({
              url: '/page/Yuemall/pages/RefundExamine/RefundExamine?changes=' + this.data.changes + '&ordersn=' + this.data.ordersn,
            })
          }
        }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
      }
    }
    
  }
})