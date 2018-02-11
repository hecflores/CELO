import React from 'react';
import UserAPI from '../../libaries/APIs/UserAPI.jsx';
import Loader from '../Containers/Loader.jsx';

class LoadUser extends React.Component
{
    static defaultProps={
        onUserFound:function(){},
        onUserNotFound:function(){},
    };
    static propTypes={
        onUserFound:React.PropTypes.func,
        onUserNotFound:React.PropTypes.func
    };


    state={
        SigningIn:true,
        SignedIn:false,
        UserInfo:{}
    };

    /**
     * @var APIHook
     */
    apiHook;
    constructor(props){
        super(props);

        this.apiHook=UserAPI.instance.hook().
        on("get-user-profile",function(data){
            this.setState({
                SigningIn:false,
                SignedIn:true,
                UserInfo:data.data
            },function(){
                this.props.onUserFound(this.state.UserInfo);
            }.bind(this));
        }.bind(this)).
        on("get-user-profile","failed",function(){
            this.setState({
                SigningIn:false
            },function(){
                this.props.onUserNotFound();
            });
        }.bind(this));
    }

    componentDidMount()
    {
        this.apiHook.open();
        this.apiHook.getListener().initiate("get-user-profile");
    }
    componentWillUnmount()
    {
        this.apiHook.close();
    }
    componentWillReceiveProps(){

    }
    render(){
        return <div>{this.props.children}{this.state.SigningIn?<div className="full-screen">Loading Current User...<Loader/></div>:null}</div>
    }
}

export default LoadUser