// 测试reduce
import caseReducer from '../caseReducer';
const state = {
    // =====分类信息======
    // 选中的行业分类
    selectIndustryObj: [],
    // 禁用的数据
    disableSelectIndustryObj: [],
    // 选中的客户行业分类
    selectCustomerIndustryObj: [],
    // 禁用的数据
    disableSelectCustomerIndustryObj: [],
    // 选中的区域分类
    selectRegionObj: [],
    // 禁用的区域分类
    disableSelectRegionObj: [],
    // =====其他信息======
    // 客户关系
    customerRelations: [],
    // 禁用的客户关系
    disableCustomerRelations: [],
    // 联系人信息
    customerContacts: [],
    // 禁用的联系人信息
    disableCustomerContacts: [],
    // 地址信息
    addresses: [],
    // 禁用的地址信息
    disableAddresses: [],
    // 账户信息
    accounts: [],
    // 禁用的账户信息
    disableAccounts: [],
    // ownerList
    ownerList: [],
    disOwnerList: []
};


function clearCreateStore(state) {
    return {
        ...state,
        selectIndustryObj: [],
        disableSelectIndustryObj: [],
        selectCustomerIndustryObj: [],
        disableSelectCustomerIndustryObj: [],
        selectRegionObj: [],
        disableSelectRegionObj: [],
        customerRelations: [],
        disableCustomerRelations: [],
        customerContacts: [],
        disableCustomerContacts: [],
        addresses: [],
        disableAddresses: [],
        accounts: [],
        disableAccounts: [],
        ownerList: [],
        disOwnerList: []
    }
}

function setSelectIndustryObj(state, action) {
    return {
        ...state,
        selectIndustryObj: action.data
    }
}

function setDisableSelectIndustryObj(state, action) {
    return {
        ...state,
        disableSelectIndustryObj: action.data
    }
}

function setSelectCustomerIndustry(state, action) {
    return {
        ...state,
        selectCustomerIndustryObj: action.data
    }
}

function setDisableSelectCustomerIndustryObj(state, action) {
    return {
        ...state,
        disableSelectCustomerIndustryObj: action.data
    }
}


function addCustomerRelations(state, action) {
    return {
        ...state,
        customerRelations: [...state.customerRelations, action.data]
    }
}

function deleteCustomerRelations(state, action) {
    return {
        ...state,
        customerRelations: state.customerRelations.filter(item => item.key !== action.data.key)
    }
}

function addCustomerContact(state, action) {
    return {
        ...state,
        customerContacts: [...state.customerContacts, action.data]
    }
}

function setDisableCustomerContacts(state, action) {
    return {
        ...state,
        disableCustomerContacts: action.data
    }
}

function delCustomerContact(state, action) {
    return {
        ...state,
        customerContacts: state.customerContacts.filter(item => item.key !== action.data.key)
    }
}

function addAddress(state, action) {
    return {
        ...state,
        addresses: [...state.addresses, action.data]
    }
}

function delAddress(state, action) {
    return {
        ...state,
        addresses: state.addresses.filter(item => item.key !== action.data.key)
    }
}

function addAccount(state, action) {
    return {
        ...state,
        accounts: [...state.accounts, action.data]
    }
}

function setDisableAccounts(state, action) {
    return {
        ...state,
        disableAccounts: action.data
    }
}

function setDisableAddresses(state, action) {
    return {
        ...state,
        disableAddresses: action.data
    }
}

function delAccount(state, action) {
    return {
        ...state,
        accounts: state.accounts.filter(item => item.key !== action.data.key)
    }
}

function setSelectRegionObj (state, action) {
    return {
        ...state,
        selectRegionObj: action.data
    }
}

function setDisableSelectRegionObj (state, action) {
    return {
        ...state,
        disableSelectRegionObj: action.data
    }
}

function setDisableCustomerRelations(state, action) {
    return {
        ...state,
        disableCustomerRelations: action.data
    }
}

function setOwnerList(state, action) {
    return {
        ...state,
        ownerList: action.data
    }
}

function setDisOwnerList(state, action) {
    return {
        ...state,
        disOwnerList: action.data
    }
}

function updateCustomerContacts(state, action) {
    let temp = state.customerContacts;
    temp[action.data.index] = action.data.value;
    return {
        ...state,
        customerContacts: [...temp]
    }
}


export default caseReducer(state, {
    'SET_SELECT_INDUSTRYCLASS': setSelectIndustryObj,
    'SET_DISABLE_SELECT_INDUSTRYOBJ': setDisableSelectIndustryObj,
    'ADD_CUSTOMER_RELATIONS': addCustomerRelations,
    'DELETE_CUSTOMER_RELATIONS': deleteCustomerRelations,
    'ADD_CUSTOMER_CONTACT': addCustomerContact,
    'DEL_CUSTOMER_CONTACT': delCustomerContact,
    'ADD_ADDRESS': addAddress,
    'DEL_ADDRESS': delAddress,
    'ADD_ACCOUNT': addAccount,
    'DEL_ACCOUNT': delAccount,
    'SET_SELECT_CUSTOMER_INDUSTRY': setSelectCustomerIndustry,
    'SET_SELECT_REGIONOBJ': setSelectRegionObj,
    'CLEAR_CREATE_STORE': clearCreateStore,
    'SET_DISABLE_SELECT_REGIONOBJ': setDisableSelectRegionObj,
    'SET_DISABLE_SELECT_CUSTOMER_INDUSTRYOBJ': setDisableSelectCustomerIndustryObj,
    'SET_DISABLE_CUSTOMER_CONTACTS': setDisableCustomerContacts,
    'SET_DISABLE_ADDRESSES': setDisableAddresses,
    'SET_DISABLE_ACCOUNTS': setDisableAccounts,
    'SET_DISABLE_CUSTOMER_RELATIONS': setDisableCustomerRelations,
    'SET_OWNER_LIST': setOwnerList,
    'SET_DIS_OWNER_LIST': setDisOwnerList,
    'UPDATE_CUSTOMER_CONTACTS': updateCustomerContacts
});
