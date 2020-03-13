//index.js
//获取应用实例
const app = getApp()
const ajax_url = app.globalData.ajax_url;
Page({
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    ishideback: true,
    banners: [
      { businessId: '1', picUrl: "/image/switch/1.jpg" },
      { businessId: '2', picUrl: "/image/switch/2.jpg" },
      {
        businessId: '1',
        picUrl: "http://dcdn.it120.cc/2019/12/29/2e79921a-92b3-4d1d-8182-cb3d524be5fb.png"
      },
      { businessId: '2', picUrl: "/image/switch/3.jpg" }
    ],

    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  goSet:function(){
    wx.setStorage({
      key: 'key',
      data: 'sdfjakl是东方就是快乐'
    })
  },
  getSet:function(){
   const value = wx.getStorageSync('key');
    console.log(value)
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  bindconfirm:function(e){
    this.setData({
      inputVal: e.detail.value
    })
    alert(inputVal);
    // wx.navigateTo({
    //   url: '/pages/goods/list?name=' + this.data.inputVal,
    // })
  }
})
