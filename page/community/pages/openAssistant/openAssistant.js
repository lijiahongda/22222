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
    data:{},
    oneStep:{},
    twoStep:{},
    threeStep:{},
    step:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      groupId: options.groupId
    })
    this.getData()
  },

  getData() {
    let that = this,
      data = {
        groupId: this.data.groupId,
        mid: this.data.uid
      }
    post('/api/community/groupRule/applyCopyWriting', data, (res) => {
      if (res.data.code == 200) {
        res.data.data.oneStep.content = res.data.data.oneStep.content.split('\n')
        res.data.data.twoStep.content = res.data.data.twoStep.content.split('\n')
        res.data.data.threeStep[1].content = res.data.data.threeStep[1].content.split('\n')
        res.data.data.threeStep[2].content = res.data.data.threeStep[2].content.split('\n')
        that.setData({
          data: res.data.data,
          oneStep: res.data.data.oneStep,
          twoStep: res.data.data.twoStep,
          threeStep: res.data.data.threeStep,
          content: res.data.data.threeStep[0].content
        })
      }
    }, 1, this.data.token, true, this.data.uid, 8)
  },

  apply(){
    let that = this,
      data = {
        groupId: this.data.groupId,
        mid: this.data.uid
      }
    wx.showModal({
      title: '请确认群您的群人数',
      content: '您的群人数大于等于' + this.data.data.userNum + '人',
      success(res) {
        if (res.confirm) {
          post('/api/community/groupRule/applyGroupAssistant', data, (res) => {
            if (res.data.code == 200 || res.data.code == 600) {
              that.setData({
                step: that.data.step + 1,
                number: res.data.data.assistantWx
              })
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            }
          }, 1, that.data.token, true, that.data.uid, 8)
        } else if (res.cancel) {

        }
      }
    })
  },

  copy: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success(res) {
        wx.getClipboardData({
          success(res) { }
        })
      },
      complete(res) { }
    })
  },

  next(){
    let that=this
    wx.showModal({
      title: '请确认群名称已修改',
      content: '请确认群名称已修改为【' + this.data.data.groupName +'】否则无法成功开通助理哦~',
      success(res) {
        if (res.confirm) {
          that.setData({
            step: that.data.step + 1
          })
        } else if (res.cancel) {
          
        }
      }
    })
  },

  pre(){
    this.setData({
      step: this.data.step - 1
    })
  }


})