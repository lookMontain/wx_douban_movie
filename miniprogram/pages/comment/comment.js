// pages/comment/comment.js
const db= wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    content: '',
    score: 5,
    images: [],
    movieid: 0,
    fileIds:[]
  },
  onContentChange(event) {
    this.setData({
      content: event.detail
    })
  },
  onScoreChange(event) {
    this.setData({
      score: event.detail
    })
  },
  submit() {
    // 先把文件上传到云存储
    const promiseArr = []
    console.log(this.data.images)
    for (let i = 0; i < this.data.images.length; i++) {
      const p = new Promise((reslove, reject) => {
        const item = this.data.images[i]
        const item_list=item.split('.')
        const suffix = item_list[item_list.length-1]
        wx.cloud.uploadFile({
          cloudPath: new Date().getDate() + '.'+suffix,
          filePath: item, // 文件路径
          success: res => {
            // get resource ID
            console.log(res.fileID)
            this.setData({
              fileIds:this.data.fileIds.concat([res.fileID])
            })

            reslove()
          },
          fail: err => {
            // handle error
          }
        })
      })
      promiseArr.push(p)
    }

    Promise.all(promiseArr).then(res=>{
     db.collection('comment').add({
       data:{
         content:this.data.content,
         score:this.data.score,
         fielId:this.data.fileIds,
         movieid:this.data.movieid
       }
     }).then(res=>{
       wx.showToast({
         title: '上传成功',
       })
     })
    })
  },
  upload_img() {
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        this.setData({
          images: this.data.images.concat(tempFilePaths)
        })
      }
    })
  },
  query_one(id) {
    wx.cloud.callFunction({
      name: 'getDetail',
      data: {
        movieid: id
      }
    }).then(res => {
      console.log(res)
      this.setData({
        detail: JSON.parse(res.result)
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.data.movieid = options.movieid
    this.query_one(options.movieid)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})