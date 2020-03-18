// pages/category/category.js
const app = getApp()
const ajax_url = app.globalData.ajax_url;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    ishideback: true,
    my_class: false,
    tabFalg: '001',
    leftList: [],
    rightList: [{
      name: '面点速食',
      picUrl: "/image/switch/2.jpg",
      id: '001'
    },
    {
      name: '酒水饮料',
      picUrl: "/image/switch/1.jpg",
      id: '002'
    },
    {
      name: '粮油干货',
      picUrl: "/image/switch/3.jpg",
      id: '003'
    },
    {
      name: '美妆百货',
      picUrl: "/image/switch/2.jpg",
      id: '004'
    },
    {
      name: '中外茶叶',
      picUrl: "/image/switch/2.jpg",
      id: '005'
    },
    {
      name: '母婴保健',
      picUrl: "/image/switch/1.jpg",
      id: '006'
    },
    {
      name: '家装家纺',
      picUrl: "/image/switch/2.jpg",
      id: '007'
    },
    {
      name: '日用纸品',
      picUrl: "/image/switch/1.jpg",
      id: '008'
    },
    {
      name: '电子数码',
      picUrl: "/image/switch/2.jpg",
      id: '009'
    }

    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTabList();//获取主分类
  },
  //  获取分类
  getTabList: function () {
    var _this = this;
    wx.request({
      url: ajax_url + '/sort/selectSortF',
      method: "get",
      success: function (res) {
        console.log(res)
        if (res.data.code == '200') {
          _this.setData({
            leftList: res.data.data
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

  },
  // 左边切换
  swichTab: function (e) {
    this.setData({
      tabFalg: e.currentTarget.dataset.id
    })
  }
})