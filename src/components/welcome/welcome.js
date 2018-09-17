// 系统欢迎页面
import React, {Component} from 'react';
import {Alert} from 'antd';

class Welcome extends Component {
    render() {
        const webChat = require('../../assets/welcome.png');
        let tag = false;
        if (this.props.menuList) {
            if (this.props.menuList.length === 0) {
                tag = true;
            } else {
                tag = false;
            }
        } else {
            tag = false;
        }
        return (
            <div>
                {tag ?
                    <Alert
                        message="您无系统权限，请联系管理员开通权限"
                        type="error"
                        style={{
                            fontSize: 19, position: 'absolute',
                            top: '360px', left: '540px'
                        }}
                    /> :''
                }
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '500px'
                }}>
                    <img src={webChat} alt={'客户管理系统'} style={{width: 50}}/>
                    <span style={{fontSize: 20, lineHeight: '10px', marginLeft: '5px'}}>欢迎使用，客户管理系统！</span>
                    {/*<span style={{fontSize: 20, lineHeight: '10px',color: '#f4a034'}}>{this.props.menuList.length === 0 ? '您无系统权限，请联系管理员开通权限' : ''}</span>*/}
                </div>
            </div>

        )
    }
}

export default Welcome;
