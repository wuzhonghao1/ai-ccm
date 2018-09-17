// Owner列表
import React from 'react';
import {Col, Row, Table, Button, Icon, Modal, message, Popconfirm} from "antd";
import AiEmployeeAutoTable from "../common/aiEmployeeAutoTable/aiEmployeeAutoTable";
import Url from '../../store/ajaxUrl';

class OwnerList extends React.Component {

    columns = [{
        title: '姓名',
        dataIndex: 'lastName'
    }, {
        title: '员工编号',
        dataIndex: 'employeeNumber'
    }, {
        title: '部门',
        dataIndex: 'organizationName'
    }, {
        title: '手机',
        dataIndex: 'mobile'
    }, {
        title: '邮箱',
        dataIndex: 'emailAddress'
    }, {
        title: '操作',
        dataIndex: 'action',
        render: (text, record) => {
            return (
                this.props.action === 'detail' ? undefined :
                <Popconfirm title="确定删除？" okText="确定删除" cancelText="返回" onConfirm={() => this.deleteRow(record)}>
                    <Icon type="delete" twoToneColor='#f4a034' theme="twoTone" style={{cursor: 'pointer',fontSize: '20px'}}/>
                </Popconfirm>
            )
        }
    }];

    state = {
        showAddModal: false,
        user: undefined,
        tableLoading: false,
        confirmLoading: false
    };

    /**
     * 保存Owner数据
     */
    save = async () => {
        this.setState({tableLoading: true});
        let response = await window.$ajax.post(Url.saveOwner, {
            customerId: this.props.customerId,
            deleteOwnerId: this.props.disOwnerList.filter(item => item.id).map(item => item.userId),
            userIds: this.props.dataSource.filter(item => !item.id).map(item => item.userId)
        });
        if (response.resultCode === 'CCS-12000') {
            Modal.success({
                title: '提示',
                content: '成功'
            });
            this.setState({tableLoading: false});
        } else {
            Modal.error({
                title: '提示',
                content: response.resultMessage
            });
            this.setState({tableLoading: false});
        }
    };

    deleteRow = async (record) => {
        this.setState({tableLoading: true});
        let response = await window.$ajax.post(Url.saveOwner, {
            customerId: this.props.customerId,
            deleteOwnerId: [record.userId],
            userIds: []
        });
        if (response.resultCode === 'CCS-12000') {
            Modal.success({
                title: '提示',
                content: '成功'
            });
            this.setState({showAddModal: false});
            this.setState({tableLoading: false});
            this.props.setDisOwnerList([...this.props.disOwnerList, record]);
            this.props.setOwnerList(this.props.dataSource.filter(item => item.employeeNumber !== record.employeeNumber));
        } else {
            Modal.error({
                title: '提示',
                content: response.resultMessage
            });
            this.setState({showAddModal: false});
            this.setState({tableLoading: false});
        }
    };

    cancel = async () => {
        // 撤销
        // ...this.props.disOwnerList
        // this.props.disOwnerList[this.props.disOwnerList.length - 1]]
        this.setState({tableLoading: true});
        let response = await window.$ajax.post(Url.saveOwner, {
            customerId: this.props.customerId,
            deleteOwnerId: [],
            userIds: [this.props.disOwnerList[this.props.disOwnerList.length - 1].userId]
        });
        if (response.resultCode === 'CCS-12000') {
            Modal.success({
                title: '提示',
                content: '成功'
            });
            this.setState({tableLoading: false});
            this.props.setOwnerList([...this.props.dataSource, this.props.disOwnerList[this.props.disOwnerList.length - 1]]);
            let data = this.props.disOwnerList;
            data.pop();
            this.props.setDisOwnerList([...data]);
        } else {
            Modal.error({
                title: '提示',
                content: response.resultMessage
            });
            this.setState({tableLoading: false});
        }
    };

    add = () => {
        this.setState({showAddModal: true});
    };

    modalOk = async () => {
        if (!this.state.user) {
            message.error('请选择人员');
            return;
        }
        if (this.props.dataSource.filter(item => item.userId === this.state.user.userId).length > 0) {
            message.error('已经存在不能重复添加');
            return;
        }

        this.setState({tableLoading: true});
        this.setState({confirmLoading: true});
        let response = await window.$ajax.post(Url.saveOwner, {
            customerId: this.props.customerId,
            deleteOwnerId: [],
            userIds: [this.state.user.userId]
        });
        if (response.resultCode === 'CCS-12000') {
            Modal.success({
                title: '提示',
                content: '成功'
            });
            this.props.setOwnerList([...this.props.dataSource, this.state.user]);
            this.setState({confirmLoading: false});
            this.setState({showAddModal: false});
            this.setState({tableLoading: false});
        } else {
            Modal.error({
                title: '提示',
                content: response.resultMessage
            });
            this.setState({confirmLoading: false});
            this.setState({showAddModal: false});
            this.setState({tableLoading: false});
        }
    };

    setPersonInfo = (value, option) => {
        window.$ajax.post(Url.getByPersonIds, [value]).then(response => {
            if (response.resultCode === 'CCS-12000') {
                if (response.employees.length === 0 || response.employees.length > 1) {
                    message.error('查询员工信息错误');
                }
                this.setState({user: response.employees[0]});
            } else {
                message.error('查询员工信息错误');
            }
        });

    };


    render() {
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <Table
                            title={
                                this.props.action === 'detail' ? undefined : () => {
                                let dom = this.props.action === 'detail' ? undefined : <div>
                                        <Button type="primary" onClick={this.add}>
                                            <Icon type="usergroup-add"/>新增
                                        </Button>
                                        <Button type="primary" onClick={this.cancel}
                                                disabled={this.props.disOwnerList.length <= 0}
                                                style={{marginLeft: 10}}><Icon type="rollback"/>撤销</Button>
                                    </div>;

                                return dom;
                            }}
                            loading={this.state.tableLoading}
                            rowKey={(record) => record.employeeNumber}
                            bordered
                            dataSource={this.props.dataSource}
                            size='middle'
                            columns={this.columns}
                            pagination={false}
                        />
                    </Col>
                </Row>
                <Modal title="选择人员" visible={this.state.showAddModal}
                       onCancel={() => this.setState({showAddModal: false})} onOk={this.modalOk}
                       confirmLoading={this.state.confirmLoading}
                >
                    <AiEmployeeAutoTable onSelect={this.setPersonInfo} returnUserId={false}/>
                </Modal>
            </div>
        );
    }
}

OwnerList.defaultProps = {
    dataSource: []
};


export default OwnerList;
