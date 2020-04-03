const app = getApp()
const ajax_url = app.globalData.ajax_url;
Page({
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    ishideback: false,
    my_class: true,
  },
  // 去活动规则
  goRule: function() {
    wx.navigateTo({
      url: '../activityRule/activityRule',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {}
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getMyFrind() //获取我的好友
  },
  // 获取我的好友列表
  getMyFrind: function() {
    var _this = this;
    var data = {
      pageNum: 1,
      pageSize: 1000,
      data: {
        id: wx.getStorageSync('useId')
      }
    }
    wx.request({
      url: ajax_url + '/mb/myFirend',
      method: "post",
      data:data,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        if (res.data.code == '200') {
          console.log(res.data.data.totalPrice);
        _this.setData({
          friendList: res.data.data.result.records,
          totalPrice: res.data.data.totalPrice
        });
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