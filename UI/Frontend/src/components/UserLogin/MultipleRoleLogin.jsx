import React from 'react';
import $ from 'jquery';
import APIComponent from "../Containers/APIComponent.jsx";
import UserAPI from "../../libaries/APIs/UserAPI.jsx";
import UserLogin from "./UserLogin.jsx";
class MultipleRoleLogin extends React.Component {

    constructor(props) {
        super(props);

        this.state={
            User:null,
            Role:null,
            UserFound:false,
            Error:null
        };


        this.testUserLogin=this.testUserLogin.bind(this);
        this.testUser=this.testUser.bind(this);
        this.deleteRole=this.deleteRole.bind(this);
    }
    testUser(data){

        if(data.success){
            this.setState({
                Role:data["Role"],
                UserFound:true
            });
        }
    }
    testUserLogin(data){
        if(data.UserHome){
            this.props.router.push("/portal");
        }
    }
    deleteRole(){
        this.setState({
            Role:false
        });
    }
    render() {
        return (
            <div className="multiple-user-login">
                    <APIComponent Message={this.state.Role?"Signing In...":"Matching Role..."} APIListener={UserAPI.instance} Event={this.state.Role?"login":"find-user"} onSubmit={this.state.Role?this.testUserLogin:this.testUser} initialInput={this.state.Role?{Role:this.state.Role}:{}}>
                        {function(data,change,getTrigger,putTrigger){
                            return (
                                <UserLogin Role={this.state.Role?this.state.Role:null} onUserOnly={this.deleteRole} UsernameOnly={false} onUserLoginAttempt={getTrigger}  onChange={change}/>
                            )
                        }.bind(this)}
                    </APIComponent>
            </div>

        );
    }
}



export default MultipleRoleLogin;