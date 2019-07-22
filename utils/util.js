const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const checkAuthSetting = scope =>{
  wx.getSetting({
    success(res) {
      if (!res.authSetting[scope]) {
        return false;
      }else{
        return true;
      }
    }
  })
};

module.exports = {
  formatTime: formatTime,
  checkAuthSetting: checkAuthSetting
}
