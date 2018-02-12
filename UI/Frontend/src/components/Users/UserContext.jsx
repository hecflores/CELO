import React from 'react';
import UserAPI from '../../libaries/APIs/UserAPI.jsx';
import {browserHistory} from "react-router";
import LoadUser from './LoadUser.jsx';
import UserAuthenticator from './UserAuthenticator.jsx';
class UserContext extends React.Component
{

    static childContextTypes={
        UserInfo:React.PropTypes.object,
        UserAuthenticator:React.PropTypes.instanceOf(UserAuthenticator)
    };

    state={
        SignedIn:false,
        UserInfo:{}
    };


    constructor(props){
        super(props);
        this.redirect=this.redirect.bind(this);
        this.setUser=this.setUser.bind(this);
    }


    getChildContext() {
        return {
            UserInfo: this.state.UserInfo,
            UserAuthenticator:new UserAuthenticator(this.state.UserInfo)
        };
    }
    setUser(user){
        this.setState({
            SignedIn:true,
            UserInfo:user
        });
    }
    redirect(){
        browserHistory.push("/login");
    }
    render(){
        return <LoadUser onUserFound={this.setUser} onUserNotFound={this.redirect}>
                  {this.state.SignedIn?this.props.children:null}
               </LoadUser>;
    }
}

export default UserContext