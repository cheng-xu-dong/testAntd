import React, { Component } from 'react';
import { Button, WhiteSpace, WingBlank, Toast } from 'antd-mobile';
import { connect } from 'dva';
import { getCookie } from '../../utils/utils';
import styles from './index.less';

@connect(({ global }) => ({
  global,
}))
export default class ClearCookie extends Component {
  render() {
    return (
      <WingBlank>
        <WhiteSpace /><Button type="primary"> 清除缓存 </Button><WhiteSpace />
      </WingBlank>
    );
  }
}
