const app = getApp()
const ajax_url = app.globalData.ajax_url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    ishideback: false,
    my_class: true,
    isScroll: true,
    orderTabList: [{
      name: '全部',
      id: '001',
      status: '',
    }, {
      name: '支出',
      id: '002',
      status: '2'
    }, {
      name: '收入',
      id: '003',
      status: '1'
    }],
    tabFalg: '001', //显示那个模块
    status: '',
    goldList:'',
    page:1,
    jinDou:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getGoldList('new');
    this.getMyRedBlance();
  },
  // 获取列表数据
  getGoldList: function(item) {
    var _this = this;
    var keyword = {
      data: {
        memberId: wx.getStorageSync('useId'),
        type: _this.data.status
      },
      pageNum: _this.data.page,
      pageSize: 10
    }

    wx.request({
      url: ajax_url + '/redEnvelope/myRedFlow',
      method: "post",
      data: keyword,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == '200') {
          console.log(res)
          if (item == 'new') {
            _this.setData({
              goldList: res.data.data.records
            });
          } else {
            _this.setData({
              goldList: _this.data.goldList.concat(res.data.data.records)
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
  // 获取我的金豆
  getMyRedBlance: function () {
    var _this = this;
    wx.request({
      url: ajax_url + '/redEnvelope/myRedBlance',
      method: "get",
      data: { memberId: wx.getStorageSync('useId') },
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function (res) {
        if (res.data.code == '200') {
          _this.setData({
            jinDou: res.data.data || 0
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
  // 切换
  productTabSwich: function(e) {
    var _this = this;
    _this.data.goldList = [];
    this.setData({
      tabFalg: e.currentTarget.dataset.id,
      status: e.currentTarget.dataset.status
    });
    _this.getGoldList();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    this.setData({
      page: 1
    })
    this.getGoldList('new');
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
    this.getGoldList(); //获取数据
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})