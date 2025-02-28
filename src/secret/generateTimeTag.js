function getTime() {
    const date = new Date() //创建一个 Date 对象，表示当前时间
  
    const day = ("0" + date.getDate()).slice(-2)          //获取日期（DD）
    const month = ("0" + (date.getMonth() + 1)).slice(-2)   //获取月份（MM）
  
    const year = date.getFullYear()     //获取年份（YYYY）
    const hour = date.getHours()        //获取小时（HH）
    const min = date.getMinutes()        //获取分钟（mm） 
    const sec = date.getSeconds()       //获取秒（ss）
  
    return year + '-' + month + '-' + day + " " + hour + ":" + min + ":" + sec   //返回年-月-日 时:分:秒
  }
  
  export { getTime }