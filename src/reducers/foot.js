// 测试reduce
import caseReducer from './caseReducer';

const footState = {
    inputValue: '123sv'
};

function setInputValue(state, action) {
    return {
        ...state,
        inputValue: action.response.resultMessage
    }
};

export default caseReducer(footState, {
    SET_INPUT_VALUE: setInputValue
});
