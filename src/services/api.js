import { stringify } from 'qs';
import request from '../utils/request';
import portUrl from '../common/portUrl.js';

// 获取用户信息
export async function getUserInfo(params) {
  return request(`${portUrl.urlRoot + portUrl.urlPort}customer/info/token`);
}

// 获取用户二维码
export async function getQrCode() {
  return request(`${portUrl.urlRoot + portUrl.urlPort}pass/auth/qrcode`);
}