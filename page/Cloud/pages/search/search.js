import {
  get,
  post
} from '../../../../utils/util.js';
let RecentSearch = []

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: [],
    uid: '',
    token: '',
    keyWord: '',
    showModalStatus: false, //弹窗状态
    searchDropGoods: [],
    RecentSearch: [],
    channelid: ''
  },
  // 发现搜索
  DiscoverySearch: function () {
    let that = this
    get('/mall/getKeyWords', {
    }, (res) => {
      if (res.data.code == 200) {
        console.log(res.data.data)
        that.setData({
          DiscoveryList: res.data.data
        })
        // }
      } else {

      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  del: function () {
    let that = this
    that.setData({
      RecentSearch: []
    })
    wx.setStorage({
      key: 'RecentSearch',
      data: that.data.RecentSearch,
    })
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    // animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    this.setData({
      showModal: false
    })
    // 隐藏遮罩层
    this.setData({
      showModal: false,
    })
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    // animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  // 搜索记录中点击 点击类别
  RecentSearch: function (e) {
    wx.navigateTo({
      url: '../searchResult/searchResult?keyWord=' + e.currentTarget.dataset.keyword +'&isSearch=1&channelId=all',
    })
  },
  // input中输入搜索内容，点击搜索/完成
  bindconfirm: function (e) {
    let that = this;
    if (!that.data.keyWord){
      return
    }
    wx.navigateTo({
      url: '../searchResult/searchResult?keyWord=' + that.data.keyWord + '&isSearch=1&channelId=all',
    })

    let name
    if (!(that.data.keyWord.match(/^[ ]+$/))){
      let isContaine = false
      for (var v of that.data.RecentSearch) {
        if (that.data.keyWord == v.keyWord) {
          isContaine = true
        }
      }
      if (!isContaine) {
        this.data.RecentSearch.unshift({
          keyWord: that.data.keyWord,
        })
        if (this.data.RecentSearch.length == 10){
          this.data.RecentSearch.pop()
        }
      }
      that.setData({
        RecentSearch: this.data.RecentSearch
      })
    }
    wx.setStorage({
      key: 'RecentSearch',
      data: this.data.RecentSearch,
    })
  },
  titleList: function (e) {
    let that = this
    wx.navigateTo({
      url: '../searchResult/searchResult?keyWord=' + e.currentTarget.dataset.name + '&isSearch=1',
    })
    let name
    if (!(e.currentTarget.dataset.name.match(/^[ ]+$/))) {
      let isContaine = false
      for (var v of that.data.RecentSearch) {
        if (e.currentTarget.dataset.name == v.keyWord) {
          isContaine = true
        }
      }
      if (!isContaine) {
        this.data.RecentSearch.unshift({
          keyWord: e.currentTarget.dataset.name,
        })
        if (this.data.RecentSearch.length == 10){
          this.data.RecentSearch.pop()
        }
      }
      that.setData({
        RecentSearch: this.data.RecentSearch
      })
    }
    wx.setStorage({
      key: 'RecentSearch',
      data: this.data.RecentSearch,
    })
    // this.hideModal()
  },
  
  focus: function () {
    let that = this;
    that.showModal()
  },
  bindblur: function () {
    let that = this;
    // this.hideModal()
  },
  close: function () {
    this.hideModal()
  },
  // 输入搜索内容请求接口
  bindinput: function (e) {
    let that = this;
    if (!e.detail.value){
      that.setData({
        showModalStatus:false,
        keyWord:'',
        searchDropGoods:[]
      })
      return
    }else{
      that.setData({
        showModalStatus: true,
        keyWord: e.detail.value
      })
      post('/mall/search/v2/suggestion', {
        keyword: that.data.keyWord
      }, (res) => {
        if (res.data.code == 200) {
          that.setData({
            searchDropGoods: res.data.data
          })
        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    }
  },


  onLoad: function (options) {
    console.log(options,'optttttt')
    let RecentSearch = wx.getStorageSync('RecentSearch')
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      RecentSearch: RecentSearch ? RecentSearch : [],
      channelid: options.channelid
    })

    if (options.channelid == undefined) {
      this.setData({
        channelid: ''
      })
    }
    console.log(this.data.RecentSearch)
    this.DiscoverySearch()
  },
  onShow: function () {
    wx.setStorage({
      key: 'curCar',
      data: '1',
    })
  },
  // 分类下右边三个 暂时用不到
  // contentList: function (e) {
  //   let that = this
  //   wx.navigateTo({
  //     url: '../searchResult/searchResult?keyWord=' + that.data.keyWord + '&brandId=' + e.currentTarget.dataset.brandid + '&contentTile=' + e.currentTarget.dataset.nameid + '&contentid=' + e.currentTarget.dataset.id + '&channelid=' + that.data.channelid,
  //   })
  //   let name
  //   if (this.data.RecentSearch.length == 10) {
  //     if (e.currentTarget.dataset.name.match(/^[ ]+$/)) {
  //     } else {
  //       let isContaine = false
  //       for (var v of that.data.RecentSearch) {
  //         if (e.currentTarget.dataset.name == v.keyWord) {
  //           isContaine = true
  //         }
  //       }
  //       if (!isContaine) {
  //         this.data.RecentSearch.unshift({
  //           keyWord: e.currentTarget.dataset.name,
  //           brandId: e.currentTarget.dataset.brandid,
  //           contentid: e.currentTarget.dataset.id,
  //           nameid: e.currentTarget.dataset.nameid
  //         })
  //         this.data.RecentSearch.pop()
  //       }
  //       that.setData({
  //         RecentSearch: this.data.RecentSearch
  //       })
  //     }
  //   } else {
  //     console.log('=====')
  //     if (e.currentTarget.dataset.name.match(/^[ ]+$/)) {

  //     } else {
  //       let isContaine = false
  //       for (var v of that.data.RecentSearch) {
  //         if (e.currentTarget.dataset.name == v.keyWord) {
  //           isContaine = true
  //         }
  //       }
  //       if (!isContaine) {
  //         this.data.RecentSearch.unshift({
  //           keyWord: e.currentTarget.dataset.name,
  //           brandId: e.currentTarget.dataset.brandid,
  //           contentid: e.currentTarget.dataset.id,
  //           nameid: e.currentTarget.dataset.nameid
  //         })
  //       }
  //       that.setData({
  //         RecentSearch: this.data.RecentSearch
  //       })
  //     }
  //   }
  //   wx.setStorage({
  //     key: 'RecentSearch',
  //     data: this.data.RecentSearch,
  //   })
  //   this.hideModal()
  // },
})