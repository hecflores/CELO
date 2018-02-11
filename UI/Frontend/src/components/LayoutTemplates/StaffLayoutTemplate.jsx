import React from 'react';
import LayoutTemplate from '../Template/LayoutTemplate.jsx';
import {LayoutLink,Layout} from '../Template/Layout.jsx';
import UserLayoutTemplate from './UserLayoutTemplate.jsx';
import CoursesBasicList from '../Courses/CoursesBasicList.jsx';
import CELOLinkButton from '../Tools/CELOLinkButton.jsx';
import UserAuthenticator from '../Users/UserAuthenticator.jsx';
class  StaffLayoutTemplate extends LayoutTemplate
{

    static contextTypes={
        UserAuthenticator:React.PropTypes.instanceOf(UserAuthenticator)
    };
    render(){
        let {children,...rest}=this.props;
        return <Layout {...rest} Template={UserLayoutTemplate}>
            <Layout.Header>
                    {this.context.UserAuthenticator.isStaff()?<CELOLinkButton TooltipText={"Add/View Questions"} TooltipDirection={"bottom"} Enabled={true} to="/portal/questions">Questions</CELOLinkButton>:null}
                    {this.getHeader()}
            </Layout.Header>
            <Layout.LeftSidePanel>
                {this.getLeftSidePanel()}
                <CoursesBasicList/>
            </Layout.LeftSidePanel>
        </Layout>

    }
}
export default StaffLayoutTemplate;