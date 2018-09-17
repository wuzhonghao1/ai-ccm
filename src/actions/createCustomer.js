import {
    SET_SELECT_INDUSTRYCLASS,
    ADD_CUSTOMER_RELATIONS,
    DELETE_CUSTOMER_RELATIONS,
    ADD_CUSTOMER_CONTACT,
    DEL_CUSTOMER_CONTACT,
    ADD_ADDRESS,
    DEL_ADDRESS,
    ADD_ACCOUNT,
    DEL_ACCOUNT,
    SET_SELECT_CUSTOMER_INDUSTRY,
    SET_SELECT_REGIONOBJ,
    CLEAR_CREATE_STORE,
    SET_DISABLE_SELECT_INDUSTRYOBJ,
    SET_DISABLE_SELECT_REGIONOBJ,
    SET_DISABLE_SELECT_CUSTOMER_INDUSTRYOBJ,
    SET_DISABLE_CUSTOMER_CONTACTS,
    SET_DISABLE_ADDRESSES,
    SET_DISABLE_ACCOUNTS,
    SET_DISABLE_CUSTOMER_RELATIONS,
    SET_OWNER_LIST, SET_DIS_OWNER_LIST, UPDATE_CUSTOMER_CONTACTS
} from '../store/actionType';

/**
 * 操作分类信息
 */

// 行业分类
export const setSelectIndustryObj = (data) => {
    return {
        type: SET_SELECT_INDUSTRYCLASS,
        data: data
    }
};

export const setDisableSelectIndustryObj = (data) => {
    return {
        type: SET_DISABLE_SELECT_INDUSTRYOBJ,
        data: data
    }
};

// 客户行业分类
export const setSelectCustomerIndustryObj = (data) => {
    return {
        type: SET_SELECT_CUSTOMER_INDUSTRY,
        data: data
    }
};

export const setDisableSelectCustomerIndustryObj = (data) => {
    return {
        type: SET_DISABLE_SELECT_CUSTOMER_INDUSTRYOBJ,
        data: data
    }
};

// 设置地区
export const setSelectRegionObj = (data) => {
    return {
        type: SET_SELECT_REGIONOBJ,
        data: data
    }
};

export const setDisableSelectRegionObj = (data) => {
    return {
        type: SET_DISABLE_SELECT_REGIONOBJ,
        data: data
    }
};


export const addCustomerRelations = (data) => {
    return {
        type: ADD_CUSTOMER_RELATIONS,
        data: data
    }
};

export const setDisableCustomerRelations = (data) => {
    return {
        type: SET_DISABLE_CUSTOMER_RELATIONS,
        data: data
    }
};

export const deleteCustomerRelations = (data) => {
    return {
        type: DELETE_CUSTOMER_RELATIONS,
        data: data
    }
};

export const addCustomerContact = (data) => {
    return {
        type: ADD_CUSTOMER_CONTACT,
        data: data
    }
};


export const delCustomerContact = (data) => {
    return {
        type: DEL_CUSTOMER_CONTACT,
        data: data
    }
};

export const addAddress = (data) => {
    return {
        type: ADD_ADDRESS,
        data: data
    }
};

export const delAddress = (data) => {
    return {
        type: DEL_ADDRESS,
        data: data
    }
};

export const addAccount = (data) => {
    return {
        type: ADD_ACCOUNT,
        data: data
    }
};

export const setDisableAccounts = (data) => {
    return {
        type: SET_DISABLE_ACCOUNTS,
        data: data
    }
};

export const delAccount = (data) => {
    return {
        type: DEL_ACCOUNT,
        data: data
    }
};

export const setDisableAddresses = (data) => {
    return {
        type: SET_DISABLE_ADDRESSES,
        data: data
    }
}

// 清空创建用户页面创建的store
export const clearCreateStore = () => {
    return {
        type: CLEAR_CREATE_STORE
    }
};

export const setDisableCustomerContacts = (data) => {
    return {
        type: SET_DISABLE_CUSTOMER_CONTACTS,
        data: data
    }
};

export const setOwnerList = (data) => {
    return {
        type: SET_OWNER_LIST,
        data: data
    }
};

export const setDisOwnerList = (data) => {
    return {
        type: SET_DIS_OWNER_LIST,
        data: data
    }
};

export const updateCustomerContacts = (data) => {
    return {
        type: UPDATE_CUSTOMER_CONTACTS,
        data: data
    }
};
