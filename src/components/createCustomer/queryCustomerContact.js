// 联系人查询组件
import React, {Component} from 'react';
import {Button, Col, Icon, Row, Table, Popover, Divider} from "antd";
import AddCustomerContact from './addCustomerContact';
import PropTypes from 'prop-types';

class QueryCustomerContact extends Component {
    state = {
        showAddCustomer: false,
        index: undefined,
        editObj: undefined,
        action: undefined
    };

    // 行定义
    columns = [{
        title: '姓名',
        dataIndex: 'fullName',
    }, {
        title: '部门',
        dataIndex: 'department',
    }, {
        title: '职位',
        dataIndex: 'job',
    }, {
        title: '电话',
        dataIndex: 'tel',
    }, {
        title: '手机',
        dataIndex: 'mobile',
    }, {
        title: '邮箱',
        dataIndex: 'emailAddress',
    }, {
        title: '地址',
        dataIndex: 'address',
        render: (text, record) => {
            let region1 = record.territoryName;
            let region2 = record.city ? (record.city[0].label +
                record.city[1].label +
                record.city[2].label) : '';
            let region3 = record.address ? record.address : '';
            if (region1 && (region2 || region3)) {
                region1 += '-';
            }
            if (region2 && region3) {
                region2 += '-';
            }

            return region1 + region2 + region3;
        }
    }, {
        title: '所有者',
        dataIndex: 'owner',
        render: (text, record) => {
            if (!record.owner || record.owner.length === 0) {
                return null;
            }
            if (record.owner && record.owner.length === 1) {
                return record.owner[0].userName
            } else {
                return <Popover content={<div>
                    {record.owner ? record.owner.map(item => <p key={item.userId}>{item.userName}</p>) : undefined}
                </div>} title="详细">
                    <Icon type="ellipsis"/>
                </Popover>
            }
        }
    }, {
        title: '操作',
        dataIndex: 'del',
        width: '10%',
        render: (text, record, index) => (this.props.isDetail ? undefined :
                <div>
                    <Icon type="delete" twoToneColor='#f4a034' theme="twoTone" onClick={() => this.deleteRow(record)} style={{cursor: 'pointer',fontSize: '20px'}}/>
                    <Divider type="vertical" />
                    <Icon type="edit" twoToneColor='#f4a034' theme="twoTone" onClick={() => this.editRow(index)} style={{cursor: 'pointer', fontSize: '20px'}}/>
                </div>
        )
    }];
    /**
     * 删除行
     */
    deleteRow = (value) => {
        // 增加到旧数据中
        this.props.setDisableCustomerContacts([...this.props.disableCustomerContacts, value]);
        this.props.delCustomerContact(value);
    };

    add = () => {
        this.setState({showAddCustomer: true, action: 'add'});
    };

    cancel = () => {
        // 将旧数据最后一个取出
        let values = this.props.disableCustomerContacts[this.props.disableCustomerContacts.length - 1];
        let dis = this.props.disableCustomerContacts;
        dis.pop();
        this.props.setDisableCustomerContacts([...dis]);
        this.props.addCustomerContact(values);
    };

    editRow = (index) => {
        // 设置要编辑的行数
        this.setState({showAddCustomer: true, editObj: this.props.customerContacts[index], action: 'edit', index: index});
    };

    render() {
        return (
            <Row>
                <Col span={24}>
                    <Table
                        title={(
                            this.props.isDetail
                                ? undefined
                                : () =>
                                    <div>
                                        <Button type="primary" onClick={this.add}><Icon
                                            type="usergroup-add"/>新增</Button>
                                        <Button type="primary" onClick={this.cancel}
                                                disabled={this.props.disableCustomerContacts <= 0}
                                                style={{marginLeft: 10}}><Icon type="rollback"/>撤销</Button>
                                    </div>
                        )}
                        bordered
                        dataSource={this.props.customerContacts}
                        size='middle'
                        columns={this.columns}
                        pagination={false}
                    />
                    {/*此处理是强制销毁组件*/}
                    {this.state.showAddCustomer ?
                        <AddCustomerContact showFalse={(value) => this.setState({showAddCustomer: false})}
                                            action={this.state.action}
                                            show={this.state.showAddCustomer} {...this.props} isAdmin={true}
                                            editObj={this.state.editObj}
                                            index={this.state.index}
                                            updateCustomerContacts={this.props.updateCustomerContacts}
                        />
                        : undefined
                    }
                </Col>
            </Row>
        )
    }
}

QueryCustomerContact.propTypes = {
    delCustomerContact: PropTypes.func,
    addCustomerContact: PropTypes.func,
    customerContacts: PropTypes.array
};
export default QueryCustomerContact;
