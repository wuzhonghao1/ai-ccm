// 亚信-区域
import React from 'react';
import {AutoComplete, message, Select} from 'antd';
import Url from '../../store/ajaxUrl';

const Option = Select.Option;

class AiRegion extends React.Component {
    state = {
        regionDataSource: [],
        regionData: []
    };

    /**
     * 区域查询
     * @param value 查询条件
     */
    regionHandleSearch = async (value) => {
        if (value.length === 0) {
            return;
        }
        this.setState({
            regionLoading: true
        });
        let data = await window.$ajax.get(Url.provinceGet + value);
        if (data.resultCode === 'CCS-12000') {
            let data2 = data.provinces.map(item => <Option key={item.name} text={item.name}>{item.name}</Option>);
            this.setState({
                regionDataSource: !value ? [] : data2,
                regionData: data.provinces
            });
        } else {
            this.setState({regionLoading: false});
            message.error('获取区域异常，请联系管理员');
        }
    };
    /**
     * 选中后设置区域的值
     * @param value 选中的value
     */
    onRegionSelect = (value) => {
        // 设置区域选中的value
        this.props.onSelect(this.state.regionData.filter(item => item.name === value)[0]);
    };

    render() {
        return (
            <div>
                {this.props.getFieldDecorator(this.props.fieldName, {})(
                    <AutoComplete
                        allowClear={true}
                        placeholder={this.props.placeholder || this.props.placeholder === '' ? this.props.placeholder : '请输入地址'}
                        disabled={this.props.disabled}
                        dataSource={this.state.regionDataSource}
                        onSelect={this.onRegionSelect}
                        onSearch={this.regionHandleSearch}
                        backfill={true}
                        defaultActiveFirstOption={true}
                        size={this.props.size}/>
                )}
            </div>
        )
    }
}

AiRegion.defaultProps = {
    placeholder: '请输入地址',
    size: 'small'
};

export default AiRegion;
