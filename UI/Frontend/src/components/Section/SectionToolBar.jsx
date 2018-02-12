import React from 'react';
import CourseContentGenericRenderDecider from '../CourseContent/CourseContentGenericRenderDecider.jsx';
import CELOLinkButton from '../Tools/CELOLinkButton.jsx';

class SectionToolBar extends CourseContentGenericRenderDecider
{

    constructor(props){
        super(props);
    }
    renderEditableMode()
    {
        return (
            <div className="course-content-editor">
                <div className="course-content-editor-tools">
                    
                    <CELOLinkButton className="pull-left" TooltipText={"See Class Material"} TooltipDirection={"left"} Enabled={true} to={"/portal/section/"+this.props.SectionInfo["SectionID"]+"/course-content"}>Course Content</CELOLinkButton>
                    <div onClick={this.setViewModeToView} className="add-btn btn btn-success">View</div>
                    <div onClick={this.setViewModeToEditing} className="add-btn btn btn-success">Edit</div>
                </div>
            </div>);
    }
    renderSubmittingMode(){
        return <div className="course-content-editor">
            <div className="course-content-editor-tools">
                <CELOLinkButton className="pull-left" TooltipText={"See Class Material"} TooltipDirection={"left"} Enabled={true} to={"/portal/section/"+this.props.SectionInfo["SectionID"]+"/course-content"}>Course Content</CELOLinkButton>

            </div>
        </div>
    }
    renderViewMode(){
        return <div className="course-content-editor">
            <div className="course-content-editor-tools">
                <CELOLinkButton className="pull-left" TooltipText={"See Class Material"}  TooltipDirection={"left"} Enabled={true} to={"/portal/section/"+this.props.SectionInfo["SectionID"]+"/course-content"}>Course Content</CELOLinkButton>
                <CELOLinkButton className="pull-left" TooltipText={"Course Home Page"}  TooltipDirection={"top"} Enabled={true} to={"/portal"}>All Courses</CELOLinkButton>

            </div>
        </div>
    }
    renderEditingMode(){
        return (
            <div className="course-content-editor">
                <div className="course-content-editor-tools">
                    <CELOLinkButton className="pull-left" TooltipText={"See Class Material"} TooltipDirection={"left"} Enabled={true} to={"/portal/section/"+this.props.SectionInfo["SectionID"]+"/course-content"}>Course Content</CELOLinkButton>
                    <div onClick={this.setViewModeToView} className="add-btn btn btn-success">View</div>
                    <div onClick={this.setViewModeToEditable} className="add-btn btn btn-success">Done</div>
                    <div onClick={this.props.onSave} className="add-btn btn btn-success">Save</div>
                </div>
            </div>);
    }

}

export default SectionToolBar