import React from 'react';
import LayoutTemplate from '../Template/LayoutTemplate.jsx';
import {LayoutLink,Layout} from '../Template/Layout.jsx';
import SimpleContainer from '../Tools/SimpleContainer.jsx';
import CourseContentIconImages from '../CourseContent/CourseContentIcon/Images/CourseContentIconImages.jsx';
class RootLayoutTemplate extends LayoutTemplate
{

    render(){
        let {children,...rest}=this.props;
        return <Layout {...rest}>
                    <Layout.Header>
                            {CourseContentIconImages.MainLogo}
                            {this.getHeader()}
                    </Layout.Header>
                    <Layout.Body>

                            {this.getBody()}

                    </Layout.Body>
                    <Layout.LeftSidePanel>
                            <SimpleContainer>
                                <div className="page-title">{this.props.PageTitle}</div>
                            </SimpleContainer>
                            {this.getLeftSidePanel()}

                    </Layout.LeftSidePanel>
                    <Layout.RightSidePanel>

                            {this.getRightSidePanel()}

                    </Layout.RightSidePanel>
                    <Layout.Footer>

                            {this.getFooter()}

                    </Layout.Footer>
               </Layout>
    }
}
export default RootLayoutTemplate;