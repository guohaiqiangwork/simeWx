// pages/confirmOrder/confirmOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    ishideback: true,

    adderList:[1],//地址数据
    newList: [{
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
    ], 
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
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
  // 去商品清单
  goDetailList:function(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/detailedList/detailedList?type=' + e.currentTarget.dataset.type,
    })
  },
  //去支付
  goPay :function(){
    wx.navigateTo({
      url: '/pages/paymentOrder/paymentOrder',
    })
  }
})