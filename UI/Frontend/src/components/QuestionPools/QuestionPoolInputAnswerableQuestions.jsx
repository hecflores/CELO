/**
 * Created by Hector on 5/21/2017.
 */

import React from 'react';
import InputGeneratingQuestions from './InputGeneratingQuestions.jsx';

class QuestionPoolInputAnswerableQuestions extends React.Component {

    static childContextTypes = {};
    static contextTypes = {
        submitForm:React.PropTypes.func,
        validFields:React.PropTypes.object,
        isFormValid:React.PropTypes.bool,
        setFormValid:React.PropTypes.func,
    };
    static defaultProps = {
        onChanged:function(){},
        MaxNumberOfQuestions:-1
    };
    static propTypes = {
        onChanged:React.PropTypes.func,
        MaxNumberOfQuestions:React.PropTypes.number
    };

    state = {};


    constructor(props) {
        super(props);

        this.QuestionsChanged=this.QuestionsChanged.bind(this);
    }

    getChildContext() {
        return {};
    }

    componentWillMount() {
        // Called When is about to mount

        this.AnyIncomingUpdate(this.props, this.context); // To Put updates in one place
    }

    componentDidMount() {
        // Called When it does mount
    }

    componentWillUnmount() {
        // Called When it unmounts
    }

    componentWillReceiveProps(props, context) {
        // Called When it receives props & context

        this.AnyIncomingUpdate(props, context); // To Put updates in one place
    }

    componentWillUpdate() {
        // Right before rendering. Dont Do setStat here. 
    }

    componentDidUpdate() {
        // Place to chech for dom stuff
    }

    AnyIncomingUpdate(props, context) {
        // Both the componentWillMount and componentWillReceiveProps will go here
    }
    QuestionsChanged(questions){
        this.setState({
            Questions:questions
        }, ()=> {
            this.props.onChanged(this.state.Questions);
        });
    }
    render() {
        return (
            <div className="QuestionPoolInputAnswerableQuestions">
                <InputGeneratingQuestions MaxNumberOfQuestions={this.props.MaxNumberOfQuestions} name={"QuestionPool"} onChanged={this.QuestionsChanged}/>
                {this.state.Questions?<div className="questions">
                        {this.state.Questions.map((question,index)=>{
                            return <input type="hidden" name={"AnswerableQuestionGroup[Questions]["+index+"][QuestionID]"} value={question["QuestionID"]} />
                        })}
                    </div>:null }
            </div>
        );
    }
}

export default QuestionPoolInputAnswerableQuestions;