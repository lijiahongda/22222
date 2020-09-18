import {
  get,
  post,
  relations,
  retrunScene
} from '../../../../utils/util.js';
var app = getApp()
Page({
  data: {
    awardList: [], //奖品数组
    colorAwardDefault: '#FEEEEE', //奖品默认颜色
    colorAwardSelect: '#FF5041', //奖品选中颜色
    indexSelect: 0, //被选中的奖品index
    isRunning: true, //是否正在抽奖
    imageAward: [], //奖品图片数组
    WinningPrize: false, //中奖弹窗状态
    Noprize: false, //未中奖
    NoFrequency: false, //次数用尽
    BarrageList: [], //弹幕数组
    animationList: [], //弹幕动画效果
    topList: [], //弹幕距离顶部距离
    animationData: {},
    isFirst: true,
    m: true, //true  弹幕在左侧屏幕外  false 弹幕在右侧屏幕外
    animationDuration:10000,//弹幕动画时间
    animationDelay:3000,//弹幕延迟时间
    isBarrageList:false,// 是否显示弹幕
    toTop: 0,
    itemLenght: 0,
    keeptrying:true,// 再次尝试
    authorizationStatus: false
  },
 
  // 用户中奖列表
  userPrizeList: function() {
    let that = this
    get('/app/member/lottery/getListOfAll', {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          rule: res.data.data.rule,
          comment: res.data.data.comment,
          list: res.data.data.list,
          itemLenght: res.data.data.list.length
        })
        that.setData({
          LoadingStatus: false
        })
      } else {
        that.setData({
          LoadingStatus: false
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  //列表数据
  luckDrawList: function() {
    let that = this
    get('/app/member/lottery/getIconList', {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          awardList: res.data.list,
          run_border: res.data.run_border,
          click_bg: res.data.click_bg,
          bg1_mini: res.data.bg1_mini,
          bg2: res.data.bg2,
          success_bg: res.data.success_bg,
          fail_bg: res.data.fail_bg,
          times_over: res.data.times_over,
          click_record: res.data.click_record,
          lottery_rule: res.data.lottery_rule,
          success_record: res.data.success_record
        })
        that.setData({
          LoadingStatus: false
        })
      } else {
        that.setData({
          LoadingStatus: false
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  // 初始化剩余剩余次数
  ResidualTimes: function() {
    let that = this
    get('/app/member/lottery/getChances', {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          changeNum: res.data.data.changeNum
        })
        that.setData({
          LoadingStatus: false
        })
      } else {
        that.setData({
          LoadingStatus: false
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  /**
   * 初始化弹幕
   */
  initBarrage: function(time, clear) {
    let that = this
    var intervalFirst = setInterval(function() {
      let tempAnimationList = []
      let tempTopList = []
      if (that.data.m) {
        for (let i = 0; i < that.data.BarrageList.length; i++) {
          var animation = wx.createAnimation({
            duration: 0,
            timingFunction: "linear",
          });
          animation.translate(that.data.widthScreen + 30).step()
          tempAnimationList.push(animation.export())
        }
        that.setData({
          animationList: tempAnimationList,
          topList: tempTopList
        })
      }

      that.data.BarrageList.map((item, index) => { //初始化弹幕配置
        //随机设计弹幕垂直位置
        tempTopList.push(20 + Math.floor(Math.random() * -30))

        var animation = wx.createAnimation({
          duration: that.data.animationDuration,
          delay: that.data.animationDelay * index,
          timingFunction: "linear",
        });
        animation.translate(-that.data.widthScreen - 30).step()
        tempAnimationList.push(animation.export())
      })
      that.setData({
        animationList: tempAnimationList,
        topList: tempTopList,
        m:!that.data.m
      })
      if (!clear) {
        clearInterval(intervalFirst)
      }

      that.initBarrage(that.data.m? (that.data.animationDuration + that.data.animationDelay * (that.data.BarrageList.length - 1)):0, false)
      that.setData({
        isFirst: false
      })
    }, time)
  },
  /**
   * 启动弹幕
   */
  startBarrage: function() {
    let that = this
    if (this.data.isFirst) {
      this.initBarrage(0)
    }
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
  onShow:function(){
    let that = this
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
    wx.setStorage({
      key: 'curCar',
      data: '1',
    })
    wx.setStorageSync('myrequest', '');
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
    that.BarrageList()
    that.luckDrawList();
    that.ResidualTimes();
    that.userPrizeList();
    that.shareImage()
    that.scrollTopText()
  },
  onLoad: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          widthScreen: res.screenWidth
        })
      },
    })
    
  },
  //滚动中奖信息
  scrollTopText() {
    let that = this
    setInterval(() => {
      let toTop = that.data.toTop + 1
      if (toTop >= that.data.itemLenght - 2) {
        that.setData({
          toTop: 0
        })
      }
      else {
        that.setData({
          toTop: toTop
        })
      }
    }, 2000)
  },
  //开始游戏
  startGame: function() {
    if(!this.data.isRunning){
      return
    }
    this.setData({
      isRunning: false
    })
    var that = this;
    that.setData({//隐藏所有弹窗
      WinningPrize: false,//中奖
      Noprize: false,//未中奖
      NoFrequency: false,//次数用尽
    })
    if (that.data.changeNum == 0) { //抽奖次数用尽
      that.setData({//次数弹窗
        NoFrequency: true
      })
      return
    } else {//还有抽奖次数
      
      // if (!that.data.isRunning) {
      //   return//如果可以抽奖继续往下
      // }
      that.setData({//
        NoFrequency: false,//次数用尽
        Noprize:false,//未中奖
        WinningPrize:false//中奖弹窗
      })
      get('/app/member/lottery/doing', {}, (res) => {//调用抽奖结果接口
        if (res.data.code == 200) {
          setTimeout(function(){
            that.setData({
              result: res.data.result,//抽奖结果
              tip: res.data.tip,
              changeNum: res.data.chanceNum//剩余抽奖次数
            })
          },3000)
          
        }
      }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
      let indexSelect = that.data.result ? that.data.result : 0
      let i = 0;
      let timer = setInterval(function() {
        
        indexSelect++;
        //可根据自己的需求改变转盘速度
        i += 30;
        indexSelect = indexSelect % 8;
        setTimeout(function() {
          
          if ((that.data.result - 1) == indexSelect) {//如果抽奖结果数减一等于我当前选中的产品
            // clearInterval(timer)//去除循环
            if (that.data.result == '') {//判断可不可以抽奖
              return
            }
            if (that.data.result == 4 || that.data.result == 8) {//如果请求结果 是未中奖
              that.setData({
                Noprize: true,
                NoFrequency: false,//次数用尽
                WinningPrize: false,//中奖弹窗
                result: '',
                keeptrying: true,
              })
              clearInterval(timer)//去除循环 清除定时器
              return

            } else {//如果中奖了
              that.setData({
                WinningPrize: true,
                Noprize: false,
                NoFrequency: false,//次数用尽
                result: '',
                keeptrying: true,
              })
              clearInterval(timer)//去除循环
            }
            return;
          }
        }, 0);
        that.setData({
          indexSelect: indexSelect
        })
      }, (400 + i)) //转动速度
    }
  },

  hideModal: function(par) {
    let that = this
    setTimeout(function(){
      // 隐藏遮罩层
      
      that.setData({
        colorAwardDefault: '#FEEEEE', //奖品默认颜色
        colorAwardSelect: '#FF5041', //奖品选中颜色
        indexSelect: 0, //被选中的奖品index
        isRunning: true, //是否正在抽奖
        imageAward: [], //奖品图片数组
        WinningPrize: false, //中奖弹窗状态
        Noprize: false, //未中奖
        NoFrequency: false, //次数用尽
      })
      if (par == 'start') {
        that.startGame()
      }
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      that.animation = animation
      animation.translateY(300).step()
      that.setData({
        animationData: animation.export(),
      })
      setTimeout(function () {
        animation.translateY(0).step()
        that.setData({
          animationData: animation.export(),
          colorAwardDefault: '#FEEEEE', //奖品默认颜色
          colorAwardSelect: '#FF5041', //奖品选中颜色
          indexSelect: 0, //被选中的奖品index
          imageAward: [], //奖品图片数组
          WinningPrize: false, //中奖弹窗状态
          Noprize: false, //未中奖
          NoFrequency: false, //次数用尽
        })
      }.bind(this), 200)
    // this.detailData(this)
    },1000)
    
  },
  // 中奖分享
  onShare: function() {
    let that = this;
    that.setData({
      WinningPrize: false
    })
  },
  // 再试试
  Keeptrying: function() {
    if (!this.data.keeptrying){
      return;
    }
    let that = this;
    that.setData({
      keeptrying: false
    })
    setTimeout(function () {
      that.hideModal('start')
    }, 1000)
    
  },
  // 弹幕数据
  BarrageList:function(){
    let that = this
    get('/app/member/lottery/getLotteryBarrageList', {}, (res) => {
      if (res.data.code == 200) {
        let concat = res.data.data.groupOne.concat(res.data.data.groupTwo);
        that.setData({
          BarrageList:concat
        })
        if(concat.length !=0){
          that.startBarrage()
        }
       
      } else {
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  // 分享图片
  shareImage:function(){
    let that = this;
    post('/app/member/lottery/share', {}, (res) => {
      if (res.data.code == 200) {
        that.setData({
          imageUrl: res.data.data.posterUrl
        })
      }
    }, 1, wx.getStorageSync('token'), true, wx.getStorageSync('uid'))
  },
  changeNumling:function(){
    this.setData({
      NoFrequency:true
    })
  },
  //分享
  onShareAppMessage: function () {
    let that = this;
    let nickname = wx.getStorageSync('nickname');
    that.hideModal()
    wx.getStorage({
      key: 'uid',
      success: function (res) {
        that.setData({
          uid: res.data
        });
        wx.getStorage({
          key: 'token',
          success: function (res) {
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
    }
    return {
      title: "“"+nickname+"“"+'邀您一起抽豪礼',
      imageUrl: that.data.imageUrl,
      path: "/page/other/pages/LuckDraw/LuckDraw" + "?reCode=" + value + '&uid=' + wx.getStorageSync('uid')
    }

  },
})