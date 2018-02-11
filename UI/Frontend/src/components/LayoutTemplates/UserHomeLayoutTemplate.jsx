import React from 'react';
import LayoutTemplate from '../Template/LayoutTemplate.jsx';
import {LayoutLink,Layout} from '../Template/Layout.jsx';
import RootLayoutTemplate from './RootLayoutTemplate.jsx';
import CELOLinkButton from '../Tools/CELOLinkButton.jsx';
class UserHomeLayoutTemplate extends LayoutTemplate
{

    render(){
        let {children,...rest}=this.props;
        return <Layout {...rest} Template={RootLayoutTemplate}>
            <Layout.Header>
                    <CELOLinkButton TooltipText="Home Page" TooltipDirection={"bottom"} to="/portal">Home</CELOLinkButton>
                    {this.getHeader()}
            </Layout.Header>
        </Layout>

    }
}
export default UserHomeLayoutTemplate;