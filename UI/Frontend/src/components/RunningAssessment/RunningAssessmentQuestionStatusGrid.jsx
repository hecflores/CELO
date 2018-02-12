import React from 'react';



class RunningAssessmentQuestionStatusGrid extends React.Component{
    static defaultProps={
        onQuestionClicked:function(){}
    };
    static propTypes={
        RunningAssessment:React.PropTypes.object,
        onQuestionClicked:React.PropTypes.func

    };
    state={

    };

    constructor(props){
        super(props);

        this.onClickedQuestion=this.onClickedQuestion.bind(this);
    }
    onClickedQuestion(questionIndex){
        this.props.onQuestionClicked(questionIndex);
    }

    render(){
        return <div className="running-assessment-question-status">
                {this.props.RunningAssessment.QuestionStatus.map(function(status,index){
                    let element=<div key={index} className="question-status-item" onClick={()=>{this.onClickedQuestion(index)}}>{(index+1)}</div>;

                    if(status=="UNSEEN"){
                        element=React.cloneElement(element,{className:"question-status-item unseen"});
                    }
                    else if(this.props.RunningAssessment.Questions[index].IsCorrect){
                        element=React.cloneElement(element,{className:"question-status-item correct"});

                    }
                    else {
                        element = React.cloneElement(element, {className: "question-status-item in-correct"});
                    }
                    return element;


                }.bind(this))}
               </div>
    }
}


export default RunningAssessmentQuestionStatusGrid;