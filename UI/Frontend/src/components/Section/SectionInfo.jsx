import React from 'react';
import {ImportDate,CourseContentGenericRenderDecider,EditableField,ImportProperties,ImportPropertyTrueFalse} from '../CourseContent/CourseContentGenericRenderDecider.jsx';
import SectionUsers from './SectionUsers.jsx';
class SectionInfo extends CourseContentGenericRenderDecider
{
    static propTypes={
        SectionInfo:React.PropTypes.object
    };

    renderEditingMode(){
        return <div className="editing-section">
                    <EditableField Id={"SectionInfo.SectionNumber"} Title="Section Number"/>
                </div>;
    }
    renderSubmittingMode(){
        return <div className="editing-section">
            <EditableField Id={"SectionInfo.SectionNumber"} Title="Section Number"/>
        </div>;
    }
    renderViewMode(){
        return <div className="view-section">
                        <EditableField Id={"SectionInfo.SectionNumber"} Title="Section Number"/>
                        </div>;
    }
    renderEditableMode(){
        return<div className="editing-section">
            <EditableField Id={"SectionInfo.SectionNumber"} Title="Section Number"/>
        </div>;
    }
    render() {
        //final-fix The Section info is not being shown for students... Fix Immediately


        return <div><div className="editing-section-info">
            <EditableField Id={"SectionNumber"} Title="Section Number" {...this.props}/>
            <EditableField Id={"TextBookInformation"} Title="Textbook Info"  {...this.props}/>
            <ImportDate Id={"StartDate"} Title="Start Date" CustomElement={<input type="date"/>}  {...this.props}/>
            <ImportDate Id={"StartDate"} Title="End Date" CustomElement={<input type="date"/>}  {...this.props}/>
            <EditableField Id={"Location"} Title="Textbook Info"  {...this.props}/>
            </div><SectionUsers {...this.props}/></div>
    }

}
export default SectionInfo