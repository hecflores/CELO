import React from 'react';
import LayoutTemplate from '../Template/LayoutTemplate.jsx';
import {LayoutLink,Layout} from '../Template/Layout.jsx';
import RootLayoutTemplate from './RootLayoutTemplate.jsx';
import SimpleContainer from '../Tools/SimpleContainer.jsx';
import CELOLinkButton from '../Tools/CELOLinkButton.jsx';
class GuestLayoutTemplate extends LayoutTemplate
{

    render(){
        let {children,...rest}=this.props;
        return <Layout {...rest} Template={RootLayoutTemplate}>
                    <Layout.Header>
                        <CELOLinkButton TooltipText={"Home Page"} Enabled={true} TooltipDirection={"bottom"} to="/">Home</CELOLinkButton>
                        <CELOLinkButton TooltipText={"Register Page"} TooltipDirection={"bottom"} to="/register">Register</CELOLinkButton>
                        <CELOLinkButton TooltipText={"Login Page"} TooltipDirection={"bottom"} to="/login">Login</CELOLinkButton>
                        {this.getHeader()}
                    </Layout.Header>
                    <Layout.LeftSidePanel>
                        {this.getLeftSidePanel()}
                        <CELOLinkButton TooltipText={"Home Page"} Enabled={true} TooltipDirection={"right"}  to="/">Home</CELOLinkButton>
                        <CELOLinkButton TooltipText={"Register Page"} TooltipDirection={"right"} to="/register">Register</CELOLinkButton>
                        <CELOLinkButton TooltipText={"Login Page"} TooltipDirection={"right"} to="/login">Login</CELOLinkButton>

                    </Layout.LeftSidePanel>
                </Layout>

    }
}
export default GuestLayoutTemplate;