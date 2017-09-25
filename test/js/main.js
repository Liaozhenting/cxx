// alert(1)
require.config({
  paths:{
    'cxx':'../../cxx'
  }
})

require(['cxx'],function(){
  alert(cxx.isString(''))
})