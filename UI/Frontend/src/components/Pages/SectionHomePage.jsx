import React from 'react';
import $ from 'jquery';
import SectionHeader from '../Section/SectionHeader.jsx';
import DataInput from '../Containers/DataInput.jsx';
import CourseContentAPI from "../../libaries/APIs/CourseContentAPI.jsx";
import {ButtonGroup,Button} from 'react-bootstrap';
import Loader from '../Containers/Loader.jsx';
import Layout from '../Template/Layout.jsx';
import Section from '../Section/Section.jsx';
import {SectionLoader, SectionLoaderIndicator} from '../Section/SectionLoader.jsx';
import SectionSaver from '../Section/SectionSaver.jsx';
import StaffLayoutTemplate from '../LayoutTemplates/StaffLayoutTemplate.jsx';
import CourseContent from '../CourseContent/CourseContent.jsx';
import CourseContentGenericRenderDecider from '../CourseContent/CourseContentGenericRenderDecider.jsx';
import SectionLink from '../Section/SectionLink.jsx';
import SimpleContainer from '../Tools/SimpleContainer.jsx';
import CourseContentTabs from '../CourseContent/CourseContentTabs.jsx';
import CourseContentViabilityManager from '../CourseContent/CourseContentViabilityManager.jsx';
import CELOLinkButton from '../Tools/CELOLinkButton.jsx';
import CourseContentTemplateSaver from '../CourseContent/CourseContentTemplateSaver.jsx';
class SectionHomePage extends CourseContentGenericRenderDecider
{
    static contextTypes = {
        UserInfo:React.PropTypes.object
    };


    constructor(props)
    {
        super(props);
    }

    renderEditableMode(){
        let {children, ...rest}=this.props;
        return  <div className="course-content-root">
                    <CourseContentTabs CourseContent={this.props.SectionInfo.CourseContent} CourseContentID={this.props.SectionInfo.MainCourseContentID} {...rest}/>
                    <CourseContentTemplateSaver CourseContent={this.props.SectionInfo.CourseContent}/>
                </div>
    }
    renderViewMode(){
        let {children, ...rest}=this.props;
        return  <div className="course-content-root">
                    <CourseContentTabs CourseContent={this.props.SectionInfo.CourseContent} CourseContentID={this.props.SectionInfo.MainCourseContentID} {...rest}/>
                    <CourseContentTemplateSaver CourseContent={this.props.SectionInfo.CourseContent}/>
                </div>
    }
    renderSubmittingMode(){
        let {children, ...rest}=this.props;
        return  <div className="course-content-root">
                    <CourseContentTabs CourseContent={this.props.SectionInfo.CourseContent} CourseContentID={this.props.SectionInfo.MainCourseContentID} {...rest}/>
                    <CourseContentTemplateSaver CourseContent={this.props.SectionInfo.CourseContent}/>
                </div>
    }
    renderEditingMode(){
        let {children, ...rest}=this.props;
        return  <div className="course-content-root">
                    <CourseContentTabs CourseContent={this.props.SectionInfo.CourseContent} CourseContentID={this.props.SectionInfo.MainCourseContentID} {...rest}/>
                    <CourseContentTemplateSaver CourseContent={this.props.SectionInfo.CourseContent}/>
                </div>
    }

    render(){
        if(typeof this.props.SectionInfo == "undefined"){
            return <SectionSaver SectionID={parseInt(this.props.params.sectionID)} Recursive="true">
                        <SectionHomePage {...this.props}/>
                   </SectionSaver>
        }
        let {children, ...rest}=this.props;
        return <CourseContentViabilityManager>
            <Layout  PageTitle={<SectionLink TooltipDirection="right" TooltipText={"Go To Course Home Page"} SectionInfo={this.props.SectionInfo}>{this.props.SectionInfo.Course.CourseCategory+" "+this.props.SectionInfo.Course.CourseID}</SectionLink> } Template={StaffLayoutTemplate} className={"section-root-container"} {...rest}>
                <Layout.Header>
                    <CELOLinkButton TooltipText="Grades Page" TooltipDirection="bottom" Enabled={true} to={"/portal/section/"+this.props.SectionID+"/grades"}>Grades</CELOLinkButton>
                </Layout.Header>
                <Layout.LeftSidePanel className="">
                    <SimpleContainer>
                        <div className="course-content-root">
                        <CourseContentTabs CourseContent={this.props.SectionInfo.CourseContent} CourseContentID={this.props.SectionInfo.MainCourseContentID} {...rest}/>
                       {this.context.UserInfo.Role!="Student"?<CourseContentTemplateSaver CourseContent={this.props.SectionInfo.CourseContent}/>:null}
                    </div>
                    </SimpleContainer>
                </Layout.LeftSidePanel>
                <Layout.Body className="section-current-course-content">
                    {React.Children.count(this.props.children)==0?
                        <Section {...rest}/>:
                        <SimpleContainer>
                            <div className="section-course-content-body-container">
                                {React.cloneElement(this.props.children,{...rest})}
                            </div>
                        </SimpleContainer>
                    }
                </Layout.Body>
            </Layout></CourseContentViabilityManager>
    }

}


export default SectionHomePage