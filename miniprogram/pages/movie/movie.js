// pages/movie/movie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie_list:[]
  },
  query_movie_list(){
    wx.showLoading({
      title: '正在加载',
    })
    wx.cloud.callFunction({
      name:'movieList',
      data:{
        start: this.data.movie_list.length,
        count:10
      }
    }).then(res=>{
      const list = JSON.parse(res.result).subjects
      this.setData({
        movie_list:this.data.movie_list.concat(list)
      })
      console.log(this.data.movie_list)
    }).finally(res=>{
      wx.hideLoading()
    })
  },
  navigatTo(event){
    const movie_id= event.target.dataset.movieid
    wx.navigateTo({
      url: `../comment/comment?movieid=${movie_id}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.query_movie_list()
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
this.query_movie_list()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})