import {connect} from 'react-redux';
import {setInputValue, update} from '../actions/foot';
import foot from '../components/foot';
import {bindActionCreators} from 'redux'


const mapDispatchToProps = dispatch => (
    bindActionCreators({
        setInputValue,
        update,
    }, dispatch)
);


function mapStateToProps(state) {
    return {
        inputValue: state.foot.inputValue,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(foot);