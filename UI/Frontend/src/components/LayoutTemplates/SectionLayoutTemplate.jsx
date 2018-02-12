import React from 'react';
import LayoutTemplate from '../Template/LayoutTemplate.jsx';
import {LayoutLink,Layout} from '../Template/Layout.jsx';
import CELOLinkButton from '../Tools/CELOLinkButton.jsx';
import UserLayoutTemplate from './UserLayoutTemplate.jsx';
import CoursesBasicList from '../Courses/CoursesBasicList.jsx';
class  StaffLayoutTemplate extends LayoutTemplate
{

    render(){
        let {children,...rest}=this.props;
        return <Layout {...rest} Template={UserLayoutTemplate}>
            <Layout.Header>
                <CELOLinkButton  Enabled={true} to={"/portal/sections/"+this.props.SectionInfo+"/grades"}>Grades</CELOLinkButton>
                <CELOLinkButton  Enabled={false} to="/portal/questions">Questions</CELOLinkButton>
                <CELOLinkButton  Enabled={false} to="/portal/course-contents">Course Content Templates</CELOLinkButton>
                {this.getHeader()}
            </Layout.Header>
            <Layout.LeftSidePanel>
                <CoursesBasicList/>
            </Layout.LeftSidePanel>
        </Layout>

    }
}
export default StaffLayoutTemplate;