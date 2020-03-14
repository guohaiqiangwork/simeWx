// pages/searchResult/searchResult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    ishideback: false,
    my_class: false,
    inputValue:'',//输入框值
    tabList: [{ name: '综合', id: '001' }, { name: '销量最高', id: '002' }, { name: '价格', id: '003' }],
    tabFalg:'001',
    searchList: [
      { naem: '海南凤梨（1个装）', picUrl: '/image/switch/2.jpg', price: '13.00', falg: '极甜凤梨甜到心里' },
      { naem: '海南凤梨（1个装）', picUrl: '/image/switch/2.jpg', price: '13.00', falg: '极甜凤梨甜到心里' },
      { naem: '海南凤梨（1个装）', picUrl: '/image/switch/2.jpg', price: '13.00', falg: '极甜凤梨甜到心里' },
      { naem: '海南凤梨（1个装）', picUrl: '/image/switch/2.jpg', price: '13.00', falg: '极甜凤梨甜到心里' },
      { naem: '海南凤梨（1个装）', picUrl: '/image/switch/2.jpg', price: '13.00', falg: '极甜凤梨甜到心里' },
      { naem: '海南凤梨（1个装）', picUrl: '/image/switch/2.jpg', price: '13.00', falg: '极甜凤梨甜到心里' },
      { naem: '海南凤梨（1个装）', picUrl: '/image/switch/2.jpg', price: '13.00', falg: '极甜凤梨甜到心里' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      inputValue: options.value
    })
    // 查询数据掉取后端接口

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
    wx.showNavigationBarLoading();
    this.setData({
      page: {
        size: 10,
        current: 1
      },
    })
    this.GetList('pull');
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中',
    });
    this.setData({
      page: {
        current: this.data.page.current + 1,
        size: 10
      }
    })
    this.GetList('on')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // tab 切换
  tabSwich: function (e) {
    this.setData({
      tabFalg: e.currentTarget.dataset.id,
    })
  },
  // 测试请求列表数据
  GetList(param) {
    var _this = this;
    wx.showLoading({
      title: '加载中',
    });
    if (param == 'pull') {
      this.data.orderList = [];
    }
    wx.request({
      url: ajax_url + 'weChat/getOrderList',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'storeId': app.customer.ownerId,
        'page.size': this.data.page.size,
        'page.current': this.data.page.current,
      },
      success: function (res) {
        (function (_this, param) {
          wx.hideLoading();
          if (!res.data.success) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            });

            return
          } else if (!res.data.obj.records.length && param == 'on') {
            _this.setData({
              page: {
                current: _this.data.page.current - 1,
                size: 10
              }
            })
            return
          } else if (!res.data.obj.records.length) {
            return
          };
          res.data.obj.records.forEach(e => {
            _this.data.orderList.push({
              createTime: tool.timestampToTime(e.createTime, 'time'),
              name: e.customer.nickName ? e.customer.nickName : '用户未授权',
              avatar: e.customer.headImgUrl ? e.customer.headImgUrl : '../../images/head_default.png',
              bankname: e.bankCard.bankName,
              scanMoney: e.storeRadio && Number(e.storeRadio.scanMoney).toFixed(2) || Number(e.store.scanMoney).toFixed(2),
              returnMoney: e.storeRadio && (e.storeRadio.scanMoney * e.storeRadio.rebate / 100).toFixed(2) || (e.store.scanMoney * e.store.rebate / 100).toFixed(2),
              sumMoney: e.sumMoney
            })
          });
          _this.setData({
            orderList: _this.data.orderList,
            incom: Number(res.data.attributes.todaySumMoney).toFixed(2)
          })

        }(_this, param))
      },
      fail: function (res) {
        wx.hideLoading();
      },

    })
  },
})