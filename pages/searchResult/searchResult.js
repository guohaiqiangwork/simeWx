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
  onLoad: function(options) {
    console.log(options)
    this.setData({
      inputValue: options.value,
      code: options.code
    });
    this.getSearchList() //获取查询列表
  },
// 获取列表数据
  getSearchList: function(type) {
    let _this = this;
    var data = {
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
      success: function(res) {
        wx.hideLoading();
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
          wx.showModal({
            content: res.data.message,
            confirmColor: '#6928E2',
            showCancel: false,
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
          wx.showModal({
            content: '添加成功',
            confirmColor: '#6928E2',
            showCancel: false,
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
  // 去产品详情
  goProudctDetails: function (e) {
    wx.navigateTo({
      url: '/pages/prouctDetails/prouctDetails?productId=' + e.currentTarget.dataset.productid,
    })
  },
  // // 上拉加载
  // refresh_j() {
  //   console.log('2342')
  //   if (this.data.refresh_falg) {
  //     let that = this;
  //     that.setData({
  //       page: this.data.page + 1, // 每次触发上拉事件，把pageNum+1
  //       isFirstLoad: false // 触发到上拉事件，把isFirstLoad设为为false
  //     });
  //     if (that.data.isScroll) {
  //       this.GetList(this);
  //     }
  //   }
  // },
  // // 下拉刷新
  // refresh() {
  //   console.log('............')
  //   if (this.data.refresh_falg) {
  //     this.data.page = 1
  //     var StoreList = this.data.StoreList;
  //     this.setData({
  //       StoreList: [],
  //     })
  //     // 调用接口加载数据
  //     if (this.data.isScroll) {
  //       this.GetList(this);
  //     }
  //   }
  //   // 当处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新
  //   wx.stopPullDownRefresh();
  // },
  // 监听输入框值
  bindconfirm: function(e) {
    console.log(e)
    var _this = this;
    _this.setData({
      inputValue: e.detail.value
    });
    _this.data.code='';
    _this.data.searchList =[];
    _this.getSearchList();
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
    wx.showNavigationBarLoading();
    this.setData({
      page: 1
    })
    this.getSearchList('new');
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    wx.showLoading({
      title: '加载中',
    });
    this.setData({
      page: this.data.page + 1,
    })
    this.getSearchList(); //获取数据
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // tab 切换
  tabSwich: function(e) {
    if (e.currentTarget.dataset.id == '002') {
      this.setData({
        sell: 1,
        priceSorted: '',
        synthesize: ''
      })
    } else if (e.currentTarget.dataset.id == '003') {
      this.setData({
        priceSorted: 1,
        sell: '',
        synthesize: ''
      })
    } else {
      this.setData({
        priceSorted: '',
        sell: '',
        synthesize: 1
      })
    }
    this.setData({
      tabFalg: e.currentTarget.dataset.id,
    });
    this.data.searchList = [];
    this.getSearchList();
  },

})