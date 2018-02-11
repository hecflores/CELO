import React from 'react';
import QuestionsTable from './QuestionsTable.jsx';
import PopupQuestionSelection from './PopupQuestionSelection.jsx';
class QuestionsSelectionContainer extends React.Component{

    static defaultProps={
        onSelectionChanged:function(){},
        Questions:[]
    };

    static propTypes={
        onSelectionChanged:React.PropTypes.func,
        Questions:React.PropTypes.arrayOf(React.PropTypes.object)
    };

    state={
        QuestionDialogOpen:false
    };


    constructor(props){
        super(props);


        this.open=this.open.bind(this);
        this.close=this.close.bind(this);
        this.updateQuestions=this.updateQuestions.bind(this);

    }
    componentWillMount() {
        // Called When is about to mount

        this.setState({
            Questions:this.props.Questions
        });
    }

    componentDidMount() {
        // Called When it does mount
    }

    componentWillUnmount() {
        // Called When it unmounts
    }

    componentWillReceiveProps(props, context) {
        // Called When it receives props & context

        this.setState({
            Questions:props.Questions
        });
    }

    componentWillUpdate() {
        // Right before rendering. Dont Do setStat here.
    }

    componentDidUpdate() {
        // Place to chech for dom stuff
    }

    open(){
        this.setState({
            QuestionDialogOpen:true
        });
    }
    close(){
        this.setState({
            QuestionDialogOpen:false
        });
    }
    updateQuestions(questions){



        this.setState({
            QuestionDialogOpen:false,
            Questions:questions
        },function() {
            this.props.onSelectionChanged(this.state.Questions);
        }.bind(this));
    }
    render(){
        return <div className="questions-selection">
                    <div className="question-selection-toolbox">
                        <span onClick={this.open} className="btn btn-default add-question">Add</span>
                        <QuestionsTable Questions={this.state.Questions}/>
                    </div>
                    <PopupQuestionSelection SelectedQuestions={this.state.Questions} Show={this.state.QuestionDialogOpen} onSelected={this.updateQuestions} onClose={this.close}/>
                </div>
    }
}

export default QuestionsSelectionContainer