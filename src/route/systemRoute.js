// 路由配置
import {Route, Switch} from 'react-router-dom';
import React, {Component} from 'react';
import Welcome from '../containers/welcome';
import CustomerQuery from '../components/customerQuery/queryTable';
import Foot from '../containers/foot';
import CreateCustomer from '../containers/createCustomer';
import NoMatch from '../components/noMatch';
import ApplyPermission from '../components/applyPermission/applyPermission';
import MyRequest from '../components/myRequest/myRequest';
import MyApproval from '../components/myApproval/myApproval';
import AgentSetting from '../components/agentSetting/agentSetting';
import MessageChanged from '../components/messageChanged/messageChanged';

// import QueryIndustryCode from '../components/messageChanged/queryIndustryCode';
class SystemRoute extends Component {
    componentDidMount() {

    }

    render() {
        return (
            <Switch>
                <Route exact path="/" component={Welcome}/>
                    <div>
                        <Route exact path="/index/query" component={CustomerQuery}/>
                        {/* <Route exact path="/index/query/:type/:id" component={QueryIndustryCode}/> */}

                        <Route exact path="/index/messageChanged/:type/:id/:reqid" component={MessageChanged}/>
                        <Route exact path="/index/messageChanged/:type/:id" component={MessageChanged}/>

                        <Route exact path="/index/createCustomer/:type" component={CreateCustomer}/>
                        <Route exact path="/index/createCustomer/:action/:id/:requestId" component={CreateCustomer}/>
                        <Route exact path="/index/createCustomer/:action/:id" component={CreateCustomer}/>
                        <Route exact path="/index/myRequest" component={MyRequest}/>
                        <Route exact path="/index/myApproval" component={MyApproval}/>
                        <Route exact path="/index/agentSetting" component={AgentSetting}/>
                        <Route exact path="/index/foot" component={Foot}/>
                        {/*审批*/}
                        <Route exact path="/index/applyPermission/approve/:roleId/:requestId"
                               component={ApplyPermission}/>
                        {/*审批详情*/}
                        <Route exact path="/index/applyPermission/detail/:roleId" component={ApplyPermission}/>
                    </div>
                <Route exact path="/index/applyPermission" component={ApplyPermission}/>
                <Route component={NoMatch}/>
            </Switch>
        )
    }
}

export default SystemRoute;
