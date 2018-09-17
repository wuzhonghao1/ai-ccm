// 亚信-通讯地址
import React from 'react';
import {Cascader, Input, message} from "antd";
import Url from '../../store/ajaxUrl';

class AiMailingAddress extends React.Component {
    state = {
        option: []
    };

    async componentDidMount() {
        let provinceAll = await window.$ajax.get(Url.provinceAll, {});
        if (provinceAll.resultCode === 'CCS-12000') {
            let data = this.add([], provinceAll);
            this.setState({option: data});
        } else {
            message.error('获取所有省份异常，请联系管理员');
        }
    }

    /**
     * 处理数据
     * @param dataChange
     * @param data
     * @param isLeaf
     * @returns {*}
     */
    add = (dataChange, data, isLeaf = false) => {
        data.provinces.forEach(element => {
            dataChange.push({
                isLeaf,
                classCode: element.code,
                value: element.name,
                label: element.name
            })
        });
        return dataChange;
    };

    /**
     * 省市县的联动
     * @param selectedOptions
     */
    loadData = (selectedOptions) => {
        let targetOption = selectedOptions[selectedOptions.length - 1];
        let selectedOptionsClassCode = targetOption.classCode;
        let dataChange = [];
        targetOption.loading = true;
        let url = selectedOptions.length <= 1 ? Url.provinceMunicipalities + selectedOptionsClassCode :
            Url.provinceRegions + selectedOptionsClassCode;
        window.$ajax.get(url).then((data) => {
            if (data.resultCode === 'CCS-12000') {
                dataChange = this.add(dataChange, data, selectedOptions.length >= 2)
            } else {
                dataChange = [];
                message.error('获取市区异常，请联系管理员');
            }
        }).then(() => {
            targetOption.loading = false;
            selectedOptions[selectedOptions.length - 1].children = dataChange;
            this.setState({
                option: this.state.option
            });
        });
    };

    onChange = (value, selectedOptions) => {
        this.props.onSelect(value, selectedOptions);
    };

    render() {
        return (
            <Cascader
                options={this.state.option}
                loadData={this.loadData}
                onChange={this.onChange}
                changeOnSelect
                size={this.props.size}
            >
                {this.props.getFieldDecorator(this.props.fieldName, {})(
                    <Input type='text' size={this.props.size} readOnly disabled={this.props.disabled}
                           placeholder={this.props.placeholder}/>)}
            </Cascader>
        )
    }
}

AiMailingAddress.defaultProps = {
    placeholder: '请输入省/市/县',
    size: 'small'
};


export default AiMailingAddress;
