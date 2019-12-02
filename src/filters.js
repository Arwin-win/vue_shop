import Vue from 'vue'
Vue.filter('dateFormat',function(time){
  time = time * 1000
  var date = new Date(time)
  return `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日${date.getHours()}时${date.getMinutes()}分${date.getSeconds()}秒`
})
