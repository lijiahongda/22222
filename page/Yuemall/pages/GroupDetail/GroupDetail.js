// page/Mall/pages/GroupDetail/GroupDetail.js
import {
  get,
  post,
  wxLogin,
  relations,
  retrunScene
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorizationStatus: false,
    showModalStatus: false,
    colorSize: [],
    statusArr: [], //各行规格默认选中项
    amountNumber: 1,

  },
  // 添加商品数量
  addNumber: function(e) {
    // wx.showToast({
    //   title: '拼团商品只能购买一件',
    //   icon: 'none'
    // })
    if (this.data.amountNumber == 10) {
      wx.showToast({
        title: '拼团商品最多只能购买10件',
        icon: 'none'
      })
    } else {
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
    }
  },
  // 减少商品数量
  subtract: function(e) {
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
  ImmediateDelegbation: function() {
    this.showModal()
  },
  sure: function() {
    console.log(this.data.amountNumber)
    wx.navigateTo({
      url: '/page/Yuemall/pages/groupBalance/groupBalance?id=' + this.data.team_id + '&goodid=' + this.data.goodid + '&skuid=' + this.data.skuid + '&areaid=' + this.data.areaid + '&goodsnum=' + this.data.amountNumber + '&found_id=' + this.data.found_id + '&type=' + 2
    })
    console.log(this.data.found_id)
  },
  GoDetail: function() {
    wx.redirectTo({
      url: '/page/Yuemall/pages/AssembleDetail/AssembleDetail?teamid=' + this.data.team_id
    })
  },
  detaildata: function() {
    let that = this
    console.log(that.data.id, 'resID')
    get('/hd/teamDetail?id=' + that.data.id + '&uid=' + that.data.uid, {}, (res) => {
      wx.hideLoading();
      console.log(res, '===========res')
      if (res.data.code == 200) {
        console.log(res.data.data.teamStatus,'teamStatus')
        let data = res.data.data
        that.setData({
          productInfo: res.data.data.productInfo,
          team: res.data.data.team,
          team_id: res.data.data.productInfo.team_id,
          goodid: res.data.data.productInfo.goods_id,
          skuid: res.data.data.productInfo.sku_id,
          goodsnum: 1,
          found_id: res.data.data.productInfo.found_id,
          teamStatus: res.data.data.teamStatus,
          colorSize: res.data.data.goodsInfo.saleList,
          boxbanner: data.goodsInfo.banner[0]
        })
        if (that.data.areaid) {} else {
          that.setData({
            areaid: res.data.data.areaInfo.addressId
          })
        }
        that.initSelected(res.data.data.goodsInfo.saleList, res.data.data.skuId)
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let scene = '';
    let reCode = '';
    if (options.scene != null) {
      retrunScene(options.scene, function(sceneObj) {
        reCode = sceneObj.C;
      });
    } else {
      reCode = options.reCode;
    }
    that.setData({
      id: options.id,
      uid: wx.getStorageSync('uid'),
      areaid: options.areaid
    })
    that.detaildata()
  },
  // 规格
  swichLabel: function(e) {
    let that = this
    console.log(that.data.colorSize)
    //选中index
    var index = e.currentTarget.dataset.idx;
    //选中行index
    var data_index = e.currentTarget.dataset.index;
    that.selectLabel(index, data_index);
  },
  // 选中lab
  selectLabel(index, data_index) {
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
    that.data.statusArr.map((b, a) => {
      if (a != idx && (typeof that.data.statusArr[a] != "undefined")) {
        is_selected_skus[a] = colorSize[a].buttons[that.data.statusArr[a]].skuList;
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
    that.setData({
      statusArr: that.data.statusArr,
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
    // this.skuidDetil()
    // console.log(that.data.sizeSelectText)
  },
  initSelected: function(colorsize, skuid) {
    console.log(colorsize)
    console.log(skuid)
    let arr = new Array(colorsize.length)
    for (let i = 0; i < colorsize.length; i++) {
      for (let j = 0; j < colorsize[i].buttons.length; j++) {
        // colorsize[i].buttons[j].skuList.indexOf(Number(skuid)) > -1
        // if (colorsize[i].buttons[j].skuList.indexOf(Number(skuid)) > -1) {
        if (colorsize[i].buttons[j].skuList.indexOf(skuid) > -1) {
          this.selectLabel(i, j);
        }
      }
    }
  },
  // 选择规格
  SelectionSpecification: function(e) {
    let that = this;
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  VerificationCode: function () {
    wx.navigateTo({
      url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
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
    } else {
      if (wx.getStorageSync('mapId')) {
        //说明已经授权，去绑定
        console.log('说明已经授权，去绑定======')
        that.setData({
          authorizationStatus: true
        })
      } else {
        //还未授权，去授权
        console.log('还未授权，去授权')
        that.setData({
          authorizationStatus: true
        })
      }
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

  }
})