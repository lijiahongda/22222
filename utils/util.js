import _Promise from 'bluebird';
import hexMD5 from './md5.js'
var utilMD5 = require('./md5.js')
var aes = require('./aes.js');


//十六位十六进制数作为秘钥
var aeskey = aes.CryptoJS.enc.Utf8.parse("zxcvbnmasdfghjkl");
//十六位十六进制数作为秘钥偏移量
var randomsix = randomString(16)
var aesiv = aes.CryptoJS.enc.Utf8.parse(randomsix);

/**
 * 加密
 */
function encrypt(data) {
  var srcs = aes.CryptoJS.enc.Utf8.parse(data);
  var encrypted = aes.CryptoJS.AES.encrypt(srcs, aeskey, {
    iv: aesiv,
    mode: aes.CryptoJS.mode.CBC,
    padding: aes.CryptoJS.pad.Pkcs7
  });
  //返回base64加密结果
  return encrypted.toString();
}

/**
 * 解密
 */
function decrypt(data) {
  // data是base64编码数据
  var decrypt = aes.CryptoJS.AES.decrypt(data, aeskey, {
    iv: aesiv,
    mode: aes.CryptoJS.mode.CBC,
    padding: aes.CryptoJS.pad.Pkcs7
  });
  var decryptedStr = decrypt.toString(aes.CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}


/**
 * 16位随机字符串生成
 */
function randomString(len) {
  len = len || 16;
  var $chars = 'abcdefghijklmnopqrstuvwxyz'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length;
  var pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

//保存图片到相册
function writePhotosAlbum(successFun, failFun) {
  console.log('---------')
  wx.getSetting({
    success(res) {
      if (!res.authSetting['scope.writePhotosAlbum']) {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success: function () {
            successFun && successFun()
          },
          fail: function (res) {
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: "小程序需要您的微信授权保存图片，是否重新授权？",
              showCancel: true,
              cancelText: "否",
              confirmText: "是",
              success: function (res2) {
                if (res2.confirm) { //用户点击确定'
                  wx.openSetting({
                    success: (res3) => {
                      if (res3.authSetting['scope.writePhotosAlbum']) {
                        //已授权
                        successFun && successFun()
                      } else {
                        failFun && failFun()
                      }
                    }
                  })
                } else {
                  failFun && failFun()
                }
              }
            });
          }
        })
      } else {
        successFun && successFun()
      }
    }
  })
}
/**
 * @param {Function} fun 接口
 * @param {Object} options 接口参数
 * @returns {Promise} Promise对象
 */
function Promise(fun, options) {
  options = options || {};
  return new _Promise((resolve, reject) => {
    if (typeof fun !== 'function') {
      reject();
    }
    options.success = resolve;
    options.fail = reject;
    fun(options);
  });
}

/**
 * 手势库
 */
function touchstart(e, _this) {
  const t = e.touches[0],
    startX = t.clientX,
    startY = t.clientY;
  _this.setData({
    'gesture.startX': startX,
    'gesture.startY': startY,
    'gesture.out': true
  })
}
/**
 * 左滑
 * @returns {boolean} 布尔值
 */
function isLeftSlide(e, _this) {
  if (_this.data.gesture.out) {
    const t = e.touches[0],
      deltaX = t.clientX - _this.data.gesture.startX,
      deltaY = t.clientY - _this.data.gesture.startY;

    if (deltaX < -20 && deltaX > -40 && deltaY < 8 && deltaY > -8) {
      _this.setData({
        'gesture.out': false
      })
      return true;
    } else {
      return false;
    }
  }
}
/**
 * 右滑
 * @returns {boolean} 布尔值
 */
function isRightSlide(e, _this) {
  if (_this.data.gesture.out) {
    const t = e.touches[0],
      deltaX = t.clientX - _this.data.gesture.startX,
      deltaY = t.clientY - _this.data.gesture.startY;

    if (deltaX > 20 && deltaX < 40 && deltaY < 8 && deltaY > -8) {
      _this.setData({
        'gesture.out': false
      })
      return true;
    } else {
      return false;
    }
  }
}

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function timeNum(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber) + [hour, minute, second].map(formatNumber)
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/*
 *  get请求
 *  url:请求地址
 *  params:参数
 *  callback:回调函数
 *  key: token
 *  type:0系统 1用户登录以后
 *  id:uid
 * */

const get = (url, params, callback, type, key = '', isUseMD5 = true, id, urlType = 1) => {
  // urlType 接口url调取类型  1,默认接口 2,线路
  if (urlType === 1) {
    if (url.indexOf('http') == -1) {
      url = 'https://api2.yuelvhui.com' + url; //dev
      // url = 'http://test-api.yuelvhui.cn' +url;//dev
    }
  } else if (urlType === 2) {
    if (url.indexOf('http') == -1) {
      url = 'https://tour.yuelvhui.com' + url
      //url = 'https://test-api.yuelvhui.com' +url;//dev
    }
  } else if (urlType === 3) {
    if (url.indexOf('http') == -1) {
      url = 'https://open.yuelvhui.com' + url
      //url = 'https://test-api.yuelvhui.com' +url;//dev
    }
  } else if (urlType === 4) {
    if (url.indexOf('http') == -1) {
      url = 'https://shop.yuelvhui.com' + url
    }
  } else if (urlType === 5) {
    if (url.indexOf('http') == -1) {
      url = 'https://hotel.yuelvhui.com' + url
    }
  }
  if (params) {
    let paramsArray = [];

    Object.keys(params).forEach(key => paramsArray.push(params[key]))
    if (url.search(/\?/) === -1) {
      url += '/' + paramsArray.join('/')
    } else {
      url += '/' + paramsArray.join('/')
    }
  }

  let authorization = ''
  let timestamp = Date.parse(new Date()).toString()
  switch (type) {
    case 0:
      authorization = 'Sys 2001.'
      break
    case 1:
      authorization = 'Bearer ' + id + '.'
      break
    case 4:
      authorization = 'Leader ' + id + '.' + wx.getStorageSync('uid') + '.'
      break
  }
  if (url[url.length - 1] == '/') {
    url = url.substr(0, url.length - 1);
  }
  var temp = isUseMD5 ? authorization + timestamp + '.' + md5(type, key, timestamp) + '.1' : authorization + timestamp + '.' + key;
  //请求
  wx.request({
    url: url,
    method: 'GET',
    // data: {
    //   x: '',
    //   y: ''
    // },


    header: {
      'Content-Type': 'application/json',
      'Authorization': isUseMD5 ? authorization + timestamp + '.' + md5(type, key, timestamp) : authorization + timestamp + '.' + key,
      'app-info': JSON.stringify({
        "systemType": "applet"
      }),
    },
    success: function (res) {
      callback(res)
    }
  })
}


/*
 *  post请求
 *  url:请求地址
 *  params:参数,这里的参数格式是：{param1: 'value1',param2: 'value2'}
 *  callback:回调函数
 *  type:0系统 1用户登录以后
 * */
const post = (url, params, callback, type, key = '', isUseMD5 = true, id, urlType = 1, typeLogin = 'from') => {
  // urlType 接口url调取类型  1,默认接口 2,线路
  if (urlType === 1) {
    if (url.indexOf('http') == -1) {
      // url = 'http://center.yuetao.com' + url; //dev
      url = 'https://api2.yuelvhui.com' + url; //dev
      // url = 'http://test-api2.yuelvhui.com' +url;//dev
    }
  } else if (urlType === 2) {
    if (url.indexOf('http') == -1) {
      url = 'https://tour.yuelvhui.com' + url
      //url = 'https://test-api.yuelvhui.com' +url;//dev
    }

  } else if (urlType === 3) {
    if (url.indexOf('http') == -1) {
      url = 'https://open.yuelvhui.com' + url
      //url = 'https://test-api.yuelvhui.com' +url;//dev
    }
  } else if (urlType === 4) {
    if (url.indexOf('http') == -1) {
      // url = 'http://yuetaomall.kaifa.com' + url; //dev
      url = 'https://shop.yuelvhui.com' + url
      // url = 'http://test-shop.yuelvhui.com' + url
    }
  } else if (urlType === 5) {
    if (url.indexOf('http') == -1) {
      url = 'https://hotel.yuelvhui.com' + url
    }
  } else if (urlType === 6) {
    if (url.indexOf('http') == -1) {
      // url = 'http://test-shop.yuelvhui.com' + url // 京东
      url = 'https://private-api.yuelvhui.com' + url // 饿了吗
    }
  } else if (urlType === 7) {
    if (url.indexOf('http') == -1) {
      url = 'https://mallapi.yuelvdaren.com' + url // 大人商品支付
    }
  } else if (urlType === 8) {
    if (url.indexOf('http') == -1) {
      url = 'https://robot.yueshang.store' + url // 小悦机器人
    }
  }
  let timestamp = Date.parse(new Date()).toString()
  let authorization = ''
  switch (type) {
    case 0:
      authorization = 'Sys 2001.'
      break
    case 1:
      authorization = 'Bearer ' + id + '.'
      break
    case 4:
      authorization = 'Leader ' + id + '.' + wx.getStorageSync('uid') + '.'
      break
  }

  let obj = {}

  if (typeLogin == 'from') {
    // 登录
    obj = params
  } else {
    obj.encryptedData = encrypt(JSON.stringify(params))
    obj.iv = randomsix
  }

  //请求
  wx.request({
    url: url, //仅为示例，并非真实的接口地址
    method: 'POST',
    data: obj,
    header: {
      'Content-Type': 'application/json',
      'Authorization': isUseMD5 ? authorization + timestamp + '.' + md5(type, key, timestamp) : authorization + timestamp + '.' + key,
      'app-info': JSON.stringify({
        "systemType": "applet"
      }),
      // 'Authorization': 'Bearer 32383.1568296073000.2135fd38cc3f7e9dcc091cc203dc7cd5'
    },
    success: function (res) {
      callback(res)
    }
  })
}

const md5 = (type, key, timestamp) => {
  let str = ''
  switch (type) {
    case 0:
      str = '2001.' + timestamp + '.' + key
      // let md = MD5;
      let password;
      return password = hexMD5.hexMD5(str);
      break
    case 1:

      str = key
      return str
      break
  }

}


/**
 * 
 * 
 * 
 * */
// const formatTime = date => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()

//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }

// const formatNumber = n => {
//   n = n.toString()
//   return n[1] ? n : '0' + n
// }
function isMobile(value) {
  var pattern = /^1[35789][0123456789]\d{8}$/;
  if (!pattern.test(value)) {
    return false;
  }
  return true;
}

function isTelephone(value) {
  //"兼容格式: 国家代码(2到3位)-区号(2到3位)-电话号码(7到8位)-分机号(3位)"
  var pattern = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
  if (!pattern.test(value)) {
    return false;
  }
  return true;
}

function isTax(value) {

  var pattern = /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/;
  if (!pattern.test(value)) {
    return false;
  }
  return true;
}

function hideMobile(value) {
  var mobile = value;
  mobile = mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  return mobile;
}

function isEmail(value) {
  var pattern = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
  if (!pattern.test(value)) {
    return false;
  }
  return true;
}

/**
 * 是否是军官证
 */
function isOfficialCard(value) {
  var reg = /[\u4e00-\u9fa5](字第){1}(\d{4,8})(号?)$/;
  if (!reg.test(value)) {
    return false;
  }
  return true;
}

/**
 * 是否是护照
 */
function isPassport(value) {
  var reg = /^1[45][0-9]{7}|([P|p|S|s]\d{7})|([S|s|G|g]\d{8})|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8})|([H|h|M|m]\d{8，10})$/;
  if (!reg.test(value)) {
    return false;
  }
  return true;
}


function getTitleWithId(mapArr, idValue) {
  var title = '';
  for (var i = 0; i < mapArr.length; i++) {
    if (mapArr[i].id == idValue) {
      title = mapArr[i].title;
      break;
    }
  }
  return title;
}

function sortBy(field1, field2) {
  return function (a, b) {
    if (a.field1 == b.field1) return a.field2 - b.field2;
    return a.field1 - b.field1;
  }
}

/**
 * 根据年-月获取日历数据
 *  data.canlender = canlender;
 *  data.canlender.year = year;
 *  data.canlender.month = month;
 *  data.canlender.weeks = weeks;
 */
function getCanlenderData(year, month) {
  var that = this;
  var canlender = [];
  // var _date = new Date()
  // var year = _date.getFullYear()  //年
  // var month = _date.getMonth() + 1  //月
  // var date = _date.getDate()  //日
  // var year = 2017  //年
  // var month = 10  //月
  // var date = 6  //日
  // var day = _date.getDay()
  var firstDay = new Date(year, month - 1, 1).getDay();
  var lastMonthDays = [];
  for (var i = firstDay; i > 0; i--) {
    lastMonthDays.push({
      'date': new Date(year, month, -i).getDate(),
      'month': parseInt(month) - 1
    })
  }

  var currentMonthDys = [];
  for (var i = 1; i <= new Date(year, month, 0).getDate(); i++) {
    currentMonthDys.push({
      'date': i,
      'month': parseInt(month),
    })
  }
  var nextMonthDays = []
  var endDay = new Date(year, month, 0).getDay();
  for (var i = 1; i < 7 - endDay; i++) {

    nextMonthDays.push({
      'date': i,
      'month': parseInt(month) + 1 > 12 ? 1 : parseInt(month) + 1
    })
  }
  canlender = canlender.concat(lastMonthDays, currentMonthDys, nextMonthDays)
  var weeks = []
  for (var i = 0; i < canlender.length; i++) {
    if (i % 7 == 0) {
      weeks[parseInt(i / 7)] = new Array(7);
    }
    weeks[parseInt(i / 7)][i % 7] = canlender[i]
  }

  var data = {};
  // data.canlender = canlender;
  data.year = year;
  data.month = month;
  data.weeks = weeks;
  return data;
}

/**
 * 同步获取
 * 获取http header Authorization value
 */
function getUserAccessData() {

  var userAccessDataValue = {};
  if (isEmptyObject(constant.constant.userAccessData)) {
    try {
      var userAccessData = wx.getStorageSync(constant.constant.userAccessDataKey);
      if (typeof (userAccessData) != "undefined") {

        userAccessDataValue = userAccessData;
        constant.constant.userAccessData = userAccessData;

      }
    } catch (e) { }
  } else {
    userAccessDataValue = constant.constant.userAccessData;
  }

  return userAccessDataValue;
}


/**
 * 同步获取
 * 
 */
function getDistributerAccessData() {

  var distributerAccessValue = '';
  if (isEmptyObject(constant.constant.distributerAccessData)) {
    try {
      var distributerAccessData = wx.getStorageSync(constant.constant.distributerAccessDataKey);
      if (typeof (distributerAccessData) != "undefined") {

        distributerAccessValue = distributerAccessData;
        constant.constant.distributerAccessData = distributerAccessData;

      }
    } catch (e) { }
  } else {
    distributerAccessValue = constant.constant.distributerAccessData;
  }

  return distributerAccessValue;
}



function isEmptyObject(e) {
  var t;
  for (t in e)
    return !1;
  return !0
}

/** 
 * 是否为空字符串，有空格不是空字符串 
 * @param str 
 * @returns {Boolean} 
 */
function isEmptyStr(str) {
  if (str == null || typeof str == "undefined" ||
    str == "") {
    return true;
  }
  return false;
};

/**
 * 验证身份证
 */
function isValidID(ID) {
  if (typeof ID !== 'string') return '非法字符串';
  var city = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江 ",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北 ",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏 ",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外"
  };
  var birthday = ID.substr(6, 4) + '/' + Number(ID.substr(10, 2)) + '/' + Number(ID.substr(12, 2));
  var d = new Date(birthday);
  var newBirthday = d.getFullYear() + '/' + Number(d.getMonth() + 1) + '/' + Number(d.getDate());
  var currentTime = new Date().getTime();
  var time = d.getTime();
  var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  var sum = 0,
    i, residue;

  if (!/^\d{17}(\d|x)$/i.test(ID)) return false //'非法身份证';
  if (city[ID.substr(0, 2)] === undefined) return false //"非法地区";
  if (time >= currentTime || birthday !== newBirthday) return false //'非法生日';
  for (i = 0; i < 17; i++) {
    sum += ID.substr(i, 1) * arrInt[i];
  }
  residue = arrCh[sum % 11];
  if (residue !== ID.substr(17, 1)) return false //'非法身份证哦';

  //return city[ID.substr(0, 2)] + "," + birthday + "," + (ID.substr(16, 1) % 2 ? " 男" : "女")
  return true;
}

function checkPassWord(password) { //必须为字母加数字且长度不小于6位
  var str = password;
  if (str == null || str.length < 6) {
    return false;
  }
  var reg1 = new RegExp(/^[0-9A-Za-z]+$/);
  if (!reg1.test(str)) {
    return false;
  }
  var reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
  if (reg.test(str)) {
    return true;
  } else {
    return false;
  }
}
/**
 * 获取微信OpenId
 */
function getWxOpenId() {
  var openId = '';
  try {

    var userAccessData = getUserAccessData();
    //接口里面的返回的openid i是小写
    openId = userAccessData.openid;

  } catch (e) {

  }

  return openId;
}

/**
 * 跳转url是否为web
 */
function isHttpUrl(url) {
  if (!isEmptyStr(url)) {
    var startIndex = url.indexOf("http");
    if (startIndex == 0) {
      return true;
    }
  }
  return false;
}

/**
 * 微信授权 + 登录
 * */
function wxLogin(callback) {
  var _this = this;
}

/**
 * 阿拉伯数字转星期
 */

function returnweek(week) {
  if (week == 1) {
    return '一';
  } else if (week == 2) {
    return '二';
  } else if (week == 3) {
    return '三';
  } else if (week == 4) {
    return '四';
  } else if (week == 5) {
    return '五';
  } else if (week == 6) {
    return '六';
  } else if (week == 0) {
    return '日';
  }
}

/**
 * 定时存储清理缓存
 * 默认两天
 * 
 * 
 *  */

function expiration(key, value, expiration = 172800000) {

  let timestamp = Date.parse(new Date());
  //不错在 赋值
  if (wx.getStorageInfoSync(key) == '') {
    wx.setStorageSync(key, value);
    wx.setStorageSync(key + 'Expiration', timestamp + expiration);
  } else {
    //过期 清空
    let timestampExpiration = wx.getStorageSync(key + 'Expiration');
    if (timestampExpiration < timestamp) {
      wx.setStorageSync(key, '');
      wx.setStorageSync(key + 'Expiration', timestamp + expiration);
    } else {


    }

  }
}

/**
 * 默认分享数据
 */
function defaultShareData() {

  return {
    title: '悦淘',
    path: '/page/line/index/index?distributerId=' + getDistributerId(),
    success: function (res) {
      // 转发成功
    },
    fail: function (res) {
      // 转发失败
    }
  }
}
/**
 * 关系绑定 时效
 * 有效时长 90天 超时可以重新覆盖
 * 
 * */
function relations(reCode) {
  // 别人的码 -- 登录绑定使用（勿动）
  console.log(reCode)
  wx.setStorage({
    key: "ortherReCode",
    data: reCode
  });
}

/**
 * 删除数组中的指定元素
 * @param {*} val 
 */
Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
// 交集
Array.intersect = function (arr1, arr2) {
  if (Object.prototype.toString.call(arr1) === "[object Array]" && Object.prototype.toString.call(arr2) === "[object Array]") {
    return arr1.filter(function (v) {
      return arr2.indexOf(v) !== -1
    })
  }
}
/*
  二维码处理Scene返回obj
*/
function retrunScene(scene, callback) {
  scene = decodeURIComponent(scene);
  let sceneArr = scene.split("&");
  let sceneObj = {};
  for (let i = 0; i < sceneArr.length; i++) {
    let sceneArr1 = sceneArr[i].split('=');
    sceneObj[sceneArr1[0]] = sceneArr1[1];
  }

  callback(sceneObj);
}

module.exports = {
  formatTime: formatTime,
  Promise: Promise,
  Gesture: {
    touchstart: touchstart,
    isLeftSlide: isLeftSlide,
    isRightSlide: isRightSlide
  },
  get: get,
  post: post,
  writePhotosAlbum: writePhotosAlbum,
  isMobile: isMobile,
  isTelephone: isTelephone,
  isEmail: isEmail,
  isValidID: isValidID,
  isTax: isTax,
  hideMobile: hideMobile,
  getTitleWithId: getTitleWithId,
  sortBy: sortBy,
  getCanlenderData: getCanlenderData,
  getUserAccessData: getUserAccessData,
  getDistributerAccessData: getDistributerAccessData,
  isEmptyObject: isEmptyObject,
  isEmptyStr: isEmptyStr,
  isHttpUrl: isHttpUrl,
  getWxOpenId: getWxOpenId,
  defaultShareData: defaultShareData,
  wxLogin: wxLogin,
  returnweek: returnweek,
  checkPassWord: checkPassWord,
  expiration: expiration,
  relations: relations,
  retrunScene: retrunScene,
  encrypt: encrypt,
  decrypt: decrypt
}