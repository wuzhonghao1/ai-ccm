import {connect} from 'react-redux';
import WelCome from '../components/welcome/welcome';
import { withRouter } from 'react-router-dom';
import {bindActionCreators} from "redux";
import {getApplicationMenu} from "../actions/menu";
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        getApplicationMenu,
    }, dispatch)
);
function mapStateToProps(state) {
    return {
        applicationList: state.app.applicationList,
        menuList: state.app.menuList
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WelCome));
