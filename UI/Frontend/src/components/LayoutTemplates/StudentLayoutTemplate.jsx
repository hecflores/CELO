import React from 'react';
import LayoutTemplate from '../Template/LayoutTemplate.jsx';
import {LayoutLink,Layout} from '../Template/Layout.jsx';
import UserLayoutTemplate from './UserLayoutTemplate.jsx';
import CoursesBasicList from '../Courses/CoursesBasicList.jsx';

/**
 * @deprecated Not Used Any More...
 */
class  StudentLayoutTemplate extends LayoutTemplate
{

    render(){
        let {children,...rest}=this.props;
        return <Layout {...rest} Template={UserLayoutTemplate}>
            <Layout.Header>
                <LayoutLink to="/portal/courses">Sections</LayoutLink>
                <LayoutLink to="/portal/course-contents">Course Content Templates</LayoutLink>
                {this.getHeader()}
            </Layout.Header>
            <Layout.LeftSidePanel>
                {this.getLeftSidePanel()}
                <CoursesBasicList/>
            </Layout.LeftSidePanel>
        </Layout>

    }
}
export default StudentLayoutTemplate;