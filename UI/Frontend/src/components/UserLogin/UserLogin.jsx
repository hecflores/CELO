import React from 'react';
import $ from 'jquery';
import DataContainer from '../Containers/DataContainer.jsx';
import DataInput from '../Containers/DataInput.jsx';
import APIComponent from '../Containers/APIComponent.jsx';


class UserLogin extends React.Component {

    static propTypes={
        OnUserUnFocus:React.PropTypes.func,
        SubmitBtnText:React.PropTypes.string,
        Role:React.PropTypes.string,
        onChange:React.PropTypes.func,
        onUsernameChanged:React.PropTypes.func,
        UsernameOnly:React.PropTypes.bool,
        onUserEntered:React.PropTypes.func,
        onUserLoginAttempt:React.PropTypes.func,
        UserError:React.PropTypes.string,
        PasswordError:React.PropTypes.string,
        onUserOnly:React.PropTypes.func
    };

    constructor(props) {
        super(props);
        this.onUserNameChangedTrigger=function(attribute, value){
            //console.debug("UserLogin: onUserNameChangedTrigger(attribute:'"+attribute+"', value:'"+value+"'");
            this.props.onUserEntered(value);
        }.bind(this);

        this.onSubmitTrigger=function(data){
            //console.debug("UserLogin: onSubmitTrigger(data:"+JSON.stringify(data)+")");
            if(this.props.UsernameOnly){
                //console.debug("UserLogin: onSubmitTrigger -> UsernameOnly");
                this.props.onUserLoginAttempt(data);
                return;
            }
            //console.debug("UserLogin: onSubmitTrigger -> :not(UsernameOnly)");
            this.props.onUserLoginAttempt(data);

        }.bind(this);
    }

    render(){
        //console.debug("UserLogin: render");
        const loginForm=function(data,change,submit,putTrigger){
            return (
                <div>
                    {this.props.Role?<DataInput Key={"Role"} Value={this.props.Role} ViewableOnly={true} onChanged={[change]} Name={"Role"}/>:""}
                    <DataInput Key={"username"} onFocus={this.props.onUserOnly}  onChanged={[change,this.props.onUsernameChanged]} onBlur={submit} Name={"User Name"} />
                    {this.props.UsernameOnly?"":<DataInput onKeyEnter={submit} Key={"password"} onChanged={[change]} Name={"Password"}/>}
                    <div onClick={submit} className="btn btn-default">Login</div>
                </div>)
        }.bind(this);

        return (
            <DataContainer onChange={this.props.onChange} onSubmit={this.onSubmitTrigger} defaultData={{Role:this.props.Role}}>
                {loginForm}
            </DataContainer>

        )
    }
}


UserLogin.defaultProps = {
    OnUserUnFocus:function(){

    },
    onUserOnly:function(){},
    SubmitBtnText:"Login",
    onUserLoginAttempt:function (username, password) {

    },
    onUserEntered:function(username){

    },
    onUsernameChanged:function(attribute,username){

    },
    onChange:function(username){

    },
    UserError:null,
    PasswordError:null,
    UsernameOnly:false,
};

export default UserLogin;