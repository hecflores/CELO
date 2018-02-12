import React from 'react';
import RunningAssessmentAPI from '../../libaries/APIs/RunningAssessmentAPI.jsx';
class RunningAssessmentProgressBar extends React.Component{

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
    onClickedQuestion(questionIndex)
    {
        this.props.onQuestionClicked(questionIndex);
    }

    render(){

        return null;

        // return <div className="running-assessment-progress-bar">
        //     {(function(){
        //
        //         return <div className="progress-bar-container">
        //             <div className="minimum-possible-score" style={{transition:"all 500ms", width:this.props.RunningAssessment.MinPossibleScore+"%"}}><span>{Math.floor(this.props.RunningAssessment.MinPossibleScore)}</span></div>
        //                    <div className="average-possible-score" style={{transition:"all 500ms", width:this.props.RunningAssessment.AveragePossibleScore+"%"}}><span>{Math.floor(this.props.RunningAssessment.AveragePossibleScore)}</span></div>
        //                    <div className="maximum-possible-score" style={{transition:"all 500ms", width:this.props.RunningAssessment.MaxPossibleScore+"%"}}><span>{Math.floor(this.props.RunningAssessment.MaxPossibleScore)}</span></div>
        //                    <div className="actual-score" style={{transition:"all 500ms", width:this.props.RunningAssessment.Grade+"%"}}><span>{Math.floor(this.props.RunningAssessment.Grade)}</span></div>
        //             <div className="f-score" style={{transition:"all 500ms", width:"60%"}}><span>F</span></div>
        //             {this.props.RunningAssessment.MaxPossibleScore>=60?
        //                    <div className="d-score" style={{transition:"all 500ms", width:"10%",left:"60%"}}><span>C</span></div>:null}
        //             {this.props.RunningAssessment.MaxPossibleScore>=70?
        //                    <div className="c-score" style={{transition:"all 500ms", width:"10%",left:"70%"}}><span>D</span></div>:null}
        //             {this.props.RunningAssessment.MaxPossibleScore>=80?
        //                    <div className="b-score" style={{transition:"all 500ms", width:"10%",left:"80%"}}><span>B</span></div>:null}
        //             {this.props.RunningAssessment.MaxPossibleScore>=90?
        //                    <div className="a-score" style={{transition:"all 500ms", width:"10%",left:"90%"}}><span>A</span></div>:null}
        //                </div>
        //
        //     }.bind(this))()}
        // </div>
    }


}
export  default  RunningAssessmentProgressBar