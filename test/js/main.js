// alert(1)
require.config({
  paths:{
    'cxx':'../../cxx'
  }
})

require(['cxx'],function(){
  console.log(cxx.isString(''))
  console.log(cxx('#app'))
})