import QuestionSelection from './QuestionSelection.jsx';
import React from 'react';



class QuestionSelectionOneSelection extends QuestionSelection{


    selectionChanged(questions){
        this.setState({
            SelectedQuestion:questions[questions.length-1],
            SelectedQuestions:[questions[questions.length-1]],
            canSelect:questions.length>0
        },function(){
            this.props.onSelected(this.state.SelectedQuestions);
        }.bind(this));
    }
}
export default QuestionSelectionOneSelection;