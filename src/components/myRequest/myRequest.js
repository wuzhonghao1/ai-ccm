import React from 'react';
import {Table, Button, Popconfirm, message, Modal, Card, Layout} from 'antd';
import Url from '../../store/ajaxUrl';
import '../../assets/css/tableCommon.less';

const {Content} = Layout;

class TableMyApply extends React.Component {
    Changed(succeed, initial) {
        initial.quickCodes.map((element) => {
            let obj = {text: element.optionMeaning, value: element.optionCode}
            succeed.push(obj);
            return obj;
        });
        return succeed;
    };

    approvalStatus = [];
    requestType = [];


    moren = {
        filterConfirm: '确定',
        filterReset: '重置',
    };
    state = {
        data: [],
        pagination: {},
        loading: false,
        result: {},
        // 页码
        pageNo: 1,
        // 条数
        pageSize: 10,
        // 审批状态
        approvalStatus: ['REQUESTED'],
        // 申请单类型
        requestType: null,
        // 表单id
        id: "",
    };


    handleTableChange = async (pagination, filters) => {
        const pager = {...this.state.pagination};
        await this.setState({filters: filters});

        pager.current = pagination.current;
        await this.setState({
            pagination: pager,
            pageNo: pagination.current,
            pageSize: pagination.pageSize,
            approvalStatus: filters ? filters.approvalStatus : null,
            requestType: filters ? filters.requestType : null,
            id: ""
        })
        this.fetch();
    };
    fetch = async (params = {}) => {
        this.setState({
            loading: true,
        });
        let result = {
            pageInfo: {},
            approvalStatus: this.state.approvalStatus ? this.state.approvalStatus : null,
            requestType: this.state.requestType ? this.state.requestType : null,
            id: ""
        };
        let pageInfo = {
            pageNo: this.state.pageNo,
            pageSize: this.state.pageSize
        };
        result.pageInfo = pageInfo ? pageInfo : undefined;
        await this.setState({result: result});
        await this.setState({approvalStatus: this.state.result.approvalStatus});
        window.$ajax.post(Url.applyGet, this.state.result).then((data) => {
            if (data.resultCode === 'CCS-12000') {
                // console.log(data);
                const pagination = {...this.state.pagination};
                pagination.total = data.pageInfo.count;
                this.setState({
                    data: data.pageInfo.result,
                    pagination,
                    loading: false,
                    ...params,
                });
            } else {
                message.error('获取列表异常，请联系管理员');
                this.setState({
                    loading: false
                });
            }
        });
    };

    componentDidMount() {

        window.$ajax.get(Url.approveState).then(data => {
            if (data.resultCode === 'CCS-12000') {
                this.approvalStatus = this.Changed(this.approvalStatus, data)
            } else {
                message.error('获取审批状态异常，请联系管理员')
            }

        });
        window.$ajax.get(Url.requestType).then(data => {
            if (data.resultCode === 'CCS-12000') {
                this.requestType = this.Changed(this.requestType, data)
            } else {
                message.error('获取申请状态异常，请联系管理员')
            }
        });

        this.fetch()
    };

    CXclick = async (record) => {
        this.setState({loading: true});
        if (record.requestTypeCode === 'APPLY_CUSTOMER') {
            let response = await window.$ajax.post(Url.cancelCustomerApply + record.requestId);
            if (response.resultCode === 'CCS-12000') {
                Modal.success({
                    title: '提示',
                    content: '撤销成功'
                });
            } else {
                Modal.error({
                    title: '提示',
                    content: response.resultMessage
                });
            }
        } else if (record.requestTypeCode === 'APPLY_OWNER') {
            let response = await window.$ajax.post(Url.cancelOwnerApply + record.requestId);
            if (response.resultCode === 'CCS-12000') {
                Modal.success({
                    title: '提示',
                    content: '撤销成功'
                });
            } else {
                Modal.error({
                    title: '提示',
                    content: response.resultMessage
                });
            }
        } else if (record.requestTypeCode === 'APPLY_ROLE') {
            // APPLY_ROLE
            let response = await window.$ajax.post(Url.cancelRoleApply + record.requestId);
            if (response.resultCode === 'CCS-12000') {
                Modal.success({
                    title: '提示',
                    content: '撤销成功'
                });
            } else {
                Modal.error({
                    title: '提示',
                    content: response.resultMessage
                });
            }
        } else {
            // APPLY_ROLE
            let response = await window.$ajax.post(Url.cancelCustomerChange + record.requestId);
            if (response.resultCode === 'CCS-12000') {
                Modal.success({
                    title: '提示',
                    content: '撤销成功'
                });
            } else {
                Modal.error({
                    title: '提示',
                    content: response.resultMessage
                });
            }
        }
        await this.fetch();
        this.setState({loading: false});
    };


    render() {
        let columns = [
            {
                title: '申请单编号',
                dataIndex: 'requestId',
                render: (text, record) => {
                    if (record.requestTypeCode === 'APPLY_OWNER' && record.approvalStatusCode !== 'APPROVALED') {
                        return text;
                    } else if (record.requestTypeCode === 'APPLY_CUSTOMER' && record.approvalStatusCode !== 'REBUT') {
                        return <a onClick={() => {
                            this.props.history.push(`/index/createCustomer/detail/${record.objectId}`);
                        }}>{text}</a>
                    } else if (record.requestTypeCode === 'APPLY_CUSTOMER' && record.approvalStatusCode === 'REBUT') {
                        return <a onClick={() => {
                            this.props.history.push(`/index/createCustomer/edit/${record.objectId}`);
                        }}>{text}</a>
                    } else if (record.requestTypeCode === 'APPLY_ROLE') {
                        return <a onClick={() => {
                            this.props.history.push(`/index/applyPermission/detail/${record.objectId}`);
                        }}>{text}</a>

                    } else if (record.requestTypeCode === 'APPLY_CHANGE') {
                        return <a onClick={() => {
                            this.props.history.push(`/index/messageChanged/detail/${record.objectId}`);
                        }}>{text}</a>
                        // this.props.history.push(`/index/messageChanged/detail/${record.objectId}`);
                    } else {
                        return <a onClick={() => {
                            this.props.history.push(`/index/createCustomer/detail/${record.objectId}`);
                        }}>{text}</a>
                    }
                },
                width: '10%',
            }, {
                title: '审批状态',
                dataIndex: 'approvalStatus',
                filters: this.approvalStatus,
                filteredValue: this.state.approvalStatus,
                width: '10%',
                filterMultiple: false,
            }, {
                title: '申请单类型',
                dataIndex: 'requestType',
                filters: this.requestType,
                filterMultiple: false,
                width: '10%',
            }, {
                title: '申请信息',
                dataIndex: 'description',
                width: '10%'
            }, {
                title: '审批意见',
                dataIndex: 'approvalReason',
                width: '18%',
            }, {
                title: '审批人',
                dataIndex: 'approver',
                width: '8%',
            }, {
                title: '申请时间',
                dataIndex: 'requestDate',
                width: '13%',
            }, {
                title: '审批时间',
                dataIndex: 'approveDate',
                width: '13%',
            }, {
                title: '操作',
                dataIndex: 'option',
                render: (text, record) => {
                    if (record.approvalStatusCode === 'REQUESTED')
                        return <div style={{
                            margin: '0 auto',
                            width: '120px'
                        }}>
                            <Popconfirm title="确定撤销？" okText="确认撤销" cancelText="返回" onConfirm={() => this.CXclick(record)}>
                                <Button type="primary" size="small"
                                >撤销</Button>
                            </Popconfirm>
                        </div>
                    if (record.approvalStatusCode === 'REJECT' && record.requestType === 'APPLY_CUSTOMER') {
                        return <div style={{
                            margin: '0 auto',
                            width: '120px'
                        }}>
                            <Button type="primary" size="small"
                                    onClick={() => this.props.history.push(`/index/createCustomer/edit/${record.objectId}`)}>编辑</Button>
                        </div>
                    }

                },
                width: '10%',
            }];
        return (
            <Layout style={{background: '#ECECEC'}}>
                <Content style={{height: '100%', width: '100%'}}>
                    <Card title="我的申请" bordered={false} style={{width: '100%', minHeight: '80vh'}}>
                        <Table
                            rowKey={record => record.requestId}
                            columns={columns}
                            dataSource={this.state.data}
                            pagination={this.state.pagination}
                            loading={this.state.loading}
                            onChange={this.handleTableChange}
                            locale={this.moren}
                            size="middle"
                            bordered={true}
                        />
                    </Card>
                </Content>
            </Layout>
        );
    }
}

export default TableMyApply;
