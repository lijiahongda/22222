// page/Yuemall//pages/DangdangList/DangdangList.js
import {
  get,
  post
} from '../../../../utils/util.js'
Page({


  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    idx: 0,
    idxs: 0,
    selectur: 'new1',
    LoadingStatus: false,
    keyword: '',
    searchDropGoods: [],
    sort: 0,
    key: [{
      id: '',
      name: "全部"
    }],
    fixeid: '',
    page: 1,
    pageSize: 10,
    isHaveMore: true,
    names: '',
    id: '',
    sorttype: 1
  },
  onTapclier: function(e) {
    let that = this
    let {
      index,
      name,
      id,
      sort
    } = e.currentTarget.dataset

    if (name === '全部') {
      that.setData({
        idx: index,
        fixeid: that.data.id,
        keyword: that.data.names
      })
    } else {
      that.setData({
        idx: index,
        fixeid: id,
        keyword: name
      })
    }
    that.initData(name, id, sort, '', that.data.sorttype)
  },
  initData: function (name, id, sort, init, sorttype) {//name 用于区分分类 id 选择全部以外的分类所传的三级ID　sort =1是升序 =0是降序 init 如果是init是初始化否则不是 sorttype 如果是3是价格排序 其余是1
    console.log(sort)
    let that = this
    let obj = {}
    obj = {
      sorttype: sorttype,
      sort: sort,
      indexKey: "channelId",
      channelId: 8,
      keyword: that.data.keyword,
      page: that.data.page,
      pageSize: that.data.pageSize,
      mid: wx.getStorageSync('uid') ? wx.getStorageSync('uid'):0
    }
    if (name == '全部') {
      obj.categorySecondId = that.data.fixeid
    } else if (that.data.selectur == 'price' || that.data.selectur == 'new1') {
      obj.categorySecondId = that.data.fixeid
    } else {
      obj.categoryThreeId = id
    }
    console.log(obj)

    post('/mall/dd/getSearchData', obj, (res) => {
      if (res.data.code == 200) {
        that.setData({
          searchDropGoods: res.data.data,
        })
        if (init == 'init') {
          that.setData({
            list: that.data.key.concat(res.data.category)
          })
        }
      }
      console.log(res)
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  // 价格
  selecttabs: function(e) {
    console.log(e)
    let that = this
    let {
      sort,
      id
    } = e.currentTarget.dataset
    if (sort == 0) {
      sort = 1
    } else {
      sort = 0
    }
    that.setData({
      selectur: id,
      sorttype: 3,
      sort: sort
    })
    console.log(that.data.selectur)
    that.initData(that.data.keyword, that.data.fixeid, sort, '', that.data.sorttype)
  },
  // 综合
  selecttaps: function(e) {
    let that = this
    that.setData({
      selectur: e.currentTarget.dataset.id,
      sorttype:1
    })
    that.initData(that.data.keyword, that.data.fixeid, that.data.sort, '', that.data.sorttype)
  },
  detailbook: function(e) {
    console.log(22, e)
    // console.log(e.currentTarget.dataset.id,77)
    wx.navigateTo({
      url: '/page/Yuemall/pages/DangBookDetail/DangBookDetail?goodsId=' + e.currentTarget.dataset.id + '&skuid=' + e.currentTarget.dataset.skuid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      keyword: options.name,
      fixeid: options.id
    })
    that.initData('全部', options.id, 0, 'init', that.data.sorttype)
    wx.setNavigationBarTitle({
      title: options.name
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
    let that = this
    if (this.data.isHaveMore) {
      post('/mall/dd/getSearchData', {
        sorttype: 1,
        sort: 0,
        indexKey: "channelId",
        channelId: 8,
        categorySecondId: that.data.fixeid,
        keyword: that.data.keyword,
        page: that.data.page,
        pageSize: that.data.pageSize,
        mid: ''
      }, (res) => {
        console.log(res)
        if (res.data.code == 200) {
          that.setData({
            searchDropGoods: that.data.searchDropGoods.concat(res.data.data),
            page: res.data.data.length > 0 ? (that.data.page + 1) : that.data.page,
            list: that.data.key.concat(res.data.category)
          })
        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    } else {
      wx.showToast({
        title: '没有更多了！',
        icon: 'none'
      })
    }
  }
})