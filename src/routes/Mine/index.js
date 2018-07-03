import React, { Component } from 'react';
import { connect } from 'dva';
import DocumentTitle from 'react-document-title';
import { routerRedux } from 'dva/router';
import { Button } from 'antd-mobile';
import bg from '../../assets/png/bg2.png';
import moreArrow from '../../assets/svg/箭头_更多.svg';
import qrPic from '../../assets/svg/QR2.svg';
import myCard from '../../assets/png/我的卡.png';
import Footer from '../../components/Footer';
import styles from './index.less';
import portUrl from '../../common/portUrl.js';
import { getCookie } from '../../utils/utils';

@connect(({ global }) => ({
  global,
}))
export default class Mine extends Component {
  state = {
    
  }

  componentDidMount() {
    getCookie('microrestaurant_eti_number');
  }

  linkCardsManager = () => {
    window.location.href = portUrl.urlRoot + portUrl.urlPort + 'menu/info/gotohref?menuId=1';
  }

  linkMineQR = () => {
    this.props.dispatch(routerRedux.push({
      pathname: portUrl.indexUrl + '/mineQR',
    }));
  }

  render() {
    const tipStyle = {
      backgroundImage: `url(${bg})`
    }

    const { userInfo } = this.props.global;

    return (
      <DocumentTitle title="我的">
        <div className={styles.mine}>
          <div style={ tipStyle } className={styles.tip}>
            <div className={styles.tipHeader}>
              {
                userInfo ? (
                  <div className={styles.userInfoWrap}>
                    <img src={userInfo.ci_headimg} />
                    <div className={styles.text}>
                      <span>{userInfo.ci_nickname}</span>
                      <span>{userInfo.ci_phone ? (userInfo.ci_phone.substring(0, 3) + '****' + userInfo.ci_phone.substring(7)) : ''}</span>
                    </div>
                  </div>
                ) : ''
              }
              <img onClick={this.linkMineQR} src={qrPic} />
            </div>
          </div>
          <div className={styles.myCard} onClick={this.linkCardsManager}>
            <div className={styles.textLeft}>
              <img src={myCard} />
              <span>我的卡</span>
            </div>
            <img className={styles.moreArrow} src={moreArrow} />
          </div>
          <Footer />
        </div>
      </DocumentTitle>
    );
  }
}
