import React, {Component} from 'react';
import {Table, Menu, Dropdown, Icon, Input, Modal, message, Select, Card, Layout, Row, Col} from 'antd';
import moment from 'moment';
import './queryTable.less';
import lang from '../../i18n/index';
import Url from '../../store/ajaxUrl';
import {Link} from 'react-router-dom';
import '../../assets/css/tableCommon.less';

const {Content} = Layout;
const Search = Input.Search;
const Option = Select.Option;
/**
 * 角色控制
 * @type {string}
 */
const approvalGroupCode = window.sessionStorage.getItem('approvalGroupCode');

class QueryTable extends Component {
    state = {
        data: [],
        pagination: {defaultPageSize: 10},
        loading: false,
        customerCode: '',
        showOwnerApply: false,
        customerId: null,
        // 审批人列表
        approverList: [],
        // 审批人
        approverId: null,
        // 财务确认窗口
        showFinanceConfirm: false,
        // 关联方
        erpRelatedParty: '29',
        // 关联段
        eprRelatedSegment: '0',
        erpRelatedPartyList: [],
        eprRelatedSegmentList: [],
        erpOrgList: [],
        confirmErpOrg: undefined
    };

    columns = [{
        title: lang.customerQuery.columnsHead.customerCode,
        dataIndex: 'customerNumber',
        render: (text, record) => (
            record.detail ? <Link
                to={'/index/createCustomer/detail/' + record.customerId}>{record.customerNumber}</Link> : record.customerNumber
        )
    }, {
        title: lang.customerQuery.columnsHead.customerName,
        dataIndex: 'customerName',
        render: (text, record) => (
            record.detail ? <Link
                to={'/index/createCustomer/detail/' + record.customerId}>{record.customerName}</Link> : record.customerName
        )
    }, {
        title: lang.customerQuery.columnsHead.unifiedSocialCode,
        dataIndex: 'unifiedSocialCode'
    }, {
        title: lang.customerQuery.columnsHead.legalPerson,
        dataIndex: 'legalPerson'
    }, {
        title: lang.customerQuery.columnsHead.lastUpdatedBy,
        dataIndex: 'lastUpdatedBy'
    }, {
        title: lang.customerQuery.columnsHead.status,
        dataIndex: 'codeMeaning'
    }, {
        title: lang.customerQuery.columnsHead.action,
        render: (text, record) =>
            // 控制按钮的展示
            record.disable || record.edit || record.editBaseData || record.enable || record.ownerApply || record.confirm
                ?
                <Dropdown overlay={this.menu(record)} trigger={['click']}>
                    <a className="ant-dropdown-link">
                        <Icon type="appstore" theme="filled" style={{fontSize: '23px'}}/>
                    </a>
                </Dropdown>
                : undefined

    }];

    // 语言
    menu = (record) => {
        let editBase;
        if (record.editBaseData === 1) {
            editBase = <Menu.Item>
                <a target="_blank" rel="noopener noreferrer"
                   onClick={() => Modal.warn({
                       title: lang.global.modalTitle,
                       content: lang.customerQuery.alertMes.baseInfoChangeError
                   })}>{lang.customerQuery.menuButton.baseInfoChange}</a>
            </Menu.Item>
        } else if (record.editBaseData === 2) {
            editBase = <Menu.Item>
                <a style={{color: '#f4a034'}} target="_blank" rel="noopener noreferrer"
                   onClick={() => this.props.history.push('/index/messageChanged/edit/' + record.customerId)}>
                    {lang.customerQuery.menuButton.baseInfoChange}
                </a>
            </Menu.Item>
        }


        return (
            <Menu>
                {record.ownerApply ?
                    <Menu.Item>
                        <a style={{color: '#f4a034'}} target="_blank"
                           onClick={() => this.applyOwner(record.customerId)}>{lang.customerQuery.menuButton.ownerApply}</a>
                    </Menu.Item>
                    : undefined}
                {record.enable ?
                    <Menu.Item>
                        <a style={{color: '#f4a034'}} target="_blank" rel="noopener noreferrer"
                           onClick={() => this.enable(record.customerId)}>{lang.customerQuery.menuButton.effective}</a>
                    </Menu.Item>
                    : undefined}
                {record.disable ?
                    <Menu.Item>
                        <a style={{color: '#f4a034'}} target="_blank" rel="noopener noreferrer"
                           onClick={() => this.disable(record.customerId)}>{lang.customerQuery.menuButton.invalid}</a>
                    </Menu.Item>
                    : undefined}
                {record.confirm ?
                    <Menu.Item>
                        <a style={{color: '#f4a034'}} target="_blank" rel="noopener noreferrer"
                           onClick={() => this.financeConfirm(record.customerId)}>{lang.customerQuery.menuButton.confirm}</a>
                    </Menu.Item>
                    : undefined}
                {record.edit ?
                    <Menu.Item>
                        <a style={{color: '#f4a034'}} target="_blank" rel="noopener noreferrer"
                           onClick={() => this.props.history.push('/index/createCustomer/edit/' + record.customerId)}>
                            {window.sessionStorage.getItem('approvalGroupCode') === 'AG_CCM' ? lang.customerQuery.menuButton.managementInformationModification : lang.customerQuery.menuButton.contactModification}
                        </a>
                    </Menu.Item>
                    : undefined}
                {editBase}
            </Menu>
        )
    };

    async componentDidMount() {
        // 销售管理员
        let approverList = await window.$ajax.get(Url.ownerApproverGet);
        if (approverList.resultCode === 'CCS-12000') {
            this.setState({approverList: approverList.users});
        } else {
            message.error(lang.customerQuery.alertMes.getAdminError);
        }
        this.getCustmer({
            customerCode: '',
            pageInfo: {
                pageNo: 1,
                pageSize: 10
            }
        });
        if (approvalGroupCode === 'AG_FIN') {
            let response = await window.$ajax.get(Url.erpRelatedParty, {});
            if (response.resultCode === 'CCS-12000') {
                this.setState({erpRelatedPartyList: response.quickCodes});
            } else {
                message.error(lang.customerQuery.alertMes.getErpRelatedPartyError);
            }
            let response2 = await window.$ajax.get(Url.erpRelatedSegment, {});
            if (response2.resultCode === 'CCS-12000') {
                this.setState({eprRelatedSegmentList: response2.quickCodes});
            } else {
                message.error(lang.customerQuery.alertMes.getEprRelatedSegmentError);
            }
        }
    }


    /**
     * 生效客户
     * @param customerId
     */
    enable = async (customerId) => {
        this.setState({loading: true});
        let response = await window.$ajax.post(Url.customerEnable + '/' + customerId);
        if (response.resultCode === 'CCS-12000') {
            this.handleTableChange(this.state.pagination);
            Modal.success({
                title: lang.global.alertModalTitle,
                content: response.resultMessage
            });
        } else {
            Modal.error({
                title: lang.global.alertModalTitle,
                content: response.resultMessage
            });
            this.setState({loading: false});
        }
    };

    /**
     * 失效客户
     * @param customerId
     */
    disable = async (customerId) => {
        this.setState({loading: true});
        let response = await window.$ajax.post(Url.customerDisable + '/' + customerId);
        if (response.resultCode === 'CCS-12000') {
            this.handleTableChange(this.state.pagination);
            Modal.success({
                title: lang.global.alertModalTitle,
                content: response.resultMessage
            });
        } else {
            this.setState({loading: false});
            Modal.error({
                title: lang.global.alertModalTitle,
                content: response.resultMessage
            });
        }
    };
    /**
     * owner申请
     * @param customerId    客户id
     * @returns {Promise<void>}
     */
    applyOwner = async (customerId) => {
        this.setState({showOwnerApply: true, customerId: customerId});

    };

    // 表格查询
    handleTableChange = (pagination) => {
        this.setState({pagination: pagination});
        this.getCustmer({
            customerCode: this.state.customerCode,
            pageInfo: {
                pageNo: pagination.current,
                pageSize: pagination.pageSize
            }
        });
    };

    // 获取查询数据
    getCustmer = async (params) => {
        this.setState({loading: true});
        let response = await window.$ajax.post(Url.customerQuery, params);

        this.setState({
            loading: false, data: [...response.customers.result], pagination: {
                current: params.pageInfo.pageNo,
                pageSize: params.pageInfo.pageSize,
                total: response.customers.count
            }
        });
    };

    // 查询条件
    handleQueryChange = (value) => {
        this.setState({customerCode: value});
        this.getCustmer({
            customerCode: value,
            pageInfo: {
                pageNo: 1,
                pageSize: this.state.pagination.pageSize
            }
        });
    };


    /**
     * owner申请确认
     * @returns {Promise<void>}
     */
    handleOk = async () => {
        if (this.state.approverId === null) {
            message.error(lang.customerQuery.alertMes.changeApproverError);
            return;
        }
        this.setState({showOwnerApply: false});
        this.setState({loading: true});
        let response = await window.$ajax.post(Url.ownerApply, {
            customerId: this.state.customerId,
            approverId: this.state.approverId
        });
        if (response.resultCode === 'CCS-12000') {
            this.handleTableChange(this.state.pagination);
            Modal.success({
                title: lang.global.alertModalTitle,
                content: response.resultMessage
            });
        } else {
            this.setState({loading: false});
            Modal.error({
                title: lang.global.alertModalTitle,
                content: response.resultMessage
            });
        }
    };
    /**
     * 财务确认
     * @param customerId    客户Id
     */
    financeConfirm = async (customerId) => {
        this.setState({showFinanceConfirm: true, customerId: customerId, erpRelatedParty: '29',eprRelatedSegment: '0' });
        let response3 = await window.$ajax.get(`${Url.erpOrgGet}${customerId}`);
        if (response3.resultCode === 'CCS-12000') {
            this.setState({erpOrgList: response3.relations});
            // 默认选中第一条记录
            if (response3.relations.length > 0) {
                this.setState({confirmErpOrg: response3.relations[0].partyRelationId});
            }
        }
    };

    // 财务确认
    confirmOk = async () => {
        if (!this.state.erpRelatedParty) {
            message.error(lang.customerQuery.alertMes.changeApproverError);
            return;
        }
        if (!this.state.eprRelatedSegment) {
            message.error(lang.customerQuery.alertMes.changeEprRelatedSegmentError);
            return;
        }
        this.setState({showFinanceConfirm: false});
        let submitData = {
            customerId: this.state.customerId,
            category: [],
            relation: []
        };

        // 关联方
        submitData.category.push({
            codeValue: this.state.erpRelatedParty,
            sourceCode: 'CATEGORY',
            categoryCode: 'ERP_RELATED_PARTY',
            states_code: 'NORMAL'
        });

        // 关联段
        submitData.category.push({
            codeValue: this.state.eprRelatedSegment,
            sourceCode: 'CATEGORY',
            categoryCode: 'EPR_RELATED_SEGMENT',
            states_code: 'NORMAL'
        });
        if (this.state.confirmErpOrg) {
            // 关系
            submitData.relation.push({
                partyRelationId: this.state.confirmErpOrg,
                disableDate: moment().format("YYYY-MM-DD HH:mm:ss"),
                customerId: this.state.customerId,
                objectVersionNumber: this.state.erpOrgList.filter(item => item.partyRelationId === this.state.confirmErpOrg)[0].objectVersionNumber,
                states_code: 'NORMAL'
            });
        }

        let response = await window.$ajax.post(Url.saveCustomerInfo, submitData);
        if (response.resultCode === 'CCS-11000') {
            Modal.success({
                title: lang.global.alertModalTitle,
                content: lang.global.success,
                onOk: () => {
                    this.handleTableChange(this.state.pagination);
                }
            });
        } else {
            Modal.error({
                title: '提示',
                content: response.resultMessage
            });
        }
    };

    render() {
        return (
            <div>
                <Layout style={{background: '#ECECEC'}}>
                    <Content style={{height: '100%', width: '100%'}}>
                        <Card title={lang.customerQuery.pageTitle} bordered={false} style={{width: '100%', minHeight: '80vh'}}>
                            <div style={{margin: '0 auto', width: 800}}>
                                <Search
                                    placeholder={lang.customerQuery.placeholder.queryCustomerSelect}
                                    onSearch={value => {
                                        this.handleQueryChange(value);
                                    }}
                                    enterButton
                                    style={{marginBottom: '15px', width: '100%'}}
                                />
                            </div>
                            <Table
                                columns={this.columns}
                                rowKey={record => record.customerId}
                                dataSource={this.state.data}
                                pagination={this.state.pagination}
                                loading={this.state.loading}
                                onChange={(pagination) => this.handleTableChange(pagination)}
                                size="middle"
                                rowClassName="query-table"
                                bordered={true}
                            />
                            {/*Owner申请选择审批人*/}
                            <Modal title={lang.customerQuery.placeholder.changeApprover}
                                   visible={this.state.showOwnerApply}
                                   onOk={this.handleOk}
                                   onCancel={() => this.setState({showOwnerApply: false})}
                            >
                                <div style={{width: 400, margin: '0 auto'}}>
                                    审批人：
                                    <Select placeholder={lang.customerQuery.placeholder.changeApprover} size="small" style={{width: '80%'}}
                                            onChange={value => this.setState({approverId: value})}>
                                        {this.state.approverList.map(item => <Option value={item.userId}
                                                                                     key={item.userId}>{item.userName}</Option>)}
                                    </Select>
                                </div>
                            </Modal>
                            {/*=======================================财务确认=======================================*/}
                            <Modal title={lang.customerQuery.modalTitle}
                                   visible={this.state.showFinanceConfirm}
                                   onOk={this.confirmOk}
                                   destroyOnClose={true}
                                   onCancel={() => this.setState({showFinanceConfirm: false})}
                            >
                                <div style={{width: 600}}>
                                    <div style={{margin: '10px auto'}}>
                                        <Row>
                                            <Col span={12} offset={4}>
                                                OU：
                                                <Select placeholder="请选择OU" size="small"
                                                        style={{width: '80%', marginLeft: 22}}
                                                        onChange={value => this.setState({confirmErpOrg: value})}
                                                        value={this.state.confirmErpOrg}>
                                                    {this.state.erpOrgList.map(item => <Option
                                                        value={item.partyRelationId}
                                                        key={item.partyRelationId}>{item.description}</Option>)}
                                                </Select>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div style={{margin: '10px auto'}}>
                                        <Row>
                                            <Col span={12} offset={4}>
                                                {lang.customerQuery.form.erpRelatedParty}：
                                                <Select placeholder={lang.customerQuery.placeholder.changeErpRelatedParty} size="small" style={{width: '80%'}}
                                                        onChange={value => this.setState({erpRelatedParty: value})}
                                                        value={this.state.erpRelatedParty}>
                                                    {this.state.erpRelatedPartyList.map(item => <Option
                                                        value={item.optionCode}
                                                        key={item.optionCode}>{item.optionMeaning}</Option>)}
                                                </Select>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div style={{margin: '10px auto'}}>
                                        <Row>
                                            <Col span={12} offset={4}>
                                                {lang.customerQuery.form.eprRelatedSegment}：
                                                <Select placeholder={lang.customerQuery.placeholder.changeEprRelatedSegment} size="small" style={{width: '80%'}}
                                                        onChange={value => this.setState({eprRelatedSegment: value})}
                                                        value={this.state.eprRelatedSegment}>
                                                    {this.state.eprRelatedSegmentList.map(item => <Option
                                                        value={item.optionCode}
                                                        key={item.optionCode}>{item.optionCode}:{item.optionMeaning}</Option>)}
                                                </Select>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>

                            </Modal>
                        </Card>
                    </Content>
                </Layout>
            </div>
        );
    }
}

export default QueryTable;
