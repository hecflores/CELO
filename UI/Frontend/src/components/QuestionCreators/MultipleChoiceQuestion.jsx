/**
 * Created by Hector on 5/4/2017.
 */

import React from 'react';
import ValidationInput from '../Tools/ValidationInput.jsx';
import NumberInput from '../Tools/NumberInput.jsx';
class MultipleChoiceQuestion extends React.Component {

    /***********************************************************************/
    /* Used for the automated organization                                 */
    /***********************************************************************/
    static _id="Multiple Choice";
    static _Description="Choose one option from a list of options";

    static get id() {
        return this._id;
    }

    /**
     * @return {number}
     */
    static get DatabaseId() {
        return this._DatabaseId;
    }

    /**
     * @return {string}
     */
    static get Description() {
        return this._Description;
    }

    static childContextTypes = {};
    static contextTypes = {};
    static defaultProps = {};
    static propTypes = {};

    state = {
        NumberOfAnswers:React.PropTypes.number,
        Answers:[],
        CorrectAnswer:null,
        Question:"..."
    };


    constructor(props) {
        super(props);

        this.numberOfChoicesChanged=this.numberOfChoicesChanged.bind(this);
        this.updateAnswers=this.updateAnswers.bind(this);
        this.setCorrectAnswer=this.setCorrectAnswer.bind(this);
        this.changeQuestion=this.changeQuestion.bind(this);
    }

    getChildContext() {
        return {};
    }

    componentWillMount() {
        // Called When is about to mount
    }

    componentDidMount() {
        // Called When it does mount
    }

    componentWillUnmount() {
        // Called When it unmounts
    }

    componentWillReceiveProps(props, context) {
        // Called When it receives props & context
    }

    componentWillUpdate() {
        // Right before rendering. Dont Do setStat here. 
    }

    componentDidUpdate() {
        // Place to chech for dom stuff
    }
    numberOfChoicesChanged(data){
        this.setState({
            NumberOfAnswers:parseInt(data)
        });
    }
    updateAnswers(index,data){
        this.setState({
            CorrectAnswer:this.state.Answers[index]==this.state.CorrectAnswer?data:this.state.CorrectAnswer,
            Answers:{...this.state.Answers,[index]:data}
        });
    }
    setCorrectAnswer(value){
        this.setState({
            CorrectAnswer:value
        });
    }
    changeQuestion(value){
        this.setState({
            Question:value
        });
    }
    render() {
        return (
            <div className="question-basics-creating multiple-choice ">
                <input type="hidden" name="QuestionType" value={MultipleChoiceQuestion._id}/>
                <input type="hidden" name="Question" value={this.state.Question} />
                <input type="hidden" name="ExpectedAnswer" value={this.state.CorrectAnswer} />
                <ValidationInput value={this.state.Question} Id="JSONParameters[question]" Title="Question" isRequired={true} Match={/.+/} MessageOnError={"Required"} MessageOnSuccess={"Perfect!"} onInputChanged={this.changeQuestion}/>
                <NumberInput CustomElement={<input type="text"/>} Id="numberOfAnswers" Title="Number of Choices" isRequired={true} Match={/.+/} onInputChanged={this.numberOfChoicesChanged}/>
                {(function(){
                    let inputs=[];
                    for(let i=0;i<this.state.NumberOfAnswers;i++){
                        inputs.push(<div className={("answer-choice-creating "+((this.state.CorrectAnswer==this.state.Answers[i])?"choice-is-selected":""))}>
                                        <span onClick={()=>{this.setCorrectAnswer(this.state.Answers[i])}} className="answer-choice-selection-btn" >{String.fromCharCode(65+i)}</span>
                            <ValidationInput Title={<div style={{opacity:0}}>Something</div>} value={this.state.Answers[i] || ""} name="JSONParameters[answers][]"   Id={"JSONParameters[answer]["+i+"]"} onInputChanged={(e)=>{this.updateAnswers(i,e)}}  isRequired={true} Match={/.+/} MessageOnError={"Required"} MessageOnSuccess={"Perfect!"}/>

                                    </div>
                        );
                    }
                    return inputs;

                }.bind(this))()}
            </div>
        );
    }
}

export default MultipleChoiceQuestion;