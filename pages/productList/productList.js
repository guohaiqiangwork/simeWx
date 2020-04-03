// pages/searchResult/searchResult.js
const app = getApp()
const ajax_url = app.globalData.ajax_url;
Page({
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    ishideback: false,
    my_class: false,
    inputValue: '', //输入框值
    isScroll: true,
    refresh_falg: true,
    page: 1,
    page_size: 10,
    code: '', //分类
    synthesize: '1',
    priceSorted: '',
    sell: '',
    title: '全部商品',
    tabList: [{
      name: '综合',
      id: '001',
      falg: '1'
    }, {
      name: '销量最高',
      id: '002',
      falg: '1'
    }, {
      name: '价格',
      id: '003',
      falg: '1'
    }],
    tabFalg: '001',
    searchList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.code == "undefined"){
      options.code =  '';
    }
    if (options.city) {
      this.setData({
        city: options.city,
        synthesize: ''
      });
      this.getCityList();
    } else {
      this.setData({
        code: options.code,
        title:options.type
      });
      this.getSearchList() //获取查询列表
    }


  },
  // 获取列表数据
  getSearchList: function (type) {
    let _this = this;
    var data = {
      city: _this.data.city || '',
      code: _this.data.code || '',
      pageNum: _this.data.page,
      goodsName: _this.data.inputValue || '',
      priceSorted: _this.data.priceSorted,
      sell: _this.data.sell,
      synthesize: _this.data.synthesize,
      meberId: wx.getStorageSync('useId')
    };
    wx.request({
      url: ajax_url + '/goods/getGoodsCondition',
      method: "post",
      data: data,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == '200') {
          if (type == 'new') {
            _this.setData({
              searchList: res.data.data
            });
          } else {
            _this.setData({
              searchList: _this.data.searchList.concat(res.data.data)
            });
          }
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
  // 获取同城数据
  getCityList: function (type) {
    let _this = this;
    var data = {
      city: _this.data.city || '',
      code: _this.data.code || '',
      pageNum: _this.data.page,
      goodsName: _this.data.inputValue || '',
      priceSorted: _this.data.priceSorted,
      sell: _this.data.sell,
      synthesize: _this.data.synthesize,
      meberId: wx.getStorageSync('useId')
    };
    wx.request({
      url: ajax_url + '/goods/getSameCityProduct',
      method: "post",
      data: data,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == '200') {
          if (type == 'new') {
            _this.setData({
              searchList: res.data.data
            });
          } else {
            _this.setData({
              searchList: _this.data.searchList.concat(res.data.data)
            });
          }
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
  // 加入购物车
  addShopCard: function (e) {
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
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == '200') {
          // wx.showModal({
          //   content: '添加成功',
          //   confirmColor: '#6928E2',
          //   showCancel: false,
          // })
          wx.showToast({
            title: '添加成功',
            icon: 'none',
            duration: 1000,
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
  // 去产品详情
  goProudctDetails: function (e) {
    wx.navigateTo({
      url: '/pages/prouctDetails/prouctDetails?productId=' + e.currentTarget.dataset.productid,
    })
  },

  // 监听输入框值
  bindconfirm: function (e) {
    console.log(e)
    var _this = this;
    _this.setData({
      inputValue: e.detail.value,
     
    });
    _this.data.code = '';
    _this.data.page='';
    _this.data.searchList = [];
    if (_this.data.city) {
      _this.getCityList();
    } else {
      _this.getSearchList();
    }

  },



  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var _this = this;
    wx.showNavigationBarLoading();
    this.setData({
      page: 1
    })
    if (_this.data.city) {
      _this.getCityList('new');
    } else {
      this.getSearchList('new');
    }

    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var _this = this;
    wx.showLoading({
      title: '加载中',
    });
    this.setData({
      page: this.data.page + 1,
    })

    if (_this.data.city) {
      _this.getCityList();
    } else {
      this.getSearchList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // tab 切换
  tabSwich: function (e) {
    var _this = this;
    if (e.currentTarget.dataset.id == '002') {
      _this.setData({
        sell: 1,
        priceSorted: '',
        synthesize: '',
        page: 1
      })
    } else if (e.currentTarget.dataset.id == '003') {
      if (this.data.priceSorted == 0) {
        var aSorrted = 1
      } else {
        var aSorrted = 0
      }
      _this.setData({
        priceSorted: aSorrted,
        sell: '',
        synthesize: '',
        page: 1
      })
    } else {
      _this.setData({
        priceSorted: '',
        sell: '',
        synthesize: 1,
        page: 1
      })
    }
    _this.setData({
      tabFalg: e.currentTarget.dataset.id,
    });
    _this.data.searchList = [];
    if (_this.data.city) {
      _this.getCityList();
    } else {
      _this.getSearchList();
    }
  },

  // 倒叙
  // listPaix:function(){
  //   if (this.data.priceSorted == 0) {
  //     var aSorrted = 1
  //   } else {
  //     var aSorrted = 0
  //   }
  //   this.setData({
  //     priceSorted: aSorrted
  //   })
  //   this.data.searchList = [];
  //   if (this.data.city) {
  //     this.getCityList();
  //   } else {
  //     this.getSearchList();
  //   }
  // }

})