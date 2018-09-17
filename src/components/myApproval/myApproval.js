import React from 'react';
import {Table, Button, message, Modal, Col, Row, Input, Card, Layout, Select, Divider} from 'antd';
import Url from '../../store/ajaxUrl';
import '../../assets/css/tableCommon.less';

const {TextArea} = Input;
const {Content} = Layout;
const Option = Select.Option;

class TableMyApply extends React.Component {
    Changed(succeed, initial) {
        initial.quickCodes.map((element) => {
            let obj = {text: element.optionMeaning, value: element.optionCode};
            succeed.push(obj);
            return obj;
        });
        return succeed;
    };

    // 审批状态列表
    approvalStatus = [];
    // 申请单类型列表
    requestType = [];

    moren = {
        filterConfirm: '确定',
        filterReset: '重置',
    };
    state = {
        data: [],
        pagination: {},
        loading: false,
        approveMessage: null,
        approveModel: false,
        requestId: null,
        filters: null,
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
        result: {},
        showTransfer: false,
        transferUser: [],
        transferTo: undefined
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
        });
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

        window.$ajax.post(Url.approvalGet, this.state.result).then((data) => {
            if (data.resultCode === 'CCS-12000') {
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

        })
    };

    componentDidMount() {
        window.$ajax.get(Url.approveState).then(data => {
            if (data.resultCode === 'CCS-12000') {
                this.approvalStatus = this.Changed(this.approvalStatus, data);
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

        this.fetch();
    };

    approve = async (state) => {

        if (state === 'REJECT' && !this.state.approveMessage) {
            message.error('请填写审批意见');
            return;
        }

        this.setState({approveModel: false});
        let response = await window.$ajax.post(Url.ownerApprove, {
            requestId: this.state.requestId,
            approvalStatusCode: state,
            remark: this.state.approveMessage
        });
        if (response.resultCode === 'CCS-12000') {
            Modal.success({
                title: '提示',
                content: response.resultMessage
            });
        } else {
            Modal.error({
                title: '提示',
                content: response.resultMessage
            });
        }
        this.handleTableChange(this.state.pagination, this.state.filters);
    };

    transferOk = async () => {
        if (!this.state.transferTo) {
            message.error('请选择转交人');
            return;
        }
        this.setState({showTransfer: false});
        let response = await window.$ajax.post(Url.changeApprover, {
            requestId: this.state.requestId,
            userId: this.state.transferTo
        });
        if (response.resultCode === 'CCS-12000') {
            Modal.success({
                title: '提示',
                content: response.resultMessage,
                onOk: () => {
                    this.handleTableChange(this.state.pagination, this.state.filters);
                }
            });
        } else {
            Modal.error({
                title: '提示',
                content: response.resultMessage,
                onOk: () => {
                    this.handleTableChange(this.state.pagination, this.state.filters);
                }
            });
        }


    };
    

    render() {
        let columns = [
            {
                title: '申请单编号',
                dataIndex: 'requestId',
                render: (text, record) => <a onClick={() => {
                    if (record.requestTypeCode === 'APPLY_CUSTOMER' || record.requestTypeCode === 'APPLY_OWNER') {
                        this.props.history.push(`/index/createCustomer/detail/${record.objectId}`);
                    } else if (record.requestTypeCode === 'APPLY_ROLE') {
                        this.props.history.push(`/index/applyPermission/detail/${record.objectId}`);
                    } else if (record.requestTypeCode === 'APPLY_CHANGE') {
                        this.props.history.push(`/index/messageChanged/detail/${record.objectId}`);
                    }
                }
                }>{text}</a>,
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
    
                width: '14%',
            }, {
                title: '申请信息',
                dataIndex: 'description',
                width: '10%'
            }, {
                title: '申请人',
                dataIndex: 'applicant',
                width: '8%',
            }, {
                title: '申请时间',
                dataIndex: 'requestDate',
                width: '10%',
            }, {
                title: '操作',
                dataIndex: 'option',
                render: (text, record) => {
                    const Id = record.requestId;
                    if (record.approvalStatusCode !== 'APPROVALED' && record.approvalStatusCode !== 'REJECT' && record.approvalStatusCode !== 'REBUT' && record.approvalStatusCode !== 'TRANSERRED' && record.approvalStatusCode !== 'CANCELLED') {
                        return <div style={{
                            margin: '0 auto',
                            width: '120px'
                        }}>
                            <Button onClick={() => {
                                if (record.requestTypeCode === 'APPLY_CUSTOMER') {
                                    this.props.history.push(`/index/createCustomer/approve/${record.objectId}/${record.requestId}`);
                                } else if (record.requestTypeCode === 'APPLY_ROLE') {
                                    this.props.history.push(`/index/applyPermission/approve/${record.objectId}/${record.requestId}`);
                                } else if (record.requestTypeCode === 'APPLY_OWNER') {
                                    this.setState({requestId: record.requestId, approveModel: true});
                                } else if (record.requestTypeCode === 'APPLY_CHANGE') {
                                    this.props.history.push(`/index/messageChanged/detail/${record.objectId}/${Id}`)
                                }
                            }} type="primary" size="small">审批</Button>
                            <Divider type="vertical"/>
                            <Button onClick={async () => {
                                this.setState({showTransfer: true});
                                let response = await window.$ajax.get(`${Url.transferApprover}${record.requestId}`);
                                if (response.resultCode === 'CCS-12000') {
                                    this.setState({transferUser: response.users, requestId: record.requestId});
                                } else {
                                    message.error(response.resultMessage);
                                }
    
                            }} type="primary" size="small">转交</Button>
                        </div>
                    }
                },
                width: '10%',
            }];
        return (
            <div>
                <Layout style={{background: '#ECECEC'}}>
                    <Content style={{height: '100%', width: '100%'}}>
                        <Card title="我的审批" bordered={false} style={{width: '100%', minHeight: '80vh'}}>
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
                <Modal title="Owner审批"
                       visible={this.state.approveModel}
                       onCancel={() => this.setState({approveModel: false})}
                       footer={<div>
                           <Button onClick={() => this.setState({approveModel: false})}>取消</Button>
                           <Button onClick={() => this.approve('REJECT')}>拒绝</Button>
                           <Button type="primary" onClick={() => this.approve('APPROVALED')}>同意</Button>
                       </div>}>
                    <Row>
                        <Col span={6} style={{textAlign: 'right'}}>
                            审批意见：
                        </Col>
                        <Col span={18}>
                            <TextArea placeholder="请输入审批意见" value={this.state.approveMessage}
                                      onChange={(value) => this.setState({approveMessage: value.target.value})}
                                      autosize style={{width: '90%'}}/>
                        </Col>
                    </Row>
                </Modal>
                <Modal title="转交审批人" visible={this.state.showTransfer}
                       onOk={this.transferOk}
                       onCancel={() => this.setState({showTransfer: false})}>
                    <Select placeholder="请输入转交人"
                            style={{width: '80%', marginLeft: '10%'}}
                            value={this.state.transferTo}
                            onSelect={(value) => this.setState({transferTo: value})}>
                        {this.state.transferUser.map(item => <Option value={item.userId}
                                                                     key={item.userId}>{item.userName}</Option>)}
                    </Select>
                </Modal>
            </div>

        );
    }
}

export default TableMyApply
