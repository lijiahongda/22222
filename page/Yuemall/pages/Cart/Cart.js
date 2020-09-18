import {
  get,
  post
} from '../../../../utils/util.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    edit: '编辑',
    // items: [1,2],
    uid: '',
    token: '',
    del: false,
    balance: true,
    isSelecteAll: false,
    GoodsId: [],
    backgroundColor: '#f4aa11',
    arrSelect: [],
    cartId: '',
    total: 0,
    length: 0,
    freight: true
  },
  // 倒计时
  startTimer: function (totalSecond, v) {
    let that = this
    // 倒计时
    var totalSecond = totalSecond;
    console.log(totalSecond)
    var interval = setInterval(function () {
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
      this.data.GoodsId[v].countDownHour = hrStr;
      this.data.GoodsId[v].countDownMinute = minStr;
      this.data.GoodsId[v].countDownSecond = secStr;
      this.setData({
        GoodsId: this.data.GoodsId
      });
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval);
        this.data.GoodsId[v].countDownHour = '00';
        this.data.GoodsId[v].countDownMinute = '00';
        this.data.GoodsId[v].countDownSecond = '00';
      }
    }.bind(this), 1000);
  },
  details: function (e) {
    let {
      activityid,
      skuid,
      goodsid
    } = e.currentTarget.dataset
    console.log(e.currentTarget.dataset)
    if (activityid) {

    } else {
      wx.navigateTo({
        url: '/page/Yuemall/pages/details/details?goodsId=' + goodsid + '&skuid=' + skuid,
      })
    }
  },
  GoShopping: function () {
    wx.switchTab({
      url: '/page/Mall/YueMall',
    })
  },
  // 立即结算
  ImmediateSettlement: function (e) {
    let that = this;
    var cartId = ''
    var GoodsId = this.data.GoodsId
    for (let f = 0; f < GoodsId.length; f++) {
      for (let item of GoodsId[f].data) {
        if (item.isChecked == true) {
          this.data.arrSelect.push(item)
        } else {
          for (var i = 0; i < this.data.arrSelect.length; i++) {
            if (this.data.arrSelect[i] == item.cartId) {
              if (i > -1) {
                this.data.arrSelect.splice(i, 1);
              }
            }
          }
        }
      }
    }
    console.log(that.data.arrSelect)
    for (var id of that.data.arrSelect) {
      cartId += id.cartId + ",";
    }
    if (cartId.length > 0) {
      cartId = cartId.substr(0, cartId.length - 1);
    }
    that.setData({
      cartId: cartId
    })
    if (that.data.arrSelect == 0) {
      wx.showToast({
        title: '至少选择一个商品',
        icon: 'none'
      })
    } else {
      // return
      wx.navigateTo({
        url: '../balance/balance?cartId=' + that.data.cartId + '&cartType=' + 'cartType',
      })
    }
  },
  checkChange1: function (e) {
    let GoodsId = this.data.GoodsId
    let channeArr = []
    let type = ''
    let {
      index,
      channelid,
      selected
    } = e.currentTarget.dataset
    console.log(e)
    if (selected == 1) {
      type = 0
    } else {
      type = 1
    }
    this.updateCartStatus(0, channelid, type)
    for (var s = 0; s < GoodsId.length; s++) { //循环购物车列表
      if (s == index) { //判断如果是用户点击的店铺 
        GoodsId[s].selected == 0 ? GoodsId[s].selected = 1 : GoodsId[s].selected = 0 //如果用户点击的店铺是选中状态更改为未选中，如果是为选中状态更改为选中
        for (let d of GoodsId[s].data) { //循环店铺下面的商品列表
          if (GoodsId[s].selected == 1) { //如果店铺是选中状态修改店铺下面所有的商品列表为选中状态
            d.isChecked = true
          } else { //如果店铺是未选中状态修改店铺下面所有的商品列表为未选中状态
            d.isChecked = false
          }
          console.log(d)
        }
      }
      if (GoodsId[s].selected == 0) {
        channeArr.push(0)
      } else {
        channeArr.push(1)
      }
      console.log(channeArr)
      if (channeArr.join('').indexOf(0) == -1) { //判断店铺是否全选并更改全选状态
        this.setData({
          isSelecteAll: true
        })
      } else {
        this.setData({
          isSelecteAll: false
        })
      }

    }

    this.setData({
      GoodsId: GoodsId
    })

    console.log(GoodsId)
    this.PriceCalculation()
    this.aaa(GoodsId, channelid)
  },
  // 价钱计算 这俩不一样
  PriceCalculation1: function () {
    let tal = 0
    let length = []
    for (let i in this.data.GoodsId) {
      for (let k in this.data.GoodsId[i].data) {
        if (this.data.GoodsId[i].data[k].selected == 1) {
          if (this.data.GoodsId[i].data[k].activityId) {
            if (this.data.GoodsId[i].data[k].activity_status != 0) {
              tal += this.data.GoodsId[i].data[k].skPrice * this.data.GoodsId[i].data[k].goodNum
            }
          } else {
            tal += this.data.GoodsId[i].data[k].vipPric * this.data.GoodsId[i].data[k].goodNum;
          }
          length.push(this.data.GoodsId[i].data[k])
        }
      }

      console.log(length, tal)
      this.setData({
        total: tal.toFixed(2),
        length: length.length
      })
    }
  },
  // 价钱计算
  PriceCalculation: function () {
    let tal = 0
    let length = []
    for (let i in this.data.GoodsId) {
      for (let k in this.data.GoodsId[i].data) {
        if (this.data.GoodsId[i].data[k].isChecked == 1) {
          if (this.data.GoodsId[i].data[k].activityId) {
            if (this.data.GoodsId[i].data[k].activity_status != 0) {
              tal += this.data.GoodsId[i].data[k].skPrice * this.data.GoodsId[i].data[k].goodNum
            }
          } else {
            tal += this.data.GoodsId[i].data[k].vipPric * this.data.GoodsId[i].data[k].goodNum;
          }
          length.push(this.data.GoodsId[i].data[k])
        }
      }

      console.log(length, tal)
      this.setData({
        total: tal.toFixed(2),
        length: length.length
      })
    }
  },
  // 购物车列表 勾选
  checkChange: function (e) {
    let {
      item,
      index,
      channelid,
      cartid,
      selected
    } = e.currentTarget.dataset
    let type = ''
    let GoodsId = this.data.GoodsId
    let channeGoodArr = [] //用来判断渠道商品是否全选
    let channeArr = [] //用来判断渠道是否全选
    let length = []
    console.log(e, item)
    if (selected == 1) {
      type = 0
    } else {
      type = 1
    }
    this.updateCartStatus(cartid, channelid, type)
    if (item.activity_status != 0) { //如果秒杀商品可以购买
      if (item.isChecked) {
        item.isChecked = false
        this.setData({
          isSelecteAll: false
        })
      } else {
        item.isChecked = true
      }
    } else { //如果秒杀商品不可购买
      wx.showToast({
        title: '请在活动开始后，进行购买',
        icon: 'none'
      })
    }

    // 单商品
    for (let i in GoodsId) {
      for (let k in GoodsId[i].data) {
        if (GoodsId[i].data[k].cartId == item.cartId) {
          GoodsId[i].data[k] = item
        }

      }
    }
    // 渠道+商品是否全选
    console.log(index)

    for (var g = 0; g < GoodsId.length; g++) {
      if (g == index) { //如果商品的渠道的与用户选择的渠道
        for (let d of GoodsId[g].data) { //循环店铺中的商品
          console.log(this.data.arrSelect)
          if (d.isChecked) { //如果选中的
            channeGoodArr.push(1)
          } else { //未选中
            channeGoodArr.push(0)
          }
        }
        if (channeGoodArr.join('').indexOf(0) == -1) { //判断店铺中是否所有商品全不选中并更改点不是否选中的状态
          GoodsId[g].selected = 1
        } else {
          GoodsId[g].selected = 0
        }
      }
      if (GoodsId[g].selected == 0) {
        channeArr.push(0)
      } else {
        channeArr.push(1)
      }
      if (channeArr.join('').indexOf(0) == -1) { //判断店铺是否全选并更改全选状态
        this.setData({
          isSelecteAll: true
        })
      } else {
        this.setData({
          isSelecteAll: false
        })
      }
    }

    let sum = 0
    let all = 59
    for (let l = 0; l < GoodsId[index].data.length; l++) {
      // tal += this.data.GoodsId[i].data[k].vipPric * this.data.GoodsId[i].data[k].goodNum;
      console.log(GoodsId[index].data[l].isChecked)
      if (GoodsId[index].data[l].isChecked) {
        sum += GoodsId[index].data[l].goodNum * GoodsId[index].data[l].vipPric
        all = (59 - sum).toFixed(2)
      }
      GoodsId[index].all = all
      console.log(all, sum)
    }
    this.setData({
      GoodsId: GoodsId
    })

    console.log(GoodsId)

    // 全选方法
    let isAllSelected = true
    for (let i in this.data.GoodsId) {
      for (let k in this.data.GoodsId[i].data) {
        if (!this.data.GoodsId[i].data[k].isChecked) {
          isAllSelected = false
        }
      }
    }
    //计算价钱
    this.PriceCalculation()
  },
  // 全选操作
  checkboxChange: function (e) {
    let GoodsId = this.data.GoodsId
    if (this.data.isSelecteAll) {
      this.setData({
        isSelecteAll: false,
      })

    } else {
      this.setData({
        isSelecteAll: true,
      })
    }
    for (var i = 0; i < GoodsId.length; i++) {
      if (this.data.isSelecteAll) {
        GoodsId[i].selected = 1
        console.log(GoodsId[i])
        for (let d of GoodsId[i].data) {
          d.isChecked = true
        }
      } else {
        GoodsId[i].selected = 0
        for (let d of GoodsId[i].data) {
          d.isChecked = false
        }
      }
    }
    this.setData({
      GoodsId: GoodsId,
    })
    console.log(GoodsId)
    this.PriceCalculation()
  },
  // 购物车裂变减少商品数量
  subtract: function (e) {
    let {
      index
    } = e.currentTarget.dataset
    let GoodsId = this.data.GoodsId
    let arr = []
    let goodNum = ''
    let item = e.currentTarget.dataset.item
    console.log(e)
    if (item.goodNum != 1) {
      for (let i in this.data.GoodsId) {
        for (let k in this.data.GoodsId[i].data) {
          if (this.data.GoodsId[i].data[k].cartId == item.cartId) {
            // 行云商品 判断最大及最小值
            if (item.channelId == 7) {
              if (item.goodNum <= item.startBuy) {
                wx.showToast({
                  title: '该商品最少购买数量为' + item.startBuy,
                  icon: 'none'
                })
                return
              }
            }
            this.data.GoodsId[i].data[k].goodNum = item.goodNum - 1
            goodNum = this.data.GoodsId[i].data[k].goodNum
            // this.data.GoodsId[i].all =  (59 - this.data.GoodsId[i].data[k].goodNum*this.data.GoodsId[i].data[k].vipPric).toFixed(2)
          }
        }
        let sum = 0
        let all = 59
        for (let l = 0; l < GoodsId[index].data.length; l++) {
          // tal += this.data.GoodsId[i].data[k].vipPric * this.data.GoodsId[i].data[k].goodNum;
          console.log(GoodsId[index].data[l].isChecked)
          if (GoodsId[index].data[l].isChecked) {
            sum += GoodsId[index].data[l].goodNum * GoodsId[index].data[l].vipPric
            all = (59 - sum).toFixed(2)
          }
          GoodsId[index].all = all
          console.log(all, sum)
        }
      }
      this.setData({
        GoodsId: this.data.GoodsId
      })
      console.log(this.data.GoodsId)
      post('/mall/cart/updateV4', {
        type: 1,
        cartId: item.cartId,
        uid: this.data.uid,
        // channelId: 2
      }, (res) => {
        if (res.data.status == 200) {

        } else if (res.data.status == 400) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })

        }
      }, 1, this.data.token, true, this.data.uid, 4)
    } else {
      wx.showToast({
        title: '受不了了，宝贝不能在减少了哦',
        icon: 'none'
      })
    }
    this.PriceCalculation()
  },
  aaa(GoodsId, channelid) {
    console.log(GoodsId)
    for (var h = 0; h < GoodsId.length; h++) {
      if (GoodsId[h].selected != 0) {
        let sum = 0
        let all = 0
        for (let l = 0; l < GoodsId[h].data.length; l++) {
          // tal += this.data.GoodsId[i].data[k].vipPric * this.data.GoodsId[i].data[k].goodNum;

          sum += GoodsId[h].data[l].goodNum * GoodsId[h].data[l].vipPric
          all = (59 - sum).toFixed(2)
          GoodsId[h].all = all
          console.log(all, sum)
        }
      } else {
        GoodsId[h].all = 59
      }
      this.setData({
        GoodsId: this.data.GoodsId
      })
    }
  },
  // 购物车裂变增加商品数量
  addNumber: function (e) {
    let {
      index
    } = e.currentTarget.dataset
    let arr = []
    let goodNum = ''
    let item = e.currentTarget.dataset.item
    let GoodsId = this.data.GoodsId
    for (let i in this.data.GoodsId) {
      for (let k in this.data.GoodsId[i].data) {
        if (this.data.GoodsId[i].data[k].cartId == item.cartId) {
          // 行云商品 判断最大及最小值
          if (item.channelId == 7) {
            if (item.goodNum >= item.endBuy) {
              wx.showToast({
                title: '该商品最多购买数量为' + item.endBuy + '个',
                icon: 'none'
              })
              return
            }
          }
          this.data.GoodsId[i].data[k].goodNum = item.goodNum + 1
          goodNum = this.data.GoodsId[i].data[k].goodNum
          // if(this.data.GoodsId[i].data[k].isChecked){
          //   this.data.GoodsId[i].all =  (59 - this.data.GoodsId[i].data[k].goodNum*this.data.GoodsId[i].data[k].vipPric).toFixed(2)
          // }
          // console.log(goodNum,this.data.freightRule,this.data.GoodsId[i].data[k].goodNum,this.data.GoodsId[i].data[k].vipPric)
        }
      }
      let sum = 0
      let all = 59
      for (let l = 0; l < GoodsId[index].data.length; l++) {
        // tal += this.data.GoodsId[i].data[k].vipPric * this.data.GoodsId[i].data[k].goodNum;
        console.log(GoodsId[index].data[l].isChecked)
        if (GoodsId[index].data[l].isChecked) {
          sum += GoodsId[index].data[l].goodNum * GoodsId[index].data[l].vipPric
          all = (59 - sum).toFixed(2)
        }
        GoodsId[index].all = all
        console.log(all, sum)
      }
      this.setData({
        GoodsId: this.data.GoodsId
      })
    }
    post('/mall/cart/updateV4', {
      type: 0,
      cartId: item.cartId,
      uid: this.data.uid,
      // channelId: 2
    }, (res) => {
      if (res.data.status == 200) {} else if (res.data.status == 400) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })

      }
    }, 1, this.data.token, true, this.data.uid, 4)
    this.PriceCalculation()
  },
  // 编辑
  edit: function (e) {
    var edit = e.target.dataset.edit;
    if (edit == '编辑') {
      this.setData({
        edit: '完成',
        del: true
      })
    } else if (edit == '完成') {
      this.setData({
        edit: '编辑',
        del: false
      })
    }

  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2); //以宽度750px设计稿做宽度的自适应
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }

      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.GoodsId;
      if (e.currentTarget.dataset.type == 2) {
        list = this.data.GoodsId;
      }
      console.log(list, index)

      list[index]['txtStyle'] = txtStyle;
      //更新列表的状态
      if (e.currentTarget.dataset.type == 1) {
        this.setData({
          'GoodsId': list
        });
      } else {
        this.setData({
          'GoodsId': list
        });
      }

    }
  },
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.GoodsId;
      if (e.currentTarget.dataset.type == 2) {
        list = this.data.GoodsId;
      }
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      if (e.currentTarget.dataset.type == 1) {
        this.setData({
          'GoodsId': list
        });
      } else {
        this.setData({
          'GoodsId': list
        });
      }
    }
  },
  //更新状态接口
  updateCartStatus(cartId, channelId, type) {
    let that = this
    post('/mall/cart/updateCartStatus', {
      uid: wx.getStorageSync('uid'),
      cartId: cartId,
      type: type,
      channelId: channelId,
    }, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          // InvalidList: res.data.data
        })

      } else {

      }
    }, 1, that.data.token, true, that.data.uid, 4)
  },
  // 列表数据
  getOrderList() {
    let that = this
    let cartLength = []
    post('/mall/cart/getLoseEfficacyCartList', {
      uid: that.data.uid
    }, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          InvalidList: res.data.data
        })

      } else {

      }
    }, 1, that.data.token, true, that.data.uid, 4)
    post('/mall/cart/listV2', {
      uid: that.data.uid,
      share_form: app.globalData.shareForm,
      position_from: app.globalData.positionFrom
    }, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        let isSelecteAl = true
        let arr = []
        let freightRule = res.data.freightRule
        for (let item of res.data.rest) {
          if (item.selected == 0) { //如果有0的
            arr.push(0)
          } else {
            arr.push(1)
          }
          console.log(arr)
          if (arr.join('').indexOf(0) == -1) { //判断店铺是否全选并更改全选状态
            this.setData({
              isSelecteAll: true
            })
          } else {
            this.setData({
              isSelecteAll: false
            })
          }

          for (let item1 of item.data) {
            item1.isChecked = false
            if (item1.selected == 1) {
              item1.isChecked = true
            }
            cartLength.push(1)
          }
          if (item.allMoney) {
            item.all = (freightRule - item.allMoney).toFixed(2)
          } else {
            item.all = 59
          }

          console.log(item.all)
        }
        console.log(cartLength)
        that.setData({
          GoodsId: res.data.rest,
          cartLength: cartLength.length,
          freightRule: freightRule
        })
        this.PriceCalculation1()

        console.log(this.data.GoodsId, res.data.rest, 'ppppppppp')
        wx.setNavigationBarTitle({
          title: '购物车(' + cartLength.length + ')',
        })
        if (that.data.GoodsId == '') {
          wx.showToast({
            title: '暂无商品',
            icon: 'none'
          })
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, that.data.token, true, that.data.uid, 4)
    post('/mall/V2/getAboutShopCart', {}, (res) => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          goodinfo: res.data.data.goodinfo
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 1, that.data.token, true, that.data.uid, 4)
  },
  goCollect(e) {
    console.log(e)
    let {
      redirecttype,
      id
    } = e.currentTarget.dataset
    let idH = parseInt(id)
    if (redirecttype == 39) {
      wx.navigateTo({
        url: '/page/Yuemall/pages/NewHotStyle/NewHotStyle?&id=' + idH,
      })
    } else if (redirecttype == 52) { //行云
      wx.navigateTo({
        url: '/page/Cloud/pages/index/index'
      })
    } else if (redirecttype == 43) { //考拉海购
      console.log('oooooooooooooo')
      wx.navigateTo({
        url: '/page/Yuemall/pages/JDclassification/JDclassification?channelId=' + 6,
      })
    } else if (redirecttype == 65) { //当当 
      wx.navigateTo({
        url: '/page/Yuemall/pages/DangHome/DangHome'
      })
    }

    return
  },
  //  删除商品列表
  delSelect: function (e) {
    let that = this;
    let {
      cartid,
      type
    } = e.currentTarget.dataset
    let cartidArr = ''
    console.log(e.currentTarget.dataset)
    console.log(type, cartid)
    if (type == 2) {
      console.log(that.data.InvalidList)
      for (var id of that.data.InvalidList) {
        cartidArr += id.cartId + ",";
      }
      if (cartidArr.length > 0) {
        cartidArr = cartidArr.substr(0, cartidArr.length - 1);
      }
    }
    console.log(cartid)
    post('/mall/cart/delete', {
      cartId: type == 1 ? cartid : cartidArr,
      uid: that.data.uid
    }, (res) => {
      if (res.data.status == 200) {
        wx.showToast({
          title: '删除成功',
          icon: 'none'
        })
        console.log('iiiiiiiiiiiii')
        that.getOrderList()
        that.setData({
          del: false,
          total: 0,
          length: 0
        })
      } else {

      }
    }, 1, that.data.token, true, that.data.uid, 4)
  },
  cardType: function () {
    wx.switchTab({
      url: '/page/EliteCard/EliteCard'
    })
  },
  onLoad: function (options) {
    let that = this
    let Modeliphonex = 'iPhone X'
    let ModeliphonePro = 'iPhone Pro'
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      cardType: wx.getStorageSync('cardType')
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.model)
        if (res.model.indexOf(Modeliphonex) > -1 || res.model.indexOf(ModeliphonePro) > -1) {
          console.log('---')
          that.setData({
            isFill: true
          })
        }
      }
    })
  },
  onPullDownRefresh: function () {
    this.getOrderList();
    wx.stopPullDownRefresh();
  },
  onShow: function () {
    this.setData({
      cartId: '',
      arrSelect: [],
      length: 0,
      total: 0,
      isSelecteAll: false,
    })
    this.getOrderList()
    wx.setStorage({
      key: 'curCar',
      data: '1',
    })
  }
})