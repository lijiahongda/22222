// page/Mall/detail/detail.js
import {
  get,
  post,
  relations,
  retrunScene,
} from '../../../../utils/util.js';
import WxParse from "../../../../wxParse/wxParse/wxParse.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    three: 5,
    imagenum: 20,
    scrollTop: 0,
    scrollId: '', //选中ID
    tabIndex: 0,
    lineText: [{
      title: '宝贝'
    }, {
      title: '评论'
    }, {
      title: '详情'
    }],

    // 轮播数组
    bannerItem: [{
        url: ''
      },
      {
        url: ''
      }

    ],
    authorizationStatus: false,
    amountNumber: 1,
    // 默认轮播数
    current: 0,
    // 规格弹窗
    showModalStatus: false,
    colorSize: [],
    selectLabel: '请选择规格',
    statusArr: [], //各行规格默认选中项
    sharelayer: false,
    buttonId: 1,
    isaddress: false
  },
  copyText: function(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success(res) {
        wx.getClipboardData({
          success(res) {}
        })
      },
      complete(res) {}
    })
  },
  // 查看更多评论
  lookComment: function() {
    wx.navigateTo({
      url: '/page/Yuemall/pages/lookComment/lookComment?productid=' + this.data.goodsId,
    })
  },
  // 点击标题切换
  NavTab: function(e) {
    let that = this
    let cur = e.currentTarget.dataset.index;
    if (that.data.tabIndex == cur) {
      return false;
    } else {
      that.setData({
        tabIndex: cur,
        scrollId: 'd' + cur
      })
      console.log('d' + cur)
    }
  },
  /**
   * 页面滑动
   */
  bindscroll: function(e) {
    let data = this.data
    let scrollTop = e.scrollTop
    this.setData({
      scrollTop: e.detail.scrollTop
    })
    if (e.detail.scrollTop > 100) {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#F34746',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
    }
    if (e.detail.scrollTop == 0) {
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
    }
  },
  addNumber: function(e) {
    if (this.data.buttonId == 1) {
      let num = e.currentTarget.dataset.num;
      this.setData({
        amountNumber: num + 1
      })
      if ((this.data.amountNumber > this.data.inventory) && this.data.channelId != 3) {
        wx.showToast({
          title: '库存数不足请重新选择数量',
          icon: 'none'
        })
      }
    } else {
      wx.showToast({
        title: '只能购买一件',
        icon: 'none'
      })
    }
  },
  // 手机号验证码
  VerificationCode: function() {
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
    })
  },
  subtract: function(e) {
    if (this.data.buttonId == 1) {
      let num = e.currentTarget.dataset.num
      if (num != 1) {
        this.setData({
          amountNumber: num - 1
        })
      } else {
        wx.showToast({
          title: '受不了了，宝贝不能在减少了哦',
          icon: 'none'
        })
      }
    } else {
      wx.showToast({
        title: '至少购买一件',
        icon: 'none'
      })
    }

  },
  address: function() {
    let that = this;
    if (wx.getStorageSync('uid')) {
      wx.navigateTo({
        url: '/page/Yuemall/pages/addressAdministration/addressAdministration?Mywinning=' + 'datilAss',
      })
    } else {
      wx.navigateTo({
        url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
      })
    }

  },
  detaildata: function() {
    let that = this
    console.log()
    get('/hd/getBargainGoodsInfo?id=' + that.data.id + '&uid=' + wx.getStorageSync('uid'), {}, (res) => {
      wx.hideLoading();
      if (res.data.code == 200) {
        let data = res.data.data
        that.setData({
          banner: data.productInfo.banner,
          bargain_price: data.assembleInfo.bargain_price,
          origin_price: data.productInfo.goodVipPrice,
          OriginPrice: data.assembleInfo.origin_price,
          priceName: data.productInfo.priceName,
          needer: data.assembleInfo.needer,
          goods_name: data.assembleInfo.goods_name,
          goods_id: data.assembleInfo.goods_id,
          colorSize: data.productInfo.saleList,
          goodsInfo: data.productInfo.goodsInfo,
          goodFreight: data.productInfo.goodFreight,
          goodsId: data.assembleInfo.goods_id,
          groupInfo: data.groupInfo,
          share_img: data.assembleInfo.share_img,
          share_title: data.assembleInfo.share_title,
          share_desc: data.assembleInfo.share_desc,
          goodSupplier: data.productInfo.goodSupplier,
          id: data.assembleInfo.id,
          count: data.count,
          comment: data.productInfo.comment,
          goodVipPrice: data.productInfo.goodVipPrice
        })
        let ortherRecode = wx.getStorageSync('ortherReCode') ? wx.getStorageSync('ortherReCode') : 0
        get('/app/member/distribution/record/' + this.data.goodsId + '/' + ortherRecode + '/' + 2, {}, (res) => {
          console.log(res)
          if (res.data.code == 200) {} else if (res.data.code == 400) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'));
        WxParse.wxParse('article', 'html', res.data.data.productInfo.goodContent, that, 5);
        that.initSelected(data.productInfo.saleList, data.assembleInfo.sku_id)
        console.log(data.areaInfo)
        if (data.areaInfo != '') {
          if (that.data.isaddress == false) {
            that.setData({
              address: data.areaInfo,
              addressCode: data.areaInfo.proviceId + '_' + data.areaInfo.cityId + '_' + data.areaInfo.zoneId + '_' + data.areaInfo.townId,
              state: data.areaInfo.state,
            })
          }
          that.setData({
            boxbanner: data.productInfo.banner[0]
          })
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  // 查看砍价记录
  lookMore: function() {
    wx.navigateTo({
      url: '/page/Yuemall/pages/HaggleList/HaggleList?id=' + this.data.id + '&type=' + 1,
    })
  },
  // 生成海报
  goPoster: function() {
    this.setData({
      sharelayer: false
    })
    wx.navigateTo({
      url: "/page/other/pages/poster/poster?goodsId=" + this.data.goodsId + '&url=' + '/share/MallProduCreduceForward' + '&id=' + 'Bargaingoods' + '&skuid=' + this.data.skuid,
    })
  },
  // 打开分享
  shareBox: function() {
    if (wx.getStorageSync('uid')) {
      this.setData({
        sharelayer: true
      })
    } else {
      wx.navigateTo({
        url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
      })
    }
  },
  // 关闭分享
  shareLayerClosed: function() {
    this.setData({
      sharelayer: false
    })
  },
  // 确定
  sure: function(e) {
    let that = this

    if ((this.data.amountNumber > this.data.inventory) && this.data.channelId != 3) {
      wx.showToast({
        title: '库存数不足请重新选择数量',
        icon: 'none'
      })
    } else {
      console.log('---')
      console.log(e.currentTarget)
      if (e.currentTarget.dataset.id == 1) { //单独购买
        if (that.data.amountNumber != 0) {
          let addressType = that.data.channelId == 3 ? 1 : 0
          let addressIds = that.data.addressCode == 0 ? (that.data.address.proviceId + '_' + that.data.address.cityId + '_' + that.data.address.zoneId + '_' + that.data.address.townId) : that.data.addressCode
          wx.navigateTo({
            url: '/page/Yuemall/pages/balance/balance?type=' + 'gopay' + '&amountnumber=' + that.data.amountNumber + '&goodid=' + that.data.goodsId + '&addressType=' + addressType + '&addressIds=' + addressIds + '&areaId=' + that.data.address.addressId + '&skuid=' + that.data.skuid,
          })
        }
      } else if (e.currentTarget.dataset.id == 2) { //发起砍价
        console.log(that.data.id)
        // wx.showLoading({
        //   title:'发起砍价中'
        // })
        post('/hd/createBargainInfo', {
          uid: wx.getStorageSync('uid'),
          bargain_id: that.data.id,
          open_id: wx.getStorageSync('openid'),
          channel: 3,
          sku_id: that.data.skuid
        }, (res) => {
          wx.hideLoading();
          if (res.data.code == 200) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
            setTimeout(function() {
              wx.navigateTo({
                url: '/page/Yuemall/pages/HelpDetails/HelpDetails?found_id=' + res.data.data.found_id,
              })
            }, 2000)

          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)

        // console.log(that.data.address.addressId)
      }
      that.hideModal()
    }

  },
  // 规格
  swichLabel: function(e) {
    let that = this
    //选中index
    var index = e.currentTarget.dataset.idx;
    console.log(e.currentTarget.dataset)
    //选中行index
    var data_index = e.currentTarget.dataset.index;
    that.selectLabel(index, data_index);
  },
  // 选中lab
  selectLabel(index, data_index) {
    // console.log(index + "&" + data_index, "need select index")
    let that = this;
    let colorSize = that.data.colorSize;
    var idx = index;
    //选中sku
    var sku = colorSize[index].buttons[data_index]['skuList']
    //选中第几行第几个
    // console.log(arr.push(colorSize[index].buttons[data_index]))
    that.data.statusArr[index] = data_index
    //取出其他sku
    let m = []
    that.setData({
      sizeSelectText: []
    })
    var is_selected_skus = {};
    this.data.statusArr.map((b, a) => {
      // console.log(a, "a");
      // console.log(b, "b");
      if (a != idx && (typeof this.data.statusArr[a] != "undefined")) {
        is_selected_skus[a] = colorSize[a].buttons[this.data.statusArr[a]].skuList;
        // console.log(colorSize[a].buttons[this.data.statusArr[a]])
      }
      // console.log(that.data.sizeSelectText.push(colorSize[a].buttons[this.data.statusArr[a]].text))
    })
    for (let i = 0; i < colorSize.length; i++) {
      var channel_data = colorSize[i].buttons;

      for (let j = 0; j < channel_data.length; j++) {
        if (i != idx) {
          var sku_isists = Array.intersect(sku, channel_data[j].skuList);
          for (let [c, d] in is_selected_skus) {
            if (c != i) {
              sku_isists = Array.intersect(sku_isists, is_selected_skus[c]); //is_selected_skus非当前行其他行选中的元素
            }
          }
          if (sku_isists.length) {
            // console.log('1')
            colorSize[i].buttons[j].isEnable = true;
          } else {
            // console.log('2')

            colorSize[i].buttons[j].isEnable = false;
          }
        } else {
          if (j == data_index) {
            // console.log('3')

            colorSize[i].buttons[j].isEnable = true;
          } else if (colorSize.length == 1) {
            // console.log('4')

            colorSize[i].buttons[j].isEnable = true;
          }
        }
      }
    }
    let last_sku = sku
    for (let [c, d] in is_selected_skus) {
      last_sku = Array.intersect(last_sku, is_selected_skus[c]);
    }
    this.setData({
      statusArr: this.data.statusArr,
      colorSize: colorSize,
      last_sku: last_sku[0],
      skuid: last_sku[0],
      sizeSelectText: that.data.sizeSelectText,
    })
    if (colorSize[index]['title'] == '颜色') {
      that.setData({
        boxbanner: colorSize[index].buttons[data_index]['img']
      })
    }
  },
  // 选择规格
  SelectionSpecification: function(e) {
    let that = this;
    that.setData({
      amountNumber: 1
    })
    if (that.data.state != 1) {
      wx.showToast({
        title: '请选择配送地址',
        icon: 'none'
      })
    } else {
      that.setData({
        buttonId: e.currentTarget.dataset.id
      })
      that.showModal()
    }

  },
  // 轮播 点击事件
  bindChange: function(e) {
    this.setData({
      current: e.detail.current
    })
  },
  // 首页
  gohome: function() {
    wx.switchTab({
      url: '/page/Mall/YueMall',
    })
  },
  // 显示弹窗
  showModal: function() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  // 隐藏弹窗
  hideModal: function() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  /**
   * 初始化默认选中项
   */
  initSelected: function(colorsize, skuid) {
    let arr = new Array(colorsize.length)
    for (let i = 0; i < colorsize.length; i++) {
      for (let j = 0; j < colorsize[i].buttons.length; j++) {
        // colorsize[i].buttons[j].skuList.indexOf(Number(skuid)) > -1
        if (colorsize[i].buttons[j].skuList.indexOf(skuid) > -1) {
          // console.log('----')
          this.selectLabel(i, j);
        }
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let that = this;
    let scene = '';
    let reCode = '';
    let id = '';
    if (options.scene != null) {
      retrunScene(options.scene, function(sceneObj) {
        reCode = sceneObj.C;
        id = sceneObj.I;
      });
    } else {
      reCode = options.reCode;
      id = options.id;
    }

    console.log(reCode, 'reCode就收recode')
    that.setData({
      id: id,
      skuid: options.skuid,
      uid: wx.getStorageSync('uid'),
      cardType: wx.getStorageSync('cardType')
    })
    that.detaildata()
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
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
    let that = this
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    // this.initSelected(this.data.colorSize, '100000942707')
    //扫码参数分解
    if (options.scene != null) {
      retrunScene(options.scene, function(sceneObj) {
        wx.setStorageSync('reI', sceneObj.I); //缓存用户id
        relations(sceneObj.C);
      });
    } else if (options.reCode) {
      relations(options.reCode);
    }

    if (wx.getStorageSync('uid')) {
      //已经绑定了
      console.log('已经绑定了')
      that.setData({
        authorizationStatus: false
      })
      that.detaildata()
      wx.showShareMenu({
        withShareTicket: true
      })
    } else {
      wx.hideShareMenu()
      that.setData({
        authorizationStatus: false
      })
    }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let that = this
    that.setData({
      sharelayer: false
    })
    wx.getStorage({
      key: 'uid',
      success: function(res) {
        that.setData({
          uid: res.data
        });
        wx.getStorage({
          key: 'token',
          success: function(res) {
            that.setData({
              token: res.data
            });
          }
        });
      }
    });
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route;
    var options = currentPage.options;
    // let teamid = "";
    // if (options.teamid == null || options.teamid == 'null' || options.teamid == 'undefined' || options.teamid == undefined) {
    //   teamid = this.data.teamid
    // } else {
    //   teamid = options.teamid;
    // }
    var value = ''
    try {
      value = wx.getStorageSync('selfReCode')

    } catch (e) {


    }
    console.log(value, '分享码')
    return {
      title: that.data.share_title + that.data.goods_name,
      imageUrl: that.data.share_img,
      path: "/page/Yuemall/pages/BargainDetails/BargainDetails" + "?reCode=" + value + '&uid=' + wx.getStorageSync('uid') + "&id=" + that.data.id
    }
  }
})