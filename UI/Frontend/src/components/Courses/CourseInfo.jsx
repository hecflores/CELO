import React from 'react';
import {CourseContentGenericRenderDecider,EditableField} from '../CourseContent/CourseContentGenericRenderDecider.jsx';

class CourseInfo extends CourseContentGenericRenderDecider
{
    static propTypes={
        Course:React.PropTypes.object
    };

    renderEditingMode(){
        return <div className="editing-course">
                  <EditableField Id={"Course.CourseCategory"} Title="Course Category"/>
               </div>;
    }
    renderSubmittingMode(){
        return <div className="submitting-course">
            <EditableField Id={"Course.CourseCategory"} Title="Course Category"/>
        </div>;
    }
    renderViewMode(){
        return <div className="view-course">
            <EditableField Id={"Course.CourseCategory"} Title="Course Category"/>
        </div>;
    }
    renderEditableMode(){
        return <div className="editable-course">
                <EditableField Id={"Course.CourseCategory"} Title="Course Category"/>
            </div>;
    }
    render(){
        return <div className="editable-course">
                    <EditableField Id={"Course.CourseCategory"} Title="Course Category" {...this.props}/>
                    <EditableField Id={"Course.CourseName"} Title="Course Category" {...this.props}/>
                    <EditableField Id={"Course.CourseID"} Title="Course ID" {...this.props}/>
                    <EditableField Id={"Course.Description"} Title="Course Description" {...this.props}/>
                </div>;
    }


}
export default CourseInfo