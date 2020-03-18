// pages/realName/realName.js
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

    imgPath:'/image/realName/card@2x.png',
    imgPathF:'/image/realName/cardF@2x.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 照片上传
  selectImg: function (e) {
    console.log(e)
    var imgType = e.currentTarget.dataset.type
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        //res.tempFilePaths 返回图片本地文件路径列表
        var tempFilePaths = res.tempFilePaths;
        if (imgType == 'fan'){
          that.setData({
            imgPathF: tempFilePaths[0]
          })
        }else{
          that.setData({
            imgPath: tempFilePaths[0]
          });
          that.loadImg()
        }
     

      }
    })
  },
  loadImg: function () {
    console.log('进来了')
    var that = this;
    console.log(that.data.imgPath + '圣诞节快乐记录') 
    wx.uploadFile({
      url: ajax_url + "/mb/verificPositive",
      filePath: that.data.imgPath,
      name: "upload_file",
      // 请求携带的额外form data
      /*formData: {
        "id": id
      },*/
      header: {
        'Content-Type': "multipart/form-data"
      },
      success: function (res) {
        console.log(JSON.stringify(res))
        wx.showToast({
          title: "图像上传成功！",
          icon: "",
          duration: 1500,
          mask: true
        });
      },
      fail: function (res) {
        wx.showToast({
          title: "上传失败，请检查网络或稍后重试。",
          icon: "none",
          duration: 1500,
          mask: true
        });
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

  }
})