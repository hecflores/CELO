import React from 'react';
import UserContext from '../Users/UserContext.jsx';
import Layout from '../Template/Layout.jsx';
import {LayoutLink}  from '../Template/Layout.jsx';
import UserMainPage from './UserMainPage.jsx';
class UserPage extends React.Component
{
    static childContextTypes = {
        refresh:React.PropTypes.func
    };
    getChildContext() {
        return {
                refresh:()=>this.forceUpdate()
                };
    }


    render(){
        return <UserContext>
                    <UserMainPage>
                        {this.props.children}
                    </UserMainPage>
                </UserContext>

    }
}

export  default  UserPage;

