// 亚信-自动补全表格内容展示
import React from 'react';
import './index.less';
import Url from '../../../store/ajaxUrl';
import {fetchGet} from "../../../http/asyncHttp";
import {
    AutoComplete, Select, message, Input
} from 'antd';

const OptGroup = AutoComplete.OptGroup;
const Option = Select.Option;

class AiEmployeeAutoTable extends React.Component {

    state = {
        options: []
    };

    /**
     * 表头
     * @returns {*}
     */
    title = () => {
        return (
            <div>
                <ul className='ai-employee-table-ul' style={{paddingLeft: 15}}>
                    <li className='ai-employee-table-li'>姓名</li>
                    <li className='ai-employee-table-li' style={{width: '100px'}}>NT</li>
                    <li className='ai-employee-table-li' style={{width: '100px'}}>CostCenterId</li>
                    <li className='ai-employee-table-li' style={{width: '150px'}}>CostCenter</li>
                </ul>
            </div>)
    };


    onSearch = async (value) => {
        if (value.length === 0) {
            return;
        }
        let response = await fetchGet(`${Url.listPerson}${value}`);
        if (response.resultCode === 'CCS-12000') {
            let data = [<OptGroup
                key={1}
                label={this.title()}
            >
                {response.users.map(item => <Option key={item.userId} value={this.props.returnUserId ? '' + item.userId : '' + item.personId} text={item.lastName}>
                    <ul className='ai-employee-table-ul'>
                        <li className='ai-employee-table-li-data'>
                            {item.lastName}({item.employeeNumber})
                        </li>
                        <li className='ai-employee-table-li-data' style={{width: '100px'}}>
                            {item.ntAccount}
                        </li>
                        <li className='ai-employee-table-li-data' style={{width: '100px'}}>
                            {item.costCenterId}
                        </li>
                        <li className='ai-employee-table-li-data' style={{width: '150px'}}>
                            {item.costCenterName}
                        </li>
                    </ul>
                </Option>)}
            </OptGroup>];
            this.setState({options: data});
        } else {
            message.error('查询员工失败');
        }
    };

    render() {
        return (<AutoComplete
            dropdownMatchSelectWidth={false}
            dropdownStyle={{width: '700px'}}
            size={this.props.size}
            style={{width: '100%'}}
            dataSource={this.state.options}
            onSelect={this.props.onSelect}
            onSearch={this.onSearch}
            optionLabelProp={'text'}
            onChange={this.props.onChange}
            placeholder={this.props.placeholder}
        >
            <Input/>
        </AutoComplete>)
    }
}

/**
 * 默认值
 * @type {{size: string}}
 */
AiEmployeeAutoTable.defaultProps = {
    size: 'small',
    placeholder: '请输入员工姓名或nt',
    returnUserId: true,
    onChange: () => {

    }
};

// onSelect (value, option)


export default AiEmployeeAutoTable;
