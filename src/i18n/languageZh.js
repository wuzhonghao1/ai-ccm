// 中文
const zh = {
    global: {
      alertModalTitle: '提示',
      success: '成功'
    },
    // 客户查询页面
    customerQuery: {
        // 标题
        pageTitle: '客户查询',
        modalTitle: '财务确认',
        // 表格头
        columnsHead: {
            customerCode: '客户编号',
            customerName: '客户名称',
            unifiedSocialCode: '统一社会信用代码',
            legalPerson: '法定代表人',
            lastUpdatedBy: '最后更新人',
            status: '状态',
            action: '操作'
        },
        // 表格菜单按钮
        menuButton: {
            baseInfoChange: '基本信息变更',
            ownerApply: 'Owner申请',
            effective: '生效',
            invalid: '失效',
            confirm: '确认',
            managementInformationModification: '管理信息修改',
            contactModification: '联系人修改',
        },
        // 弹出信息
        alertMes: {
            baseInfoChangeError: '已提交过基本信息变更申请',
            getAdminError: '获取销售管理员异常，请联系管理员',
            getErpRelatedPartyError: '获取关联方异常，请联系管理员',
            getEprRelatedSegmentError: '获取关联段异常，请联系管理员',
            changeApproverError: '请选择审批人',
            changeErpRelatedPartyError: '请选择关联方',
            changeEprRelatedSegmentError: '请选择关联段',
        },
        // 输入提示信息
        placeholder: {
            queryCustomerSelect: '请输入客户编码、客户名称、统一代码、法人代表，多关键字用空格隔开',
            changeApprover: '选择审批人',
            changeOu: '请选择OU',
            changeErpRelatedParty: '请选择关联方',
            changeEprRelatedSegment: '请选择关联段'
        },
        form: {
            erpRelatedParty: '关联方',
            eprRelatedSegment: '关联段'
        }
    }
};

export default zh;

