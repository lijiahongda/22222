import {
  get,
  post,
  relations
} from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    myself:{},
    parentUser:{},
    teacher:{},
    fans:[],
    showEdit:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token')
    })
    this.getData()
  },
  getData() {
    let that = this,
      data = {
        page: this.data.page, //页数
        pageSize: 10, //一页展示数
        source: 1
      }
    post('/community/groupRule/addressBook', data, (res) => {
      if (res.data.code == 200) {
        that.setData({
          myself: res.data.data.myself,
          parentUser: res.data.data.parentUser,
          teacher: res.data.data.teacher, 
          fans: res.data.data.fans.list
        })
      }
    }, 1, this.data.token, true, this.data.uid, 1)
  },
  showEditBind(){
    this.setData({
      showEdit:true
    })
  },
  bindconfirm(e){
    console.log(e)
    let that = this,
      data = {
        wechat: e.detail.value
      }
    post('/community/groupRule/updateWx', data, (res) => {
      if (res.data.code == 200) {
        wx.showToast({
          title: res.data.msg,
        })
      }
    }, 1, this.data.token, true, this.data.uid, 1)
  }

  
})