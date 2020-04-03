//获取应用实例
const app = getApp()
const ajax_url = app.globalData.ajax_url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    ishideback: false,
    my_class: true,
    activeList: [], //轮播详情
    barList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.type == 'bar') {
      this.getBar(options.activeId)
    } else {
      this.getFind(options.activeId)
    }
  },
  // 获取轮播活动
  getFind: function(data) {
    var _this = this;
    // 获取首页轮播
    wx.request({
      url: ajax_url + "/act/find/" + data,
      method: "get",
      success: function(res) {
        if (res.data.code == '200') {
          _this.setData({
            activeList: res.data.data
          })
        } else {
          // wx.showModal({
          //   content: res.data.message,
          //   confirmColor: '#6928E2',
          //   showCancel: false,
          // })
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000,
          })
        }
      }
    })
  },
  // 获取bar活动
  getBar: function(data) {
    var _this = this;
    wx.request({
      url: ajax_url + "/banner/content/" + data,
      method: "get",
      success: function(res) {
        if (res.data.code == '200') {
          
          _this.setData({
            barList: res.data.data
          })
        } else {
          // wx.showModal({
          //   content: res.data.message,
          //   confirmColor: '#6928E2',
          //   showCancel: false,
          // })
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000,
          })
        }
      }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})