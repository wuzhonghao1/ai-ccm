import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import CreateCustomer from '../components/createCustomer/createCustomer';
import { withRouter } from 'react-router-dom';
import {
    setSelectIndustryObj,
    setSelectCustomerIndustryObj,
    addCustomerRelations,
    deleteCustomerRelations,
    addCustomerContact,
    delCustomerContact,
    addAddress,
    delAddress,
    addAccount,
    delAccount,
    setSelectRegionObj,
    clearCreateStore,
    setDisableSelectIndustryObj,
    setDisableSelectRegionObj,
    setDisableSelectCustomerIndustryObj,
    setDisableCustomerContacts,
    setDisableAddresses,
    setDisableAccounts,
    setDisableCustomerRelations,
    setOwnerList,
    setDisOwnerList,
    updateCustomerContacts
} from '../actions/createCustomer';

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        setSelectIndustryObj,
        setSelectRegionObj,
        addCustomerRelations,
        deleteCustomerRelations,
        addCustomerContact,
        delCustomerContact,
        addAddress,
        delAddress,
        addAccount,
        delAccount,
        setSelectCustomerIndustryObj,
        clearCreateStore,
        setDisableSelectIndustryObj,
        setDisableSelectRegionObj,
        setDisableSelectCustomerIndustryObj,
        setDisableCustomerContacts,
        setDisableAddresses,
        setDisableAccounts,
        setDisableCustomerRelations,
        setOwnerList,
        setDisOwnerList,
        updateCustomerContacts
    }, dispatch)
);


function mapStateToProps(state) {
    return {
        selectIndustryObj: state.createCustomer.selectIndustryObj,
        disableSelectIndustryObj: state.createCustomer.disableSelectIndustryObj,
        selectCustomerIndustryObj: state.createCustomer.selectCustomerIndustryObj,
        disableSelectCustomerIndustryObj: state.createCustomer.disableSelectCustomerIndustryObj,
        selectRegionObj: state.createCustomer.selectRegionObj,
        disableSelectRegionObj: state.createCustomer.disableSelectRegionObj,
        customerRelations: state.createCustomer.customerRelations,
        disableCustomerRelations: state.createCustomer.disableCustomerRelations,
        customerContacts: state.createCustomer.customerContacts,
        disableCustomerContacts: state.createCustomer.disableCustomerContacts,
        addresses: state.createCustomer.addresses,
        disableAddresses: state.createCustomer.disableAddresses,
        accounts: state.createCustomer.accounts,
        disableAccounts: state.createCustomer.disableAccounts,
        ownerList: state.createCustomer.ownerList,
        disOwnerList: state.createCustomer.disOwnerList
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateCustomer));
