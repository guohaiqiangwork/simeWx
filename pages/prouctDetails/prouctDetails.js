// pages/prouctDetails/prouctDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    ishideback: false,
    my_class: false,
    banners: [
      { businessId: '1', picUrl: "/image/switch/1.jpg" },
      { businessId: '2', picUrl: "/image/switch/2.jpg" },
      {
        businessId: '1',
        picUrl: "http://dcdn.it120.cc/2019/12/29/2e79921a-92b3-4d1d-8182-cb3d524be5fb.png"
      },
      { businessId: '2', picUrl: "/image/switch/3.jpg" }
    ], //轮播数组
    gList: [{ name: '原料产地', content: '丹麦' }, { name: '保质期', content: '3天冷藏（建议收货当天食用）' }, { name: '储藏温度', content: '0℃ - 5℃' }, { name: '商家电话', content: '400-1005-200' }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
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