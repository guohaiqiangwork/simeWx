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
    bannerUrl: '', //banner图片
    proudeList: [],
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
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    this.getTab()//获取首页头部分类
    this.getHot() //获取分类及产品
    this.goWxLogin() //获取openid
    this.getLunBo() //获取首页轮播
    this.getNewGoods() //获取新品发现
    this.getBanner() //获取bard
  },
  // 微信登录
  goWxLogin: function() {
    var that = this;
    //调用登录接口，获取 code
    wx.login({
      success: function(res) {
        wx.request({
          //后台登录接口--小程序登录接口code换取会员信息接口
          url: ajax_url + '/wx/miniLogin/' + res.code,
          method: "get",
          success: function(res) {
            app.nativeData.openId = res.data.data.openid;
            app.nativeData.sessionKey = res.data.data.sessionKey
            wx.getUserInfo({
              success: function(res) {
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
  // 获取新品发现
  getNewGoods: function() {
    var _this = this;
    wx.request({
      url: ajax_url + '/goods/getNewGoods',
      method: "get",
      success: function(res) {
        if (res.data.code == '200') {
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
  // 获取首页bard
  getBanner: function() {
    var _this = this;
    var keyData = {
      isShow: 1,
      position: 1,
    };
    wx.request({
      url: ajax_url + '/banner/find',
      method: "POST",
      data: JSON.stringify(keyData),
      contentType: 'application/json',
      success: function(res) {
        if (res.data.code == '200') {
          _this.setData({
            bannerUrl: res.data.data
          });
        }
      }
    })
  },
  // 获取tab 及产品
  getHot: function() {
    var _this = this;
    wx.request({
      url: ajax_url + '/sort/getHot',
      method: "get",
      success: function(res) {
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
  // 获取tab
  getTab:function(){
    var _this = this;
    wx.request({
      url: ajax_url + '/tbGoodsPictureApi/selectPrice',
      method: "get",
      success: function (res) {
        console.log(res)
        if (res.data.code == '200') {
          _this.setData({
            tabListTitle: res.data.data
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
  // 同城
  goCity: function() {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: ajax_url + '/wx/isLogin',
      method: "get",
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function (res) {
        wx.hideToast()
        if (res.data.code == '200') {
          wx.getLocation({
            type: 'wgs84',
            success: function (res) {
              console.log(res);
              //弹框
              var locationString = res.latitude + "," + res.longitude;
              wx.request({
                url: 'https://apis.map.qq.com/ws/geocoder/v1/',
                data: {
                  "key": "OD6BZ-VQM3J-MGRFK-K54KC-DHQJQ-3UFD7",
                  "location": locationString
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                method: 'GET',
                success: function (r) {
                  var city = r.data.result.address_component.city
                  wx.navigateTo({
                    url: '/pages/searchResult/searchResult?city=' + city,
                  })
                }
              });
            }
          })
        } else {
          wx.navigateTo({
            url: '../logs/logs'
          })
        }
      }
    })
  

  },

  // 去搜素页面
  bindconfirm: function(e) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: ajax_url + '/wx/isLogin',
      method: "get",
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        wx.hideToast()
        if (res.data.code == '200') {
          wx.navigateTo({
            url: '/pages/searchResult/searchResult?value=' + e.detail.value,
          })
        } else {
          wx.navigateTo({
            url: '../logs/logs'
          })
        }
      }
    })

  },
  // 去产品详情
  goProudctDetails: function(e) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: ajax_url + '/wx/isLogin',
      method: "get",
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        wx.hideToast()
        if (res.data.code == '200') {
          wx.navigateTo({
            url: '/pages/prouctDetails/prouctDetails?productId=' + e.currentTarget.dataset.productid,
          })
        } else {
          wx.navigateTo({
            url: '../logs/logs'
          })
        }
      }
    })

  },
  //去活动详情
  tapBanner: function(e) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: ajax_url + '/wx/isLogin',
      method: "get",
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        wx.hideToast()
        if (res.data.code == '200') {
          wx.navigateTo({
            url: '/pages/activityDetails/activityDetails?activeId=' + e.currentTarget.dataset.id + '&type=' + e.currentTarget.dataset.type,
          })
        } else {
          wx.navigateTo({
            url: '../logs/logs'
          })
        }
      }
    })
  },
  // 点击导航页面滚动
  toViewClick: function(e) {
    console.log(e.currentTarget.dataset.code);
    return
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: ajax_url + '/wx/isLogin',
      method: "get",
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function (res) {
        wx.hideToast()
        if (res.data.code == '200') {
          wx.navigateTo({
            url: '/pages/productList/productList?value=' + e.detail.value,
          })
        } else {
          wx.navigateTo({
            url: '../logs/logs'
          })
        }
      }
    })


  },
  // 加入购物车
  addShopCard: function(e) {
    wx.showLoading({
      title: '添加中...',
    })
    var data = {
      goodsId: e.currentTarget.dataset.id,
      pecificationId: e.currentTarget.dataset.spid,
      userId: wx.getStorageSync('useId'),
    };
    wx.request({
      url: ajax_url + '/shoppingCart/addCart',
      method: "post",
      data: data,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == '200') {
          wx.showModal({
            content: '添加成功',
            confirmColor: '#6928E2',
            showCancel: false,
          })
        } else if (res.data.code == '1500' || res.data.code == '401') {
          wx.navigateTo({
            url: '../logs/logs'
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
  }

})