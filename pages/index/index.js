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
    ], //轮播数组
    tabList: [
      { name: '面点速食', picUrl: "/image/switch/2.jpg" },
      { name: '酒水饮料', picUrl: "/image/switch/1.jpg" },
      { name: '粮油干货', picUrl: "/image/switch/3.jpg" },
      { name: '美妆百货', picUrl: "/image/switch/2.jpg" },
      { name: '中外茶叶', picUrl: "/image/switch/2.jpg" },
      { name: '母婴保健', picUrl: "/image/switch/1.jpg" },
      { name: '家装家纺', picUrl: "/image/switch/2.jpg" },
      { name: '日用纸品', picUrl: "/image/switch/1.jpg" },
      { name: '电子数码', picUrl: "/image/switch/2.jpg" }
    
    ],//导航栏数组
    newList:[
      { naem: '海南凤梨（1个装）', picUrl: '/image/switch/2.jpg', price: '13.00', falg:'极甜凤梨甜到心里',id:'001'},
      { naem: '海南凤梨（1个装）', picUrl: '/image/switch/2.jpg', price: '13.00', falg: '极甜凤梨甜到心里', id: '002'},
      { naem: '海南凤梨（1个装）', picUrl: '/image/switch/2.jpg', price: '13.00', falg: '极甜凤梨甜到心里', id: '003' },
      { naem: '海南凤梨（1个装）', picUrl: '/image/switch/2.jpg', price: '13.00', falg: '极甜凤梨甜到心里', id: '004'},
      { naem: '海南凤梨（1个装）', picUrl: '/image/switch/2.jpg', price: '13.00', falg: '极甜凤梨甜到心里', id: '005'},
      { naem: '海南凤梨（1个装）', picUrl: '/image/switch/2.jpg', price: '13.00', falg: '极甜凤梨甜到心里', id: '006'},
      { naem: '海南凤梨（1个装）', picUrl: '/image/switch/2.jpg', price: '13.00', falg: '极甜凤梨甜到心里' },
    ],//新品发现
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
  // 去搜素页面
  bindconfirm:function(e){
    console.log(e.detail.value);
    wx.navigateTo({
      url: '/pages/searchResult/searchResult?value=' + e.detail.value,
    })
  },
  // 去产品详情
  goProudctDetails: function (e) {
    console.log(e.currentTarget.dataset.productid);
    wx.navigateTo({
      url: '/pages/prouctDetails/prouctDetails?productId=' + e.currentTarget.dataset.productid,
    })
  },
  
})
