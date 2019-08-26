// pages/list/list.js
const app = getApp();
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.checkForUpdate();
    app.globalData.listPage = this;
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
    //if(!points[0] || !points[0]["distance"]){
    //    return;
    //}
    var points = app.globalData.points;
    this.setData({
      "points": points
    })
    Object.assign(this, this.options.data); 
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
  showOrientation: function (e) {
    var that = this;
    var toLocation = e.currentTarget.id;
    var latitude = e.currentTarget.dataset.latitude
    var longitude = e.currentTarget.dataset.longitude
    wx.showModal({
      title: '导航提示',
      content: '确定要去【' + toLocation + '】？',
      success: function (res) {
        if (res.confirm) {
          wx.openLocation({ // 打开微信内置地图，实现导航功能（在内置地图里面打开地图软件）
            latitude: latitude,
            longitude: longitude,
            name: toLocation,
            success: function (res) {
              console.log(res);
            },
            fail: function (res) {
              console.log(res);
            }
          })
        } else {

        }
      },
      fail: function () {

      }
    })
  }
})
