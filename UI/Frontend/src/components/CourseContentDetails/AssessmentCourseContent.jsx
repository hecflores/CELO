import React from 'react';
import {CourseContentGenericRenderDecider,ImportProperties,ImportPropertyTrueFalse} from '../CourseContent/CourseContentGenericRenderDecider.jsx';
import CourseContentTabs from '../CourseContent/CourseContentTabs.jsx';
import CourseContentAssessmentQuestionsProperty from '../Questions/CourseContentAssessmentQuestionsProperty.jsx';
import AnswerableQuestions from 'components/Questions/AnsweredQuestions/AnswerableQuestions.jsx';
import AssessmentAPI from 'libaries/APIs/AssessmentAPI.jsx';
import RunningAssessment from '../RunningAssessment/RunningAssessment.jsx';
import CELOButton from '../Tools/CELOButton.jsx';
import GradesLoader from '../Grades/GradesLoader.jsx';
import GradesTableSmall from '../Grades/GradesTableSmall.jsx';
import GradesContext from '../Grades/GradesContext.jsx';
import AssessmentStartButton from '../Assessments/AssessmentStartButton.jsx';
class AssessmentCourseContent extends CourseContentGenericRenderDecider{

    static propTypes={
        CourseContent:React.PropTypes.shape({
            Children:React.PropTypes.array,
            ContentID:React.PropTypes.number,
            CourseContentNumber:React.PropTypes.number,
            Depth:React.PropTypes.number,
            Description:React.PropTypes.string,
            Gradable:React.PropTypes.number,
            Name:React.PropTypes.string,
            ParentFolderID:React.PropTypes.number,
            Properties:React.PropTypes.object,
            RolesVisible:React.PropTypes.string,
            RootContentID:React.PropTypes.number,
            SectionID:React.PropTypes.number,
            Type:React.PropTypes.string,
            URL:React.PropTypes.string,
            Breadcrums:React.PropTypes.arrayOf(React.PropTypes.shape({
                Children:React.PropTypes.array,
                ContentID:React.PropTypes.number,
                CourseContentNumber:React.PropTypes.number,
                Depth:React.PropTypes.number,
                Description:React.PropTypes.string,
                Gradable:React.PropTypes.number,
                Name:React.PropTypes.string,
                ParentFolderID:React.PropTypes.number,
                Properties:React.PropTypes.object,
                RolesVisible:React.PropTypes.string,
                RootContentID:React.PropTypes.number,
                SectionID:React.PropTypes.number,
                Type:React.PropTypes.string,
                URL:React.PropTypes.string,
            })),
            AnsweringQuestionGroup:React.PropTypes.shape({
                AnswerableGroupID:React.PropTypes.number,
                AvailableOn:React.PropTypes.number,
                AvailableTo:React.PropTypes.number,
                Category:React.PropTypes.number,
                CourseContentID:React.PropTypes.number,
                CreatedBy:React.PropTypes.string,
                CreatedOn:React.PropTypes.string,
                Modified:React.PropTypes.bool,
                Timeallowed:React.PropTypes.number
            }),
            AnswerableQuestionGroup:React.PropTypes.object


        })
    }
    constructor(props){
        super(props);

        this.startAssessment=this.startAssessment.bind(this);
    }

    startAssessment(){
        AssessmentAPI.instance.initiate("start-assessment",
            {id:this.props.CourseContent.AnswerableQuestionGroup.AnswerableGroupID});
    }

    renderViewMode()
    {
        if(this.props.CourseContent.Properties.RunningAssessment){
            return <RunningAssessment RunningAssessment={this.props.CourseContent.AnsweringQuestionGroup}/>
        }

        return <div>
                     <div className="">
                         <div className="check-boxes-properties">
                             <ImportPropertyTrueFalse Title={"Make the link available"} Id={"available"} {...this.props}/>
                             <ImportPropertyTrueFalse Title={"Allow Multiple Attempts"} Id={"allowMultipleAttempts"} {...this.props}/>
                             <ImportPropertyTrueFalse Title={"Set Timer"} Id={"useTimer"} {...this.props}/>
                         </div>
                         <CourseContentAssessmentQuestionsProperty  {...this.props}/>
                         <div className="link-assessment-portal-container">
                             {!this.props.CourseContent["HasSubmission"] || (this.props.CourseContent["HasSubmission"] && this.props.CourseContent["Properties"]["allowMultipleAttempts"])
                                 ? <AssessmentStartButton AnswerableGroupID={this.props.CourseContent.AnswerableQuestionGroup.AnswerableGroupID}>
                                     <CELOButton TooltipText={"Will Start the Assessment"} Enabled={true} to={"/portal/assessments/"+this.props.CourseContent.AnswerableQuestionGroup.AnswerableGroupID}>Start New Submission</CELOButton>
                                 </AssessmentStartButton>
                                 : null}
                         </div>
                         <GradesLoader Filters={{ContentID:this.props.CourseContent.ContentID}}>
                             <GradesContext>
                                <GradesTableSmall/>
                             </GradesContext>
                         </GradesLoader>
                    </div>


               </div>
    }
    renderEditableMode()
    {
            return <div className="">
                <div className="check-boxes-properties">
                    <ImportPropertyTrueFalse Title={"Make the link available"} Id={"available"} {...this.props}/>
                    <ImportPropertyTrueFalse Title={"Allow Multiple Attempts"} Id={"allowMultipleAttempts"} {...this.props}/>
                    <ImportPropertyTrueFalse Title={"Set Timer"} Id={"useTimer"} {...this.props}/>
                </div>

                    <CourseContentAssessmentQuestionsProperty  {...this.props}/>
                </div>
    }
    renderEditingMode(){
        return <div className="">
            <div className="check-boxes-properties">
                <ImportPropertyTrueFalse Title={"Make the link available"} Id={"available"} {...this.props}/>
                <ImportPropertyTrueFalse Title={"Allow Multiple Attempts"} Id={"allowMultipleAttempts"} {...this.props}/>
                <ImportPropertyTrueFalse Title={"Set Timer"} Id={"useTimer"} {...this.props}/>
            </div>
                    <CourseContentAssessmentQuestionsProperty  {...this.props}/>
               </div>
    }
    render(){
        return  <div>

                    {super.render()}
                </div>
    }
}

export default AssessmentCourseContent