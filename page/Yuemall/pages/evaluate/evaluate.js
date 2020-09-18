// page/Yuemall//pages/evaluate/evaluate.js
import {
  get,
  post,
  relations,
  retrunScene,
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodstars: [true, true, true, true, true],
    packstars: [true, true, true, true, true],
    deliverstars: [true, true, true, true, true],
    deliverystars: [true, true, true, true, true],
    redImage: 'https://image.yuelvhui.com/pubfile/2019/06/13/line_1560408930.png',
    GrayImage: 'https://image.yuelvhui.com/pubfile/2019/06/13/line_1560408934.png',
    TextArea: '',
    imgs: [],
    isanonymous: false,
    image: []
  },
  // 打包评星
  packstars: function(e) {
    let that = this;
    let id = e.currentTarget.dataset.id
    if (id == 1) {
      that.setData({
        packstars: [true, false, false, false, false]
      })
    } else if (id == 2) {
      that.setData({
        packstars: [true, true, false, false, false]
      })
    } else if (id == 3) {
      that.setData({
        packstars: [true, true, true, false, false]
      })
    } else if (id == 4) {
      that.setData({
        packstars: [true, true, true, true, false]
      })
    } else if (id == 5) {
      that.setData({
        packstars: [true, true, true, true, true]
      })
    }
  },
  // 送货评星
  deliverstars: function(e) {
    let that = this;
    let id = e.currentTarget.dataset.id
    if (id == 1) {
      that.setData({
        deliverstars: [true, false, false, false, false]
      })
    } else if (id == 2) {
      that.setData({
        deliverstars: [true, true, false, false, false]
      })
    } else if (id == 3) {
      that.setData({
        deliverstars: [true, true, true, false, false]
      })
    } else if (id == 4) {
      that.setData({
        deliverstars: [true, true, true, true, false]
      })
    } else if (id == 5) {
      that.setData({
        deliverstars: [true, true, true, true, true]
      })
    }
  },
  //点击商品星星
  starsGoods: function(e) {
    let that = this;
    let id = e.currentTarget.dataset.id
    if (id == 1) {
      that.setData({
        goodstars: [true, false, false, false, false]
      })
    } else if (id == 2) {
      that.setData({
        goodstars: [true, true, false, false, false]
      })
    } else if (id == 3) {
      that.setData({
        goodstars: [true, true, true, false, false]
      })
    } else if (id == 4) {
      that.setData({
        goodstars: [true, true, true, true, false]
      })
    } else if (id == 5) {
      that.setData({
        goodstars: [true, true, true, true, true]
      })
    }
  },
  // 配送星星
  deliverystars: function(e) {
    let that = this;
    let id = e.currentTarget.dataset.id
    if (id == 1) {
      that.setData({
        deliverystars: [true, false, false, false, false]
      })
    } else if (id == 2) {
      that.setData({
        deliverystars: [true, true, false, false, false]
      })
    } else if (id == 3) {
      that.setData({
        deliverystars: [true, true, true, false, false]
      })
    } else if (id == 4) {
      that.setData({
        deliverystars: [true, true, true, true, false]
      })
    } else if (id == 5) {
      that.setData({
        deliverystars: [true, true, true, true, true]
      })
    }
  },
  // 编辑文字
  bindTextAreaBlur: function(e) {
    this.setData({
      TextArea: e.detail.value
    })
    console.log(e.detail.value)
  },
  // 上传图片
  upload: function() {
    let that = this
    var imgs = this.data.imgs;
    if (imgs.length >= 9) {
      wx.showToast({
        title: '最多6张',
      })
      return false;
    }
    wx.chooseImage({
      count: 6, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var imgs = that.data.imgs;
        for (var i = 0; i < tempFilePaths.length; i++) {
          if (imgs.length >= 9) {
            that.setData({
              imgs: imgs
            });
            return false;
          } else {
            imgs.push(tempFilePaths[i]);
          }
        }
        that.setData({
          imgs: imgs
        });
        for (let i of that.data.imgs) {
          that.urlTobase64(i)
        }
      }
    });
  },
  // 删除图片
  deleteImg: function(e) {
    var imgs = this.data.imgs;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      imgs: imgs
    });
  },
  // 是否匿名
  anonymous: function() {
    this.setData({
      isanonymous: this.data.isanonymous ? false : true
    })
  },
  urlTobase64(url) {
    let that = this
    let image = that.data.image
    console.log(url)
    wx.request({
      url: url,
      responseType: 'arraybuffer', //最关键的参数，设置返回的数据格式为arraybuffer
      success: res => {
        //把arraybuffer转成base64
        let base64 = wx.arrayBufferToBase64(res.data);

        //不加上这串字符，在页面无法显示的哦
        base64　 = 'data:image/jpg;base64,' + base64

        //打印出base64字符串，可复制到网页校验一下是否是你选择的原图片呢
        console.log(base64)
        wx.request({
          url: 'https://api2.yuelvhui.com/common/uploadBase64', //仅为示例，并非真实的接口地址
          method: 'POST',
          data: {
            file: base64
          },
          header: {
            'Content-Type': 'application/json'
          },
          success: function(res) {
            console.log(res.data.url)
            image.push(res.data.url)
            that.setData({
              image: image
            })
            console.log(that.data.image)

          }
        })
      }
    })
  },
  // 提交
  Submission: function(e) {
    let that = this
    let goodsStars = []
    let packstars = []
    let deliverstars = []
    let deliverystars = []
    for (let v of that.data.goodstars) {
      if (v) {
        goodsStars.push(v)
      }
    }
    for (let p of that.data.packstars) {
      if (p) {
        packstars.push(p)
      }
    }
    for (let d of that.data.deliverstars) {
      if (d) {
        deliverstars.push(d)
      }
    }
    for (let y of that.data.deliverystars) {
      if (y) {
        deliverystars.push(y)
      }
    }
    if (that.data.TextArea == '') {
      wx.showToast({
        title: '请写下心得体验',
        icon: 'none'
      })
      return false
    }
    // console.log(that.data.TextArea,'文字')
    console.log(that.data.image.join(","), '上传图片')
    // console.log(goodsStars.length, '商品星星')
    // console.log(packstars.length, '打包星星')
    // console.log(deliverstars.length, '送货星星')
    // console.log(deliverystars.length,'配送星星')
    // console.log(that.data.isanonymous,'是否匿名')
    post('/mall/addComment', {
      mid: wx.getStorageSync('uid'),
      record_id: that.data.recordid,
      product_id: that.data.productid,
      type: 1,
      sku_id: that.data.skuid,
      goods_score: goodsStars.length,
      lo_package_score: packstars.length,
      lo_distribution_score: deliverstars.length,
      lo_courier_score: deliverystars.length,
      comment: that.data.TextArea,
      imgs: that.data.image.join(","),
      is_anonymous: that.data.isanonymous
    }, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        setTimeout(function() {
          wx.navigateTo({
            url: '/page/Yuemall/pages/SuccessfulComments/SuccessfulComments',
          })
        }.bind(this), 500)
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'), 4);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      recordid: options.recordid,
      productid: options.productid,
      skuid: options.skuid,
      img: options.img
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }
})