import React from 'react';
import Popup from 'components/Tools/Popup.jsx';
import QuestionsController from './QuestionsController.jsx';
import SelectableQuestionTable from './SelectableQuestionTable.jsx';
import GetQuestionsFromController from './GetQuestionsFromController.jsx';
class QuestionSelection extends React.Component{

    static defaultProps={
        onSelected:function () {}

    };
    static propTypes={
        onSelected:React.PropTypes.func,

        Load:React.PropTypes.bool,
        SelectedQuestions:React.PropTypes.array
    };
    state={
        SelectedQuestions:[],
        AllQuestions:[],
        canSelect:false,
        Fetch:true
    };

    constructor(props){
        super(props);
        this.selectionChanged=this.selectionChanged.bind(this);
        this.selectedChanges=this.selectedChanges.bind(this);
        this.questionsLoaded=this.questionsLoaded.bind(this);
    }
    componentWillReceiveProps(props){
        this.setState({
            SelectedQuestions:props.SelectedQuestions || []
        })
    }
    questionsLoaded(questions){
        this.setState({
            AllQuestions:questions,
            Fetch:false
        })
    }
    selectionChanged(questions)
    {
        this.setState({
            SelectedQuestions:questions,
            canSelect:questions.length>0
        });
    }
    selectedChanges(){
        this.props.onSelected(this.state.SelectedQuestions);
    }
    render(){
        return <div className="questions-selections">
                <QuestionsController>
                    <GetQuestionsFromController GiveTo={SelectableQuestionTable}  onSelectionChanged={this.selectionChanged} SelectedQuestions={this.state.SelectedQuestions}/>
                </QuestionsController>
            </div>
    }
}

export default QuestionSelection