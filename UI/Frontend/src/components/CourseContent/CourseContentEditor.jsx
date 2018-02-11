import React from 'react';
import CourseContent from './CourseContent.jsx';
import CourseContentGenericRenderDecider from './CourseContentGenericRenderDecider.jsx';

import CourseContentCreationMenu from './CourseContentCreationMenu.jsx';
import CELOButton from '../Tools/CELOButton.jsx';
class CourseContentEditor extends CourseContentGenericRenderDecider
{

    constructor(props){
        super(props);
    }
    renderEditableMode()
    {
        return (
            <div className="course-content-editor">
                <div className="course-content-editor-tools">
                    <CourseContentCreationMenu {...this.props}/>
                    <div onClick={this.setViewModeToEditing} className="add-btn btn btn-success">Edit</div>
                </div>
            </div>);
    }
    renderSubmittingMode(){
        return null;
    }
    renderViewMode(){
        return (null);
    }
    renderEditingMode(){
        return (
            <div className="course-content-editor">
                <div className="course-content-editor-tools">
                    <CELOButton Enabled={true} TooltipDirection={"bottom"} TooltipText={"Edit this Course Content"} onClick={this.setViewModeToEditable} className="add-btn btn btn-success">Done</CELOButton>
                    <div onClick={this.props.onSave} className="add-btn btn btn-success">Save</div>
                </div>
            </div>);
    }

}
CourseContentEditor.propTypes={
    CourseContentID:React.PropTypes.number.isRequired,
    CourseContent:React.PropTypes.object
};

export default CourseContentEditor