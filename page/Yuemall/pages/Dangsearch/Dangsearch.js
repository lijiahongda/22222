// page/Yuemall//pages/Dangsearch/Dangsearch.js
import {
  get,
  post
} from '../../../../utils/util.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // search: '搜索',
    inputvalue: '',
    history: [],
    inpuVal: '',
    LoadingStatus: false,
    searchDropGoods:[],
    tuijian:[],
    keyword:'',
    showModal: false,
    page:1,
    pageSize:10
  },
  getList:function(){
    let that=this
    post('/mall/dd/getDdSearchWord',{

    }, (res) => {
      if (res.data.code == 200) {
        that.setData({
          tuijian: res.data.data
        })
        console.log(res.data)
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
  },
  titleList: function (e) {
    let that = this
    wx.navigateTo({
      url: '/page/Yuemall/pages/DangSearchResult/DangSearchResult?name=' + e.currentTarget.dataset.name,
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
        if (this.data.RecentSearch.length == 10) {
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
  confirm: function(e) {
    console.log(e)
      let _this = this;
      let arr = _this.data.history;
      if (_this.data.inputvalue == "") {
        //判断是否已经存在
        let arrnum = arr.indexOf(_this.data.inpuVal);
        if (arrnum != -1) {
          //删除已存在后重新插入至数组
          arr.splice(arrnum, 1)
          arr.unshift(_this.data.inpuVal);
        } else {
          arr.unshift(_this.data.inpuVal);
        }
        _this.setData({
          showModal: false
        })
      } else {
        let arr_num = arr.indexOf(_this.data.inputvalue);
        if (arr_num != -1) {
          arr.splice(arr_num, 1)
          arr.unshift(_this.data.inputvalue);
        } else {
          arr.unshift(_this.data.inputvalue);
        }
      }
      wx.setStorage({
        key: 'history_arr',
        data: arr,
      })
      //取出搜索记录
      wx.getStorage({
        key: 'history_arr',
        success: function(res) {
          _this.setData({
            history: res.data
          })
        },
      })
      wx.navigateTo({
        url: '/page/Yuemall/pages/DangSearchResult/DangSearchResult?name='+e.detail.value,
      })
      _this.setData({
        inputvalue:''
      })

    
  },
  onSearchdel: function() {
    this.setData({
      history: []
    });
    //清空缓存
    wx.removeStorage({
      key: 'history_arr',

    })
  },
  bindinput: function(e) {
    let that=this
    that.setData({
      inpuVal: e.detail.value
    })
    if (!e.detail.value) {
      that.setData({
        showModal: false,
        inpuVal: '',
        searchDropGoods: []
      })
      return
    } else {
      that.setData({
        showModalStatus: true,
        inpuVal: e.detail.value
      })
      post('/mall/search/v2/suggestion', {
        keyword: that.data.inpuVal
      }, (res) => {
        if (res.data.code == 200) {
          console.log(res)
          
          
          if(res.data.data==''){
            that.setData({
              showModal: false
            })
          }else{
            that.setData({
            searchDropGoods: res.data.data,
            showModal:true
          })
          }
        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 4)
    }
  },
  RecentSearch: function (e) {
    console.log(e.currentTarget.dataset.text)
    wx.navigateTo({
      url: '/page/Yuemall/pages/DangSearchResult/DangSearchResult?name=' + e.currentTarget.dataset.text
    })
  },
  bindblur: function(e) {
    let that = this
    // that.confirm(e)
    that.setData({
      showModal:false
    })
  },
  focus: function() {
    let that = this

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let _this = this;
    _this.getList()
    wx.getStorage({
      key: 'history_arr',
      success: function(res) {
        _this.setData({
          history: res.data
        })
      },
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

  }
})