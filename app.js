//app.js
var QQMapWX = require('resource/map/js/qqmap-wx-jssdk.min.js');
var points = [];
const qqmapsdk = new QQMapWX({
  key: 'R3OBZ-GU663-KA73R-3SCOZ-ZFGC2-WFFOY'
});
App({
  onLaunch: function () {
    
  },

  globalData: {
    qqmapsdk: qqmapsdk,
    points: points
  }
})