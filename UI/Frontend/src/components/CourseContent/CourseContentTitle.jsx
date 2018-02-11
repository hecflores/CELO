import CourseContentIcon from './CourseContentIcon.jsx';
import React from 'react';
import CourseContentGenericRenderDecider from './CourseContentGenericRenderDecider.jsx';

class CourseContentTitle extends CourseContentGenericRenderDecider {


    renderViewMode() {
        return <div className="course-content-title">{this.props.CourseContent["Name"]}<CourseContentIcon {...this.props}/></div>;
    }
    renderEditableMode(){
        return this.renderViewMode();//  React.cloneElement((this.renderViewMode()),{onClick:this.setViewModeToEditing});
    }
    renderEditingMode(){
        return  <div className=" form-group ">
                    <label htmlFor="course-title">Title</label>
                    <input className={"form-control "+this.getChangesClass("Name")}
                           onChange={(e)=>{this.onChange({Name:e.target.value})}}
                           onBlur={this.onCommit} type="text" value={this.props.Data["Name"]}
                    />
                </div>
    }
    renderSubmittingMode(){
        return <div className="course-content-title">Setting...</div>;
    }
}

export default CourseContentTitle