// 亚信-行业分类组件
import React from 'react';
import {Cascader, Input, message} from "antd";
import Url from '../../store/ajaxUrl';

class AiCategory extends React.Component {

    state = {
        customerIndustryClass: []
    };

    // 组件初始化加载AI数据
    componentDidMount() {
        // 客户行业分类
        let newData = [];
        window.$ajax.get(Url.customerLevel1, {}).then(data => {
            if (data.resultCode === 'CCS-12000') {
                newData = this.addCustomerIndustryClass(newData, data, false, 1);
                this.setState({customerIndustryClass: newData});
            } else {
                message.error('获取客户行业分类异常，请联系管理员');
            }
        });
    }

    // 数据的拼接
    addCustomerIndustryClass = (dataChange, data, isLeaf, leave) => {
        // 因为有不同的数据结构通过级别进行调整
        if (leave === 1) {
            data.custIndustries.forEach(item => {
                dataChange.push({
                    isLeaf,
                    classCode: item.classCode,
                    fullClassName: item.fullClassName,
                    value: item.classCode,
                    label: item.customerType
                });
            });
        } else if (leave === 2) {
            data.custIndustries.forEach(item => {
                dataChange.push({
                    isLeaf,
                    classCode: item.classCode,
                    fullClassName: item.fullClassName,
                    value: item.classCode,
                    label: item.industry
                });
            });
        } else if (leave === 3) {
            data.custIndustries.forEach(item => {
                dataChange.push({
                    isLeaf,
                    classCode: item.classCode,
                    fullClassName: item.fullClassName,
                    value: item.classCode,
                    label: item.province
                });
            });
        }
        return dataChange;
    };

    /**
     * 读取其他分类
     * @param selectedOptions
     * @returns {boolean}
     */
    loadDataCustomerIndustryClass = (selectedOptions) => {
        // 控制等级
        if (selectedOptions.length === 2) {
            return false;
        }
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        let selectedOptionsClassCode = selectedOptions[selectedOptions.length - 1].classCode;
        let dataChange = [];
        window.$ajax.get(Url.customerLevel2 + selectedOptionsClassCode).then((data) => {
            if (data.resultCode === 'CCS-12000') {
                if (selectedOptions.length === 1) {
                    dataChange = this.addCustomerIndustryClass(dataChange, data, true, 2);
                } else if (selectedOptions.length === 2) {
                    dataChange = this.addCustomerIndustryClass(dataChange, data, true, 3);
                }
                selectedOptions[selectedOptions.length - 1].children = dataChange;
                this.setState({
                    customerIndustryClass: this.state.customerIndustryClass
                });
            } else {
                message.error('获取客户行业分类异常，请联系管理员');
            }
            targetOption.loading = false;
        });
    };

    /**
     * 选择客户行业分类后
     */
    onCustomerIndustryClassChange = (value, selectedOptions) => {
        // 控制等级
        if (selectedOptions.length === 2) {
            this.props.onSelect(value, selectedOptions);
        }
    };

    render() {
        return <Cascader
            style={{width: '100%'}}
            size={this.props.size}
            placeholder="请选择行业分类"
            options={this.state.customerIndustryClass}
            loadData={this.loadDataCustomerIndustryClass}
            onChange={this.onCustomerIndustryClassChange}
            displayRender={(label) => `${label[0]}/${label[1]}`}
            changeOnSelect
        >{this.props.getFieldDecorator(this.props.fieldName)(
            <Input
                placeholder={this.props.placeholder}
                type='text'
                disabled={this.props.disabled} size="small" readOnly/>
        )}</Cascader>
    }
}

AiCategory.defaultProps = {
    placeholder: '请选择行业分类',
    size: 'small'
};

export default AiCategory;
