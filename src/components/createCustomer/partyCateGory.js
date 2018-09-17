// 分类信息
import React, {Component} from 'react'
import {Tag, Col, Row, Icon, message, Cascader, AutoComplete, Select} from 'antd';
import {fetchGet} from '../../http/asyncHttp';
import Url from '../../store/ajaxUrl';
import PropTypes from 'prop-types';
import QueryInustryClass from './queryIndustryClass';

const tagStyle = {marginBottom: 5, fontSize: 15};
const Option = Select.Option;

class PartyCateGory extends Component {

    state = {
        showInputA: false,
        showInputB: false,
        showCustomerIndustryClass: false,
        queryIndustryClassModal: false,
        // 客户行业分类
        customerIndustryClass: [],
        regionDataSource: [],
        regionDataSourceDom: [],
        regionLoading: false

    };

    componentDidMount() {

        // 客户行业分类
        let newData = [];
        window.$ajax.get(Url.customerLevel1, {}).then((data) => {
            if (data.resultCode === 'CCS-12000') {
                newData = this.addCustomerIndustryClass(newData, data, false, 1);
                this.setState({customerIndustryClass: newData});
            } else {
                message.error('获取客户行业分类异常，请联系管理员');
            }
        });
    };


    componentWillReceiveProps(nextProps) {
    }

    // 读取客户行业分类数据
    loadDataCustomerIndustryClass = (selectedOptions) => {
        if (selectedOptions.length === 3) {
            return false;
        }
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        let selectedOptionsClassCode = selectedOptions[selectedOptions.length - 1].classCode;
        let dataChange = [];
        window.$ajax.get(Url.customerLevel2 + selectedOptionsClassCode).then((data) => {
            if (data.resultCode === 'CCS-12000') {
                if (selectedOptions.length === 1) {
                    dataChange = this.addCustomerIndustryClass(dataChange, data, false, 2);
                } else if (selectedOptions.length === 2) {
                    dataChange = this.addCustomerIndustryClass(dataChange, data, true, 3);
                }
                selectedOptions[selectedOptions.length - 1].children = dataChange;
                this.setState({
                    option: this.state.option
                });
            } else {
                message.error('获取客户行业分类异常，请联系管理员')
            }
            targetOption.loading = false;

        });
    };
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
    // modal的查询
    query = (value) => {
        if (value === undefined || value === null || value.length === 0) {
            message.error('请输入查询条件');
            return;
        }
        this.setState({loading: true});
        window.$ajax.get(Url.industryClass + value, {}).then(res => {
            if (res.resultCode !== 'CCS-12000') {
                message.error('接口异常，请联系管理员');
                this.setState({loading: false});
                return;
            } else {

            }
            this.setState({data: res.industryClasses, loading: false});
        }).catch(error => {
            this.setState({loading: false});
        });
    };
    // 显示分类的操作按钮
    showInput = (type) => {
        if (type === 'A') {
            this.setState({showInputA: true, queryIndustryClassModal: true,});
        } else if (type === 'B') {
            this.setState({showInputB: true});
        } else if (type === 'C') {
            this.setState({showCustomerIndustryClass: true});
        }
    };

    // 关闭行业分类标签
    closeIndustryCodeTag = (key) => {
        // 删除时，判断id是否为空，若为空则不处理,若不为空则将数据加入到禁用的数据中
        let dis = this.props.selectIndustryObj.filter(item => item.industryCode === key && item.categoryId !== undefined);
        if (dis.length > 0) {
            this.props.setDisableSelectIndustryObj([
                ...this.props.disableSelectIndustryObj,
                ...dis
            ]);
        }
        this.props.setSelectIndustryObj(this.props.selectIndustryObj.filter(item => item.industryCode !== key));
    };
    // 选择客户行业分类后的数据
    onCustomerIndustryClassChange = (value, selectedOptions) => {
        // 判断是否选择到了最后一个级别
        if (selectedOptions.length === 3) {
            if (this.props.selectCustomerIndustryObj.filter(item => item.classCode === selectedOptions[2].classCode).length > 0) {
                message.error('不允许选择重复的行业分类');
                return;
            }
            let dis = this.props.disableSelectCustomerIndustryObj.filter(item => item.classCode === selectedOptions[2].classCode);
            // 若旧数据组中存在你选中的数据则从旧数据中拉出,并且清理旧数据
            if (dis.length > 0) {
                this.props.setDisableSelectCustomerIndustryObj([...this.props.disableSelectCustomerIndustryObj.filter(item => item.classCode !== selectedOptions[2].classCode)]);
                this.props.setSelectCustomerIndustryObj([...this.props.selectCustomerIndustryObj, ...dis]);
            } else {
                this.props.setSelectCustomerIndustryObj([...this.props.selectCustomerIndustryObj, selectedOptions[2]]);
            }
            this.setState({showCustomerIndustryClass: false});
        }
    };
    // 关闭客户行业分类标签
    closeCustomerIndustryCodeTag = (key) => {
        // 过滤出要更新的数据，设置到禁用数据组中
        let dis = this.props.selectCustomerIndustryObj.filter(item => item.classCode === key && item.categoryId !== undefined);
        if (dis.length > 0) {
            this.props.setDisableSelectCustomerIndustryObj([...this.props.disableSelectCustomerIndustryObj, ...dis]);
        }
        this.props.setSelectCustomerIndustryObj(this.props.selectCustomerIndustryObj.filter(item => item.classCode !== key));
    };
    // 区域查询
    regionHandleSearch = (value) => {
        if (value.length === 0) {
            return;
        }
        this.setState({
            regionLoading: true
        });
        window.$ajax.get(Url.provinceGet + value).then((data) => {
            if (data.resultCode === 'CCS-12000') {
                let data2 = data.provinces.map(item => <Option key={item.code} text={item.name}>{item.name}</Option>);
                this.setState({
                    regionDataSourceDom: !value ? [] : data2,
                    regionDataSource: !value ? [] : data.provinces,
                    regionLoading: false
                });
            } else {
                this.setState({regionLoading: false});
                message.error('获取区域异常，请联系管理员')
            }
        });
    };
    // 当选中区域
    onRegionSelect = (value) => {
        // 设置区域选中的value
        this.setState({showInputB: false});
        if (this.props.selectRegionObj.filter(item => item.code === value).length > 0) {
            message.error('不能选择重复的数据');
            return;
        }
        // 检查是否在旧数据组中，若存在则从中提取数据
        let dis = this.props.disableSelectRegionObj.filter(item => item.code === value);
        if (dis.length > 0) {
            // 剔除旧数据中的元素替换到新数据中
            this.props.setDisableSelectRegionObj([...this.props.disableSelectRegionObj.filter(item => item.code !== value)]);
            this.props.setSelectRegionObj([...this.props.selectRegionObj, ...dis]);
        } else {
            this.props.setSelectRegionObj([...this.props.selectRegionObj, this.state.regionDataSource.filter(item => item.code === value)[0]]);
        }
    };

    closeRegionTag = (value) => {
        // 若是更新过来的数据删除了，则保存在旧数据组中，将来从中提取
        let dis = this.props.selectRegionObj.filter(item => item.code === value && item.categoryId !== undefined);
        if (dis.length > 0) {
            this.props.setDisableSelectRegionObj([...dis]);
        }
        // 设置区域选中的value
        this.props.setSelectRegionObj(this.props.selectRegionObj.filter(item => item.code !== value));
    };

    addIndustryClass = (value) => {
        this.setState({queryIndustryClassModal: false});
        if (value === undefined) {
            return;
        }
        // 如果你添加的这个数据已经被删除过了则从删除的数据中拉取出来
        let dis = this.props.disableSelectIndustryObj.filter(item => item.industryCode === value.industryCode);
        if (dis.length > 0) {
            this.props.setDisableSelectIndustryObj([...this.props.disableSelectIndustryObj.filter(item => item.industryCode !== value.industryCode)]);
            this.props.setSelectIndustryObj([...this.props.selectIndustryObj, dis[0]]);
        } else {
            // 若是新添加的则正常走添加的处理
            this.props.setSelectIndustryObj([...this.props.selectIndustryObj, value]);
        }
    };

    render() {
        return (
            <div style={{width: '90%'}}>
                <Row>
                    <Col span={2} style={{textAlign: 'right'}}>行业分类：</Col>
                    <Col span={22}>
                        {this.props.selectIndustryObj.map((item) => {
                            // 一级
                            if (item.industryCode.length === 1) {
                                return <Tag color="orange" closable={!this.props.isDetail} style={tagStyle}
                                            key={item.industryCode}
                                            onClose={() => this.closeIndustryCodeTag(item.industryCode)}>{item.classLevel1}</Tag>
                            } else if (item.industryCode.length === 3) {
                                return <Tag color="orange" closable={!this.props.isDetail} style={tagStyle}
                                            key={item.industryCode}
                                            onClose={() => this.closeIndustryCodeTag(item.industryCode)}>{item.classLevel2}</Tag>
                            } else if (item.industryCode.length === 4) {
                                return <Tag color="orange" closable={!this.props.isDetail} style={tagStyle}
                                            key={item.industryCode}
                                            onClose={() => this.closeIndustryCodeTag(item.industryCode)}>{item.classLevel3}</Tag>
                            } else if (item.industryCode.length === 5) {
                                return <Tag color="orange" closable={!this.props.isDetail} style={tagStyle}
                                            key={item.industryCode}
                                            onClose={() => this.closeIndustryCodeTag(item.industryCode)}>{item.classLevel4}</Tag>
                            }
                            return null;
                        })}
                        {
                            this.props.isDetail ? null :
                                <Tag
                                    onClick={() => this.showInput('A')}
                                    style={{background: '#fff', borderStyle: 'dashed', fontSize: 15}}>
                                    <Icon type="plus"/>新分类
                                </Tag>
                        }
                    </Col>
                </Row>
                <div style={{margin: '15px 0'}}/>
                <Row>
                    <Col span={2} style={{textAlign: 'right'}}>区域分类：</Col>
                    <Col span={22}>
                        {
                            this.props.selectRegionObj.map(item =>
                                <Tag color="orange" closable={!this.props.isDetail} style={tagStyle} key={item.code}
                                     onClose={() => this.closeRegionTag(item.code)}
                                >{item.name}</Tag>
                            )
                        }
                        {this.state.showInputB ?
                            <AutoComplete
                                dataSource={this.state.regionDataSourceDom}
                                onSelect={this.onRegionSelect}
                                onSearch={this.regionHandleSearch}
                                placeholder="请输入区域"
                                backfill={true}
                                size="small"
                                style={{width: 150}}
                            />
                            :
                            this.props.isDetail ? null :
                            <Tag
                                onClick={() => this.showInput('B')}
                                style={{background: '#fff', borderStyle: 'dashed', fontSize: 15}}>
                                <Icon type="plus"/> 新分类
                            </Tag>
                        }
                    </Col>
                </Row>
                <div style={{margin: '15px 0'}}/>
                <Row>
                    <Col span={2} style={{textAlign: 'right'}}>客户行业分类：</Col>
                    <Col span={22}>
                        {
                            this.props.selectCustomerIndustryObj.map(item =>
                                <Tag color="orange" closable={!this.props.isDetail} style={tagStyle} key={item.classCode}
                                     onClose={() => this.closeCustomerIndustryCodeTag(item.classCode)}
                                >{item.fullClassName}</Tag>
                            )
                        }
                        {this.state.showCustomerIndustryClass ?
                            <Cascader
                                style={{width: 150}}
                                size="small"
                                placeholder="请选择客户行业分类"
                                options={this.state.customerIndustryClass}
                                loadData={this.loadDataCustomerIndustryClass}
                                onChange={this.onCustomerIndustryClassChange}
                                displayRender={(label) => label[2]}
                                changeOnSelect
                            /> :
                            this.props.isDetail ? null :
                            <Tag
                                onClick={() => this.showInput('C')}
                                style={{background: '#fff', borderStyle: 'dashed', fontSize: 15}}>
                                <Icon type="plus"/> 新分类
                            </Tag>
                        }
                    </Col>
                </Row>
                <QueryInustryClass show={this.state.queryIndustryClassModal}
                                   selectIndustryObj={this.props.selectIndustryObj}
                                   setSelectIndustryObj={this.props.setSelectIndustryObj}
                                   ok={(value) => this.addIndustryClass(value)}
                                   isMain={true}/>
            </div>
        );
    }
}

PartyCateGory.propTypes = {
    selectIndustryObj: PropTypes.array,
    setSelectIndustryObj: PropTypes.func
};

export default PartyCateGory;
