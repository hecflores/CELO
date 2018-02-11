import React from 'react';
import SectionHeader from '../Section/SectionHeader.jsx';
import APIComponent from '../Containers/APIComponent.jsx';
import DataInput from '../Containers/DataInput.jsx';
import CourseContent from '../CourseContent/CourseContent.jsx';
import SectionsAPI from "../../libaries/APIs/SectionsAPI.jsx";
import CourseTitle from '../Courses/CourseTitle.jsx';
import {SectionLoader, SectionLoaderIndicator} from '../Section/SectionLoader.jsx';
import {ButtonGroup,Button} from 'react-bootstrap';
import Loader from '../Containers/Loader.jsx';
import Layout from '../Template/Layout.jsx';
import UserRenderChooser from '../Users/UserRenderChooser.jsx';
import StaffLayoutTemplate from '../LayoutTemplates/StaffLayoutTemplate.jsx';
import SimpleContainer from '../Tools/SimpleContainer.jsx';
import CourseContentViabilityManager from '../CourseContent/CourseContentViabilityManager.jsx';
import CourseContentTabs from '../CourseContent/CourseContentTabs.jsx';
import SectionLink from '../Section/SectionLink.jsx';
import SectionUsers from './SectionUsers.jsx';
import {CourseContentGenericRenderDecider,ImportProperties,ImportPropertyTrueFalse} from '../CourseContent/CourseContentGenericRenderDecider.jsx';
import CourseInfo from '../Courses/CourseInfo.jsx';
import SectionToolBar from './SectionToolBar.jsx';
import SectionInfo from './SectionInfo.jsx';
import WidgetModule from '../Pages/WidgetModule.jsx';
import WidgetModules from '../Pages/WidgetModules.jsx';
class Section extends CourseContentGenericRenderDecider{
    static propTypes={
        SectionInfo:React.PropTypes.object,
        SectionID:React.PropTypes.number,
    };

    constructor(props)
    {
        super(props);
    }

    renderEditingMode()
    {
        return <div className="editing-section">
                        <SectionToolBar {...this.props} />


                        <CourseInfo {...this.props} Course={this.props.SectionInfo["Course"]}/>
                        <SectionInfo {...this.props}/>
               </div>
    }
    renderViewMode()
    {
        return <div className="editing-section">
                    <SectionToolBar {...this.props} />

            <CourseInfo {...this.props} Course={this.props.SectionInfo["Course"]}/>
            <SectionInfo {...this.props}/>
                </div>
    }
    renderSubmittingMode()
    {
        return <div className="editing-section">
            <SectionToolBar {...this.props} />
            <CourseInfo {...this.props} Course={this.props.SectionInfo["Course"]}/>
            <SectionInfo {...this.props}/>
        </div>
    }
    renderEditableMode()
    {
        return <div className="editing-section">
            <SectionToolBar {...this.props} />
            <CourseInfo {...this.props} Course={this.props.SectionInfo["Course"]}/>
            <SectionInfo {...this.props}/>

        </div>
    }


}



export default Section;