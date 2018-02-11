import React from 'react';
import $ from 'jquery';
import AnswerableQuestion from './AnswerableQuestion.jsx';
import APIComponent from '../../Containers/APIComponent.jsx';
import DataInput from '../../Containers/DataInput.jsx';
import QuestionsAPI from "../../../libaries/APIs/QuestionsAPI.jsx";
import {ButtonGroup,Button} from 'react-bootstrap';
import Loader from '../../Containers/Loader.jsx';


class AnswerableQuestionsEvent{

}


class AnswerableQuestions extends React.Component
{
    constructor(props) {
        super(props);
        this.state={
            Questions:this.props.AnswerableQuestions.sort(function(a,b){
                return a.AnswerableID<b.AnswerableID?-1:1;
            })
        };

        /*******************************************************************/
        this.onLoadStarted=function(e)
        {
            e.Collection=this;
            this.props.onLoadStarted(e);
        }.bind(this);

        /*******************************************************************/
        this.onLoadFinished=function(e)
        {
            let currentQuestions=this.state.Questions;
            currentQuestions[e.Index]=e.Question;
            this.setState({
                Questions:currentQuestions
            },function(){
                e.Collection=this;
                this.props.onLoadFinished(e);
            }.bind(this));


        }.bind(this);

        /*******************************************************************/
        this.onIsLocked=function(e){
            this.props.onIsLocked(e);
        }.bind(this);

        /*******************************************************************/
        this.onIsUnAnswered=function(e){
            this.props.onIsUnAnswered(e);
        }.bind(this);

        /*******************************************************************/
        this.onAnswered=function(AnswerableID, choice){
            let Questions={...this.state.Questions};
            Questions[AnswerableID].ChosenAnswer=choice;
            if(Questions[AnswerableID].ChosenAnswer!=choice){
                throw new Error("I made a mistake with the updating of a question");
            }
            this.setState({
                Questions:Questions
            });
            this.props.onAnswered(AnswerableID, choice);
        }.bind(this);
    }
    componentWillReceiveProps(props)
    {
        let Questions={};
        props.AnswerableQuestions.forEach(function(question){
            Questions[question["AnswerableID"]]=question;
        });


        this.setState({
            Questions:Questions
        });
    }
    render(){
        return (
            this.state.Questions?(
                    <div className="answerable-questions">
                        {Object.values(this.state.Questions).map(function (question, index) {
                            return (<AnswerableQuestion
                                        key={index}
                                        AnswerableQuestion={question}
                                        Index={index}
                                        onLoadStarted={this.onLoadStarted}
                                        onLoadFinished={this.onLoadFinished}
                                        onIsLocked={this.onIsLocked}
                                        onIsUnAnswered={this.onIsUnAnswered}
                                        onAnswered={this.onAnswered}
                                />

                            );
                        }.bind(this))}
                    </div>
                ):(

                <APIComponent Message="Loading Answered Questions..."  Fetch={true} APIListener={QuestionsAPI.instance} Event={"get-answerable-questions"}>
                    {function(data,change,send,setData){
                        return <AnswerableQuestions AnswerableQuestions={data}/>
                    }}
                </APIComponent>
                )
        )
    }
}
AnswerableQuestions.propTypes={
    AnswerableQuestions:React.PropTypes.array,
    onLoadStarted:React.PropTypes.func,
    onLoadFinished:React.PropTypes.func,
    onIsLocked:React.PropTypes.func,
    onIsUnAnswered:React.PropTypes.func,
    onAnswered:React.PropTypes.func,
};

AnswerableQuestions.defaultProps={
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
};
export default AnswerableQuestions