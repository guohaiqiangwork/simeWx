// pages/dataSet/dataSet.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    ishideback: false,
    my_class: true,
    setList: [{
      name: '头像',
      value: ''
    },
    {
      name: '用户名',
      value: '张三'
    },
    {
      name: '性别',
      value: '男',
      modeVal: "selector",
      index: 0,
      sexArray: ['男', '女'],
    },
    {
      name: '生日',
      value: '1989-07-21',
      modeVal: "date",
      index: "",
      sexArray: "",
    }
    ],
    jnr: [{
      name: '纪念日',
      value: '07-21',
      modeVal: "date",
      index: "",
      sexArray: ""
    }]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  //  点击时间组件确定事件  
  bindTimeChange: function (e) {
    console.log("谁哦按")
    this.setData({
      times: e.detail.value
    })
  },
  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      dates: e.detail.value 
    })
  },
  //  点击城市组件确定事件  
  bindPickerChange: function (e) {
    let listIndex = e.currentTarget.dataset.index;
    let listvalue = e.currentTarget.dataset.value;
  
    let sexFalg = e.detail.value;
    let _this = this;
    let list = "setList[" + listIndex + "].value"

    if (listIndex == 2){
      if (sexFalg == '0') {
        _this.data.ni = '男'
      } else {
        _this.data.ni = '女'
      }
    }else{
      _this.data.ni = sexFalg
    }
    
    this.setData({
      [list]: _this.data.ni
    })
  }
})