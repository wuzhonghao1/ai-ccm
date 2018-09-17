import {connect} from 'react-redux';
import {getApplicationMenu} from '../actions/menu';
import {bindActionCreators} from 'redux';
import App from '../components/App';
import { withRouter } from 'react-router-dom'
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        getApplicationMenu,
    }, dispatch)
);


function mapStateToProps(state) {
    return {
        applicationList: state.app.applicationList,
        menuList: state.app.menuList
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
