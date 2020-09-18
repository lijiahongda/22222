
const app = getApp()
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
    status: 1,
    mobile: '',
    countryCode: '86',
    vCode: '',
    codeNumber: '',
    countdown: 60, // 验证码倒计时
    isNewUser: false,
    countryName: '中国',
    isOldUse: false,
    title: '注册',
    isauthorization: false
  },
  // 暂不登录
  TemporarilyLoggedIn: function() {
    wx.navigateBack()
  },
  // 立即登录
  LoginImmediately: function(e) {
    let that = this
    if (e.detail.errMsg == "getPhoneNumber:ok") { //允许获取
      console.log(that.data.session_key)
      wx.request({
        url: 'https://api2.yuelvhui.com/app/auth/weixin/weixinLogin2',
        data: {
          "applicationId": 40, 
          "codeNumber": that.data.codeNumber ? that.data.codeNumber : '', //邀请码
          "encryptedData": e.detail.encryptedData,
          "iv": e.detail.iv,
          "session_key": wx.getStorageSync('sessionKey'),
          'registerType': 0,
          'openId': wx.getStorageSync('openid')
        },

        method: 'POST',
        header: {
          'content-type': 'application/json',
          'Authorization': 'Sys 2001.1572445472000.381d2a3926cb49cb964efe1b565be95f'
        },
        success(res) {
          console.log(res)
          if (res.data.code == 200) {

            wx.setStorage({
              key: "uid",
              data: res.data.id
            });
            wx.setStorage({
              key: "token",
              data: res.data.token
            });
            wx.setStorage({
              key: "cardType",
              data: res.data.cardType
            });
            wx.setStorage({
              key: 'nickname',
              data: res.data.nickname
            })
            wx.setStorage({
              key: 'selfReCode',
              data: res.data.invitationCode
            })
            wx.setStorage({
              key: 'mobile',
              data: res.data.mobile
            })
            wx.setStorage({
              key: 'md5Id',
              data: res.data.md5Id
            })
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
            that.setData({
              uid: res.data.id
            })
            if (res.data.headImg) {
              setTimeout(function() {
                wx.navigateBack()
              }, 1000)
            } else {
              console.log('====')
              that.setData({
                isauthorization: true
              })
            }
          }
        }
      })
    }
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    // this.getPerson()
  },
  // 获取用户基础信息
  getPerson: function(e) {
    console.log(e)
    let that = this
    wx.request({
      url: 'https://api2.yuelvhui.com/app/auth/weixin/weixinBind',
      data: {
        "applicationId": 40, // 默认
        "encryptedData": e.detail.encryptedData,
        "iv": e.detail.iv,
        "session_key": that.data.session_key,
        "mid": that.data.uid
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Sys 2001.1572445472000.381d2a3926cb49cb964efe1b565be95f'
      },
      success(res) {
        console.log('---', res)
        wx.setStorage({
          key: 'nickname',
          data: res.data.data.nickname
        })
        wx.showToast({
          title: '授权成功',
          icon: 'none'
        })
        that.setData({
          isauthorization: false
        })
        setTimeout(function() {
          wx.navigateBack()
          const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
          const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
          if (wxPrevPage) {
            console.log('uid',that.data.uid)
            wxPrevPage.setData({
              uid: that.data.uid
            })
            wx.navigateBack()
          }
        }, 1500)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.setData({
      mobile: options.mobile,
      codeNumber: wx.getStorageSync('ortherReCode') ? wx.getStorageSync('ortherReCode') : options.codeNumber,
      registerType: options.registerType
    })
    console.log(that.data.registerType,'-----')
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    that.login()
    app.globalData.isMeber = true
  },
  login: function() {
    let that = this
    wx.login({
      success(loginRes) {
        console.log(loginRes, 'dddddddd')
        wx.request({
          url: 'https://api2.yuelvhui.com/app/auth/weixin/getSessionKey',
          data: {
            "code": loginRes.code,
            "applicationId": 40
          },
          method: 'POST',
          header: {
            'content-type': 'application/json',
            'Authorization': 'Sys 2001.1572445472000.381d2a3926cb49cb964efe1b565be95f'
          },
          success(res) {
            console.log('========0', res)
            wx.setStorage({
              key: 'unionid',
              data: res.data.data.unionid,
            })
            wx.setStorage({
              key: 'sessionKey',
              data: res.data.data.session_key,
            })
            wx.setStorage({
              key: 'openid',
              data: res.data.data.openid,
            })
            that.setData({
              openid: res.data.data.openid,
              session_key: res.data.data.session_key,
              unionid: res.data.data.unionid
            })

          }
        })
      }
    })
  },
  // 用户协议
  UserAgreement: function() {
    wx.navigateTo({
      url: '/page/other/pages/UserAgreement/UserAgreement',
    })
  },











  reCodeChange: function(e) {
    this.setData({
      codeNumber: e.detail.value
    })
  },
  jumpCity: function() {
    wx.navigateTo({
      url: '/page/other/pages/login/areaCode/areaCode'
    })
  },
  phone: function(e) {
    let that = this;
    that.setData({
      mobile: e.detail.value
    })
  },


  // 存openId
  getOpenid: function(id) {

  },
  // 倒计时
  getCode: function() {
    if (this.data.countdown != 60) {
      return;
    }
    let _this = this;
    let temp = setInterval(function() { // 倒计时
      _this.setData({
        countdown: _this.data.countdown - 1
      })
      if (_this.data.countdown == 1) {
        _this.setData({
          countdown: 60
        })
        clearInterval(temp);
      }

    }, 1000)
  },
  // 获取验证码
  allow: function() {
    let that = this;
    if (that.data.mobile == '') {
      wx.showToast({
        title: '请输入手机号',
      })
    } else {
      const codeUrl = '/app/auth/sendByWeChat';
      post(codeUrl, {
        mobile: that.data.mobile,
        invitationCode: wx.getStorageSync('ortherReCode') ? wx.getStorageSync('ortherReCode') : '',
        areaCode: that.data.countryCode
      }, (res) => {
        if (res.data.code === 200) {
          console.log(res)
          that.getCode();
          if (res.data.data.status == 1) { //老用户
            that.setData({
              title: '登录'
            })
          } else { //新用户
            that.setData({
              isOldUse: true
            })
          }
          that.setData({
            status: res.data.data.status,
            codeNumber: res.data.data.invitationCode,
            isDixon: res.data.data.isDixon
          })
          wx.setStorageSync('cardType', res.data.data.card)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          });
        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true);
    }
  },

  // 验证码
  code(e) {
    this.setData({
      vCode: e.detail.value
    })
  },

  // 老用户登录
  // login: function() {
  //   let that = this;
  //   if (that.data.vCode == "") {
  //     wx.showToast({
  //       title: '请输入正确的验证码！',
  //       icon: 'none'
  //     })
  //   }
  //   let obj = {
  //     mobile: that.data.mobile,
  //     code: that.data.vCode
  //   }
  //   console.log(obj)
  //   let url = "/app/auth/verify";
  //   post(url, obj, (res) => {
  //     console.log(res)
  //     if (res.data.code == 200) {
  //       that.getOpenid(res.data.id)
  //       wx.setStorage({
  //         key: "uid",
  //         data: res.data.id
  //       });
  //       wx.setStorage({
  //         key: "token",
  //         data: res.data.token
  //       });
  //       wx.setStorage({
  //         key: 'selfReCode',
  //         data: res.data.recode
  //       })
  //       wx.setStorage({
  //         key: 'mobile',
  //         data: res.data.mobile
  //       })
  //       wx.showToast({
  //         title: res.data.msg,
  //         icon: 'none'
  //       })
  //       setTimeout(function() {
  //         wx.navigateBack()
  //       }, 1000)
  //     } else {
  //       wx.showToast({
  //         title: res.data.msg,
  //         icon: 'none'
  //       })
  //     }
  //   }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true);
  // },
  HouseInfo: function() {
    let that = this
    get('/app/member/v4/getParentInfo/' + that.data.codeNumber, {}, (res) => {
      console.log(res)
      if (res.data.code === 200) {
        that.setData({
          codeNumber: res.data.data.codeNumber,
          headimgurl: res.data.data.headimgurl,
          nickName: res.data.data.nickName
        })
        that.setData({
          binding: true
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true);
  },
  // 取消绑定
  cancel: function() {
    let that = this
    that.setData({
      binding: false
    })
  },
  // 最终绑定
  sure: function() {
    let that = this
    wx.showToast({
      title: '请稍等...',
      icon: 'none'
    })
    post('/app/member/v4/bindWx', {
      mapId: '',
      mobile: that.data.mobile,
      areaCode: that.data.countryCode,
      country: that.data.countryName,
      codeNumber: that.data.codeNumber,
      applicationId: 40
    }, (res) => {
      console.log(res)
      if (res.data.code === 200) {
        that.getOpenid(res.data.data.id)
        wx.setStorage({
          key: 'isBinding',
          data: res.data.data.status,
        })
        wx.setStorage({
          key: "mapId",
          data: res.data.data.mapId
        });
        wx.setStorage({
          key: 'cardType',
          data: res.data.data.cardType,
        })
        wx.setStorage({
          key: "token",
          data: res.data.data.token
        });
        wx.setStorage({
          key: "uid",
          data: res.data.data.id
        });
        wx.setStorage({
          key: 'selfReCode',
          data: res.data.data.recode
        })
        wx.setStorage({
          key: 'mobile',
          data: res.data.data.mobile
        })

        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        setTimeout(function() {
          wx.navigateBack({
            delta: 2
          })
        }, 1000)
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true);

  },
  // 注册
  complete: function() {
    let that = this;
    if (that.data.vCode == "") {
      wx.showToast({
        title: '请输入正确的验证码！',
        icon: 'none'
      })
    }
    /**
     * 1、如果有关系绑定传open即可，
     * 2、如果没有关系绑定并且用户输入邀请码传邀请码，
     * 3、否则走分配
     * */
    let obj = {
      mobile: that.data.mobile,
      verifyCode: that.data.vCode,
      mapId: wx.getStorageSync('mapId'),
      areaCode: that.data.countryCode
    }
    let url = "/app/member/v4/verify/bindByMobile";
    post(url, obj, (res) => {
      console.log(res)
      if (res.data.code === 200) {
        wx.setStorage({
          key: "uid",
          data: res.data.data.id
        });
        wx.setStorage({
          key: "token",
          data: res.data.data.token
        });

        if (res.data.data.status == 1) {
          that.HouseInfo()
        } else if (res.data.data.status == 2) {

          setTimeout(function() {
            wx.navigateBack()
          }, 1000)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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

  // eliteCard: function () { // 跳购卡
  //   wx.navigateTo({
  //     url: '/page/yueMember/pages/EliteCard/EliteCard'
  //   })
  // },
})