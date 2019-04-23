import React from 'react';
import {ImportPropertyTrueFalse,CourseContentGenericRenderDecider} from '../CourseContent/CourseContentGenericRenderDecider.jsx';
import CourseContentAssessmentQuestionsProperty from '../Questions/CourseContentAssessmentQuestionsProperty.jsx';
import CELOButton from '../Tools/CELOButton.jsx';
import AssessmentStartButton from './AssessmentStartButton.jsx';
class AssessmentInfo extends CourseContentGenericRenderDecider{

    renderSubmittingMode(){

    }
    renderEditableMode(){
        return <div className="">

            <ImportPropertyTrueFalse Title={"Makes the link available"} Id={"available"} {...this.props}/>
            <ImportPropertyTrueFalse Title={"Add a new announcement for this test"} Id={"announcement"} {...this.props}/>
            <ImportPropertyTrueFalse Title={"Force Completion"} Id={"forceCompletion"} {...this.props}/>
            <ImportPropertyTrueFalse Title={"Allow Multiple Attempts"} Id={"allowMultipleAttempts"} {...this.props}/>
            <ImportPropertyTrueFalse Title={"Set Timer"} Id={"useTimer"} {...this.props}/>
            <CourseContentAssessmentQuestionsProperty  {...this.props}/>
            <AssessmentStartButton AnswerableGroupID={this.props.CourseContent.AnswerableQuestionGroup.AnswerableGroupID}/>
        </div>
    }
    renderViewMode(){
        if(this.props.CourseContent.AnsweringQuestionGroup)
        {
            return <RunningAssessment RunningAssessment={this.props.CourseContent.AnsweringQuestionGroup}/>
        }

        return <div className="assessment-info-for-running-view">
                    <ImportPropertyTrueFalse Title={"Make the link available"} Id={"available"} {...this.props}/>
                    <ImportPropertyTrueFalse Title={"Add a new announcement for this test"} Id={"announcement"} {...this.props}/>
                    <ImportPropertyTrueFalse Title={"Force Completion"} Id={"forceCompletion"} {...this.props}/>
                    <ImportPropertyTrueFalse Title={"Allow Multiple Attempts"} Id={"allowMultipleAttempts"} {...this.props}/>
                    <ImportPropertyTrueFalse Title={"Set Timer"} Id={"useTimer"} {...this.props}/>
                    <CourseContentAssessmentQuestionsProperty  {...this.props}/>

                </div>
    }
    renderEditingMode(){
        return <div className="">
                    <ImportPropertyTrueFalse Title={"Make the link available"} Id={"available"} {...this.props}/>
                    <ImportPropertyTrueFalse Title={"Add a new announcement for this test"} Id={"announcement"} {...this.props}/>
                    <ImportPropertyTrueFalse Title={"Force Completion"} Id={"forceCompletion"} {...this.props}/>
                    <ImportPropertyTrueFalse Title={"Allow Multiple Attempts"} Id={"allowMultipleAttempts"} {...this.props}/>
                    <ImportPropertyTrueFalse Title={"Set Timer"} Id={"useTimer"} {...this.props}/>
                    <CourseContentAssessmentQuestionsProperty  {...this.props}/>
                </div>
    }
}

export default AssessmentInfo