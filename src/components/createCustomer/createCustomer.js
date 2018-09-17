/* eslint-disable eqeqeq */
// 创建新客户-（基本信息表单）
import React, {Component} from 'react';
import {
    Modal,
    Form,
    Input,
    Row,
    Col,
    DatePicker,
    Select,
    Button,
    Spin,
    message,
    Radio,
    Tooltip,
    Skeleton
} from 'antd';
import CustomerContact from './queryCustomerContact';
import CToH from '../../utils/CtoH';
import moment from 'moment';
import Url from '../../store/ajaxUrl';
import './createCustomer.less';
import QueryIndustryClass from "./queryIndustryClass";
import FieldHistory from './fieldHistory';
import OwnerList from './ownerList';
// 【AI】行业分类组件
import AiCategory from '../common/aiCategory';
// 【AI】省市县联动组件
// import AiMailingAddress from '../common/aiMailingAddress';
// 【AI】区域
import AiRegion from '../common/aiRegion';
// 【AI】自动补全员工表格
import AiEmployeeAutoTable from "../common/aiEmployeeAutoTable/aiEmployeeAutoTable";

const FormItem = Form.Item;
// 日期格式化
const dateFormat = 'YYYY-MM-DD';
const Search = Input.Search;
const Option = Select.Option;
const {TextArea} = Input;
const RadioGroup = Radio.Group;
// 用户角色
const UserRole = window.sessionStorage.getItem('approvalGroupCode');

class CreateCustomer extends Component {
    state = {
        // 客户信息的三要素弹窗
        visible: false,
        // 客户类型
        type: '',
        // 查询分类信息的控制
        queryIndustryClassModal: false,
        // 选中表单中的行业信息
        industryObj: undefined,
        // 操作
        action: undefined,
        // 修改，审批客户id
        id: undefined,
        // 全局加载状态
        globalLoading: false,
        // 客户类型
        categoryTypes: [],
        // 对象版本号
        objectVersionNumber: undefined,
        // 审批选择的审批人范围
        managerAll: [],
        // 审批人
        managerUser: undefined,
        // 是否是详情
        isDetail: false,
        // 申请单id
        requestId: undefined,
        // 审批信息
        approveMessage: '',
        // 客户分类的分类ID
        typeCategoryId: undefined,
        // 客户分类的对象版本
        typeObjectVersionNumber: undefined,
        // 代理人列表
        agentPersonList: [],
        // 代理人
        agentUser: undefined,
        // 字段变更历史
        fieldHistory: [],
        customerIndustryObjectNumber: undefined,
        customerIndustryCategoryId: undefined,
        // 销售订单客户
        salesOrderCustomerList: [],
        aiCategoryCategoryId: undefined,
        aiCategoryObjectNumber: undefined,
        // 省市县数据
        provinceOption: [],
        city: undefined,
        addressId: undefined,
        addressUsageId: undefined,
        addressObjectVersionNumber: undefined,
        // 信用评估
        creditEvaluationList: [],
        // 业务评估
        businessEvaluationList: [],
        // 信用评估分类对象
        creditEvaluationCategoryId: undefined,
        creditEvaluationObjectNumber: undefined,
        businessEvaluationCategoryId: undefined,
        businessEvaluationObjectNumber: undefined,
        modifyPermission: {
            // 基本信息
            baseData: true,
            // 分类信息
            category: true,
            // 字段历史
            fieldHistory: true,
            // owner历史
            owner: true,
            // 是否显示
            showPage: true,
            // 三要素是否可修改
            threeElements: false
        },
        statusCode: undefined,
        oldCustomerName: undefined,
        oldUnifiedSocialCode: undefined,
        businessCheckDisabled: true,
        businessCheckLoading: false,
        asyncOkCustomerName: undefined,
        // 客户分类必选
        aiCategoryClassCodeValidate: false,
        // 所在地址必选
        regionNameValidate: false
    };
    /**
     * 初始化诗句
     * @returns {Promise<void>}
     */
    init = async () => {
        // 下拉数据：客户类型
        let categoryTypes = await window.$ajax.get(Url.categoryTypes);
        if (categoryTypes.resultCode === 'CCS-12000') {
            this.setState({categoryTypes: categoryTypes.quickCodes});
        } else {
            message.error('获取客户类型异常，请联系管理员');
        }
        // 销售管理员
        if (this.props.match.params.action !== 'detail') {
            let managerAll = await window.$ajax.get(Url.managerGet, {});
            if (managerAll.resultCode === 'CCS-12000') {
                this.setState({managerAll: managerAll.users});
            } else {
                message.error('获取销售管理员异常，请联系管理员');
            }
        }
        // 如果是新增则获取
        if (this.props.match.params.type !== undefined) {
            if (this.props.match.params.type === 'INT') {
                let response = await window.$ajax.get(Url.managerGet, {});
                if (response.resultCode === 'CCS-12000') {
                    this.setState({agentPersonList: response.users});
                } else {
                    message.error('获取可代理人异常，请联系管理员');
                }
            } else {
                let response = await window.$ajax.get(Url.getAgentPersonEXT, {});
                if (response.resultCode === 'CCS-12000') {
                    this.setState({agentPersonList: response.users});
                } else {
                    message.error('获取可代理人异常，请联系管理员');
                }
            }
        }
        // 代理设置
        let salesOrderCustomer = await window.$ajax.get(Url.orderCustGet);
        if (salesOrderCustomer.resultCode === 'CCS-12000') {
            this.setState({salesOrderCustomerList: salesOrderCustomer.quickCodes});
        }
        // 下拉数据：信用评估
        let creditEvaluationGet = await window.$ajax.get(Url.creditEvaluationGet);
        if (creditEvaluationGet.resultCode === 'CCS-12000') {
            this.setState({creditEvaluationList: creditEvaluationGet.quickCodes});
        } else {
            message.error('获取信用评估异常，请联系管理员');
        }
        // 下拉数据：业务评估
        let businessEvaluationGet = await window.$ajax.get(Url.businessEvaluationGet);
        if (businessEvaluationGet.resultCode === 'CCS-12000') {
            this.setState({businessEvaluationList: creditEvaluationGet.quickCodes});
        } else {
            message.error('获取业务评估异常，请联系管理员');
        }
    };

    /**
     * 权限处理
     * @param permissionPage
     */
    noPermission = (permissionPage) => {
        if (!permissionPage.modifyPermission.showPage) {
            Modal.error({
                title: '提示',
                content: '您没有权限操作此客户',
                onOk: () => this.props.history.go(-1),
                onCancel: () => this.props.history.go(-1)
            });
        } else {
            this.setState({modifyPermission: permissionPage.modifyPermission});
        }
    };

    /**
     * 权限控制
     * @returns {Promise<void>}
     */
    permissionControl = async () => {
        if (this.props.match.params.action) {
            if (this.props.match.params.action === 'edit') {
                let permissionPage = await window.$ajax.get(`${Url.permissionPage}/MODIFY/${this.props.match.params.id}`);
                if (permissionPage.resultCode === 'CCS-12000') {
                    if (permissionPage.modifyPermission) {
                        this.noPermission(permissionPage);
                    }
                }
            } else if (this.props.match.params.action === 'approve') {
                let permissionPage = await window.$ajax.get(`${Url.permissionPage}/APPROVE/${this.props.match.params.id}`);
                if (permissionPage.resultCode === 'CCS-12000') {
                    if (permissionPage.modifyPermission) {
                        this.noPermission(permissionPage);
                    }
                }
            } else if (this.props.match.params.action === 'detail') {
                let permissionPage = await window.$ajax.get(`${Url.permissionPage}/DETAIL/${this.props.match.params.id}`);
                if (permissionPage.resultCode === 'CCS-12000') {
                    if (permissionPage.modifyPermission) {
                        this.noPermission(permissionPage);
                    }
                }
            }
        } else {
            let permissionPage = await window.$ajax.get(`${Url.permissionPage}/CREATE/0`);
            if (permissionPage.resultCode === 'CCS-12000') {
                if (permissionPage.modifyPermission) {
                    this.noPermission(permissionPage);
                }
            }
        }
    };

    /**
     * 页面加载完成
     */
    async componentDidMount() {
        // 设置等待初始化数据状态
        this.setState({globalLoading: true});
        // 权限控制
        await this.permissionControl();
        await this.init();
        if (this.props.match.params.action === 'detail') {
            // 是否是详情
            this.setState({isDetail: true});
        } else {
            this.setState({isDetail: false});
        }
        // 处理编辑加载
        if (this.state.action === null && (this.props.match.params.action === 'edit' || this.props.match.params.action === 'detail' || this.props.match.params.action === 'approve')) {
            if (this.props.match.params.action === 'approve') {
                this.setState({requestId: this.props.match.params.requestId});
            }
            this.setState({globalLoading: true, action: this.props.match.params.action});
        }
        this.setState({globalLoading: false});
    }

    /**
     * 选择客户行业分类后
     */
    onCustomerIndustryClassChange = (value, selectedOptions) => {
        if (selectedOptions.length === 2) {
            this.setState({aiCategoryClassCodeValidate: false});
            this.props.form.setFieldsValue({aiCategoryClassCode: selectedOptions[1].classCode});
            this.props.form.setFieldsValue({aiCategoryName: selectedOptions.map(item => item.label).join(',')});
        }

    };

    /**
     * 生命周期，下次调用
     * @param nextProps
     */
    async componentWillReceiveProps(nextProps) {
        let type = nextProps.match.params.type;
        // 测试
        this.setState({type: type});
        let action = nextProps.match.params.action;
        if (nextProps.match.params.action === 'detail') {
            this.setState({isDetail: true});
        } else {
            this.setState({isDetail: false});
        }
        if (action !== 'detail' && action !== 'edit' && action !== 'approve') {
            // 如果是从新增等页面进入的则清空页面数据，若菜单类型切换了也需要清空数据
            if (this.state.type !== type || this.props.match.params.action === 'detail' || this.props.match.params.action === 'edit' || this.props.match.params.action === 'approve') {
                this.setState({
                    type: type,
                    visible: true,
                    action: undefined,
                    id: undefined
                });
                // 清空旧数据
                this.props.clearCreateStore();
                this.props.form.resetFields();
            }
        } else {
            // 处理编辑加载
            if ((nextProps.match.params.action !== this.state.action || nextProps.match.params.id !== this.state.id || this.state.action === null)
                && (nextProps.match.params.action === 'edit' || nextProps.match.params.action === 'detail' || nextProps.match.params.action === 'approve')) {
                if (nextProps.match.params.action === 'approve') {
                    this.setState({requestId: nextProps.match.params.requestId});
                }
                this.setState({globalLoading: true, action: nextProps.match.params.action});
                await this.setDetail(nextProps);
            }
        }
    }

    /**
     * 组件卸载时
     */
    componentWillUnmount() {
        // 清空旧数据
        this.props.clearCreateStore();
        this.props.form.resetFields();
    }

    /**
     * 设置详细信息
     * @param nextProps
     * @returns {Promise<void>}
     */
    setDetail = async (nextProps) => {
        this.setState({globalLoading: true});
        // 清理上一次的旧数据
        this.props.clearCreateStore();
        let action = nextProps.match.params.action;
        let id = nextProps.match.params.id;
        this.setState({
            visible: false,
            action: action,
            id: id
        });
        let responseCustomer = await window.$ajax.get(Url.getCustomerInfo + nextProps.match.params.id, {});
        if (responseCustomer.resultCode !== 'CCS-11000') {
            Modal.error({
                title: '提示',
                content: responseCustomer.resultMessage
            });
            return;
        }
        let customer = responseCustomer.customer;
        this.setState({statusCode: customer.statusCode});
        // 查询组数据
        if (customer.owner) {
            let data = await window.$ajax.post(Url.getByPersonIds, customer.owner.map(item => item.mdUserId));
            if (data.resultCode === 'CCS-12000') {
                // Owner信息
                let temp = data.employees.map(item => {
                    item.id = new Date().getTime();
                    return item;
                });

                this.props.setOwnerList(temp);
            } else {
                message.error('获取客户所有人员数据失败');
            }
        }

        // 字段变更历史
        this.setState({fieldHistory: customer.fieldHistory});
        // 客户版本号
        this.setState({objectVersionNumber: customer.objectVersionNumber});
        this.setState({oldCustomerName: customer.customerName, oldUnifiedSocialCode: customer.unifiedSocialCode});
        this.props.form.setFieldsValue({
            unifiedSocialCode: customer.unifiedSocialCode,
            customerName: customer.customerName,
            legalPerson: customer.legalPerson,
            customerNumber: customer.customerNumber,
            establishDate: moment(customer.establishDate),
            usedName: customer.usedName,
            corpAddress: customer.corpAddress,
            industryCode: customer.industryCode,
            industryName: customer.industryCode ? customer.industryCode + customer.industryName : '',
            corpUrl: customer.corpUrl,
            regionName: customer.regionName,
            regionCode: customer.regionCode,
            taxpayerNumber: customer.taxpayerNumber,
            approvalDate: customer.approvalDate,
            contributedCapital: customer.contributedCapital,
            corpType: customer.corpType,
            englishName: customer.englishName,
            insuredNumber: customer.insuredNumber,
            // operatingState: customer.operatingState,
            operationPeriodStart: customer.operationPeriodStart,
            operationPeriodEnd: customer.operationPeriodEnd,
            operationScope: customer.operationScope,
            organizationCode: customer.organizationCode,
            // registedCapital: customer.registedCapital,
            registrationAuthority: customer.registrationAuthority,
            registrationMark: customer.registrationMark,
            // personelScale: customer.personelScale
        });
        if (customer.category !== undefined) {
            // 设置分类信息
            // 客户分类：内部、外部
            let obj = customer.category.filter(item => item.sourceCode === 'CATEGORY' && item.categoryCode === 'PARTY_EXT_INT');
            if (obj.length > 0) {
                this.setState({
                    typeCategoryId: obj[0].categoryId,
                    typeObjectVersionNumber: obj[0].objectVersionNumber,
                    type: obj[0].codeValue
                });
                this.props.form.setFieldsValue({type: obj[0].codeValue});
            }

            // 是否销售订单
            let obj2 = customer.category.filter(item => item.sourceCode === 'CATEGORY' && item.categoryCode === 'IS_ORDER_CUST');
            if (obj2.length > 0) {
                this.props.form.setFieldsValue({salesOrderCustomer: obj2[0].codeValue});
                this.setState({customerIndustryCategoryId: obj2[0].categoryId});
                this.setState({customerIndustryObjectNumber: obj2[0].objectVersionNumber});
            }

            // 行业分类
            let obj3 = customer.category.filter(item => item.sourceCode === 'CUST_INDUSTRY' && item.categoryCode === 'D_CC_CUST_INDUSTRY');
            if (obj3.length > 0) {
                this.setState({aiCategoryCategoryId: obj3[0].categoryId});
                this.setState({aiCategoryObjectNumber: obj3[0].objectVersionNumber});
                this.props.form.setFieldsValue({aiCategoryClassCode: obj3[0].codeValue});
                this.props.form.setFieldsValue({aiCategoryName: obj3[0].optionMeaning});
            }
            // 信用评估
            let obj4 = customer.category.filter(item => item.sourceCode === 'CATEGORY' && item.categoryCode === 'CREDIT_EVALUATION');
            if (obj4.length > 0) {
                this.setState({creditEvaluationCategoryId: obj4[0].categoryId});
                this.setState({creditEvaluationObjectNumber: obj4[0].objectVersionNumber});
                this.props.form.setFieldsValue({creditEvaluation: obj4[0].codeValue});
            }

            // 信用评估
            let obj5 = customer.category.filter(item => item.sourceCode === 'CATEGORY' && item.categoryCode === 'BUSINESS_EVALUATION');
            if (obj5.length > 0) {
                this.setState({businessEvaluationCategoryId: obj5[0].categoryId});
                this.setState({businessEvaluationObjectNumber: obj5[0].objectVersionNumber});
                this.props.form.setFieldsValue({businessEvaluation: obj5[0].codeValue});
            }
        }
        // 地址信息
        if (customer.address !== undefined && customer.address.length > 0) {
            let address = customer.address[customer.address.length - 1];
            this.setState({
                addressId: address.addressId,
                addressUsageId: address.usageId,
                addressObjectVersionNumber: address.objectVersionNumber,
                city: [{
                    value: address.province,
                    label: address.province,
                }, {
                    value: address.city,
                    label: address.city
                }, {
                    value: address.country,
                    label: address.country,
                    classCode: address.regionCode
                }]
            });
            this.props.form.setFieldsValue({
                address: address.address1,
                province: address.country ? `${address.province}/${address.city}/${address.country}` : undefined
            });
        }
        if (customer.contact !== undefined) {
            // 联系人信息
            customer.contact.forEach(item => {
                this.props.addCustomerContact({
                    contactId: item.contactId,
                    usageId: item.usageId,
                    objectVersionNumber: item.objectVersionNumber,
                    key: item.contactId,
                    fullName: item.fullName,
                    department: item.department,
                    job: item.job,
                    tel: item.tel,
                    mobile: item.mobile,
                    emailAddress: item.emailAddress,
                    owner: item.owner,
                    // 地址
                    addressId: item.address.addressId,
                    addressUsageId: item.address.usageId,
                    addressObjectVersionNumber: item.address.objectVersionNumber,
                    city: [{
                        value: item.address.province,
                        label: item.address.province,
                        classCode: ''
                    }, {
                        value: item.address.city,
                        label: item.address.city,
                        classCode: ''
                    }, {
                        value: item.address.country,
                        label: item.address.country,
                        classCode: item.address.regionCode
                    }],
                    territoryCode: item.address.territoryCode,
                    territoryName: item.address.territoryName,
                    address: item.address.address1
                });
            });
        }
        this.setState({globalLoading: false});
    };
    /**
     * 首次进入弹出窗口的关闭方法
     */
    handleCancel = () => {
        this.setState({
            visible: false,
        });
        // 取消后回首页
        this.props.history.push('/index/query');
    };
    /**
     * 首次进入弹出窗口的提交方法
     * @param e
     */
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(['customerName', 'unifiedSocialCode', 'legalPerson'], {}, (error, values) => {
            if (!this.state.agentUser && UserRole === 'AG_CCM' && this.props.match.params.type !== 'INT') {
                message.error('请选择代理人');
                return;
            }
            if (error === null) {
                this.props.form.setFieldsValue({
                    customerName: values.customerName.trim(),
                    unifiedSocialCode: values.unifiedSocialCode ? values.unifiedSocialCode.trim() : ''
                });
                this.setState({visible: false});
            }
        });
    };

    /**
     * 验证社会统一代码
     */
    validatorUnifiedSocialCode = async (rule, value, callback) => {
        if (this.state.action === 'approve' && value === this.state.oldUnifiedSocialCode) {
            callback();
        }
        if (this.state.action === 'edit' && value === this.state.oldUnifiedSocialCode) {
            callback();
        }
        if (value) {
            try {
                let response = await window.$ajax.get(Url.valicateSocialCode + value.trim());
                if (response.resultCode === 'CCS-12000' && response.existed) {
                    callback('代码已存在');
                } else {
                    callback();
                }
            } catch (e) {
                callback('代码填写格式异常');
            }
        }
    };

    /**
     * 验证客户名称
     */
    validatorCustomerName = async (rule, value, callback) => {
        // 记录校验状态是否正确，下面在进行同步按钮的处理
        let check = true;
        if (this.state.action === 'approve' && value === this.state.oldCustomerName) {
            callback();
            return;
        }
        if (this.state.action === 'edit' && value === this.state.oldCustomerName) {
            callback();
            return;
        }

        if (value) {
            try {
                let response = await window.$ajax.get(Url.valicateCustomerName + value.trim());
                if (response.resultCode === 'CCS-12000' && response.existed) {
                    callback('客户名称已存在');
                    check = false;
                } else {
                    callback();
                }
            } catch (e) {
                callback('名称填写格式异常');
            }
            // 控制同步的数据
            if (value.length > 4 && this.state.asyncOkCustomerName !== value && check) {
                this.setState({businessCheckDisabled: false});
            } else {
                this.setState({businessCheckDisabled: true});
            }
        }
    };
    /**
     * 检验表单的数据
     */
    validateForm = (type) => {
        let validate = true;
        let validateCol = [];
        let col = ['customerName', 'usedName', 'unifiedSocialCode', 'legalPerson', 'industryName', 'establishDate', 'corpUrl', 'corpAddress', 'address'];
        let manger = ['type', 'salesOrderCustomer', 'creditEvaluation', 'businessEvaluation', 'aiCategoryClassCode', 'regionName', 'regionCode', 'aiCategoryName'];
        // 不论什么情况下若是销售管理员审批验证管理信息必填
        if (UserRole === 'AG_CCM') {
            validateCol = [...col, ...manger];
        } else {
            validateCol = [...col];
        }
        // 判断表单数据
        this.props.form.validateFields(validateCol, (err, values) => {
            // 如果是管理员才判断
            let city = 0;
            if (UserRole === 'AG_CCM') {
                if (!values.aiCategoryClassCode || this.state.aiCategoryClassCodeValidate) {
                    this.setState({aiCategoryClassCodeValidate: true});
                    city++;
                }
                if (!values.regionCode || this.state.regionNameValidate) {
                    this.setState({regionNameValidate: true});
                    city++;
                }
                if (city > 0) {
                    validate = false;
                }
            }
            if (!err) {
                if (this.state.city) {
                    if (this.state.city.length !== 3) {
                        message.error('请将省市县填写完整');
                        validate = false;
                    }
                }
                // 提交状态下判断是否必须
                if (type === 'submit' && !this.state.managerUser && UserRole !== 'AG_CCM' && UserRole !== 'AG_FIN') {
                    message.error("请选择审批人");
                    validate = false;
                }
                let csType = this.props.form.getFieldsValue(['type']).type ? this.props.form.getFieldsValue(['type']).type : this.state.type;
                if (this.props.customerContacts && this.props.customerContacts.length === 0 && csType !== 'INT') {
                    message.error("至少填写一个联系人");
                    validate = false;
                }
            } else {
                validate = false;
            }
        });
        return validate;
    };

    /**
     * 整个表单提交方法
     */
    submit = async (type, approveState) => {
        let validateCol = [];
        let col = ['customerName', 'usedName', 'unifiedSocialCode', 'legalPerson', 'industryName', 'establishDate', 'corpUrl', 'corpAddress', 'address'];
        let manger = ['type', 'salesOrderCustomer', 'creditEvaluation', 'businessEvaluation', 'aiCategoryClassCode', 'regionName', 'regionCode'];
        if (UserRole === 'AG_CCM') {
            validateCol.push(col);
            validateCol.push(manger);
        } else {
            validateCol.push(col);
        }
        if (approveState === 'REBUT' && (this.state.approveMessage === '')) {
            message.error('请填写审批意见');
            return;
        }

        // 若是审批拒绝
        if (approveState === 'REBUT') {
            this.setState({globalLoading: true});
            let response = await window.$ajax.post(Url.customerApprove, {
                requestId: this.state.requestId,
                approvalStatusCode: approveState,
                remark: this.state.approveMessage
            });
            if (response.resultCode === 'CCS-12000') {
                Modal.success({
                    title: '提示',
                    content: '审批成功',
                    onOk: () => {
                        this.props.history.push('/index/myApproval');
                    }
                });
            } else {
                Modal.error({
                    title: '提示',
                    content: response.resultMessage
                });
            }
            this.setState({globalLoading: false});
            return;
        }
        this.props.form.validateFields(async (err, values) => {
            // 验证数据
            let validate = this.validateForm(type);
            if (validate) {
                this.setState({globalLoading: true});
                let formData = values;
                // 基本信息
                let submitData = {
                    customerId: this.state.id,
                    createdBy: this.state.agentUser, // 被代理人
                    objectVersionNumber: this.state.objectVersionNumber,
                    taxpayerNumber: formData.taxpayerNumber,
                    unifiedSocialCode: formData.unifiedSocialCode,
                    usedName: formData.usedName,
                    approvalDate: formData.approvalDate,
                    contributedCapital: formData.contributedCapital,
                    corpType: formData.corpType,
                    corpUrl: formData.corpUrl,
                    customerName: formData.customerName,
                    customerNumber: formData.customerNumber,
                    description: formData.description,
                    englishName: formData.englishName,
                    establishDate: formData.establishDate ? formData.establishDate.format('YYYY-MM-DD') : undefined,
                    industryCode: formData.industryCode,
                    insuredNumber: formData.insuredNumber,
                    legalPerson: formData.legalPerson,
                    // operatingState: formData.operatingState,
                    operationPeriodStart: formData.operationPeriodStart,
                    operationPeriodEnd: formData.operationPeriodEnd,
                    operationScope: formData.operationScope,
                    organizationCode: formData.organizationCode,
                    regionCode: formData.regionCode,
                    // registedCapital: formData.registedCapital,
                    registrationAuthority: formData.registrationAuthority,
                    registrationMark: formData.registrationMark,
                    personelScale: formData.personelScale,
                    corpAddress: formData.corpAddress,
                    // 分类
                    category: [],
                    // 客户关系
                    relation: [],
                    // 联系人
                    contact: [],
                    // 地址
                    address: [],
                    // 账户信息
                    account: []
                };
                // 是否是内外部客户 PARTY_EXT_INT
                let value = this.props.form.getFieldsValue(['type']);
                let partyExtInt = {
                    categoryId: this.state.typeCategoryId,
                    objectVersionNumber: this.state.typeObjectVersionNumber,
                    codeValue: !this.state.action ? this.state.type : value.type,
                    sourceCode: 'CATEGORY',
                    categoryCode: 'PARTY_EXT_INT'
                };
                // 是否销售订单
                let customerIndustryCategory = {
                    categoryId: this.state.customerIndustryCategoryId,
                    objectVersionNumber: this.state.customerIndustryObjectNumber,
                    codeValue: !this.state.action ? UserRole === 'AG_CCM' || UserRole === 'AG_OMC' ? 'YES' : 'NO' : formData.salesOrderCustomer,
                    sourceCode: 'CATEGORY',
                    categoryCode: 'IS_ORDER_CUST'
                };
                if (UserRole === 'AG_CCM') {
                    customerIndustryCategory.codeValue = formData.salesOrderCustomer;
                }

                // 行业分类
                if (formData.aiCategoryClassCode) {
                    let aiCategory = {
                        categoryId: this.state.aiCategoryCategoryId,
                        objectVersionNumber: this.state.aiCategoryObjectNumber,
                        codeValue: formData.aiCategoryClassCode,
                        sourceCode: 'CUST_INDUSTRY',
                        categoryCode: 'D_CC_CUST_INDUSTRY'
                    };
                    submitData.category.push(aiCategory);
                }

                // 信用评估
                if (formData.creditEvaluation) {
                    let creditEvaluation = {
                        categoryId: this.state.creditEvaluationCategoryId,
                        objectVersionNumber: this.state.creditEvaluationObjectNumber,
                        codeValue: formData.creditEvaluation,
                        sourceCode: 'CATEGORY',
                        categoryCode: 'CREDIT_EVALUATION'
                    };
                    submitData.category.push(creditEvaluation);
                }

                // 业务评估
                if (formData.businessEvaluation) {
                    let businessEvaluation = {
                        categoryId: this.state.businessEvaluationCategoryId,
                        objectVersionNumber: this.state.businessEvaluationObjectNumber,
                        codeValue: formData.businessEvaluation,
                        sourceCode: 'CATEGORY',
                        categoryCode: 'BUSINESS_EVALUATION'
                    };
                    submitData.category.push(businessEvaluation);
                }
                submitData.category.push(partyExtInt, customerIndustryCategory);

                // 区域分类
                let address = (formData.address || this.state.city) ? {
                    addressId: this.state.addressId,
                    usageId: this.state.addressUsageId,
                    objectVersionNumber: this.state.addressObjectVersionNumber,
                    province: this.state.city && this.state.city.length === 3 ? this.state.city[0].value : undefined,
                    city: this.state.city && this.state.city.length === 3 ? this.state.city[1].value : undefined,
                    country: this.state.city && this.state.city.length === 3 ? this.state.city[2].value : undefined,
                    regionCode: this.state.city && this.state.city.length === 3 ? this.state.city[2].classCode : undefined,
                    address1: formData.address,
                    usageCode: 'POSTAL_ADDR',
                    territoryCode: 'CN'
                } : undefined;

                submitData.address = address ? [address] : undefined;

                // 联系人信息
                submitData.contact = this.props.customerContacts.map(item => {
                    return {
                        contactId: item.contactId,
                        usageId: item.usageId,
                        objectVersionNumber: item.objectVersionNumber,
                        department: item.department,
                        emailAddress: item.emailAddress,
                        fullName: item.fullName,
                        job: item.job,
                        tel: item.tel,
                        mobile: item.mobile,
                        address: item ?
                            {
                                addressId: item.addressId,
                                usageId: item.addressUsageId,
                                objectVersionNumber: item.addressObjectVersionNumber,
                                addressName: item.addressName,
                                address1: item.address,
                                description: item.description,
                                province: item.city && item.city.length === 3 ? item.city[0].value : undefined,
                                city: item.city && item.city.length === 3 ? item.city[1].value : undefined,
                                country: item.city && item.city.length === 3 ? item.city[2].value : undefined,
                                territoryCode: item.territoryCode,
                                regionCode: item.city && item.city.length === 3 ? item.city[2].classCode : undefined,
                            } : undefined
                    }
                });
                submitData.contact.push(...this.props.disableCustomerContacts
                    .filter(item2 => item2.contactId !== undefined && item2.contactId !== null)
                    .map(item => {
                        return {
                            disableDate: moment().format("YYYY-MM-DD HH:mm:ss"),
                            contactId: item.contactId,
                            usageId: item.usageId,
                            objectVersionNumber: item.objectVersionNumber,
                            department: item.department,
                            emailAddress: item.emailAddress,
                            fullName: item.fullName,
                            job: item.job,
                            tel: item.tel,
                            mobile: item.mobile,
                            address: item.address1 ?
                                {
                                    addressId: item.addressId,
                                    usageId: item.addressUsageId,
                                    objectVersionNumber: item.addressObjectVersionNumber,
                                    addressName: item.addressName,
                                    address: item.address1,
                                    description: item.description,
                                    province: item.city && item.city.length === 3 ? item.city[0].value : undefined,
                                    city: item.city && item.city.length === 3 ? item.city[1].value : undefined,
                                    country: item.city && item.city.length === 3 ? item.city[2].value : undefined,
                                    territoryCode: item.territoryCode,
                                    regionCode: item.city && item.city.length === 3 ? item.city[2].classCode : undefined
                                } : undefined
                        }
                    }));
                // 数据提交
                let response = await window.$ajax.post(Url.saveCustomerInfo, submitData);
                if (response.resultCode === 'CCS-11000') {
                    if ('submit' === type) {
                        await this.apply(response.customerId);
                        return Promise.resolve(true);
                    } else if ('save' === type) {
                        this.setState({globalLoading: false, id: response.customerId});
                        Modal.success({
                            title: '提示',
                            content: response.resultMessage,
                            onOk: () => {
                                this.props.history.push('/index/query');
                            }
                        });
                        return Promise.resolve(true);
                    } else if ('approve-save' === type) {
                        // 审批
                        await this.approve(approveState);
                        return Promise.resolve(true);
                    }
                } else {
                    this.setState({globalLoading: false});
                    Modal.success({
                        title: '提示',
                        content: response.resultMessage,
                    });
                    return Promise.reject(false);
                }
            }
        });


    };
    /**
     * 基本信息：行业分类的选择
     * @param value 弹窗中选择的对象
     */
    setIndustryClass = (value) => {
        if (value === undefined || value === null) {
            this.setState({queryIndustryClassModal: false});
            return;
        }
        if (value.industryCode.length === 1) {
            this.props.form.setFieldsValue({industryName: value.classLevel1});
        } else if (value.industryCode.length === 3) {
            this.props.form.setFieldsValue({industryName: value.classLevel2});
        } else if (value.industryCode.length === 4) {
            this.props.form.setFieldsValue({industryName: value.classLevel3});
        } else if (value.industryCode.length === 5) {
            this.props.form.setFieldsValue({industryName: value.classLevel4});
        }
        this.props.form.setFieldsValue({industryCode: value.industryCode});
        this.setState({queryIndustryClassModal: false, industryObj: value});
    };

    /**
     * 选中后设置区域的值
     * @param value 选中的value
     */
    onRegionSelect = (value) => {
        // 设置区域选中的value
        this.setState({regionNameValidate: false});
        this.props.form.setFieldsValue({regionCode: value.code});
        this.props.form.setFieldsValue({regionName: value.name});
    };
    /**
     * 审批通过
     * @param state
     * @returns {Promise<void>}
     */
    approve = async (approveState) => {
        let response = await window.$ajax.post(Url.customerApprove, {
            requestId: this.state.requestId,
            approvalStatusCode: approveState,
            remark: this.state.approveMessage
        });
        if (response.resultCode === 'CCS-12000') {
            Modal.success({
                title: '提示',
                content: '审批成功',
                onOk: () => {
                    this.props.history.push('/index/myApproval');
                }
            });
        } else {
            Modal.error({
                title: '提示',
                content: response.resultMessage
            });
        }
        this.setState({globalLoading: false, id: response.customerId});
    };
    /**
     * 客户申请
     * @param customerId
     * @returns {Promise<void>}
     */
    apply = async (customerId) => {
        this.setState({globalLoading: true});
        let applyResponse = await window.$ajax.post(Url.customerApply, {
            customerId: customerId,
            approverId: this.state.managerUser
        });
        if ('CCS-12000' === applyResponse.resultCode) {
            Modal.success({
                title: '提示',
                content: applyResponse.resultMessage,
                onOk: () => {
                    this.props.history.push('/index/query');
                }
            });
        } else {
            Modal.error({
                title: '提示',
                content: applyResponse.resultMessage
            });
        }
        this.setState({globalLoading: false});
    };
    /**
     * 当区域变化
     * @param value
     * @param selectedOptions
     */
    onMailingAddressChange = (value, selectedOptions) => {
        this.props.form.setFieldsValue({province: selectedOptions.map(item => item.label).join('/')});
        this.setState({city: selectedOptions});

    };
    /**
     * 从企查查同步数据到此表单中
     */
    syncData = async () => {
        this.setState({businessCheckLoading: true});
        this.props.form.validateFields(['customerName'], async (error, value) => {
            if (!error) {
                // 如果同步成功后记录成功的数据下次不能再次拉去
                this.setState({businessCheckDisabled: true});
                this.setState({asyncOkCustomerName: value.customerName});
                let response = await window.$ajax.get(Url.getFormQcc + value.customerName);
                if (response.resultCode === 'CCS-12000') {
                    this.setDetailQcc(response.customer);
                    message.success('同步成功啦，已经为您准备好客户的信息');
                } else {
                    message.error(response.resultMessage);
                }

            }
        });
        this.setState({businessCheckLoading: false});
    };

    setDetailQcc = (data) => {
        let customer = data;
        this.props.form.setFieldsValue({
            unifiedSocialCode: customer.creditCode,
            legalPerson: customer.operName,
            // usedName: customer.originalName && customer.originalName.length > 0 ? customer.originalName[0].name : undefined,
            establishDate: moment(customer.startDate),
            corpAddress: customer.address,
            address: customer.address,
            // registedCapital: customer.registCapi,
            // operatingState: customer.status,
            registrationMark: customer.no,
            organizationCode: customer.orgNo,
            corpType: customer.econKind,
            approvalDate: customer.checkDate,
            registrationAuthority: customer.belongOrg,
            operationPeriodStart: customer.termStart,
            operationPeriodEnd: customer.termEnd,
            operationScope: customer.scope
        });
        // 地址
        if (customer.contactInfo && customer.contactInfo.webSite && customer.contactInfo.webSite.length > 0) {
            this.props.form.setFieldsValue({corpUrl: customer.contactInfo.webSite[0].url});
        }
        // 行业分类
        let tempCode = customer.industry.industryCode;
        let tempName = customer.industry.industry;
        if (customer.industry) {
            if (customer.industry.smallCategoryCode) {
                tempCode += customer.industry.smallCategoryCode;
                tempName = customer.industry.smallCategory;
            } else if (customer.middleCategory) {
                tempCode += customer.industry.middleCategoryCode;
                tempName = customer.industry.middleCategory;
            } else if (customer.industry.subIndustryCode) {
                tempCode += customer.industry.subIndustryCode;
                tempName = customer.industry.subIndustry;
            }
        }
        this.props.form.setFieldsValue({industryName: tempCode + tempName});
        this.props.form.setFieldsValue({industryCode: tempCode});
    };

    render() {
        // 弹出层的组件布局
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 7},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };
        // 正文内容组件布局
        const formItemLayoutMain = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };
        // 分类内容组件布局
        const mangerItemLayoutMain = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 11},
            },
        };

        const {getFieldDecorator} = this.props.form;

        /*隐藏域*/
        getFieldDecorator('industryCode', {})(
            <Input type='hidden'/>
        );
        /*隐藏域*/
        getFieldDecorator('regionCode', {})(
            <Input type='hidden'/>
        );
        /*隐藏域:注册资本*/
        // getFieldDecorator('registedCapital', {})(
        //     <Input type='hidden'/>
        // );
        /*隐藏域:经营状态代码*/
        // getFieldDecorator('operatingState', {})(
        //     <Input type='hidden'/>
        // );
        /*隐藏域:注册号*/
        getFieldDecorator('registrationMark', {})(
            <Input type='hidden'/>
        );
        /*隐藏域：组织机构代码*/
        getFieldDecorator('organizationCode', {})(
            <Input type='hidden'/>
        );
        /*隐藏域：公司类型代码*/
        getFieldDecorator('corpType', {})(
            <Input type='hidden'/>
        );
        /*隐藏域：核准日期*/
        getFieldDecorator('approvalDate', {})(
            <Input type='hidden'/>
        );
        /*隐藏域：登记机关*/
        getFieldDecorator('registrationAuthority', {})(
            <Input type='hidden'/>
        );

        /*隐藏域：营业期限开始*/
        getFieldDecorator('operationPeriodStart', {})(
            <Input type='hidden'/>
        );

        /*隐藏域：营业期限结束*/
        getFieldDecorator('operationPeriodEnd', {})(
            <Input type='hidden'/>
        );

        /*隐藏域：经营范围*/
        getFieldDecorator('operationScope', {})(
            <Input type='hidden'/>
        );


        return (
            <div style={{padding: 24}}>
                <Spin tip="Loading..." spinning={this.state.globalLoading}>
                    {/*==========================================基本信息==========================================*/}
                    <div className="head-info-tag" id='baseInfo'>基本信息</div>
                    {/*三要素*/}
                    <Form>
                        <Modal
                            title="填写客户基本信息"
                            maskClosable={false}
                            visible={this.state.visible}
                            onOk={this.handleSubmit}
                            onCancel={this.handleCancel}
                            footer={
                                <div>
                                    <Button onClick={this.handleCancel} style={{marginRight: '10px'}}>取消</Button>
                                    <Tooltip placement="top" title={() =>
                                        <div>
                                            <div>【注意：请填写标准名称】</div>
                                            <div>从企查查丰富您的客户信息</div>
                                        </div>
                                    }>
                                        <Button type="primary" onClick={this.syncData}
                                                style={{marginRight: '10px'}}
                                                loading={this.state.businessCheckLoading}
                                                disabled={this.state.businessCheckDisabled}>企查查</Button>
                                    </Tooltip>
                                    <Button type="primary" onClick={this.handleSubmit}>确认</Button>
                                </div>
                            }>

                            {UserRole === 'AG_CCM' ?
                                <FormItem
                                    {...formItemLayout}
                                    label="代理">
                                    <AiEmployeeAutoTable onSelect={(value, option) => {
                                        this.setState({agentUser: value});
                                    }}/>
                                </FormItem>
                                : <FormItem
                                    {...formItemLayout}
                                    label="代理">
                                    <Select placeholder="请选择代理人" size="small" style={{width: '100%'}}
                                            onChange={value => this.setState({agentUser: value})}>
                                        {this.state.agentPersonList.map(item => <Option value={item.userId}
                                                                                        key={item.userId}>{item.userName}</Option>)}
                                    </Select>
                                </FormItem>}
                            <FormItem
                                {...formItemLayout}
                                label="客户名称">
                                {getFieldDecorator('customerName', {
                                    rules: [{
                                        required: true, message: '客户名称不能为空'
                                    }, {
                                        max: 80, message: '长度超出限制'
                                    }, {
                                        validator: this.validatorCustomerName
                                    }],
                                })(
                                    <Input placeholder="请输入标准客户名称" size="small" onBlur={() => {
                                        this.props.form.setFieldsValue({customerName: CToH(this.props.form.getFieldsValue(["customerName"]).customerName)});
                                    }}/>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="统一社会信用代码">
                                {getFieldDecorator('unifiedSocialCode', {
                                    rules: [{
                                        len: 18, message: '长度必须为18位'
                                    }, {
                                        validator: this.validatorUnifiedSocialCode,
                                    }],
                                })(
                                    <Input type="text" placeholder="请输入统一社会信用代码" size="small"/>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="法定代表人">
                                {getFieldDecorator('legalPerson', {
                                    rules: [{
                                        max: 30, message: '长度超出限制'
                                    }],
                                })(
                                    <Input type="text" placeholder="请输入法定代表人" size="small"/>
                                )}
                            </FormItem>
                        </Modal>

                        <Row>

                            <Col span={8}>
                                <FormItem
                                    {...formItemLayoutMain}
                                    label="客户编码">
                                    {getFieldDecorator('customerNumber', {})(
                                        <Input type="text" size="small" disabled={true}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    {...formItemLayoutMain}
                                    label="客户名称">
                                    {getFieldDecorator('customerName', {
                                        rules: [{
                                            required: true, message: '客户名称不能为空',
                                        }, {
                                            max: 80, message: '长度超出限制'
                                        }, {
                                            validator: this.validatorCustomerName
                                        }],
                                    })(
                                        <Input placeholder={this.state.isDetail ? '' : '请输入客户名称'}
                                               size="small"
                                               disabled={this.state.isDetail ? this.state.isDetail : !this.state.modifyPermission.threeElements}
                                               onBlur={() => {
                                                   this.props.form.setFieldsValue({customerName: CToH(this.props.form.getFieldsValue(["customerName"]).customerName)});
                                               }}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    {...formItemLayoutMain}
                                    label="曾用名">
                                    {getFieldDecorator('usedName', {
                                        rules: [{
                                            max: 80, message: '长度超出限制'
                                        }]
                                    })(
                                        <Input type="text" placeholder={this.state.isDetail ? '' : '请输入曾用名'}
                                               size="small"
                                               disabled={this.state.isDetail ? this.state.isDetail : !this.state.modifyPermission.baseData}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem
                                    {...formItemLayoutMain}
                                    label="统一社会信用代码">
                                    {getFieldDecorator('unifiedSocialCode', {
                                        rules: [{
                                            len: 18, message: '长度必须为18位'
                                        }, {
                                            validator: this.validatorUnifiedSocialCode,
                                        }],
                                    })(
                                        <Input type="text"
                                               placeholder={this.state.isDetail ? '' : '请输入统一社会信用代码'} size="small"
                                               disabled={this.state.isDetail ? this.state.isDetail : !this.state.modifyPermission.threeElements}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    {...formItemLayoutMain}
                                    label="法定代表人">
                                    {getFieldDecorator('legalPerson', {
                                        rules: [{
                                            max: 30, message: '长度超出限制'
                                        }],
                                    })(
                                        <Input type="text" placeholder={this.state.isDetail ? '' : '请输入法定代表人'}
                                               size="small"
                                               disabled={this.state.isDetail ? this.state.isDetail : !this.state.modifyPermission.threeElements}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    {...formItemLayoutMain}
                                    label="工商注册行业">
                                    {getFieldDecorator('industryName', {})(
                                        <Search
                                            placeholder={this.state.isDetail ? '' : '请选择工商注册行业'}
                                            onSearch={() => this.setState({queryIndustryClassModal: true})}
                                            size="small" style={{height: '24px'}}
                                            readOnly={true}
                                            disabled={this.state.isDetail ? this.state.isDetail : !this.state.modifyPermission.baseData}
                                        />
                                    )}
                                </FormItem>
                            </Col>

                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem
                                    {...formItemLayoutMain}
                                    label="成立日期">
                                    {getFieldDecorator('establishDate', {
                                        rules: [{
                                            required: true, message: '成立日期不能为空',
                                        }]
                                    })(
                                        <DatePicker format={dateFormat} style={{width: '100%'}}
                                                    placeholder={this.state.isDetail ? '' : '请选择成立日期'}
                                                    size="small"
                                                    disabled={this.state.isDetail ? this.state.isDetail : !this.state.modifyPermission.baseData}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    {...formItemLayoutMain}
                                    label="官网地址">
                                    {getFieldDecorator('corpUrl', {
                                        rules: [{
                                            max: 240, message: '长度超出限制'
                                        }]
                                    })(
                                        <Input type="text" placeholder={this.state.isDetail ? '' : '请输入官网地址'}
                                               size="small" style={{height: '24px'}}
                                               disabled={this.state.isDetail ? this.state.isDetail : !this.state.modifyPermission.baseData}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    {...formItemLayoutMain}
                                    label="注册地址(住所)">
                                    {getFieldDecorator('corpAddress', {
                                        rules: [{
                                            max: 240, message: '长度超出限制'
                                        }, {
                                            required: true, message: '注册地址(住所)不能为空',
                                        }]
                                    })(
                                        <Input type="text" placeholder={this.state.isDetail ? '' : '请输入注册地址(住所)'}
                                               size="small"
                                               disabled={this.state.isDetail ? this.state.isDetail : !this.state.modifyPermission.baseData}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem
                                    {...formItemLayoutMain}
                                    label="通信地址">
                                    {getFieldDecorator('address', {
                                        rules: [{
                                            max: 80, message: '长度超出限制'
                                        }, {
                                            required: true, message: '通信地址不能为空',
                                        }]
                                    })(
                                        <Input type='text' placeholder={this.state.isDetail ? '' : '请输入通信地址'}
                                               size="small"
                                               disabled={this.state.isDetail ? this.state.isDetail : !this.state.modifyPermission.baseData}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        {/*============================================================管理信息============================================================*/}
                        {this.state.modifyPermission.category || this.state.action === 'detail' ?
                            <div>
                                <div className="head-info-tag" id='manger'>管理信息</div>
                                <Skeleton active loading={this.state.globalLoading}>
                                    <Row>
                                        <Col span={12}>
                                            <FormItem
                                                {...mangerItemLayoutMain}
                                                label="内外部客户">
                                                {getFieldDecorator('type', {
                                                    initialValue: this.state.type, rules: [{
                                                        required: true, message: '内外部客户不能为空',
                                                    }]
                                                })(
                                                    <RadioGroup placeholder={this.state.isDetail ? '' : '请选择内外部客户'}
                                                                disabled={this.state.isDetail ? this.state.isDetail : !this.state.modifyPermission.category}>
                                                        {this.state.categoryTypes.map(item =>
                                                            <Radio value={item.optionCode}
                                                                   key={item.codeId}
                                                                   style={{width: '60px'}}>{item.optionMeaning}</Radio>
                                                        )}
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem
                                                {...mangerItemLayoutMain}
                                                label="销售订单客户">
                                                {getFieldDecorator('salesOrderCustomer', {
                                                    initialValue: UserRole === 'AG_CCM' || UserRole === 'AG_OMC' ? 'YES' : 'NO',
                                                    rules: [{
                                                        required: true, message: '销售订单客户不能为空',
                                                    }]
                                                })(
                                                    <RadioGroup placeholder={this.state.isDetail ? '' : '请选择销售订单客户'}
                                                                disabled={this.state.isDetail ? this.state.isDetail : !this.state.modifyPermission.category}>
                                                        {this.state.salesOrderCustomerList.map(item =>
                                                            <Radio value={item.optionCode}
                                                                   key={item.codeId}
                                                                   style={{width: '60px'}}>{item.optionMeaning}</Radio>
                                                        )}
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12}>
                                            <FormItem
                                                {...mangerItemLayoutMain}
                                                label="信用评估">
                                                {getFieldDecorator('creditEvaluation', {
                                                    rules: [{
                                                        required: true, message: '信用评估不能为空',
                                                    }]
                                                })(
                                                    <RadioGroup placeholder={!this.state.isDetail ? '请选择信用评估' : ''}
                                                                disabled={this.state.isDetail ? this.state.isDetail : !this.state.modifyPermission.category}>
                                                        {this.state.creditEvaluationList.map(item =>
                                                            <Radio value={item.optionCode}
                                                                   key={item.codeId}
                                                                   style={{width: '60px'}}>{item.optionMeaning}</Radio>
                                                        )}
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem
                                                {...mangerItemLayoutMain}
                                                label="业务评估">
                                                {getFieldDecorator('businessEvaluation', {
                                                    rules: [{
                                                        required: true, message: '业务评估不能为空',
                                                    }]
                                                })(
                                                    <RadioGroup placeholder={!this.state.isDetail ? '请选择业务评估' : ''}
                                                                disabled={this.state.isDetail ? this.state.isDetail : !this.state.modifyPermission.category}>
                                                        {this.state.businessEvaluationList.map(item =>
                                                            <Radio value={item.optionCode}
                                                                   key={item.codeId}
                                                                   style={{width: '60px'}}>{item.optionMeaning}</Radio>
                                                        )}
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12}>
                                            {/*隐藏域名*/}
                                            {getFieldDecorator('aiCategoryClassCode')(
                                                <Input type="hidden"/>
                                            )}
                                            {/*增加隐藏域防止加载出错*/}
                                            {getFieldDecorator('aiCategoryName')(
                                                <Input type="hidden"/>
                                            )}
                                            <FormItem
                                                {...mangerItemLayoutMain}
                                                label="客户分类"
                                                required={true}
                                                help={this.state.aiCategoryClassCodeValidate ? '请选择客户分类' : ''}
                                                validateStatus={this.state.aiCategoryClassCodeValidate ? 'error' : ''}>
                                                <AiCategory placeholder={this.state.isDetail ? '' : '请选择客户分类'}
                                                            onSelect={this.onCustomerIndustryClassChange}
                                                            disabled={this.state.isDetail ? this.state.isDetail : !this.state.modifyPermission.category}
                                                            getFieldDecorator={getFieldDecorator}
                                                            fieldName='aiCategoryName'/>
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            {getFieldDecorator('regionName')(
                                                <Input type="hidden"/>
                                            )}
                                            <FormItem
                                                {...mangerItemLayoutMain}
                                                label="客户注册所在地(省)"
                                                required={true}
                                                help={this.state.regionNameValidate ? '请选择客户注册所在地(省)' : ''}
                                                validateStatus={this.state.regionNameValidate ? 'error' : ''}>
                                                <AiRegion
                                                    placeholder={this.state.isDetail ? '' : '请输入客户注册所在地(省)'}
                                                    onSelect={this.onRegionSelect} getFieldDecorator={getFieldDecorator}
                                                    fieldName='regionName'
                                                    disabled={this.state.isDetail ? this.state.isDetail : !this.state.modifyPermission.category}/>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Skeleton>
                            </div>
                            : undefined}

                        {/*==========================================联系人信息==========================================*/}
                        <div className="head-info-tag" id='customerContact'>联系人信息</div>
                        <CustomerContact delCustomerContact={this.props.delCustomerContact}
                                         addCustomerContact={this.props.addCustomerContact}
                                         customerContacts={this.props.customerContacts}
                                         disableCustomerContacts={this.props.disableCustomerContacts}
                                         setDisableCustomerContacts={this.props.setDisableCustomerContacts}
                                         updateCustomerContacts={this.props.updateCustomerContacts}
                                         isDetail={this.state.isDetail}
                        />
                        {/*==========================================Owner列表==========================================*/}
                        {/*销售管理员和财务管理员*/}
                        {this.state.modifyPermission.owner ?
                            <div>
                                <div className="head-info-tag" id='ownerList'>客户所有者</div>
                                <OwnerList dataSource={this.props.ownerList} setOwnerList={this.props.setOwnerList}
                                           disOwnerList={this.props.disOwnerList}
                                           setDisOwnerList={this.props.setDisOwnerList}
                                           customerId={this.state.id} action={this.state.action}/>
                            </div>
                            : undefined}
                        {/*==========================================客户变更历史==========================================*/}
                        {/*新建时不显示*/}
                        {this.state.modifyPermission.fieldHistory ?
                            <div>
                                <div className="head-info-tag" id='ownerList'>客户变更历史</div>
                                <FieldHistory dataSource={this.state.fieldHistory}/>
                            </div>
                            : undefined}
                        {/*========================================== 提交内容 ==========================================*/}
                        {
                            (this.state.action === 'edit' || !this.state.action) ?
                                <div>
                                    {/*管理员和财务人员不需要审批*/}
                                    {UserRole !== 'AG_CCM' && UserRole !== 'AG_FIN' && this.state.statusCode !== 'NORMAL' ?
                                        <div>
                                            <div className="head-info-tag" id='approve'>审批相关</div>
                                            <div style={{width: 400, margin: '0 auto'}}>
                                                销售管理员：
                                                <Select placeholder="请选择销售管理员" size="small"
                                                        style={{width: '50%'}}
                                                        onChange={value => this.setState({managerUser: value})}>
                                                    {this.state.managerAll.map(item => <Option
                                                        value={item.userId}
                                                        key={item.userId}>{item.userName}</Option>)}
                                                </Select>
                                            </div>
                                        </div>
                                        : undefined}
                                    <Row style={{marginTop: 40}}>
                                        <Col span={22}>
                                            <Row type="flex" justify="space-around">
                                                <Col span={2}>
                                                    {this.state.statusCode === 'NORMAL'
                                                        ? <Button type="primary" block
                                                                  onClick={() => this.submit('save')}>保存</Button>
                                                        : <Button type="primary" block
                                                                  onClick={() => this.submit('submit')}>提交</Button>}
                                                </Col>

                                                <Col span={2}>
                                                    <Button type="primary" block
                                                            onClick={() => this.props.history.go(-1)}>取消</Button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                                : undefined
                        }

                    </Form>
                    {/*========================================== 审批内容 ==========================================*/}
                    {this.state.action === 'approve' ?
                        <div>
                            <div className="head-info-tag" id='approve'>审批结果</div>
                            <FormItem
                                labelCol={{
                                    xs: {span: 24},
                                    sm: {span: 5},
                                }}
                                wrapperCol={{
                                    xs: {span: 24},
                                    sm: {span: 12},
                                }}
                                label="审批意见">
                                                <TextArea value={this.state.approveMessage}
                                                          onChange={e => this.setState({approveMessage: e.target.value})}
                                                          placeholder="请审批意见" autosize
                                                          style={{width: '98%', height: '24px'}}/>
                            </FormItem>
                            <Row style={{marginTop: 40}}>
                                <Col span={22}>
                                    <Row type="flex" justify="space-around">
                                        <Col span={2}>
                                            <Button type="primary" block
                                                    onClick={() => this.submit('approve-save', 'APPROVALED')}>同意</Button>
                                        </Col>
                                        <Col span={2}>
                                            <Button type="primary" block
                                                    onClick={() => this.submit('approve-save', 'REBUT')}>驳回</Button>
                                        </Col>
                                        <Col span={2}>
                                            <Button type="primary" block
                                                    onClick={() => this.props.history.go(-1)}>取消</Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                        : undefined
                    }
                    {/*==========================================选择基本信息中的行业分类：【modal选择行业】==========================================*/}
                    <QueryIndustryClass show={this.state.queryIndustryClassModal}
                                        selectIndustryObj={this.props.selectIndustryObj}
                                        setSelectIndustryObj={this.props.setSelectIndustryObj}
                                        isMain={false}
                                        ok={(value) => this.setIndustryClass(value)}/>
                </Spin>
            </div>
        )
    }
}

const CreateCustomerForm = Form.create()(CreateCustomer);
export default CreateCustomerForm;
