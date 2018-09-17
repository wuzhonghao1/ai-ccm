import React, {Component} from 'react';
import {
    AutoComplete,
    Spin,
    Icon,
    Form,
    DatePicker,
    Row,
    Col,
    Button,
    Table,
    message,
    Popconfirm,
    Select,
    Tabs
} from 'antd';
import Url from '../../store/ajaxUrl';
import moment from 'moment';
import '../../assets/css/tableCommon.less';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

const antIcon = <Icon type="loading" style={{fontSize: 12}} spin/>

class Agent extends Component {
    state = {
        count1: "",
        count2: "",
        dataSource: [],
        selectDate: [],
        loading: false,
        loading1: false,
        loading2: false,
        data1: [],
        data2: [],
        pagination: {},
        // 我的申请
        result: {
            "us1rName": "",
            "enableDate": "",
            "expiredDate": "",
            "optionCode": "",
        },
        // 我的代理人
        result1: {
            "pageInfo": {
                "pageNo": 1,
                "pageSize": 5,
            },
            "approvalStatus": "",
            "agentType": "",
            "agentId": "",
        },
        // 我代理的人
        result2: {
            "pageInfo": {
                "pageNo": 1,
                "pageSize": 5,
            },
            "approvalStatus": "",
            "agentType": "",
            "agentId": "",
            "status": ""
        },
    };
    // 筛选 默认 操作按钮
    moren = {
        filterConfirm: '确定',
        filterReset: '重置',
    };
    // 申请单类型 过滤默认值
    approvalStatus = [];
    // 审批状态 过滤默认值
    requestType = [];

    // 过滤数据转换
    Changed(succeed, initial) {
        initial.quickCodes.map((element) => {
            let obj = {text: element.optionMeaning, value: element.optionCode};
            succeed.push(obj);
            return false;
        });
        return succeed;
    };

    // 授权提交
    handleFetch = () => {
        this.setState({
            loading: true,
        });
        window.$ajax.post(Url.agentDate, this.state.result).then((data) => {
            this.setState({
                loading: false,
            });
            if (data.resultCode === "CCS-12000") {
                message.success('授权成功！')
            } else {
                message.error(data.resultMessage)
            }
        });
    };
    // 自动补全下拉列表渲染
    handleAutoSearch = (value) => {
        this.setState({
            loading: true,
        });
        window.$ajax.get(Url.agentAuto + "/" + value).then((data) => {
            let data2 = data.users.map(item =>
                <Option key={item.userId + ''} value={item.userId + ''}>
                    {item.userName}
                </Option>);
            this.setState({
                dataSource: !value ? [] : data2,
                loading: false,
            });
        })
    };
    // 自动补全下拉选中
    handleAutoSelect = (value) => {
        let result = this.state.result;
        result.agentorId = value;
        this.setState({
            result: result,
        });
    };
    // 审批类型 select
    handleSelectChange = (value) => {
        let result = this.state.result;
        result.requestTypeCode = value;
        this.setState({
            result: result
        });
    };
    // 授权 按钮提交点击
    handleSubmit = (e) => {
        e.preventDefault();
        if (!this.state.result.agentorId) {
            message.error('请从下拉框选择数据！');
        } else {
            this.props.form.validateFields((err, fieldsValue) => {
                if (err) {
                    return;
                }
                const values = {
                    ...fieldsValue,
                    'datepicker1': fieldsValue['datepicker1'].format('YYYY-MM-DD'),
                    'datepicker2': fieldsValue['datepicker2'] ? fieldsValue['datepicker2'].format('YYYY-MM-DD') : null,
                };
                this.setState({
                    result: {
                        "agentorId": this.state.result.agentorId,
                        "enableDate": values.datepicker1,
                        "expiredDate": values.datepicker2,
                        "requestTypeCode": this.state.result.requestTypeCode,
                    },
                }, () => {
                    this.handleFetch()
                })
            });
        }

    };

    // 代理我的人  数据渲染
    handleTableChange1 = (pagination, filters) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({
            pagination1: pager,
            result1: {
                "pageInfo": {
                    "pageNo": pagination.current,
                    "pageSize": pagination.pageSize
                },
                "approvalStatus": filters.approvalStatus,
                "agentType": filters.requestType,
                "id": ""
            },
        }, () => {
            this.handleTableFetch1();
        });
    };
    // 我代理的人  数据渲染
    handleTableChange2 = (pagination, filters) => {


        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({

            pagination2: pager,
            result2: {
                "pageInfo": {
                    "pageNo": pagination.current,
                    "pageSize": pagination.pageSize
                },
                "approvalStatus": filters.approvalStatus,
                "agentType": filters.requestType,
                "id": ""
            },
        }, () => {
            // console.log("2",this.state.data2)
            this.handleTableFetch2();
        });
    };
    // 代理我的人  数据获取
    handleTableFetch1 = (params = {}) => {
        this.setState({
            loading1: true,
        });
        window.$ajax.post(Url.agentMe, this.state.result1).then((data) => {
            if (data.resultCode === 'CCS-12000') {
                const pagination = {...this.state.pagination};
                this.setState({
                    count1: data.agentors.count,
                    data1: data.agentors.result,
                    pagination,
                    loading1: false,
                    ...params,
                });

            } else {
                message.error('获取列表异常，请联系管理员');
                this.setState({
                    loading1: false
                });
            }

        })
    };
    // 我代理的人  数据获取
    handleTableFetch2 = (params = {}) => {
        this.setState({
            loading2: true,
        });
        window.$ajax.post(Url.myAgent, this.state.result2).then((data) => {
            if (data.resultCode === 'CCS-12000') {
                const pagination = {...this.state.pagination};
                pagination.total = 200;
                this.setState({
                    count2: data.agentors.count,
                    data2: data.agentors.result,
                    pagination,
                    loading2: false,
                    ...params,
                });
            } else {
                message.error('获取列表异常，请联系管理员');
                this.setState({
                    loading2: false
                });
            }

        })
    };

    componentDidMount() {
        // 审批状态过滤
        window.$ajax.get(Url.agentApprove).then(data => {
            if (data.resultCode === 'CCS-12000') {
                this.requestType = this.Changed(this.requestType, data)
                this.setState({
                    selectDate: data.quickCodes,
                })
            } else {
                message.error('获取审批状态异常，请联系管理员')
            }
        });
        // 申请单类型过滤
        window.$ajax.get(Url.agentRequestType).then(data => {
            if (data.resultCode === 'CCS-12000') {
                this.approvalStatus = this.Changed(this.approvalStatus, data);
            } else {
                message.error('获取申请状态异常，请联系管理员')
            }

        });

        this.handleTableFetch1();
        this.handleTableFetch2();
    };

    // 撤销 按钮操作
    CXclick1 = (agentId) => {
        this.setState({
            loading1: true,
            result1: {
                "pageInfo": {...this.state.result1.pageInfo},
                "requestType": this.state.result1.requestType,
                "agentId": agentId,
                "approvalStatus": this.state.result1.approvalStatus,
            },
        }, () => {
            window.$ajax.post(Url.agentRemove, {agentId: agentId}).then((data) => {
                message.success(data.resultMessage);
                this.setState({
                    loading1: false,
                }, () => {
                    this.handleTableFetch1();
                    this.handleTableFetch2();
                })

            })
        });
    };
    // 同意 按钮操作
    CXclick2 = (agentId) => {
        this.setState({
            loading2: true,
            result2: {
                "pageInfo": {...this.state.result2.pageInfo},
                "requestType": this.state.result2.requestType,
                "agentId": agentId,
                "approvalStatus": this.state.result2.approvalStatus,
                "status": "ACCEPTED"
            },
        }, () => {
            window.$ajax.post(Url.agentAgree, this.state.result2).then((data) => {
                message.success(data.resultMessage)
                this.setState({
                    loading2: false,
                }, () => {
                    this.handleTableFetch2();
                })
            })
        });

    };
    // 拒绝 按钮操作
    CXclick3 = (agentId) => {
        this.setState({
            loading2: true,
            result2: {
                "pageInfo": {...this.state.result2.pageInfo},
                "requestType": this.state.result2.requestType,
                "agentId": agentId,
                "approvalStatus": this.state.result2.approvalStatus,
                "status": "REJECTED",
            },
        }, () => {
            window.$ajax.post(Url.agentAgree, this.state.result2).then((data) => {
                message.success(data.resultMessage)
                this.setState({
                    loading2: false,
                }, () => {
                    this.handleTableFetch2();
                })
            })
        });

    };

    //tab 切换加载数据
    onTabClick = () => {
        this.handleTableFetch1()
        this.handleTableFetch2()
    }

    // 代理我的人  表头渲染
    columns1 = [
        {
            title: '编号',
            dataIndex: 'agentId',
            width: '5%',
            render: text => <a>{text}</a>,
        }, {
            title: '代理类型',
            dataIndex: 'requestType',
            filters: this.requestType,
            filterMultiple: false,
            width: '10%',
        }, {
            title: '代理人',
            dataIndex: 'agentorName',
            width: '5%',
        }, {
            title: '开始时间',
            dataIndex: 'enableDate',
            width: '10%',
        }, {
            title: '结束时间',
            dataIndex: 'expiredDate',
            width: '10%',
        }, {
            title: '操作',
            dataIndex: 'option',
            // approvalStatusCode 进行判断
            render: (text, record, index) => {
                const agentId = record.agentId;
                return <Popconfirm title="确定撤销操作？" okText="确认" cancelText="返回" onConfirm={() => this.CXclick1(agentId)}>
                    <Button type="primary" size='small'
                    >撤销</Button>
                </Popconfirm>;
            },
            width: '10%',
        }];
    // 我代理的人  表头渲染
    columns2 = [
        {
            title: '编号',
            dataIndex: 'agentId',
            width: '5%',
            render: text => <a>{text}</a>,
        },
        {
            title: '审批状态',
            dataIndex: 'approvalStatus',
            filters: this.approvalStatus,
            width: '10%',
            filterMultiple: false,
        }, {
            title: '代理类型',
            dataIndex: 'requestType',
            filters: this.requestType,
            filterMultiple: false,
            width: '10%',
        }, {
            title: '代理人',
            dataIndex: 'userName',
            width: '5%',
        }, {
            title: '开始时间',
            dataIndex: 'enableDate',
            width: '10%',
        }, {
            title: '结束时间',
            dataIndex: 'expiredDate',
            width: '10%',
        }, {
            title: '操作',
            dataIndex: 'option',
            // approvalStatusCode 进行判断
            render: (text, record, index) => {
                const agentId = record.agentId;
                return <Popconfirm title="确定撤销操作？" okText="确认" cancelText="返回" onConfirm={() => this.CXclick1(agentId)}>
                    <Button type="primary" size='small'
                    >撤销</Button>
                </Popconfirm>;
            },
            width: '15%',
        }];

    render() {
        const {getFieldDecorator} = this.props.form;
        const {dataSource} = this.state;
        const options = this.state.selectDate.map(d => <Option key={d.optionCode}>{d.optionMeaning}</Option>);
        const config = {
            rules: [{type: 'object', required: true, message: '请选择开始时间!'}],
        };
        const config1 = {
            rules: [{required: true, message: '请选择姓名!'}],
        };
        const config2 = {
            rules: [{required: true, message: '请选择代理类型!'}],
        };
        return (
            <div style={{padding: 24}}>
                <Tabs
                    onTabClick={this.onTabClick}
                    defaultActiveKey="1"
                >
                    <TabPane tab="新建申请" key="1">
                        <Form onSubmit={this.handleSubmit}>
                            <Row>
                                <Col span={6}>
                                    <FormItem>
                                        {getFieldDecorator('autocomplete', config1)(
                                            <div>
                                                <AutoComplete
                                                    dataSource={dataSource}
                                                    onSelect={this.handleAutoSelect}
                                                    onSearch={this.handleAutoSearch}
                                                    placeholder="请输入要查询的姓名"
                                                    backfill={true}
                                                />
                                                {this.state.loading ? <Spin indicator={antIcon} style={{
                                                    position: "absolute",
                                                    right: 0,
                                                    top: 0,
                                                }}/> : ""}
                                            </div>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={4} offset={1}>
                                    <FormItem>
                                        {getFieldDecorator('select', config2)(
                                            <Select onSelect={this.handleSelectChange} placeholder={"请选择代理类型"}>
                                                {options}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={4} offset={1}>
                                    <FormItem>
                                        {getFieldDecorator('datepicker1', {...config, initialValue: moment()})(
                                            <DatePicker
                                                placeholder={"开始时间"}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={4}>
                                    <FormItem>
                                        {getFieldDecorator('datepicker2')(
                                            <DatePicker
                                                placeholder={"结束时间"}
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={3} offset={1}>
                                    <FormItem>
                                        <Button type="primary" htmlType="submit">授权</Button>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </TabPane>
                    <TabPane tab="代理我的人" key="2">
                        <Table
                            rowKey={record => record.agentId}
                            columns={this.columns1}
                            dataSource={this.state.data1}
                            loading={this.state.loading1}
                            onChange={this.handleTableChange1}
                            locale={this.moren}
                            size="middle"
                            pagination={{pageSize: 5, total: this.state.count1,}}
                            bordered={true}
                        />
                    </TabPane>
                    <TabPane tab="我代理的人" key="3">
                        <Table
                            rowKey={record => record.agentId}
                            columns={this.columns2}
                            dataSource={this.state.data2}
                            loading={this.state.loading2}
                            onChange={this.handleTableChange2}
                            locale={this.moren}
                            size="middle"
                            pagination={{pageSize: 5, total: this.state.count2,}}
                            bordered={true}
                        />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

const AgentSetting = Form.create()(Agent);

export default AgentSetting


