//index.js
//获取应用实例
const app = getApp()
const ajax_url = app.globalData.ajax_url;
Page({
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    ishideback: true,
    banners: [], //轮播数组
    tabList: [], //导航栏数组
    newList: [], //新品发现
    proudeList: [{
        title: '酒水饮料',
        id: "002",
        data: [{
            naem: '海南凤梨（1个装）',
            picUrl: '/image/switch/2.jpg',
            price: '13.00',
            falg: '极甜凤梨甜到心里',
            id: '001'
          },
          {
            naem: '海南凤梨（1个装）',
            picUrl: '/image/switch/2.jpg',
            price: '13.00',
            falg: '极甜凤梨甜到心里',
            id: '002'
          },
          {
            naem: '海南凤梨（1个装）',
            picUrl: '/image/switch/2.jpg',
            price: '13.00',
            falg: '极甜凤梨甜到心里',
            id: '003'
          },
          {
            naem: '海南凤梨（1个装）',
            picUrl: '/image/switch/2.jpg',
            price: '13.00',
            falg: '极甜凤梨甜到心里',
            id: '004'
          },
          {
            naem: '海南凤梨（1个装）',
            picUrl: '/image/switch/2.jpg',
            price: '13.00',
            falg: '极甜凤梨甜到心里',
            id: '005'
          },
          {
            naem: '海南凤梨（1个装）',
            picUrl: '/image/switch/2.jpg',
            price: '13.00',
            falg: '极甜凤梨甜到心里',
            id: '006'
          },
          {
            naem: '海南凤梨（1个装）',
            picUrl: '/image/switch/2.jpg',
            price: '13.00',
            falg: '极甜凤梨甜到心里'
          },
        ]
      },
      {
        title: '面点素食',
        id: "001",
        data: [{
            naem: '海南凤梨（1个装）',
            picUrl: '/image/switch/2.jpg',
            price: '13.00',
            falg: '极甜凤梨甜到心里',
            id: '001'
          },
          {
            naem: '海南凤梨（1个装）',
            picUrl: '/image/switch/2.jpg',
            price: '13.00',
            falg: '极甜凤梨甜到心里',
            id: '002'
          },
          {
            naem: '海南凤梨（1个装）',
            picUrl: '/image/switch/2.jpg',
            price: '13.00',
            falg: '极甜凤梨甜到心里',
            id: '003'
          },
          {
            naem: '海南凤梨（1个装）',
            picUrl: '/image/switch/2.jpg',
            price: '13.00',
            falg: '极甜凤梨甜到心里',
            id: '004'
          },
          {
            naem: '海南凤梨（1个装）',
            picUrl: '/image/switch/2.jpg',
            price: '13.00',
            falg: '极甜凤梨甜到心里',
            id: '005'
          },
          {
            naem: '海南凤梨（1个装）',
            picUrl: '/image/switch/2.jpg',
            price: '13.00',
            falg: '极甜凤梨甜到心里',
            id: '006'
          },
          {
            naem: '海南凤梨（1个装）',
            picUrl: '/image/switch/2.jpg',
            price: '13.00',
            falg: '极甜凤梨甜到心里'
          },
        ]
      }



    ],
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  goSet: function() {
    wx.setStorage({
      key: 'key',
      data: 'sdfjakl是东方就是快乐'
    })
  },
  getSet: function() {
    const value = wx.getStorageSync('key');
    console.log(value)
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    // console.log(app.nativeData.token + '第三届法律框架')
    this.goWxLogin()//获取openid
    this.getLunBo() //获取首页轮播
    this.getTabList()//获取分类
    this.getNewGoods()//获取新品发现
  },
  // 微信登录
  goWxLogin: function () {
    var that = this;
    //调用登录接口，获取 code
    wx.login({
      success: function (res) {
        wx.request({
          //后台登录接口--小程序登录接口code换取会员信息接口
          url: ajax_url + '/wx/miniLogin/' + res.code,
          method: "get",
          success: function (res) {
            console.log(res);
            app.nativeData.openId = res.data.data.openid;
            wx.getUserInfo({
              success: function (res) {
                that.data.userInfo = res.userInfo;
                that.setData({
                  userInfo: that.data.userInfo
                });

              }
            })
          }
        })
      }
    })
  },
  // 获取轮播
  getLunBo: function() {
    var _this = this;
    // 获取首页轮播
    wx.request({
      url: ajax_url + '/act/list',
      method: "get",
      success: function(res) {
        if (res.data.code == '200') {
          _this.setData({
            banners: res.data.data
          })
        } else {
          wx.showModal({
            content: res.data.message,
            confirmColor: '#6928E2',
            showCancel: false,
          })
        }
      }
    })
  },
  //  获取分类
  getTabList: function() {
    var _this = this;
    wx.request({
      url: ajax_url + '/sort/selectSortF',
      method: "get",
      success: function (res) {
        if (res.data.code == '200') {
          _this.setData({
            tabList: res.data.data
          })
        } else {
          wx.showModal({
            content: res.data.message,
            confirmColor: '#6928E2',
            showCancel: false,
          })
        }
      }
    })

  },
  // 获取新品发现
  getNewGoods:function(){
    var _this = this;
    wx.request({
      url: ajax_url + '/goods/getNewGoods',
      method: "get",
      success: function (res) {
        if (res.data.code == '200') {
          console.log(res)
          _this.setData({
            newList: res.data.data
          })
        } else {
          wx.showModal({
            content: res.data.message,
            confirmColor: '#6928E2',
            showCancel: false,
          })
        }
      }
    })
  },

  // 去搜素页面
  bindconfirm: function(e) {
    console.log(e.detail.value);
    wx.navigateTo({
      url: '/pages/searchResult/searchResult?value=' + e.detail.value,
    })
  },
  // 去产品详情
  goProudctDetails: function(e) {
    console.log(e.currentTarget.dataset.productid);
    wx.navigateTo({
      url: '/pages/prouctDetails/prouctDetails?productId=' + e.currentTarget.dataset.productid,
    })
  },

  // 点击导航页面滚动
  toViewClick: function(e) {
    console.log(e.currentTarget.dataset.id);
    wx.pageScrollTo({
      scrollTop: 600,
      duration: 300
    });
  }

})