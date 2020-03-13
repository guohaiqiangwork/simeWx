// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    ishideback: true,
    name: '留一手',
    hiddenName: false
  },
  getUserMessage: function () {
    //alert("获取个人信息")
    getUserDetail(mui, plus.storage.getItem('memberId'), function (data) {
      if (data.code == 200) {
       console.log(JSON.stringify(data))
      } else if (data.code == 401 || data.code == 1500) {
        //alert("需要登录");
        //gotoLoginIn()
      } else {
        tipShow(data.message)
        $("#code").val('')
      }
    });
  },
  // 获取门店列表
  GetList: function (that) {
    this.setData({
      refresh_falg: false
    });
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: ajax_url + '/mb/find/'+'',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',// 默认值
        'Authorization': "Bearer" + " " + plus.storage.getItem('Token'),
        'client': 'APP',
      },
      data: {
     
      },
      success: function (res) {
        wx.hideLoading();
        that.setData({
          refresh_falg: true
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    console.log('离开时间')
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

  },

  // 我的订单页面跳转
  goMyOrder: function (e) {
    let falg = e.currentTarget.dataset.falg;
    wx.navigateTo({
      url: '../myOrder/myOrder?index=' + falg,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { }
    })
  },
 
  
})