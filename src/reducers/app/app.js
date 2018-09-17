// 测试reduce
import caseReducer from '../caseReducer';

const footState = {
    // 系统应用菜单
    applicationList: [],
    // 系统菜单
    menuList: undefined
};

function getApplicationAndMenuList(state, action) {
    if (!action.response.permission.menus) {
        return {
            ...state,
            applicationList: [],
            menuList: []
        }
    } else
    return {
        ...state,
        applicationList: action.response.permission.applications,
        menuList: action.response.permission.menus
    }
};

export default caseReducer(footState, {
    'GET_APPLICATION_MENU': getApplicationAndMenuList
});
