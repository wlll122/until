import { Message, Loading } from 'element-ui'
let loadingInstance = null
function startLoading () {
  loadingInstance = Loading.service({
    fullscreen: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.6)'
  })
}
function closeLoading () {
  loadingInstance.close()
}
let needLoadingRequestCount = 0
function showLOding () {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}
function hideLoding () {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    closeLoading()
  }
}
export default {

  showLOding,
  hideLoding
}
