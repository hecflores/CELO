import React from 'react';
import LayoutTemplate from '../Template/LayoutTemplate.jsx';
import {LayoutLink,Layout} from '../Template/Layout.jsx';
import UserHomeLayoutTemplate from './UserHomeLayoutTemplate.jsx';
import UserProfileWidget from '../Users/UserProfileWidget.jsx';
class UserLayoutTemplate extends LayoutTemplate
{

    render(){
        let {children,...rest}=this.props;
        return <Layout {...rest} Template={UserHomeLayoutTemplate}>
            <Layout.Header>
                    {this.getHeader()}
                    <UserProfileWidget/>
            </Layout.Header>
        </Layout>

    }
}
export default UserLayoutTemplate;