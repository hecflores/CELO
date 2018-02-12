import React from 'react';
import Popup from 'components/Tools/Popup.jsx';
import QuestionsLoader from './QuestionsLoader.jsx';
import SelectableQuestionTable from './SelectableQuestionTable.jsx';
import QuestionSelectionOneSelection from './QuestionSelectionOneSelection.jsx';
class PopupQuestionSelectionOneSelection extends QuestionSelectionOneSelection{

    static defaultProps={
        Show:false,
        onClose:function () {},
        onSelected:function () {}

    };
    static propTypes={
        onSelected:React.PropTypes.func,
        onClose:React.PropTypes.func,
        Show:React.PropTypes.bool,
        Load:React.PropTypes.bool,
        SelectedQuestions:React.PropTypes.array
    };


    constructor(props){
        super(props);
        this.state={
            SelectedQuestions:[],
            AllQuestions:[],
            canSelect:false,
            Fetch:true
        };
    }
    render()
    {
        return <Popup Show={this.props.Show} OkEnabled={this.state.canSelect} okText={"Select"} onClosed={this.props.onClose} onSubmit={this.selectedChanges} Title={"Select your Questions"}>
                    {super.render()}
                </Popup>
    }
}

export default PopupQuestionSelectionOneSelection