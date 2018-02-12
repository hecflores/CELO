import React from 'react';
import CourseContentGenericRenderDecider from '../CourseContent/CourseContentGenericRenderDecider.jsx';
import CourseContentTabs from '../CourseContent/CourseContentTabs.jsx';
import CourseContentTitle from '../CourseContent/CourseContentTitle.jsx';
import CourseContentDescription from '../CourseContent/CourseContentDescription.jsx';

class WeekCourseContent extends CourseContentGenericRenderDecider{

    renderEditableMode(){
        return  <CourseContentTabs {...this.props}/>
    }
    renderEditingMode(){
        return null;// <CourseContentTabs {...this.props}/>
    }
    renderViewMode(){
        return  <CourseContentTabs {...this.props} />
    }
    renderSubmittingMode(){
        return null;// <CourseContentTabs {...this.props}/>
    }
}

export default WeekCourseContent