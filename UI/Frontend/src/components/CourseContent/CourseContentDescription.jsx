import React from 'react';
import CourseContentGenericRenderDecider from './CourseContentGenericRenderDecider.jsx';
class CourseContentDescription extends CourseContentGenericRenderDecider{
    renderEditingMode(){
        return <div className=" form-group ">
            <label htmlFor="course-title">Description</label>
            <input className={"form-control "+this.getChangesClass("Description")}
                   onChange={(e)=>{this.onChange({Description:e.target.value})}}
                   onBlur={this.onCommit} type="text" value={this.props.Data["Description"]}
            />
        </div>
    }
    renderEditableMode() {
        return this.renderViewMode();
    }
    renderSubmittingMode() {
        return null;
    }
    renderViewMode(){
        return <div className="course-content-description" dangerouslySetInnerHTML={{__html: this.props.CourseContent["Description"]}}/>
    }
}

export default CourseContentDescription