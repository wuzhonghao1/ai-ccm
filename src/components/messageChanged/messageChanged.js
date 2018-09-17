import React, {Component} from 'react';
import {
    Form,
    Input,
    DatePicker,
    Row,
    Col,
    Button,
    Select,
    message,
    Upload,
    Icon,
    Spin,
    Modal,
    Tag,
    Popover,
    Layout,
    Card,

} from 'antd';
import Url from '../../store/ajaxUrl';
// import set from 'lodash/set'
import CToH from '../../utils/CtoH';
import moment from 'moment';
import QueryIndustryClass from "./queryIndustryClass";
import './messageChanged.less';
// 【AI】省市县联动组件
// import AiMailingAddress from '../common/aiMailingAddress';

const approvalGroupCode = window.sessionStorage.getItem('approvalGroupCode');
const FormItem = Form.Item;
const {Content} = Layout;
const Search = Input.Search;
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option
const {TextArea} = Input;

class MsgChange extends Component {
    state = {
        // 全局加载状态
        globalLoading: false,
        id: '',
        type: this.props.match.params.type,

        // 变更前默认值
        initialData: {},
        // 变更后的数据
        afterInitialData: [],
        // 查询分类信息的控制
        queryIndustryClassModal: false,
        // 客户名称
        customerName: '',
        // 统一社会信用代码
        unifiedSocialCode: '',
        // 法定代表人
        legalPerson: '',
        // 成立日期
        establishDate: '',
        // 行业编码
        industryName: '',
        // 通讯地址
        regionName: '',
        // 注册地址（住所）的三级分类查询
        option: [],
        // 注册地址（住所）的数据
        regionDataSource: [],
        // 地区数据
        regionData: [],
        // 选中的地区
        regionSelect: '',
        // 注册地址（住所）等待
        regionLoading: false,
        // 省市县数据
        provinceOption: [],
        city: null,
        addressId: null,
        addressUsageId: null,
        addressObjectVersionNumber: null,
        // 注册地址
        corpAddress: '',
        // 通信地址
        address: '',
        // 上传附件
        uploadFile: '',
        // 公司官网
        corpUrl: '',
        // 客户编码
        customerNumber: '',
        // 曾用名
        // usedName: "",
        // 审批人
        managerUser: '',
        // 审批人 下拉
        personelScaleDom: [],
        // 行业编码
        industryObj: null,
        // 提交代码
        submitCode: {},
        // 是否是详情
        isDetail: false,
        // 是否是审批详情
        isRequest: false,
        // 申请单id
        requestId: undefined,
        // 审批信息
        approveMessage: '',
        // 上传文件信息
        afterFileGuid: '',
        afterFileName: '',
        // 文件上传加载状态
        uploadLoading: false,
        // 文件上传按钮
        fileList: [],
        // 文件上传按钮 反馈
        fileGuid1: null,
        // 文件上传个格式是否正确
        fileUploadIsOk: false,
        // 文件上传参数
        uploadFileParame: '',
        // 文件上传按钮控制
        fileUploadControl: false,
        // 版本号
        objectVersionNumber: '',
        // icon mark
        customerNameMark: true,
        unifiedSocialCodeMark: true,
        legalPersonMark: true,
        establishDateMark: true,
        industryNameMark: true,
        corpAddressMark: true,
        addressMark: true,
        corpUrlMark: true,
        // 上传文件的授权Token
        uploadFileToken: undefined,
        // 上传文件的Id
        uploadFileId: undefined,
        // 上传文件的名字
        uploadFileName: undefined
    };
    // 初始化数据 变量
    init = async () => {
        // 下拉数据：客户类型
        let categoryTypes = await window.$ajax.get(Url.categoryTypes);
        if (categoryTypes.resultCode === 'CCS-12000') {
            this.setState({categoryTypes: categoryTypes.quickCodes});
        } else {
            message.error('获取客户类型异常,请联系管理员');
        }
        // 获取审批人下拉
        await window.$ajax.get(Url.personel).then(data => {
            // console.log(data.users)
            this.setState({
                personelScaleDom: data.users
            })
        });

    };

    async componentDidMount() {
        this.setState({
            globalLoading: true,
        });
        if (this.props.match.params.type === 'detail') {
            // 是否是详情
            this.setState({isDetail: true});
        } else {
            this.setState({isDetail: false});
        }
        if (this.props.match.params.reqid) {
            // 是否是审批详情
            this.setState({isRequest: true});
        } else {
            this.setState({isRequest: false});
        }
        // 获取当前的申请单id
        if (this.props.match.params.type === 'detail') {
            await this.setState({requestId: this.props.match.params.reqid});
            // 详情进来获取变更后的数据
            let customerId = await window.$ajax.get(Url.getCustomerChangeInfo + this.props.match.params.id, {})
            console.log("customerId", customerId)
            let details = customerId.newCust, details1 = customerId.oldCust,
                file = customerId.file ? customerId.file : "", objectVersionNumber = customerId.objectVersionNumber

            // 详情的mark
            if (details.customerName === details1.customerName) {
                this.setState({customerNameMark: true})
            } else {
                this.setState({customerNameMark: false})
            }
            ;
            if (details.unifiedSocialCode === details1.unifiedSocialCode) {
                this.setState({unifiedSocialCodeMark: true})
            } else {
                this.setState({unifiedSocialCodeMark: false})
            }
            ;
            if (details.legalPerson === details1.legalPerson) {
                this.setState({legalPersonMark: true})
            } else {
                this.setState({legalPersonMark: false})
            }
            ;
            if (details.industryName === details1.industryName) {
                this.setState({industryNameMark: true})
            } else {
                this.setState({industryNameMark: false})
            }
            ;
            if (details.corpAddress === details1.corpAddress) {
                this.setState({corpAddressMark: true})
            } else {
                this.setState({corpAddressMark: false})
            }
            ;
            if (details.address1 === details1.address1) {
                this.setState({addressMark: true})
            } else {
                this.setState({addressMark: false})
            }
            ;
            if (details.corpUrl === details1.corpUrl) {
                this.setState({corpUrlMark: true})
            } else {
                this.setState({corpUrlMark: false})
            }
            ;
            if (details.establishDate === details1.establishDate) {
                this.setState({establishDateMark: true})
            } else {
                this.setState({establishDateMark: false})
            }
            ;

            this.setState({
                afterFileGuid: file ? file.fileGuid : null,
                afterFileName: file ? file.fileName : null,
                objectVersionNumber: objectVersionNumber,
            });
            // console.log("customerId",customerId)
            this.setState({
                afterInitialData: details,
                // 详情进来获取变更前的数据
                initialData: details1
            });
        } else {
            await this.setState({id: this.props.match.params.id});
            // 获取变更前的数据
            let customerBefore = await window.$ajax.get(Url.getCustomerInfo + this.state.id, {});
            await this.setState({
                industryObj: customerBefore.customer.industryCode ? {
                    industryCode: customerBefore.customer.industryCode
                } : {
                    industryCode: null
                },
            })
            // 设置地址的参数
            if (customerBefore.customer.address && customerBefore.customer.address.length > 0) {
                this.setState({
                    addressId: customerBefore.customer.address[0].addressId
                    , addressObjectVersionNumber: customerBefore.customer.address[0].objectVersionNumber
                    , addressUsageId: customerBefore.customer.address[0].usageId
                });
            }

            console.log('<>', customerBefore);
            await this.setState({
                objectVersionNumber: customerBefore.customer.objectVersionNumber,
                initialData: {
                    customerNumber: customerBefore.customer.customerNumber ? customerBefore.customer.customerNumber : null,
                    customerName: customerBefore.customer.customerName ? customerBefore.customer.customerName : null,
                    // usedName: customerBefore.customer.usedName ? customerBefore.customer.usedName : null,
                    industryName: customerBefore.customer.industryName ? customerBefore.customer.industryName : null,
                    unifiedSocialCode: customerBefore.customer.unifiedSocialCode ? customerBefore.customer.unifiedSocialCode : null,
                    legalPerson: customerBefore.customer.legalPerson ? customerBefore.customer.legalPerson : null,
                    industryCode: this.state.industryObj.industryCode ? this.state.industryObj.industryCode : null,
                    establishDate: customerBefore.customer.establishDate ? customerBefore.customer.establishDate : null,
                    corpAddress: customerBefore.customer.corpAddress ? customerBefore.customer.corpAddress : null,
                    address: customerBefore.customer.address ? customerBefore.customer.address[0].address1 : null,
                    corpUrl: customerBefore.customer.corpUrl ? customerBefore.customer.corpUrl : null,
                    approverId: customerBefore.customer.personelScale ? customerBefore.customer.personelScale : null,
                }
            });
            this.props.form.setFieldsValue({
                industryName: customerBefore.customer.industryName,
            });
        }
        // 初始化数据
        await this.init();
        this.setState({
            globalLoading: false,
        })
    }

    /**
     * 控制上传按钮,右侧mark
     */
    fileUploadControl = async () => {
        let values = {
            customerName: await this.props.form.getFieldValue('customerName') ? this.props.form.getFieldValue('customerName') : undefined,
            unifiedSocialCode: await this.props.form.getFieldValue('unifiedSocialCode') ? this.props.form.getFieldValue('unifiedSocialCode') : undefined,
            legalPerson: await this.props.form.getFieldValue('legalPerson') ? this.props.form.getFieldValue('legalPerson') : undefined,
            corpAddress: await this.props.form.getFieldValue('corpAddress') ? this.props.form.getFieldValue('corpAddress') : undefined,
            address: await this.props.form.getFieldValue('address') ? this.props.form.getFieldValue('address') : undefined,
            corpUrl: await this.props.form.getFieldValue('corpUrl') ? this.props.form.getFieldValue('corpUrl') : undefined,
        }
        let values1 = {
            customerName: this.state.initialData.customerName ? this.state.initialData.customerName : undefined,
            unifiedSocialCode: this.state.initialData.unifiedSocialCode ? this.state.initialData.unifiedSocialCode : undefined,
            legalPerson: this.state.initialData.legalPerson ? this.state.initialData.legalPerson : undefined,
            corpAddress: this.state.initialData.corpAddress ? this.state.initialData.corpAddress : undefined,
            address: this.state.initialData.address ? (this.state.isDetail ? this.state.initialData.address1 : this.state.initialData.address) : undefined,
            corpUrl: this.state.initialData.corpUrl ? this.state.initialData.corpUrl : undefined,
        }
        if (values.customerName === values1.customerName) {
            this.setState({customerNameMark: true})
        } else {
            this.setState({customerNameMark: false})
        }
        ;
        if (values.unifiedSocialCode === values1.unifiedSocialCode) {
            this.setState({unifiedSocialCodeMark: true})
        } else {
            this.setState({unifiedSocialCodeMark: false})
        }
        ;
        if (values.legalPerson === values1.legalPerson) {
            this.setState({legalPersonMark: true})
        } else {
            this.setState({legalPersonMark: false})
        }
        ;
        if (values.corpAddress === values1.corpAddress) {
            this.setState({corpAddressMark: true})
        } else {
            this.setState({corpAddressMark: false})
        }
        ;
        if (values.address === values1.address) {
            this.setState({addressMark: true})
        } else {
            this.setState({addressMark: false})
        }
        ;
        if (values.corpUrl === values1.corpUrl) {
            this.setState({corpUrlMark: true})
        } else {
            this.setState({corpUrlMark: false})
        }
        ;


        // if ((values.customerName === values1.customerName) && (values.unifiedSocialCode === values1.unifiedSocialCode) && (values.legalPerson === values1.legalPerson)) {
        //     this.setState({fileUploadControl: false,})
        // } else {
        //     this.setState({fileUploadControl: true,})
        // };

    }
    fileUploadControl1 = (value, dateString) => {
        let values1 = this.state.initialData.establishDate ? this.state.initialData.establishDate : undefined;
        if (dateString === values1) {
            this.setState({establishDateMark: true})
        } else {
            this.setState({establishDateMark: false})
        }
        ;
    }
    /**
     * 验证统一社会信用代码
     */
    validatorUnifiedSocialCode = async (rule, value, callback) => {
        if (this.state.initialData.unifiedSocialCode !== value && value.length > 0) {
            try {
                let response = await window.$ajax.get(Url.valicateSocialCode + value);
                console.log(response)
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
        if (this.state.initialData.customerName !== value && value.length > 0) {
            try {
                let response = await window.$ajax.get(Url.valicateCustomerName + value);

                if (response.resultCode === 'CCS-12000' && response.existed) {
                    callback('客户名称已存在');
                } else {
                    callback();
                }
            } catch (e) {
                callback('名称填写格式异常');
            }

        }

    };

    // 审批通过（APPROVALED）或拒绝（REJECT）
    approve = async (state) => {
        if (state === 'REJECT' && (this.state.approveMessage === '')) {
            message.error('请填写审批意见');
            return;
        }
        let submitData = {
            customerId: this.state.afterInitialData.customerId,
            objectVersionNumber: this.state.objectVersionNumber,
            customerName: this.state.afterInitialData.customerName,
            // usedName: this.state.afterInitialData.usedName,
            unifiedSocialCode: this.state.afterInitialData.unifiedSocialCode,
            legalPerson: this.state.afterInitialData.legalPerson,
            industryCode: this.state.afterInitialData.industryCode,
            establishDate: moment(this.state.afterInitialData.establishDate).format('YYYY-MM-DD'),
            corpAddress: this.state.afterInitialData.corpAddress,
            address: [],
            corpUrl: this.state.afterInitialData.corpUrl,
        };
        let address = {
            addressId: this.state.addressId,
            objectVersionNumber: this.state.addressObjectVersionNumber,
            usageId: this.state.addressUsageId,
            address1: this.state.afterInitialData.address1,
        };

        submitData.address = address.address1 ? [address] : undefined;

        // console.log(submitData)
        if (state === 'APPROVALED') {
            this.setState({globalLoading: true});
            let response = await window.$ajax.post(Url.saveCustomerInfo, submitData);
            if (response.resultCode === 'CCS-11000') {
                let response = await window.$ajax.post(Url.customerApproveOk, {
                    requestId: this.state.requestId,
                    approvalStatusCode: state,
                    remark: this.state.approveMessage,
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
            } else {
                Modal.error({
                    title: '提示',
                    content: response.resultMessage
                });
            }
        } else {
            this.setState({globalLoading: true});
            let response = await window.$ajax.post(Url.customerApproveOk, {
                requestId: this.state.requestId,
                approvalStatusCode: state,
                remark: this.state.approveMessage,
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
        }

        this.setState({globalLoading: false});

    };
    // 提交按钮
    handSubmit = async (e) => {
        e.preventDefault();
        this.setState({
            globalLoading: true,
        });
        let managerUser = this.props.form.getFieldValue("managerUser");
        // 不是管理员的情况必须选择审批人
        if (this.props.match.params.type === 'edit' && managerUser === undefined && approvalGroupCode !== 'AG_CCM' && approvalGroupCode !== 'AG_FIN') {
            Modal.error({
                title: '提示',
                content: "请选择审批人！",
            });
            this.setState({globalLoading: false});
        } else {
            this.props.form.validateFields(
                ['customerId', 'customerNumber', 'customerName', 'unifiedSocialCode', 'legalPerson', 'establishDate', 'industryName', 'corpAddress', 'address', 'corpUrl', 'uploadFile', 'managerUser'],
                {},
                async (err, values) => {
                    console.log("submitvalues",values)
                    let submitCode = {
                        customerId: this.state.id,
                        objectVersionNumber: this.state.objectVersionNumber,
                        customerNumber: values.customerNumber ? values.customerNumber : null,
                        customerName: values.customerName ? values.customerName.trim() : null,
                        // usedName: values.usedName ? values.usedName : null,
                        unifiedSocialCode: values.unifiedSocialCode ? values.unifiedSocialCode.trim() : null,
                        legalPerson: values.legalPerson ? values.legalPerson.trim() : null,
                        industryCode: this.state.industryObj.industryCode ? this.state.industryObj.industryCode.trim() : null,
                        establishDate: moment(values.establishDate).format('YYYY-MM-DD'),
                        corpAddress: values.corpAddress ? values.corpAddress.trim() : null,
                        address1: values.address ? values.address.trim() : null,
                        corpUrl: values.corpUrl ? values.corpUrl.trim() : null,
                        approverId: values.managerUser ? values.managerUser : null,
                        fileGuid: values.uploadFile ? values.uploadFile.file.response.fileGuid : null,
                    };
                    let customerNameTag = (this.state.initialData.customerName ? this.state.initialData.customerName : undefined) !== (values.customerName ? values.customerName : undefined);
                    let unifiedSocialCodeTag = (this.state.initialData.unifiedSocialCode ? this.state.initialData.unifiedSocialCode : undefined) !== (values.unifiedSocialCode ? values.unifiedSocialCode : undefined);
                    let legalPersonTag = (this.state.initialData.legalPerson ? this.state.initialData.legalPerson : undefined) !== (values.legalPerson ? values.legalPerson : undefined);

                    let address = {
                        addressId: this.state.addressId,
                        objectVersionNumber: this.state.addressObjectVersionNumber,
                        usageId: this.state.addressUsageId,
                        address1: values.address,
                    };

                    submitCode.address = address.address1 ? [address] : undefined;

                    if (this.state.fileGuid1 ? false : (customerNameTag || unifiedSocialCodeTag || legalPersonTag)) {
                        Modal.error({
                            title: '提示',
                            content: "修改客户名称、统一社会信用代码或法定代表人，请上传附件！",
                        });
                        this.setState({globalLoading: false});
                    } else {
                        if (!err) {
                            if (approvalGroupCode === 'AG_CCM' || approvalGroupCode === 'AG_FIN') {
                                console.log('>>>', submitCode);
                                let response = await window.$ajax.post(Url.saveCustomerInfo, submitCode);
                                if (response.resultCode === 'CCS-11000') {
                                    this.setState({
                                        submitCode: submitCode
                                    }, () => {
                                        // console.log("submitCode",this.state.submitCode)
                                        window.$ajax.post(Url.changeSubmit, this.state.submitCode).then(data => {
                                            if (data.resultCode === 'CCS-12000') {
                                                this.setState({globalLoading: false});
                                                Modal.success({
                                                    title: '提示',
                                                    content: data.resultMessage,
                                                    onOk: () => {
                                                        this.props.history.push('/index/query');
                                                    }
                                                });
                                            } else {
                                                this.setState({globalLoading: false});
                                                Modal.success({
                                                    title: '提示',
                                                    content: data.resultMessage,
                                                    onOk: () => {
                                                        this.props.history.push('/index/query');
                                                    }
                                                });

                                            }
                                        })
                                    });
                                } else {
                                    Modal.error({
                                        title: '提示',
                                        content: '保存客户信息失败'
                                    });
                                }
                            } else {
                                this.setState({
                                    submitCode: submitCode
                                }, () => {
                                    // console.log("submitCode",this.state.submitCode)
                                    window.$ajax.post(Url.changeSubmit, this.state.submitCode).then(data => {
                                        if (data.resultCode === 'CCS-12000') {
                                            this.setState({globalLoading: false})
                                            Modal.success({
                                                title: '提示',
                                                content: data.resultMessage,
                                                onOk: () => {
                                                    this.props.history.push('/index/myRequest');
                                                }
                                            });
                                        } else {
                                            this.setState({globalLoading: false});
                                            Modal.success({
                                                title: '提示',
                                                content: data.resultMessage,
                                                onOk: () => {
                                                    this.props.history.push('/index/myRequest');
                                                }
                                            });

                                        }
                                    })
                                });
                            }

                            this.setState({globalLoading: false})
                        }
                        this.setState({globalLoading: false})
                    }
                }
            )
        }

    };
    // 文件上传
    handleChange = async (info) => {
        let fileList = info.fileList;
        fileList = fileList.slice(-1);
        this.setState({fileList});

        if (info.file.status !== 'uploading') {
            // console.log(info);
            fileList[0].url = Url.download + fileList[0].response.fileGuid;
            let fileGuid1 = info.fileList.length === '0' ? null : info.fileList[0].response.fileGuid;
            this.setState({fileGuid1: fileGuid1});
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 文件上传 ${info.file.response.resultMessage}`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 文件上传${info.file.response.resultMessage}`);
        }
    };

    beforeUpload = async (file) => {

        this.setState({
            uploadLoading: true,
        })
        const fileArray = ["image/jpeg", 'image/gif', 'image/png', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        const isOk = fileArray.includes(file.type);
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('文件上传不能大于10MB!');
            await this.setState({
                uploadLoading: false,
            })
        };
        if (!isOk) {
            message.error("请上传正确的文件格式！")
            await this.setState({
                uploadLoading: false,
            })
        };
        await this.setState({fileUploadIsOk: isOk && isLt10M});
        await this.setState({
            uploadLoading: false,
        })
        return isOk && isLt10M;

    }

    /**
     * 基本信息：行业分类的选择
     * @param value 弹窗中选择的对象
     */
    setIndustryClass = async (value) => {
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
        await this.setState({queryIndustryClassModal: false, industryObj: value});

        let values1 = this.state.initialData.industryCode ? this.state.initialData.industryCode : undefined;
        let values2 = this.state.industryObj.industryCode ? this.state.industryObj.industryCode : undefined;
        if (values1 === values2) {
            this.setState({industryNameMark: true})
        } else {
            this.setState({industryNameMark: false})
        }
        ;
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
    // 超出省略号
    ellipsis = (value, number) => {
        if (!value) {
            return;
        } else {
            if (value.length > number) {
                return value.slice(0, number) + '...';
            } else {
                return value;
            }
        }
    }
   
    render() {
        const formItemLayout = {
            labelCol: {
                sm: {span: 4},
            },
            wrapperCol: {
                sm: {span: 20},
            },
        };
        const PersonFormItemLayout = {
            labelCol: {
                sm: {span: 4},
            },
            wrapperCol: {
                sm: {span: 20},
            },
        };
        const {getFieldDecorator} = this.props.form;
        const props = {
            name: 'uploadFile',
            action: Url.fileUpload,
            beforeUpload: this.beforeUpload,
            onChange: this.state.fileUploadIsOk ? this.handleChange : null,
            multiple: false,
            accept: ".jpg, .jpeg, .png, .gif, .doc, .docx, .pdf",
            headers: {
                Authorization: 'authorization-text',
            },

        };
        const content = (
            <div>
                <div>
                    附件类型：.jpg、 .jpeg、 .png、 .gif、
                </div>
                <div>
                    .doc、 .docx、 .pdf
                </div>
            </div>
        );

        return (
            <div className="MessageChanged">
                <Spin tip="Loading..." spinning={this.state.globalLoading}>
                    <Layout style={{background: '#ECECEC'}}>
                        <Content style={{height: '100%', width: '100%'}}>
                            <Card title="客户基本信息变更" bordered={false} style={{width: '100%', minHeight: '80vh'}}>

                                <Form onSubmit={this.handSubmit}
                                      encType='multipart/form-data'
                                >
                                    <Row style={{
                                        backgroundColor: '#f4a034',
                                        marginBottom: 15,
                                        color: '#fff',
                                        padding: "6px 0",
                                        borderRadius: 5,
                                    }}>
                                        <Col span={4} style={{textAlign: 'right', paddingRight: 10,}}>
                                            <span>可变更项</span>
                                        </Col>
                                        <Col span={20}>
                                            <Row>
                                                <Col span={10} offset={1}>
                                                    <span>变更前</span>
                                                </Col>
                                                <Col span={10} offset={1}>
                                                    <span>变更后</span>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <FormItem
                                        {...formItemLayout}
                                        style={{marginBottom: 15,}}
                                        label="客户编码"
                                        colon={false}
                                    >
                                        <Row>
                                            <Col span={10} offset={1}>
                                                <Tag size="small"
                                                     style={{width: '100%'}}>{this.state.initialData.customerNumber}</Tag>
                                            </Col>
                                            <Col span={10} offset={1}>
                                                {getFieldDecorator('customerNumber', {initialValue: this.state.isDetail ? this.state.afterInitialData.customerNumber : this.state.initialData.customerNumber})(
                                                    <Input type="text" disabled={true} size="small"/>
                                                )}
                                            </Col>
                                        </Row>
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        style={{marginBottom: 15,}}
                                        label="客户名称"
                                        colon={false}
                                    >
                                        <Row>
                                            <Col span={10} offset={1}>
                                                <Tag size="small"
                                                     style={{width: '100%'}}>{this.state.initialData.customerName}</Tag>
                                            </Col>
                                            <Col span={10} offset={1}>
                                                {getFieldDecorator('customerName', {
                                                    initialValue: this.state.isDetail ? this.state.afterInitialData.customerName : this.state.initialData.customerName,
                                                    rules: [{
                                                        required: true, message: '客户名称不能为空！'
                                                    },
                                                        {
                                                            max: 80, message: '长度超出限制'
                                                        },
                                                        {
                                                            validator: this.validatorCustomerName,
                                                        }],
                                                })(
                                                    <Input placeholder="请输入客户名称" size="small"
                                                           disabled={this.state.isDetail}
                                                           onBlur={() => {
                                                               this.props.form.setFieldsValue({customerName: CToH(this.props.form.getFieldsValue(["customerName"]).customerName)});
                                                           }}
                                                           onChange={this.fileUploadControl}/>
                                                )}
                                            </Col>
                                            <Col span={1}>
                                                {
                                                    this.state.customerNameMark ? null :
                                                        <Icon type="diff" twoToneColor='#f4a034' theme="twoTone"
                                                              style={{marginLeft: 10,}}/>
                                                }
                                            </Col>
                                        </Row>
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        style={{marginBottom: 12,}}
                                        label="统一社会信用代码"
                                        colon={false}
                                    >
                                        <Row>
                                            <Col span={10} offset={1}>
                                                <Tag size="small"
                                                     style={{width: '100%'}}>{this.state.initialData.unifiedSocialCode}</Tag>
                                            </Col>
                                            <Col span={10} offset={1}>
                                                {getFieldDecorator('unifiedSocialCode', {
                                                    initialValue: this.state.isDetail ? this.state.afterInitialData.unifiedSocialCode : this.state.initialData.unifiedSocialCode,
                                                    rules: [{
                                                        len: 18, message: '长度必须为18位'
                                                    }, {
                                                        validator: this.validatorUnifiedSocialCode,
                                                    }],
                                                })(
                                                    <Input type="text" placeholder="请输入社会统一信用代码" size="small"
                                                           disabled={this.state.isDetail}
                                                           onChange={this.fileUploadControl}
                                                    />
                                                )}
                                            </Col>
                                            <Col span={1}>
                                                {
                                                    this.state.unifiedSocialCodeMark ? null :
                                                        <Icon type="diff" twoToneColor='#f4a034' theme="twoTone"
                                                              style={{marginLeft: 10,}}/>
                                                }
                                            </Col>
                                        </Row>
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        style={{marginBottom: 12,}}
                                        label="法定代表人"
                                        colon={false}
                                    >
                                        <Row>
                                            <Col span={10} offset={1}>
                                                <Tag size="small"
                                                     style={{width: '100%'}}>{this.state.initialData.legalPerson}</Tag>
                                            </Col>
                                            <Col span={10} offset={1}>
                                                {getFieldDecorator('legalPerson', {
                                                    initialValue: this.state.isDetail ? this.state.afterInitialData.legalPerson : this.state.initialData.legalPerson,
                                                    rules: [{
                                                        max: 30, message: '长度超出限制'
                                                    }],
                                                })(
                                                    <Input type="text" placeholder="请输入法定代表人" size="small"
                                                           disabled={this.state.isDetail}
                                                           onChange={this.fileUploadControl}/>
                                                )}
                                            </Col>
                                            <Col span={1}>
                                                {
                                                    this.state.legalPersonMark ? null :
                                                        <Icon type="diff" twoToneColor='#f4a034' theme="twoTone"
                                                              style={{marginLeft: 10,}}/>
                                                }
                                            </Col>
                                        </Row>
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        style={{marginBottom: 15,}}
                                        label="成立日期"
                                        colon={false}
                                    >
                                        <Row>
                                            <Col span={10} offset={1}>
                                                <Tag size="small"
                                                     style={{width: '100%'}}>{moment(this.state.initialData.establishDate).format("YYYY-MM-DD")}</Tag>
                                            </Col>
                                            <Col span={10} offset={1}>
                                                {getFieldDecorator('establishDate', {
                                                    rules: [{
                                                        required: true, message: '请填写日期！'
                                                    }],
                                                    initialValue: this.state.isDetail ? moment(this.state.afterInitialData.establishDate) : (this.state.initialData.establishDate ? moment(this.state.initialData.establishDate) : moment())
                                                },)(
                                                    <DatePicker format={dateFormat} style={{width: '100%'}}
                                                                size="small"
                                                                onChange={this.fileUploadControl1}
                                                                disabled={this.state.isDetail}
                                                                placeholder={'请选择成立日期'}/>
                                                )}
                                            </Col>
                                            <Col span={1}>
                                                {
                                                    this.state.establishDateMark ? null :
                                                        <Icon type="diff" twoToneColor='#f4a034' theme="twoTone"
                                                              style={{marginLeft: 10,}}/>
                                                }
                                            </Col>
                                        </Row>
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        style={{marginBottom: 12,}}
                                        label="工商注册行业"
                                        colon={false}
                                    >
                                        <Row>
                                            <Col span={10} offset={1}>
                                                <Tag size="small"
                                                     style={{width: '100%'}}>{this.state.initialData.industryName}</Tag>
                                            </Col>
                                            <Col span={10} offset={1}>
                                                {getFieldDecorator('industryName', {
                                                    initialValue: this.state.isDetail ? this.state.afterInitialData.industryName : this.state.initialData.industryName,
                                                })(
                                                    <Search
                                                        size="small"
                                                        readOnly={true}
                                                        disabled={this.state.isDetail}
                                                        placeholder={'请选择工商注册行业'}
                                                        onSearch={value => this.setState({queryIndustryClassModal: true})}
                                                    />
                                                )}
                                            </Col>
                                            <Col span={1}>
                                                {
                                                    this.state.industryNameMark ? null :
                                                        <Icon type="diff" twoToneColor='#f4a034' theme="twoTone"
                                                              style={{marginLeft: 10,}}/>
                                                }
                                            </Col>
                                        </Row>
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        style={{marginBottom: 15,}}
                                        label="注册地址(住所)"
                                        colon={false}
                                    >
                                        <Row>
                                            <Col span={10} offset={1}>
                                                <Tag size="small" style={{width: '100%'}}
                                                     title={this.state.initialData.corpAddress}>{this.ellipsis(this.state.initialData.corpAddress, 20)}</Tag>
                                            </Col>
                                            <Col span={10} offset={1}>
                                                {getFieldDecorator('corpAddress', {
                                                    initialValue: this.state.isDetail ? this.state.afterInitialData.corpAddress : this.state.initialData.corpAddress,
                                                    rules: [{
                                                        required: true, message: '请输入注册地址(住所)！'
                                                    }, {
                                                        max: 240, message: '长度超出限制'
                                                    }]
                                                })(
                                                    <Input type="text" placeholder={'请输入注册地址(住所)'} size="small"
                                                           disabled={this.state.isDetail}
                                                           onChange={this.fileUploadControl}/>
                                                )}
                                            </Col>
                                            <Col span={1}>
                                                {
                                                    this.state.corpAddressMark ? null :
                                                        <Icon type="diff" twoToneColor='#f4a034' theme="twoTone"
                                                              style={{marginLeft: 10,}}/>
                                                }
                                            </Col>
                                        </Row>
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        style={{marginBottom: 15,}}
                                        label="通信地址"
                                        colon={false}
                                    >
                                        <Row>
                                            <Col span={10} offset={1}>
                                                <Tag size="small"
                                                     title={this.state.isDetail ? this.state.initialData.address1 : this.state.initialData.address}
                                                     style={{width: '100%'}}>
                                                    {this.state.isDetail ? this.ellipsis(this.state.initialData.address1, 20) : this.ellipsis(this.state.initialData.address, 20)}
                                                </Tag>
                                            </Col>
                                            <Col span={10} offset={1}>
                                                {getFieldDecorator('address', {
                                                    initialValue: this.state.isDetail ? this.state.afterInitialData.address1 : this.state.initialData.address,
                                                    rules: [{
                                                        required: true, message: '请输入通信地址！'
                                                    }, {
                                                        max: 240, message: '长度超出限制'
                                                    }]
                                                })(
                                                    <Input type="text" placeholder={'请输入通信地址'} size="small"
                                                           disabled={this.state.isDetail}
                                                           onChange={this.fileUploadControl}
                                                    />
                                                )}
                                            </Col>
                                            <Col span={1}>
                                                {
                                                    this.state.addressMark ? null :
                                                        <Icon type="diff" twoToneColor='#f4a034' theme="twoTone"
                                                              style={{marginLeft: 10,}}/>
                                                }
                                            </Col>
                                        </Row>
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        style={{marginBottom: 15,}}
                                        label="官网地址"
                                        colon={false}
                                    >
                                        <Row>
                                            <Col span={10} offset={1}>
                                                <Tag size="small"
                                                     style={{width: '100%'}}>{this.state.initialData.corpUrl}</Tag>
                                            </Col>
                                            <Col span={10} offset={1}>
                                                {getFieldDecorator('corpUrl', {
                                                    initialValue: this.state.isDetail ? this.state.afterInitialData.corpUrl : this.state.initialData.corpUrl,
                                                    rules: [{
                                                        max: 240, message: '长度超出限制'
                                                    }]
                                                })(
                                                    <Input type="text" placeholder={'请输入官网地址'} size="small"
                                                           disabled={this.state.isDetail}
                                                           onChange={this.fileUploadControl}/>
                                                )}
                                            </Col>
                                            <Col span={1}>
                                                {
                                                    this.state.corpUrlMark ? null :
                                                        <Icon type="diff" twoToneColor='#f4a034' theme="twoTone"
                                                              style={{marginLeft: 10,}}/>
                                                }
                                            </Col>
                                        </Row>
                                    </FormItem>
                                    {/* {
                                        this.state.fileUploadControl ? */}
                                    <FormItem
                                        {...formItemLayout}
                                        style={{marginBottom: 20,}}
                                        label="附件"
                                        colon={false}
                                    >
                                        <Spin tip="Loading..." spinning={this.state.uploadLoading}>
                                            {
                                                this.state.isDetail ?
                                                    <Col span={9} offset={1}>
                                                        <a href={Url.download + this.state.afterFileGuid}>{this.state.afterFileName}</a>
                                                    </Col> :

                                                    <Row>
                                                        <Col span={10} offset={1}>
                                                        </Col>
                                                        <Col span={10} offset={1}>

                                                            {getFieldDecorator('uploadFile', {})(
                                                                <Upload {...props} size="small"
                                                                        fileList={this.state.fileList}
                                                                        disabled={this.state.isDetail}>
                                                                    <Popover content={content}>
                                                                        <Button size="small"
                                                                                disabled={this.state.isDetail}>
                                                                            <Icon type="upload" size="small"
                                                                                  disabled={this.state.isDetail}/> 点击上传
                                                                        </Button>
                                                                    </Popover>
                                                                </Upload>
                                                            )}
                                                        </Col>
                                                    </Row>

                                            }
                                        </Spin>

                                    </FormItem>
                                    {/*  : null
                                    } */}

                                    {!this.state.isDetail && approvalGroupCode !== 'AG_CCM' && approvalGroupCode !== 'AG_FIN' ?
                                        <FormItem
                                            {...PersonFormItemLayout}
                                            style={{
                                                marginBottom: 20,
                                                paddingTop: 20,
                                                borderTop: "1px solid #ccc"
                                            }}
                                            label="审批人"
                                            colon={false}
                                        >
                                            {getFieldDecorator('managerUser', {
                                                rules: [{
                                                    required: true,
                                                    message: '',
                                                }]
                                            })(
                                                <Select placeholder={'请选择审批人'} size="small"
                                                        style={{width: '87.3333%', marginLeft: "4.3333%"}}
                                                        disabled={this.state.isDetail}>
                                                    {this.state.personelScaleDom.map(item =>
                                                        <Option value={item.userId}
                                                                key={item.userId}>{item.userName}</Option>
                                                    )}
                                                </Select>
                                            )}
                                        </FormItem>
                                        : undefined
                                    }
                                    <FormItem
                                        style={{display: this.state.isRequest ? 'block' : 'none'}}
                                        {...PersonFormItemLayout}
                                        label="审批意见"
                                        colon={false}
                                    >
                                        <Row>
                                            <Col span={19} offset={1} style={{marginBottom: 20,}}>
                                                <TextArea
                                                    value={this.state.approveMessage}
                                                    onChange={e => this.setState({approveMessage: e.target.value})}
                                                    placeholder={'请输入审批意见'} size="small" autosize/>
                                            </Col>
                                        </Row>
                                    </FormItem>


                                    <FormItem style={{display: this.state.isDetail ? 'none' : 'block'}}>
                                        <Row type="flex" justify="space-around">
                                            <Col span={2}>
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                >提交</Button>
                                            </Col>
                                            <Col span={2}>
                                                <Button
                                                    onClick={() => this.props.history.go(-1)}
                                                    type="primary"
                                                >取消</Button>
                                            </Col>
                                        </Row>
                                    </FormItem>
                                    <FormItem style={{display: this.state.isRequest ? 'block' : 'none'}}>
                                        <Row>
                                            <Col>
                                                <Row type="flex" justify="space-around">
                                                    <Col span={2}>
                                                        <Button
                                                            type="primary"
                                                            onClick={() => this.approve('APPROVALED')}
                                                        >同意</Button>
                                                    </Col>
                                                    <Col span={2}>
                                                        <Button
                                                            type="primary"
                                                            onClick={() => this.approve('REJECT')}
                                                        >拒绝</Button>
                                                    </Col>
                                                    <Col span={2}>
                                                        <Button
                                                            onClick={() => this.props.history.go(-1)}
                                                            type="primary"
                                                        >取消</Button>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>

                                    </FormItem>
                                    {/*==========================================选择基本信息中的行业分类==========================================*/}
                                    <QueryIndustryClass show={this.state.queryIndustryClassModal}
                                                        selectIndustryObj={this.props.selectIndustryObj}
                                                        setSelectIndustryObj={this.props.setSelectIndustryObj}
                                                        isMain={false}
                                                        ok={(value) => this.setIndustryClass(value)}/>
                                </Form>
                            </Card>
                        </Content>
                    </Layout>
                </Spin>

            </div>
        )
    }


}


const MessageChanged = Form.create()(MsgChange);

export default MessageChanged

