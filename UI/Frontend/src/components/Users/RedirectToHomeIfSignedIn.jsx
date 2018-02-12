import React from 'react';
import {browserHistory} from "react-router";
import LoadUser from './LoadUser.jsx';
class RedirectToHomeIfSignedIn extends  React.Component{


    constructor(props){
        super(props);
        this.redirect=this.redirect.bind(this);
    }
    redirect(){
        browserHistory.push("/portal");
    }
    render(){
        return  <LoadUser onUserFound={this.redirect}>
                    {this.props.children}
                </LoadUser>;
    }
}

export default RedirectToHomeIfSignedIn;