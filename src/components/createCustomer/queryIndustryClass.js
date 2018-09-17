// 查询分类信息
import React, {Component} from 'react';

import {Table, Input, message, Modal} from 'antd';
import Url from '../../store/ajaxUrl';

const Search = Input.Search;
const columns = [{
    title: '门类',
    dataIndex: 'classLevel1',
    width: 60
}, {
    title: '大类',
    dataIndex: 'classLevel2',
    width: 120
}, {
    title: '中类',
    dataIndex: 'classLevel3',
    width: 120
}, {
    title: '小类',
    dataIndex: 'classLevel4',
    width: 90
}];

class QueryIndustryClass extends Component {
    state = {
        data: [],
        loading: false,
        selectedRowKeys: []
    };

    onSelectChange = (selectedRowKeys) => {
        // 不允许选择重复的
        if (this.props.isMain) {
            let tag = true;
            for (let i = 0; i < this.props.selectIndustryObj.length; i++) {
                if (this.props.selectIndustryObj[i].industryCode === selectedRowKeys[selectedRowKeys.length - 1]) {
                    message.error('不能选择重复的数据');
                    tag = false;
                    break;
                }
            }
            if (tag) {
                this.setState({selectedRowKeys});
            }
        } else {
            this.setState({selectedRowKeys});
        }
    };

    componentWillReceiveProps(nextProps) {
        // 菜单选中状态切回
        if (!nextProps.queryIndustryClassModal) {
            this.setState({selectedRowKeys: [], data: []})
        }
    }

    query = (value) => {
        if (value === undefined || value === null || value.length === 0) {
            message.error('请输入查询条件');
            return;
        }
        this.setState({loading: true});
        window.$ajax.get(Url.industryClass + value, {}).then(res => {
            if (res.resultCode !== 'CCS-12000') {
                message.error('接口异常，请联系管理员');
            } else {
                this.setState({data: res.industryClasses});
            }
            this.setState({loading: false});

        }).catch(error => {
            this.setState({loading: false});
        });
    };

    handleOk = () => {
        let selectObj = this.state.data.filter(item => this.state.selectedRowKeys.indexOf(item.industryCode) >= 0)[0];
        this.props.ok(selectObj);
    };

    render() {
        return (
            <div>
                <Modal
                    title="选择行业分类"
                    visible={this.props.show}
                    onOk={this.handleOk}
                    onCancel={() => this.props.ok()}
                    destroyOnClose={true}
                    width={800} style={{width: '550px'}}>
                    <div>
                        <div style={{margin: '10px 0'}}>
                            <Search
                                placeholder="请输入分类名"
                                onSearch={value => this.query(value)}
                                enterButton
                                style={{width: '100%', height: '32px'}}
                            />
                        </div>
                        <Table
                            filterMultiple={true}
                            rowSelection={{
                                type: 'radio',
                                onChange: this.onSelectChange,
                                selectedRowKeys: this.state.selectedRowKeys
                            }}
                            pagination={false}
                            columns={columns}
                            rowKey={record => record.industryCode}
                            dataSource={this.state.data}
                            loading={this.state.loading}
                            onChange={this.handleTableChange}
                            size="middle"
                            scroll={{y: 500, x: 400}}
                            rowClassName="query-table"
                            bordered={true}/>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default QueryIndustryClass;
