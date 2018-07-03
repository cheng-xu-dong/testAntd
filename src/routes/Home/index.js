import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Button, Toast } from 'antd-mobile';
import Footer from '../../components/Footer';
import styles from './index.less';
import headerPNG from '../../assets/header.png';
import addressPic from '../../assets/svg/定位.svg';
import noticePic from '../../assets/svg/公告.svg';
import portUrl from '../../common/portUrl.js';
import noOrderList from '../../assets/noOrderList.png';
import { getCookie, getQueryString, decryptByDESModeEBC } from '../../utils/utils';

@connect(({ global, home }) => ({
  global,
  home,
}))
export default class Home extends Component {
  state = {
    
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'home/clearStorage',
    });
  }

  componentDidMount() {
    let eti_id = getCookie('microrestaurant_eti_number') ? decryptByDESModeEBC(getCookie('microrestaurant_eti_number')) : '';

    Toast.loading('等待中...', 10);

    const { dispatch } = this.props;

    const That = this;

    dispatch({
      type: 'home/getShopList',
      payload: {
        eti_number: eti_id,
        That
      }
    });
  }

  clickRestaurantInfo = (obj) => {
    this.props.dispatch(routerRedux.push({
      pathname: portUrl.indexUrl + '/restaurantInfo',
      state: {
        mhi_id: obj.mhi_id
      }
    }));
  }

  hideLoading = () => {
    Toast.hide();
  }

  render() {
    const { shopList } = this.props.home;

    return (
      <DocumentTitle title="首页">
        <div className={styles.home}>
          {
            shopList.items ? (
              <div className={styles.itemWrap}>
                {
                  shopList.items.map((array, index) => {
                    return (
                      <div key={index} className={styles.itemsInfo} onClick={this.clickRestaurantInfo.bind(null, array)}>
                        <div className={styles.thumb}>
                          <img src={array.mhi_header_img ? JSON.parse(array.mhi_header_img).picture_small_network_url : headerPNG} />
                        </div>
                        <div className={styles.info}>
                          <div className={styles.info_name}>
                            <h3>{array.mhi_name ? array.mhi_name : '餐厅名称'}</h3>
                            {
                              array.merchantBusinessList ? (
                                <span>
                                  {
                                    array.merchantBusinessList.map((arrayChild, indexChild) => {
                                      if (parseInt(arrayChild.mhb_bii_id) === 1) {
                                        return <i key={indexChild} className={styles.ding}>订</i>;
                                      } else if (parseInt(arrayChild.mhb_bii_id) === 2) {
                                        return <i key={indexChild} className={styles.yuan}>员</i>;
                                      } else if (parseInt(arrayChild.mhb_bii_id) === 8) {
                                        return <i key={indexChild} className={styles.qu}>取</i>;
                                      } else if (parseInt(arrayChild.mhb_bii_id) === 4) {
                                        return <i key={indexChild} className={styles.gui}>柜</i>;
                                      }
                                    })
                                  }
                                </span>
                              ) : ''
                            }
                          </div>
                          {/*<div className={styles.info_saleCount}></div>*/}
                          <div className={styles.info_address}>
                            <img src={addressPic} />
                            <span>{array.mhi_address ? array.mhi_address : '地址'}</span>
                          </div>
                          <div className={styles.info_notice}>
                            <img src={noticePic} />
                            <span>{array.mhi_introduce ? array.mhi_introduce : '公告'}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                }
                <Footer />
              </div>
            ) : (
              <div className={styles.noShopList}>
                <div className={styles.text}>
                  <img src={noOrderList} />
                  <span>暂无可订餐的餐厅...</span>
                </div>
                <Footer />
              </div>
            )
          }
        </div>
      </DocumentTitle>
    );
  }
}
