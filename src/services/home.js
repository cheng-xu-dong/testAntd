import { stringify } from 'qs';
import request from '../utils/request';
import portUrl from '../common/portUrl.js';

// 查询餐厅列表
export async function getShopList(params) {
  return request(`${portUrl.urlRoot + portUrl.urlPort}merchant/info/list?${stringify(params)}`);
}