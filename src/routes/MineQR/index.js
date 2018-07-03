import React, { Component } from 'react';
import { connect } from 'dva';
import DocumentTitle from 'react-document-title';
import { Button } from 'antd-mobile';
import bg from '../../assets/png/bg1.png';
import refresh from '../../assets/svg/refresh.svg';
import refreshSuccess from '../../assets/svg/refreshSuccess.svg';
import styles from './index.less';
import QRCode from 'qrcode.react';
import portUrl from '../../common/portUrl.js';
import { getCookie } from '../../utils/utils';

@connect(({ global }) => ({
  global,
}))
export default class MineQR extends Component {
  state = {
    qrcode: '',
    refreshFlag: false,
  }

  componentDidMount() {
    getCookie('microrestaurant_eti_number');
    this.getQrCode();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  getQrCode = () => {
    if (!this.state.refreshFlag) {
      clearTimeout(this.timer);

      const { dispatch } = this.props;

      const That = this;

      dispatch({
        type: 'global/getQrCode',
        payload: That,
      });
    }
  }

  countDownTime = (time) => {
    if (time === 0) {
      this.getQrCode();
    } else {
      time--;

      this.timer = setTimeout(()=>{
        this.countDownTime(time)
      },1000)
    }
  }

  render() {
    const tipStyle = {
      backgroundImage: `url(${bg})`
    }

    const { userInfo } = this.props.global;
    const { qrcode, refreshFlag } = this.state;

    return (
      <DocumentTitle title="我的卡二维码">
        <div style={ tipStyle } className={styles.mineQR}>
          <div className={styles.qrDiv}>
            <QRCode onClick={this.getQrCode} size={200} value={qrcode} />
            {
              refreshFlag ? (
                <p>
                  <img src={refreshSuccess} />
                  已刷新
                </p>
              ) : (
                <p>
                  <img src={refresh} />
                  请点击二维码
                  <span onClick={this.getQrCode}>刷新</span>
                </p>
              )
            }
          </div>
        </div>
      </DocumentTitle>
    );
  }
}
