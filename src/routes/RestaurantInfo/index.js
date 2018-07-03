import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Button, Toast } from 'antd-mobile';
import styles from './index.less';
import headerPNG from '../../assets/header.png';
import noticePic from '../../assets/svg/公告.svg';

import portUrl from '../../common/portUrl.js';
import { getCookie } from '../../utils/utils';

@connect(({ global, restaurantInfo, loading }) => ({
  global,
  restaurantInfo,
}))
export default class RestaurantInfo extends Component {
  state = {
    
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'restaurantInfo/clearStorage',
    });
  }

  componentDidMount() {
    getCookie('microrestaurant_eti_number');

    if (this.props.location.state && this.props.location.state.mhi_id) {
      Toast.loading('等待中...', 10);

      const { dispatch } = this.props;

      const That = this;

      dispatch({
        type: 'restaurantInfo/getShopInfo',
        payload: {
          mhi_id: this.props.location.state.mhi_id,
          That
        }
      });
    } else {
      this.props.dispatch(routerRedux.push(portUrl.indexUrl + '/home'));
    }
  }

  clickServiceType = (obj) => {
    this.props.dispatch(routerRedux.push(obj.path));
  }

  clickNoServiceType = () => {
    Toast.fail('当前无可预定餐别', 1);
  }

  hideLoading = () => {
    Toast.hide();
  }

  checkBussiness = (obj, shopBusinessList) => {
    const { dispatch } = this.props;

    const That = this;

    dispatch({
      type: 'restaurantInfo/checkBussiness',
      payload: {
        mhb_id: obj.mhb_id,
        obj: obj,
        shopBusinessList: shopBusinessList,
        That
      }
    });
  }

  render() {
    const { shopInfo, shopBusinessList } = this.props.restaurantInfo;

    let serviceType = [];

    if (shopBusinessList) {
      shopBusinessList.items.map((array, index) => {
        portUrl.serviceTypeArr.map((arrayChild, indexChild) => {
          if (parseInt(array.mhb_bii_id) === parseInt(arrayChild.id)) {
            arrayChild['font'] = array.bii_name;
            arrayChild['haveMeal'] = array.haveMeal;
            arrayChild['path'] = {
              pathname: portUrl.indexUrl + '/' + arrayChild.key,
              state: {
                titleFont: array.bii_name,
                mhb_bii_id: array.mhb_bii_id,
                mhb_id: array.mhb_id,
                mhi_id: this.props.location.state.mhi_id,
              }
            }
            serviceType.push(arrayChild);
          }
        })
      })
    }

    return (
      <DocumentTitle title="餐厅详情">
        {
          shopInfo && shopBusinessList ? (
            <div className={styles.restaurantInfo}>
              <div className={styles.itemsInfo}>
                <div className={styles.thumb}>
                  <img src={shopInfo.mhi_header_img ? JSON.parse(shopInfo.mhi_header_img).picture_small_network_url : headerPNG} />
                </div>
                <div className={styles.info}>
                  <div className={styles.info_name}>
                    <h3>{shopInfo.mhi_name ? shopInfo.mhi_name : '餐厅名称'}</h3>
                  </div>
                  {/*<div className={styles.info_saleCount}></div>*/}
                  <div className={styles.info_notice}>
                    <img src={noticePic} />
                    <span>{shopInfo.mhi_introduce ? shopInfo.mhi_introduce : '餐厅公告'}</span>
                  </div>
                </div>
              </div>

              {
                serviceType.length > 0 ? (
                  <div className={styles.shopService}>
                    <div className={styles.title}>
                      <p>餐饮服务</p>
                    </div>
                    <div className={styles.serviceType}>
                    {
                      serviceType.map((array, index) => {
                        if (array.haveMeal) {
                          return (
                            <div key={ index } className={styles.serviceTypeItem} onClick={this.clickServiceType.bind(null, array)}>
                              <img style={array.size} src={array.pic} />
                              <span>{array.font}</span>
                            </div>
                          )
                        } else {
                          return (
                            <div key={ index } className={styles.serviceTypeItem} onClick={this.clickNoServiceType}>
                              <img style={array.size} src={array.noPic} />
                              <span>{array.font}</span>
                            </div>
                          )
                        }
                      })
                    }
                    </div>
                  </div>
                ) : ''
              }

              <div className={styles.shopInfo}>
                <div className={styles.title}>
                  <p>商家信息</p>
                </div>
                <div className={styles.shopMessage}>
                  <div>
                    <span>地址</span>
                    <span>{shopInfo.mhi_address ? shopInfo.mhi_address : '商家地址'}</span>
                  </div>
                  <div>
                    <span>联系电话</span>
                    <span>{shopInfo.mhi_phone ? shopInfo.mhi_phone : '商家电话'}</span>
                  </div>
                  <div>
                    <span>营业时间</span>
                    <span>{shopInfo.mhi_office_hours ? shopInfo.mhi_office_hours : '营业时间'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : ''
        }
      </DocumentTitle>
    );
  }
}
