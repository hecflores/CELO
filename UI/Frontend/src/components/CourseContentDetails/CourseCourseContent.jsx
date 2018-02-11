import React from 'react';
import {CourseContentGenericRenderDecider,ImportProperties,ImportPropertyTrueFalse} from '../CourseContent/CourseContentGenericRenderDecider.jsx';
import CourseContentTabs from '../CourseContent/CourseContentTabs.jsx';
import CourseContentTitle from '../CourseContent/CourseContentTitle.jsx';
import CourseContentDescription from '../CourseContent/CourseContentDescription.jsx';
class CourseCourseContent extends CourseContentGenericRenderDecider{

    constructor(props){
        super(props);

    }

    renderViewMode()
    {
        return <div>
            
            <CourseContentTabs {...this.props} />
        </div>
    }
    renderEditableMode(){
        return <div>
            <CourseContentTabs {...this.props} />
        </div>
    }
    renderEditingMode(){
        return <div>
            <CourseContentTabs {...this.props} />
        </div>
    }



}

export default CourseCourseContent