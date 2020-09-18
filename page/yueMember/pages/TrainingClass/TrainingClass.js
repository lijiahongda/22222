// page/yueMember/pages/TrainingClass/TrainingClass.js
import {
  get,
  post,
  relations,
  retrunScene
} from '../../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    pageSize:10,
    isHaveMore:true
  },
  // 轮播
  detail:function(e){
    wx.navigateTo({
      url: '/page/yueMember/pages/UniversityDetails/UniversityDetails?id=' + e.currentTarget.dataset.id + '&type=' + 0,
    })
  },
  subList:function(e){
    wx.navigateTo({
      url: '/page/yueMember/pages/UniversityList/UniversityList?id='+e.currentTarget.dataset.id,
    })
    // if (e.currentTarget.dataset.type == 0){
    //   wx.navigateTo({
    //     url: '/page/yueMember/pages/UniversityDetails/UniversityDetails?aid=' + e.currentTarget.dataset.aid + '&type=' + e.currentTarget.dataset.type,
    //   })
    // } else if (e.currentTarget.dataset.type == 1){
    //   wx.navigateTo({
    //     url: '/page/yueMember/pages/UniversityDetails/UniversityDetails?aid=' + e.currentTarget.dataset.aid + '&type=' + e.currentTarget.dataset.type,
    //   })
    // }else if(e.currentTarget.dataset.type == 2){
    //   wx.navigateTo({
    //     url: '/page/oneself/pages/FunctionIntroduction/FunctionIntroduction?type=' + 4 + '&MyreCode=' + wx.getStorageSync('selfReCode'),
    //   })
    // }
  },
  // 培训课程
  Class:function(){
    let that =this
    get('/university/v2/getTrainingCourseListV1/' + that.data.pageSize+'/'+that.data.page, {}, (res) => {
      if (res.data.code == 200) {
       that.setData({
         banners: res.data.data.banners,
         subList: res.data.data.subList,
         list: res.data.data.articleList.list,
         page:that.data.page+1
       })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true);
  },
  //精品沙龙。大咖风采、环球热点。战略合作
  list: function (type) {
    let that = this
    get('/university/v2/list/' + type+'/' + that.data.pageSize + '/' + that.data.page, {}, (res) => {
      if (res.data.code == 200) {
        console.log(res)
        that.setData({
          list: res.data.data.list,
          page: that.data.page + 1
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      type:options.type
    })
    if (options.type == 10001){
      that.Class()
    }else{
      console.log(options.type)
      that.list(options.type)
    }
    wx.setNavigationBarTitle({
      title: options.name,
    })
  },
  onReachBottom: function () {
    let that = this
    if(that.data.type == 10001){
      if (this.data.isHaveMore) {
        get('/university/v2/getTrainingCourseListV1/' + that.data.pageSize + '/' + that.data.page, {}, (res) => {
          if (res.data.code == 200) {
            that.setData({
              list: that.data.list.concat(res.data.data.articleList.list),
              page: res.data.data.articleList.list.length > 0 ? (that.data.page + 1) : that.data.page,
              isHaveMore: res.data.data.articleList.list.length > 0 ? true : false
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true);
      } else {
        wx.showToast({
          title: '没有更多了！',
          icon: 'none'
        })
      }
    }else{
      if (this.data.isHaveMore) {
        get('/university/v2/list/' + that.data.type + '/' + that.data.pageSize + '/' + that.data.page, {}, (res) => {
          if (res.data.code == 200) {
            that.setData({
              list: that.data.list.concat(res.data.data.list),
              page: res.data.data.list.length > 0 ? (that.data.page + 1) : that.data.page,
              isHaveMore: res.data.data.list.length > 0 ? true : false
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true);
      } else {
        wx.showToast({
          title: '没有更多了！',
          icon: 'none'
        })
      }
    }
  }
})