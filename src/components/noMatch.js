import React from 'react';
import {Link} from 'react-router-dom';

class Head extends React.Component {

    render() {
        return (
            <div>
                没有找到哦～
                <Link to='/index'>主页</Link>
            </div>
        );
    }
}

export default Head;