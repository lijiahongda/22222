// page/assembleFree/page/InitiateGroup/InitiateGroup.js
import {
  get,
  post,
  wxLogin
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
      image: '',
      name: '',
      num: 1,
      time: 65602,
    }],
    amountNumber:1,
    share_title: '',
    countDownDay: '0',
    countDownHour: '00',
    countDownMinute: '00',
    countDownSecond: '00',
    headH: '',
    showModalStatus: false,
    statusArr:[]
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
  detaildata: function() {
    let that = this
    console.log(that.data.ordersn, that.data.type, that.data.uid)
    post('/hd/getOrdersnTeamInfo', {
      uid: that.data.uid,
      ordersn: that.data.ordersn,
      type: that.data.type
    }, (res) => {
      wx.hideLoading();
      console.log('---------detaildata')
      if (res.data.code == 200) {
        console.log(res)
        let data = res.data.data
        console.log(data.productInfo)
        that.setData({
          productInfo: data.productInfo,
          goods_img: data.productInfo.goods_img,
          teamStatus: data.teamStatus,
          team: data.team,
          headH: data.team[0].headpic,
          countDown: data.countDown,
          teamid: data.productInfo.team_id,
          id: data.productInfo.found_id,
          share_title: data.share,
          ruleImg: data.ruleImg,
          isInTeam: data.isInTeam
        })
        if (data.teamStatus == 1) { //进行中
          console.log('===')
          that.startTimer(data.countDown)
        }
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  // https://shop.yuelvhui.com/hd/assemble?page=1&channel=7

  // 拼团商品详情
  AssembleDetail: function(e) {
    wx.redirectTo({
      url: '/page/Yuemall/pages/AssembleDetail/AssembleDetail?teamid=' + e.currentTarget.dataset.id + ' & skuid=' + e.currentTarget.dataset.skuid,
    })
  },

  initData: function() {
    let that = this
    get('/hd/assemble?page=' + 1 + '&channel=' + 7, {}, (res) => {
      if (res.data.code == 200) {
        this.selectComponent("#lineTwoListFlow")._onOption(res.data.data.item)
        console.log(res)
        // wx.hideLoading()
        // that.setData({
        //   assembleList: res.data.data.item
        // })
      } else {}
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  // 查看订单
  lookorder: function() {
    wx.navigateTo({
      url: '/page/oneself/pages/orderDetail/orderDetail?ordersn=' + this.data.ordersn
    })
  },
  orderDetail: function() {
    wx.navigateTo({
      url: '/page/oneself/pages/orderDetail/orderDetail?ordersn=' + this.data.ordersn
    })
  },
  // 再开一团
  AnotherRound: function() {
    wx.redirectTo({
      url: '/page/Yuemall/pages/AssembleDetail/AssembleDetail?teamid=' + this.data.teamid,
    })
  },
  // 查看更多福利
  MoreBenefits: function() {
    wx.redirectTo({
      url: '/page/Yuemall/pages/BargainPriceList/BargainPriceList',
    })
  },
  // 去拼单详情
  GoGroupDetail: function() {
    wx.navigateTo({
      url: '/page/Yuemall/pages/GroupDetail/GroupDetail',
    })
  },
  // 砍价拼团查看更多列表
  BargainPriceList: function(e) {
    wx.navigateTo({
      url: '/page/Yuemall/pages/BargainPriceList/BargainPriceList?title=' + e.currentTarget.dataset.title + '&url=' + e.currentTarget.dataset.url,
    })
  },
  // 砍价商品详情
  BargainDetails: function() {
    wx.navigateTo({
      url: '/page/Yuemall/pages/BargainDetails/BargainDetails',
    })
  },
  // 继续拼团
  goOn: function(e) {
    console.log(e.currentTarget.dataset)
    if (e.currentTarget.dataset.teamstatus == 3) {
      wx.navigateTo({
        url: '/page/assembleFree/page/assembleFree/assembleFree',
      })
    } else {
      wx.redirectTo({
        url: '/page/assembleFree/page/AssembleDetail/AssembleDetail?teamid=' + e.currentTarget.dataset.id + ' & skuid=' + e.currentTarget.dataset.skuid,
      })
    }

  },
  IwantCan: function() {
    let that = this
    if (wx.getStorageSync('uid')) {
      that.showModal()
    } else {
      wx.navigateTo({
        url: '/page/Yuemall/pages/VerificationCode/VerificationCode'
      })
    }
  },
  // 倒计时
  startTimer: function(totalSecond) {
    let that = this
    // 倒计时
    var totalSecond;
    // totalSecond = that.data.statrstime
    totalSecond = totalSecond
    var interval = setInterval(function() {
      // 秒数
      var second = totalSecond;
      // 天数位
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;

      // 小时位
      var hr = Math.floor((second - day * 3600 * 24) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位
      var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位
      var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      this.setData({
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr,
        countDownDay: day
      });
      totalSecond--;
      if (totalSecond < 0) {
        that.detaildata()
        clearInterval(interval);
        this.setData({
          countDownHour: '00',
          countDownMinute: '00',
          countDownSecond: '00',
          countDownDay: '0'
        });

      }
    }.bind(this), 1000);
  },
  // 倒计时
  AnotherRoundstartTimer: function(totalSecond, v) {
    let that = this
    // 倒计时
    var totalSecond;
    // totalSecond = that.data.statrstime
    totalSecond = totalSecond
    var interval = setInterval(function() {
      // 秒数
      var second = totalSecond;
      // 天数位
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;

      // 小时位
      var hr = Math.floor((second - day * 3600 * 24) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位
      var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位
      var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;
      this.data.list[v].countDownHour = hrStr;
      this.data.list[v].countDownMinute = minStr;
      this.data.list[v].countDownSecond = secStr;
      this.setData({
        list: this.data.list
      });
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval);
        this.data.list[v].countDownHour = '00';
        this.data.list[v].countDownMinute = '00';
        this.data.list[v].countDownSecond = '00';
      }
    }.bind(this), 1000);
  },
  // 
  teamDetail: function() {
    let that = this
    console.log(that.data.id, '/hd/teamDetail?id=' + that.data.id + '&uid=' + that.data.uid)
    get('/hd/teamDetail?id=' + that.data.id + '&uid=' + that.data.uid, {}, (res) => {
      wx.hideLoading();
      console.log('---------teamDetail')
      if (res.data.code == 200) {
        console.log(res)
        let data = res.data.data
        // console.log(data.productInfo)
        that.setData({
          productInfo: data.productInfo,
          goods_img: data.productInfo.goods_img,
          teamStatus: data.teamStatus,
          team: data.team,
          headH: data.team[0].headpic,
          countDown: data.countDown,
          teamid: data.productInfo.team_id,
          id: data.productInfo.found_id,
          share_title: data.share,
          ruleImg: data.ruleImg,
          colorSize: data.goodsInfo.saleList,
          isInTeam: data.isInTeam,
        })
        console.log(that.data.teamStatus,'==[[[[[[[')
        if (data.teamStatus == 1) { //进行中
          console.log('===')
          that.startTimer(data.countDown)
        }
        that.initSelected(data.goodsInfo.saleList, data.skuId)
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)

  },
  // 规格
  swichLabel: function (e) {
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
  initSelected: function (colorsize, skuid) {
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
  // 确定
  sure: function (e) {
    let that = this
    if ((this.data.amountNumber > this.data.inventory) && this.data.channelId != 3) {
      wx.showToast({
        title: '库存数不足请重新选择数量',
        icon: 'none'
      })
    } else {
      wx.redirectTo({
        url: '/page/assembleFree/page/groupBalance/groupBalance?found_id=' + that.data.id +
          '&goodid=' + that.data.productInfo.goods_id + '&skuid=' + that.data.skuid + '&areaid=' + 0 + '&addressIds=' + 0 + '&goodsnum=' + that.data.amountNumber + '&type=' + 2 + '&id=' + that.data.teamid
      })
      that.hideModal()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      Entrance: options.Entrance, //是从结算页进来==b,如果拼团进行中==h,如果拼团成功==s,如果拼团失败==f
      ordersn: options.ordersn,
      type: options.type,
      uid: wx.getStorageSync('uid'),
      isfail: options.isfail,
      id: options.id
    })
    console.log(options.id, 'optionsTeamid')
    console.log(options.type, 'optionstype')
    console.log(that.data.uid, wx.getStorageSync('uid'))
    if (options.type == 1) {
      // 开团详情
      console.log('=====开团')
      that.detaildata()
    } else {
      console.log('=====参团')
      // 参团详情
      that.teamDetail()
    }
    that.initData()
    console.log(options.Entrance)
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
    that.setData({
      uid:wx.getStorageSync('uid')
    })
    if (that.data.type == 1) {
      // 开团详情
      console.log('=====开团')
      that.detaildata()
    } else {
      console.log('=====参团')
      // 参团详情
      that.teamDetail()
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
    if (this.data.Entrance == 'b') {
      wx.navigateBack({
        delta: 2
      })
    }
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
  // 分享图片及标题

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let that = this
    let value = ''
    try {
      value = wx.getStorageSync('selfReCode')

    } catch (e) {

    }
    console.log(that.data.id)
    return {
      title: that.data.share_title,
      imageUrl: that.data.goods_img,
      path: "page/assembleFree/page/InitiateGroup/InitiateGroup" + "?reCode=" + value + "&id=" + that.data.id + '&type=' + 2
    }
  }
})