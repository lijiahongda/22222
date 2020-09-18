// page/oneself/pages/BrigadeFestival/BrigadeFestival.js
import {
  get,
  post,
  wxLogin,
  relations,
  retrunScene,
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isBrigadeFestival: true,
    GiftPackage: '领取礼包',
    order: [],
    page: 1,
    pageSize: 10,
    isHaveMore: true,
    authorizationStatus:false
  },
  // 授权
  login: function () {
    let that = this
    console.log('detail------')
    wx.login({
      success: function (loginRes) {
        let recode = ''
        if (wx.getStorageSync("ortherReCode")) {
          recode = wx.getStorageSync("ortherReCode")
        } else {
          recode = ''
        }
        wx.getUserInfo({
          success: function (res) {
            post('https://api2.yuelvhui.com/app/auth/weixin/login', {
              "code": loginRes.code,
              "encryptedData": res.encryptedData,
              "iv": res.iv,
              "appId": 'wxa404e150131464ed',
              "reCode": recode
            }, (res) => {
              if (res.data.code === 200) {
                //  绑卡注册所需字段
                wx.setStorage({
                  key: "openId",
                  data: res.data.data.openId
                });
                // 判断是否绑定关系 如果是2 没有绑定关系 如果是3绑定关系存在
                wx.setStorage({
                  key: 'isBinding',
                  data: res.data.data.status,
                })
                //授权登录信息缓存到本地
                wx.setStorage({
                  key: "nickname",
                  data: res.data.data.nickname
                });
                wx.setStorage({
                  key: "uid",
                  data: res.data.data.id
                });

                wx.setStorage({ //用户卡类型
                  key: "userType",
                  data: res.data.data.userType
                })
                wx.setStorage({ //用户卡类型
                  key: "cardType",
                  data: res.data.data.cardType
                })
                wx.setStorage({ //用户卡类型
                  key: "iscard",
                  data: res.data.data.cardType
                })
                wx.setStorage({ //用户卡类型
                  key: "isCard",
                  data: res.data.data.isCard
                })
                wx.setStorage({
                  key: "token",
                  data: res.data.data.token,
                });
                //存mapid
                wx.setStorage({
                  key: "mapId",
                  data: res.data.data.mapId
                });
                wx.setStorage({
                  key: "integral",
                  data: res.data.data.integral
                });
                if (res.data.data.id) {
                  that.setData({
                    authorizationStatus: false,
                  })
                  /**
                   * 这里存自己的邀请码
                   * */
                  var aUrl = "/app/member/v3/newGet/";
                  get(aUrl, {}, (resNew) => {
                    if (resNew.data.code === 200) {
                      // 自己邀请码 ---分享使用（勿改）
                      wx.setStorage({
                        key: "selfReCode",
                        data: resNew.data.data.reCode
                      });
                      wx.setStorage({
                        key: "leaderId",
                        data: resNew.data.data.leaderId
                      });
                      wx.setStorage({
                        key: "isCard",
                        data: resNew.data.isCard
                      });
                      wx.setStorage({
                        key: "memberAuth",
                        data: resNew.data.data.memberAuth
                      });
                    }
                  }, 1, res.data.data.token, true, res.data.data.id);
                  wx.showShareMenu({
                    withShareTicket: true
                  })
                } else {
                  wx.hideShareMenu()
                  if (res.data.data.mapId) {
                    //说明已经授权，去绑定
                    console.log('说明已经授权，去绑定')
                    that.setData({
                      authorizationStatus: false,
                    })
                    let obj = {
                      openid: res.data.data.openId,
                    }
                    let url = "/app/auth/weixinReCodeV2";
                    post(url, obj, (res) => {
                      if (res.data.code === 200) {
                        if (!res.data.data) {
                          return;
                        }
                        let mobile = res.data.data.mobile == undefined ? '' : res.data.data.mobile
                        let codeNumber = res.data.data.reCode == undefined ? '' : res.data.data.reCode
                        wx.navigateTo({
                          url: '/page/Yuemall/pages/VerificationCode/VerificationCode?mobile=' + mobile + '&codeNumber=' + codeNumber
                        })
                      }
                    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true);
                  } else {
                    //还未授权，去授权
                    console.log('还未授权，去授权')
                    that.setData({
                      authorizationStatus: true,
                    })
                  }
                }
              }
            }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true);

          }
        })
      }
    })
  },
  // 领取礼包
  GiftPackage: function() {
    let that = this;
    if (wx.getStorageSync('cardType') > 0) {
      if (that.data.invitedNum >= 100) {
        post('/app/member/award/getGifts/', {}, (res) => {
          if (res.data.code == 200) {
            if (res.data.data.status == 1) {
              that.setData({
                GiftPackage: '已领取',
                hadReceive: 2
              })
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            } else if (res.data.data.status == 2) {
              that.setData({
                GiftPackage: '领取礼包'
              })
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          } else {}
        }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
      } else {
        wx.showToast({
          title: '很遗憾，您的直推会员数未到100人，请继续加油吧！',
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      wx.showToast({
        title: '请先成为会员在领取礼包',
        icon: 'none',
        duration: 2000
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  orderDetail:function(){
    let that = this
    get('/app/member/invited/shareRedirect/', {}, (res) => {
      wx.hideLoading();
      if (res.data.code == 200) {
        if (res.data.data.overTime == 1) {
          that.setData({
            isBrigadeFestival: true
          })
          get('/app/member/invited/shareIndex/', {}, (res) => {
            wx.hideLoading();
            if (res.data.code == 200) {
              that.setData({
                onShare: res.data.data.url
              })
              wx.setNavigationBarTitle({
                title: res.data.data.title
              })
            } else { }
          }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
          get('/app/member/invited/shareUrl/', {}, (res) => {
            if (res.data.code == 200) {
              that.setData({
                directUrl: res.data.data.wxUrl.directUrl,
                imageUrl: res.data.data.wxUrl.imgUrl,
                dirceTitle: res.data.data.wxUrl.title
              })

            } else { }
          }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))

        } else if (res.data.data.overTime == 2) {
          that.setData({
            isBrigadeFestival: false
          })
          get('/app/member/invited/shareListHeader/', {}, (res) => {
            wx.hideLoading();
            if (res.data.code == 200) {
              that.setData({
                invitedNum: res.data.data.invitedNum,
                endTime: res.data.data.endTime,
                hadReceive: res.data.data.hadReceive
              })
              if (res.data.data.hadReceive == 1) {
                that.setData({
                  GiftPackage: '领取礼包'
                })
              } else if (res.data.data.hadReceive == 2) {
                that.setData({
                  GiftPackage: '已领取'
                })
              }
            } else { }
          }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
          get('/app/member/invited/shareList/' + that.data.page + '/' + that.data.pageSize, {}, (res) => {
            wx.hideLoading();
            if (res.data.code == 200) {
              that.setData({
                order: res.data.data.list,
                page: that.data.page + 1,
              })

            } else { }
          }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
        }
      } else { }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
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
    let that = this;
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route;
    let options = currentPage.options;
    //扫码参数分解
    if (options.scene != null) {
      retrunScene(options.scene, function (sceneObj) {
        wx.setStorageSync('reI', sceneObj.I);//缓存用户id
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
      wx.showShareMenu({
        withShareTicket: true
      })
    } else {
      wx.hideShareMenu()
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
    that.orderDetail()
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
    let that = this
    if (!that.data.isBrigadeFestival) {
      if (that.data.isHaveMore) {
        get('/app/member/invited/shareList/' + that.data.page + '/' + that.data.pageSize, {}, (res) => {
          if (res.data.code == 200) {
            let order = that.data.order;
            that.setData({
              order: that.data.order.concat(res.data.data.list),
              page: res.data.data.list.length > 0 ? (that.data.page + 1) : that.data.page,
              isHaveMore: res.data.data.list.length > 0 ? true : false
            })
          } else {

          }
        }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
      } else {
        wx.showToast({
          title: '没有更多了！',
          icon: 'none'
        })
      }
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let that = this
    let nickname = wx.getStorageSync('nickname');
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
    var value = ''
    try {
      value = wx.getStorageSync('selfReCode')

    } catch (e) {
      // Do something when catch error
    }
    return {
      title: that.data.dirceTitle,
      imageUrl: that.data.imageUrl,
      path: "/page/oneself/pages/BrigadeFestival/BrigadeFestival" + "?reCode=" + value + '&uid=' + wx.getStorageSync('uid')
    }

  },
  // 去邀请
  onShare: function() {
    this.onShareAppMessage()
  }
})