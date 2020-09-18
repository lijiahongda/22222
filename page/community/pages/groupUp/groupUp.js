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
    status: 0, // 1待审核 2审核通过 3审核不通过
    fileList: [],
    upgradeContent:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      status: options.status
    })
    console.log(options.status)
  },

  onShow(){
    this.getData()
  },
  // 文件上传
  choseImg(e){
    var that = this
    wx.chooseImage({
      count: 2,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        that.setData({ fileList:[] });
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        for (let i in tempFilePaths){
          wx.uploadFile({
            url: 'https://api2.yuelvhui.com/app/third/upload', //仅为示例，非真实的接口地址
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              'user': 'test'
            },
            success(resa) {
              // 上传完成需要更新 fileList
              // 上传完成需要更新 fileList
              const { fileList } = that.data;
              let url = JSON.parse(resa.data).url
              fileList.push({ url });
              that.setData({ fileList });
            }
          })
        }
      }
    })
  },
  afterRead(event) {
    let that=this
    console.log(event)
    const { file } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: 'https://api2.yuelvhui.com/app/third/upload',
      filePath: file.path,
      header:{
        'Content-Type':'application/json'
      },
      name: 'file',
      formData: {},
      success(res) {
        // 上传完成需要更新 fileList
        const { fileList = [] } = that.data;
        let url = JSON.parse(res.data).url
        fileList.push({ ...file, url });
        that.setData({ fileList });
      }
    });
  },

  goTwo(){
    this.setData({
      status:0
    })
  },

  goImg(){
    wx.navigateTo({
      url: '/page/community/pages/webImg/webImg?img=' + this.data.data.exampleImages.join(","),
    })
  },

  getData(){
    let that=this,
      data={
        mid: this.data.uid,
        source: 1,
      }
    wx.showLoading({
      title: '加载中',
    })
    post('/api/community/groupRule/upgrade', data, (res) => {
      wx.hideLoading()
      if (res.data.code == 200) {
        that.setData({
          data: res.data.data,
          groupId: res.data.data.groupId,
          upgradeContent: res.data.data.upgradeContent
        })
      }
    }, 1, this.data.token, true, this.data.uid, 8)
  },
  copy(e) {
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

  // 提交审核
  submit(){
    let imagesList = [], images
    this.data.fileList.map(obj=>{
      imagesList.push(obj.url)
    })
    images = imagesList.join(',')
    console.log(images)
    let that = this,
      data={
        groupId: this.data.groupId,
        images,
        mid: this.data.uid
      }
    post('/api/community/groupRule/applyReview', data, (res) => {
      if (res.data.code == 200) {
        that.setData({
          status:1
        })
      }else{
        wx.showToast({
          title: res.data.msg,
        })
      }
    }, 1, this.data.token, true, this.data.uid, 8)
  },

  goGroup(){
    wx.navigateTo({
      url: '/page/community/pages/myGroup/myGroup',
    })
  }
})