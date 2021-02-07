// 请求函数封装

import axios from 'axios'

// if (process.env.VUE_APP_CURRENTMODE == 'prod') {
//   axios.defaults.withCredentials = true// 让ajax携带cookie
// }

// axios实例
// let baseURL = AUTH_SERVICE
let baseURL = ''
const basicService = axios.create({
  baseURL: baseURL, // api 的 base_url
  timeout: 10000 // 请求超时时间
})
// 拦截重复请求
const pending = {}
const CancelToken = axios.CancelToken
const removePending = (key, isRequest = false) => {
  if (pending[key] && isRequest) {
    pending[key]('取消重复请求')
  }
  delete pending[key]
}
const getRequestIdentify = (config, isReuest = false) => {
  let url = config.url
  if (isReuest) {
    url = config.baseURL + config.url.substring(1, config.url.length)
  }
  return config.method === 'get' ? encodeURIComponent(url + JSON.stringify(config.params)) : encodeURIComponent(config.url + JSON.stringify(config.data))
}
// 拦截器
// 请求前 成功
let handleRequestSuccess = (config) => {
  // 拦截重复请求(即当前正在进行的相同请求)
  let requestData = getRequestIdentify(config, true)
  removePending(requestData, true)
  config.cancelToken = new CancelToken((c) => {
    pending[requestData] = c
  })
  // if (store.getters.token) {
  //   config.headers['token'] = getToken()
  // }
  // // 补 orgId
  // let userInfo = store.getters.userInfo
  // if (userInfo && userInfo.orgId) {
  //   if (config.data) {
  //     config.data.orgId = userInfo.orgId
  //   }
  // }
  return config
}
// 请求前 失败
let handleRequestFailure = (error) => {
  return Promise.reject(error)
}
// 请求后 成功
let handleResponseSuccess = (response) => {
  return response
}
// 请求后 失败
let handleResponseFailure = (error) => {
  // 处理超时
  var originalRequest = error.config
  let errorDom = document.querySelector('.fe-message--error')
  if (error.code == 'ECONNABORTED' && error.message.indexOf('timeout') != -1 && !originalRequest._retry && !errorDom) {
    console.log('页面加载超时，请重试')
    // Message.error('页面加载超时，请重试')
  }
  return Promise.reject(error)
}
basicService.interceptors.request.use(handleRequestSuccess, handleRequestFailure)
basicService.interceptors.response.use(handleResponseSuccess, handleResponseFailure)

/* 过滤请求参数空的键值对 */
let filterParmas = (params) => {
  if (params instanceof Array) {
    return params
  } else if (params === null) {
    return params
  } else {
    let arr = Object.keys(params)
    let curParams = {}
    arr.forEach(item => {
      if (params[item]) {
        if (params[item] instanceof Array) {
          if (params[item].length > 0) {
            curParams[item] = params[item]
          }
        } else if (params[item] instanceof Object) {
          let tempArr = Object.keys(params[item])
          // 日期对象不排除
          if (tempArr.length > 0 || params[item] instanceof Date) {
            curParams[item] = params[item]
          }
        } else {
          curParams[item] = params[item]
        }
      } else {
        if (params[item] !== undefined && params[item] !== null && params[item] !== '') {
          curParams[item] = params[item]
        }
      }
    })
    return curParams
  }
}
let filterParamsWhileList = ['process_api/form/saveForm', 'task/addTask']
/*
@parm type: 请求类型 GET POST PUT DELETE...
@parm url: 请求的地址
@parm paramsOrData: 请求的入参
@parm defaultTip: 是否使用默认的提示 true是；false否（需要自己处理提示）
@parm isReturnAll: 是否返回所有的出参 true是；false否（只返回res.data）
*/
// data 参数特殊给需要data请求体的delete用
function basicAxios (type, url, paramsOrData, defaultTip = false, isReturnAll = true, specialDelete = false) {
  let options = {
    method: type,
    url: url,
    params: type === 'GET' || (!specialDelete && type === 'DELETE') ? filterParmas(paramsOrData) : null,
    data: type === 'POST' || type === 'PUT' || specialDelete ? filterParmas(paramsOrData) : null
  }
  if (filterParamsWhileList.indexOf(url) !== -1) {
    options = {
      method: type,
      url: url,
      params: type === 'GET' || type === 'DELETE' ? paramsOrData : null,
      data: type === 'POST' || type === 'PUT' ? paramsOrData : null
    }
  }
  return new Promise((resolve, reject) => {
    // console.log(11111, options)
    basicService(options).then(res => {
      // console.log(`${url}接口返回值：`, res)
      if (isReturnAll) { resolve(res) } else {
        if (+res.data.code === 200 || +res.data.code === 600) {
          // 成功
          resolve(res.data.data)
        } else if (+res.data.code === 401) { // 过期了,清理下token,然后跳往登录页
          // Message.error('登录过期,正在前往登录页...')
          console.log('登录过期,正在前往登录页...')
          store.dispatch('LogOut').then(() => {
            window.location.reload()
          })
        } else {
          console.log('服务器错误')
          // if (defaultTip) {
          //   if (url.indexOf('erp_api/') > -1) {
          //     if (+res.data.code === -1) {
          //       Message({
          //         message: '服务器错误',
          //         type: 'error',
          //         duration: 3 * 1000
          //       })
          //     } else {
          //       Message({
          //         message: res.data.message,
          //         type: 'error',
          //         duration: 3 * 1000
          //       })
          //     }
          //   } else {
          //     Message({
          //       message: window.vm.$t(`messageCode.${res.data.code}`),
          //       type: 'error',
          //       duration: 3 * 1000
          //     })
          //   }
          // }
          reject(res.data)
        }
      }
    }).catch(err => {
      // Message({
      //   message: err,
      //   type: 'error',
      //   duration: 3 * 1000
      // })
      // console.log(`${url}接口报错信息：`, err)
    })
  })
}
function fileAxios (type, url, paramsOrData) {
  let options = {
    responseType: 'blob',
    method: type,
    url: url,
    params: type === 'GET' || type === 'DELETE' ? filterParmas(paramsOrData) : null,
    data: type === 'POST' || type === 'PUT' ? filterParmas(paramsOrData) : null
  }
  return new Promise((resolve, reject) => {
    basicService(options).then(res => {
      resolve(res)
    }).catch(err => {
      // Message({
      //   message: '下载失败',
      //   type: 'error',
      //   duration: 3 * 1000
      // })
      // console.log(`${url}接口报错信息：`, err)
    })
  })
}
// 封装
export default {
  basicGet: function (url, paramsOrData, defaultTip) {
    return basicAxios('GET', url, paramsOrData, defaultTip)
  },
  specialGet: function (url, paramsOrData, defaultTip) { // 特殊的 请求，返回请求的所有内容，不做处理
    return basicAxios('GET', url, paramsOrData, defaultTip, true)
  },
  basicPost: function (url, paramsOrData, defaultTip) {
    return basicAxios('POST', url, paramsOrData, defaultTip)
  },
  basicPut: function (url, paramsOrData, defaultTip) {
    return basicAxios('PUT', url, paramsOrData, defaultTip)
  },
  basicDelete: function (url, paramsOrData, defaultTip, specialDelete) {
    return basicAxios('DELETE', url, paramsOrData, defaultTip, false, specialDelete)
  },
  filePost: function (url, paramsOrData, defaultTip) {
    return fileAxios('POST', url, paramsOrData, defaultTip)
  },
  fileGet: function (url, paramsOrData, defaultTip) {
    return fileAxios('GET', url, paramsOrData, defaultTip)
  }
}
