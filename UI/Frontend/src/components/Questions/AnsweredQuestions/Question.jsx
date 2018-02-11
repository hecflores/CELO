import React from 'react';
import * as QuestionTypes from '../../QuestionTypes/*.jsx';
import QuestionAPI from '../../../libaries/APIs/QuestionsAPI.jsx';

class Question extends React.Component{

    constructor(props){
        super(props);

        this.apiHook=QuestionAPI.instance.on("answer-question",function(){

        });
    }
    componentWillMount(){

    }
    answerQuestion(answer){

    }
    render(){


    }
}