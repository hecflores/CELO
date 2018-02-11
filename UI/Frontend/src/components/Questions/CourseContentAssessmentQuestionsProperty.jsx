import React from 'react';
import QuestionsSelectionContainer from './QuestionsSelectionContainer.jsx';
import QuestionsTable from './QuestionsTable.jsx';
import GetQuestionsFromController from './GetQuestionsFromController.jsx';
import QuestionsController from './QuestionsController.jsx';
import CourseContentGenericRenderDecider from '../CourseContent/CourseContentGenericRenderDecider.jsx';
class CourseContentAssessmentQuestionsProperty extends CourseContentGenericRenderDecider{


    updateQuestions(data){
        this.props.onChange({AnswerableQuestionGroup:{Questions:data}});
    }

    foundQuestion(){
        try{
            let questions=this.state.Data["AnswerableQuestionGroup"]["Questions"];
            return questions?questions:[];
        }
        catch(e){

        }
        return [];
    }
    renderEditingMode(){
        let questions=this.foundQuestion();

        return <QuestionsController  Questions={questions}>
                  <GetQuestionsFromController GiveTo={QuestionsSelectionContainer} SelectedQuestions={questions} onSelectionChanged={this.updateQuestions.bind(this)}/>
               </QuestionsController>
    }

    renderViewMode(){
        let questions=this.foundQuestion();
        return <dl className={"course-content-property "}>
                    <dh>Questions</dh>
                    <dd>{questions.length} Questions</dd>
                </dl>
    }
    renderEditableMode(){
        let questions=this.foundQuestion();
        return <dl className={"course-content-property "}>
            <dh>Questions</dh>
            <dd>
                <QuestionsController Questions={questions}>
                    <GetQuestionsFromController GiveTo={QuestionsTable} />
                </QuestionsController>
            </dd>
        </dl>
    }
    renderSubmittingMode(){
        let questions=this.foundQuestion();
        return <dl className={"course-content-property "}>
            <dh>Questions</dh>
            <dd>{questions.length} Questions</dd>
        </dl>
    }

}

export default CourseContentAssessmentQuestionsProperty