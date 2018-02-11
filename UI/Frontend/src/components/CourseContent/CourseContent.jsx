import React from 'react';
import CourseContentTitle from './CourseContentTitle.jsx';
import CourseContentDescription from './CourseContentDescription.jsx';
import CourseContentTabs from './CourseContentTabs.jsx';
import CourseContentChildTabs from './CourseContentChildTabs.jsx';

import {ImportProperties,CourseContentGenericRenderDecider} from './CourseContentGenericRenderDecider.jsx';
import CourseContentEditor from './CourseContentEditor.jsx';

import CourseContentDetails from '../CourseContentDetails/CourseContentDetails.jsx';
import CourseContentBreadcrums from '../CourseContent/CourseContentBreadcrums.jsx';

class CourseContent extends CourseContentGenericRenderDecider
{
    static propTypes={
        CourseContentID:React.PropTypes.number,
        CourseContent:React.PropTypes.object
    };

    constructor(props)
    {
        super(props);
    }

    renderSubmittingMode()
    {
        return this.renderViewMode();
    }
    renderViewMode()
    {
        return (<div className={"course-content-root section-current-course-content type-" + this.props.CourseContent.Type}>
                    <CourseContentEditor {...this.props}/>
                    <CourseContentBreadcrums {...this.props}/>
                    <CourseContentTitle {...this.props}/>
                    <CourseContentDescription {...this.props}/>
                    <ImportProperties Id={"Notes"} Title={"Notes"} {...this.props}/>
                    <div className="course-content-details-main-container">
                        <CourseContentChildTabs {...this.props}/>
                        <CourseContentDetails {...this.props}/>
                    </div>
                </div>);
    }
    renderEditableMode()
    {
        return this.renderViewMode();
    }
    renderEditingMode()
    {
        return (<div className="course-content-root-editing  section-current-course-content">
                    <CourseContentEditor {...this.props}/>
                    <CourseContentBreadcrums {...this.props}/>
                    <CourseContentTitle {...this.props}/>
                    <CourseContentDescription {...this.props}/>
                    <ImportProperties Id={"Notes"} Title={"Notes"} CustomElement={<textarea/>} {...this.props}/>
                    <CourseContentDetails {...this.props}/>
                </div>);
    }
    // render(){
    //     return (<div className="course-content-root">
    //                 <CourseContentEditor {...this.props}/>
    //                 <CourseContentTitle {...this.props}/>
    //                 <CourseContentDescription {...this.props}/>
    //                 <CourseContentDetails {...this.props}/>
    //                 <ImportProperties Id={"Notes"} Title={"Notes"} CustomElement={<textarea/>} {...this.props}/>
    //             </div>);
    // }
}


export default CourseContent