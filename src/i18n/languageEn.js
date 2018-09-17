// 英文
const cn = {
    global: {
        alertModalTitle: 'prompt',
        success: 'success'
    },
    // 客户查询页面
    customerQuery: {
        // 标题
        pageTitle: 'Query customer',
        modalTitle: 'Financial confirmation',
        // 表格头
        columnsHead: {
            customerCode: 'number',
            customerName: 'name',
            unifiedSocialCode: 'Social unified credit code',
            legalPerson: 'legal representative',
            lastUpdatedBy: 'Last updater',
            status: 'status',
            action: 'operating'
        },
        // 表格菜单按钮
        menuButton: {
            baseInfoChange: 'Basic information change',
            ownerApply: 'Owner application',
            effective: 'Effective',
            invalid: 'Invalid',
            confirm: 'confirm',
            managementInformationModification: 'Management information modification',
            contactModification: 'Contact modification',
        },
        // 弹出信息
        alertMes: {
            baseInfoChangeError: 'Basic information change request has been submitted',
            getAdminError: 'Get sales administrator exception, please contact administrator',
            getErpRelatedPartyError: 'Get the related party exception, please contact the administrator',
            getEprRelatedSegmentError: 'Get the associated segment exception, please contact the administrato',
            changeApproverError: 'Please select an approver',
            changeErpRelatedPartyError: 'Please select a related party',
            changeEprRelatedSegmentError: 'Please select the associated segment',
        },
        // 输入提示信息
        placeholder: {
            queryCustomerSelect: 'Please enter customer code, customer name, Unicode, legal representative, multiple keywords separated by spaces',
            changeApprover: 'Select approver',
            changeOu: 'Please select OU',
            changeErpRelatedParty: 'Please select a related party',
            changeEprRelatedSegment: 'Please select the associated segment'
        },
        form: {
            erpRelatedParty: 'Related party',
            eprRelatedSegment: 'Associated segment'
        }
    }
};

export default cn;
