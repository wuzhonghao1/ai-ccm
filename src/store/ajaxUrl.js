// ajax请求地址
// let ccm = 'http://192.168.0.169:8080/ai-ccm';
// let ccm = 'http://192.168.0.35:31357/ai-ccm';
let ccm = `${window.sessionStorage.getItem('PUBLIC_URL')}`;
// let ccm = '/ai-ccm';
let ccs = `${window.sessionStorage.getItem('ccsUrl')}`;
// let ccs = 'http://192.168.0.169:8080/ccs';
const url = {
    // 获取菜单
    getSystemMenu: ccm + '/permission/get',
    // 查询行业分类四级分类
    industryClass: ccm + '/baseData/industryClass/get/',
    // 状态代码
    operatingState: ccm + '/baseData/quickCode/d/get/OPERATING_STATE',
    // 人员规模
    personelScale: ccm + '/baseData/quickCode/d/get/PERSONAL_SCALE',
    // 分类信息
    categoryTypes: ccm + '/baseData/quickCode/d/get/PARTY_EXT_INT',
    // 一级公司类型代码
    level1: ccm + '/baseData/registry/get/level1',
    // 二三级公司类型代码
    level2: ccm + '/baseData/registry/get/level2/',
    // 客户行业所有
    levelAll: ccm + '/baseData/registry/get',
    // 客户行业分类一级
    customerLevel1: ccm + '/baseData/cust/industry/get/0',
    // 客户行业分类后级
    customerLevel2: ccm + '/baseData/cust/industry/get/',
    // 客户行业分类后级
    relationType: ccm + '/baseData/quickCode/d/get/RELATION_TYPE',
    // 账户分类
    partyAccountType: ccm + '/baseData/quickCode/d/get/PARTY_ACCOUNT_TYPE',
    // 模糊查询省份
    provinceGet: ccm + '/baseData/province/get/',
    // 获取所有省份
    provinceAll: ccm + '/baseData/province/getAll',
    // 市区
    provinceMunicipalities: ccm + '/baseData/province/get/municipalities/',
    // 区
    provinceRegions: ccm + '/baseData/province/get/regions/',
    roleGet: ccm + '/permission/role/get',
    // 获取详情
    getCustomerInfo: ccs + '/api/v1.0.0/getCustomerInfo?customerId=',
    // 保存或提交
    saveCustomerInfo: ccs + '/api/v1.0.0/customer',
    // 国家
    territoryGet: ccm + '/baseData/territory/get',
    // 客户列表查询
    customerQuery: ccm + '/customer/get',
    // 获取销售管理员
    managerGet: ccm + `/permission/manager/get/APPLY_CUSTOMER/${window.sessionStorage.getItem('roleId')}`,
    // 获取审批人
    personel: ccm + `/permission/manager/get/APPLY_CHANGE/${window.sessionStorage.getItem('roleId')}`,
    // 获取权限申请的审批人
    permissionApproveGet: ccm + `/permission/manager/get/APPLY_ROLE/${window.sessionStorage.getItem('roleId')}`,
    // 获取Owner申请的审批人
    ownerApproverGet: ccm + `/permission/manager/get/APPLY_OWNER/${window.sessionStorage.getItem('roleId')}`,
    // 提交审批流程
    customerApply: ccm + '/customer/apply',
    // 请求
    approvalGet: ccm + '/approval/get',
    // 审批状态
    approveState: ccm + '/baseData/quickCode/get/APPROVAL_STATUS',
    // 请求状态
    requestType: ccm + '/baseData/quickCode/get/REQUEST_TYPE',
    // 获取申请
    applyGet: ccm + '/approval/apply/get',
    // 客户生效
    customerEnable: ccm + '/customer/enable/',
    // 客户失效
    customerDisable: ccm + '/customer/disable/',
    // 客户审批
    customerApprove: ccm + '/customer/approve',
    // Owner审批
    ownerApprove: ccm + '/customer/owner/approve',
    // 创建外部客户时选择代理人
    getAgentPersonINT: ccm + '/agent/get/ADD_CUSTOMER_INT',
    // 创建内部客户时选择代理人
    getAgentPersonEXT: ccm + '/agent/get/ADD_CUSTOMER_EXT',
    // 审批时用的选择关联方
    erpRelatedParty: ccm + '/baseData/quickCode/d/get/ERP_RELATED_PARTY',
    // 审批时用的选择关联段
    erpRelatedSegment: ccm + '/baseData/quickCode/d/get/EPR_RELATED_SEGMENT',
    // 取消客户申请
    cancelCustomerApply: ccm + '/customer/cancel/',
    // 取消客户Owner申请
    cancelOwnerApply: ccm + '/customer/owner/cancel/',
    // 角色申请
    roleApply: ccm + '/permission/apply',
    // 角色撤销申请
    cancelRoleApply: ccm + '/permission/cancel/',
    // 撤销变更请求
    cancelCustomerChange: ccm + '/customer/modify/cancel/',
    // Owner
    ownerApply: ccm + '/customer/owner/apply',
    //代理申请数据
    agentDate: ccm + '/agent/apply',
    //代理设置 自动补全人名
    agentAuto: ccm + '/baseData/user/get',
    //代理我的人
    agentMe: ccm + '/agent/apply/get',
    //我的代理人
    myAgent: ccm + '/agent/get',
    //代理设置 审批状态过滤
    agentApprove: ccm + '/agent/agentType/get',
    //代理设置 申请单类型过滤
    agentRequestType: ccm + '/baseData/quickCode/get/AGENT_STATUS',
    //代理设置 申请单类型过滤
    orderCustGet: ccm + '/baseData/quickCode/d/get/IS_ORDER_CUST',
    // 信用评估
    creditEvaluationGet: ccm + '/baseData/quickCode/d/get/CREDIT_EVALUATION',
    // 业务评估
    businessEvaluationGet: ccm + '/baseData/quickCode/d/get/BUSINESS_EVALUATION',
    // 代理意见同意，拒绝
    agentAgree: ccm + '/agent/approve',
    // 代理意见撤销
    agentCancel: ccm + '/agent/cancel',
    // 代理删除
    agentRemove: ccm + '/agent/remove',
    // 查询员工组数据
    getByPersonIds: ccm + '/baseData/user/getByPersonIds',
    // 获取转交人
    transferApprover : ccm + '/approval/approver/get/',
    // 转交
    changeApprover: ccm + '/approval/changeApprover',
    // 文件上传
    fileUpload: ccm + '/file/upload',
    // 审批通过数据
    customerApproveOk: ccm + '/customer/modify/approve ',
    // 变更提交
    changeSubmit: ccm + '/customer/modify/apply',
    // 变更后的数据接口
    getCustomerChangeInfo: ccm + '/customer/modify/get/',
    // 页面内部权限控制接口
    permissionPage: ccm + '/customer/modify/permission/get/',
    // 人员组数据模糊查询
    listPerson: ccm + '/baseData/user/getFromMainData/',
    // 保存Owner
    saveOwner: ccm + '/customer/owner/add',
    // 获取财务确认的OU信息
    erpOrgGet: ccm + '/baseData/ref/erp/org/',
    // 文件下载
    download: ccm + '/file/download/',
    // 检验客户名称的唯一性
    valicateCustomerName: ccm + '/customer/valicate/customerName/',
    // 检验社会同于代码
    valicateSocialCode: ccm + '/customer/valicate/socialCode/',
    getFormQcc: ccm + '/customer/getFromQcc/',
    // 文件上传获取token
    tokenGet: ccm + '/file/token/get',
    // 文件上传成功url
    fileSuccess: ccm + '/file/upload/v2.0',
    help: ccm + '/static/help/客户中心管理系统操作手册（销售版）V1.0.pdf'

};

export default url;
