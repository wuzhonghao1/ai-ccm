// 字段更新列表
import React from 'react';
import {Col, Row, Table} from "antd";
import moment from 'moment';
const columns = [{
    title: '变更类别',
    dataIndex: 'fieldDisplayName'
}, {
    title: '变更前内容',
    dataIndex: 'lastValue'
}, {
    title: '变更后内容',
    dataIndex: 'currentValue'
}, {
    title: '更新时间',
    dataIndex: 'lastUpdateDate',
    render: (text, record) => {
        return moment(text).format("YYYY-MM-DD HH:mm:ss")
    }
},{
    title: '更新人',
    dataIndex: 'lastUpdatedByName'
}];


class FieldHistory extends React.Component {
    render () {
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <Table
                            bordered
                            dataSource={this.props.dataSource}
                            size='middle'
                            columns={columns}
                            pagination={false}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default FieldHistory;
