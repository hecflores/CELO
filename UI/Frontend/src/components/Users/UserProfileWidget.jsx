import React from 'react';
import UserAPI from '../../libaries/APIs/UserAPI.jsx';
import {browserHistory} from 'react-router';
import {Button,ButtonGroup,DropdownButton,MenuItem} from 'react-bootstrap';

class UserProfileWidget extends React.Component
{
    static contextTypes={
        UserInfo:React.PropTypes.object
    };

    state={
        DropdownOpen:false
    };
    constructor(props){
        super(props);

        this.logout=this.logout.bind(this);

        this.apiHook=UserAPI.instance.hook().on("logout",function(){
            browserHistory.push("/login");
        }.bind(this));
    }
    logout(){
        UserAPI.instance.initiate("logout");
    }
    componentDidMount(){
        this.apiHook.open();
    }
    componentWillUnmount(){
        this.apiHook.close();
    }
    render(){

        return <div className="user-profile">
                    <div className="user-button">
                        <Button onBlur={()=>{this.setState({DropdownOpen:true})}} onClick={()=>{this.setState({DropdownOpen:!this.state.DropdownOpen})}}>
                            <div className="user-icon">
                                <i className="fa fa-user-circle"/>
                            </div>
                            <div className="user-role">
                                Welcome, {this.context.UserInfo.FirstName}
                            </div>
                        </Button>
                    </div>
                    {this.state.DropdownOpen?
                            <div className="user-menu">
                                <ButtonGroup vertical>
                                    <Button onClick={this.logout} >Logout</Button>

                                </ButtonGroup>
                            </div>:null}

                </div>


    }
}

export  default UserProfileWidget