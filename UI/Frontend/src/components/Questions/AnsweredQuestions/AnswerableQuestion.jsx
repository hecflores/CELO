import React from 'react';
import $ from 'jquery';
import APIComponent from '../../Containers/APIComponent.jsx';
import DataInput from '../../Containers/DataInput.jsx';
import CoursesAPI from "../../../libaries/APIs/CoursesAPI.jsx";
import {ButtonGroup,Button} from 'react-bootstrap';
import Loader from '../../Containers/Loader.jsx';

import QuestionTypes from '../../QuestionTypes/*.jsx';
import QuestionAPI from '../../../libaries/APIs/QuestionsAPI.jsx';

class AnswerableQuestion extends React.Component
{
    static propTypes=
        {
            onLoadStarted:React.PropTypes.func,
            onLoadFinished:React.PropTypes.func,
            onIsLocked:React.PropTypes.func,
            onIsUnAnswered:React.PropTypes.func,
            onAnswered:React.PropTypes.func,
            onAnswerFinished:React.PropTypes.func,
            AnswerableQuestion:React.PropTypes.object.isRequired,
            Index:React.PropTypes.number.isRequired,
            onGetDom:React.PropTypes.func
        };
    static defaultProps={
        onGetDom:function(){},
        onAnswered:function(answer){

        },
        onLoadStarted:function(answer){

        },
        onLoadFinished:function(answer){

        },
        onIsLocked:function(answer){

        },
        onIsUnAnswered:function(answer){

        },
        onAnswerFinished:function(answer){

        }
    };


    constructor(props) {
        super(props);

        this.Important=function(){
            return {Question:this.props.AnswerableQuestion,Index:this.props.Index};
        }.bind(this);


    }
    componentWillMount(){
        this.setState({
            ...this.props
        })
    }
    componentWillReceiveProps(props){
        this.setState({
            ...props
        })
    }
    componentWillUnmount()
    {

    }
    componentDidMount()
    {
    }
    answerTheQuestion(answer)
    {

        this.props.onAnswered(this.state.AnswerableQuestion.AnswerableID,answer);
        QuestionAPI.instance.initiate("answer-question",{html:"<div>Not Implmented Yet</div>",AnswerableGroupID:this.props.AnswerableQuestion.AnswerableGroupID, AnswerableID:this.props.AnswerableQuestion.AnswerableID,answer:answer},this.props.onAnswerFinished);


    }
    render(){
        let Question= this.state.AnswerableQuestion;


        for(let key in QuestionTypes)
        {
            if(!QuestionTypes.hasOwnProperty(key)){
                continue;
            }
            if(this.props.AnswerableQuestion.QuestionTypeID==QuestionTypes[key].default.DatabaseId){
                let QuestionTypeFound=QuestionTypes[key]["default"];
                return <div ref={this.props.onGetDom}>
                          <QuestionTypeFound Answer={Question.ChosenAnswer} onAnswered={this.answerTheQuestion.bind(this)} Parameters={Question.JSONParameters}/>
                       </div>
            }
        }
        return <h1>Unkown Question Type</h1>;
    }
}

export default AnswerableQuestion