import fetch from 'dva/fetch';
import { Toast } from 'antd-mobile';
import portUrl from '../common/portUrl.js';
import { reAuthorize } from './utils.js';

const codeMessage = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  Toast.fail(`请求错误 ${errortext}`, 1);
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (newOptions.type === 'json') {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };

      newOptions.body = JSON.stringify(newOptions.body);
    } else if (newOptions.type === 'from') {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        ...newOptions.headers,
      };

      let ret = '';

      for (let i in newOptions.body) {
        ret += encodeURIComponent(i) + '=' + encodeURIComponent(newOptions.body[i]) + '&'
      }

      newOptions.body = ret;
    }
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      if (parseInt(res.code) === 401) {
        reAuthorize();
      } else if (parseInt(res.code) === 406) {
        Toast.fail('获取数据失败', 1);
      } else if (parseInt(res.code) === 500) {
        Toast.fail('请求数据异常', 1);
      } else {
        return res;
      }
    })
    .catch((e) => {
      Toast.fail('接口响应失败', 1);
    });
}