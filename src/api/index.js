// 读取api文件夹下的所有js文件，全部暴露出来

// 读取当前目录下的所有.js文件
const req = require.context('.', false, /\.js/)

console.log('req', req)

let apiMap

// 将读取到的.js文件全部引入到项目中
const requireAll = requireContext => requireContext.keys().map(requireContext)

requireAll(req).map(e => {
  console.log('eeee', e)
  apiMap = { ...e, ...apiMap }
})

const allApi = apiMap

export default allApi
