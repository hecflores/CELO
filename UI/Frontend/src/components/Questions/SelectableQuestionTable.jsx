import React from 'react';
import QuestionsTable from './QuestionsTable.jsx'
import QuestionsTableHeader from './QuestionsTableHeader.jsx';
class SelectableQuestionTable extends React.Component{

    static defaultProps={
        SelectedQuestions:[],
        onSelectionChanged:function(){}
    };
    static propTypes={
        Questions:React.PropTypes.array.isRequired,
        SelectedQuestions:React.PropTypes.array,
        onSelectionChanged:React.PropTypes.func
    };



    constructor(props){
        super(props);

        this.state={
            Questions:props.Questions,
            SelectedQuestions:props.SelectedQuestions
        };
        this.questionClicked=this.questionClicked.bind(this);
        this.questionHovered=this.questionHovered.bind(this);
    }
    componentWillReceiveProps(props){

        this.setState({
            Questions:props.Questions,
            SelectedQuestions:props.SelectedQuestions
        },function(){

        }.bind(this));
    }
    questionClicked(question){
        if(this.isSelected(question)){
            this.setState({
                SelectedQuestions:this.state.SelectedQuestions.filter(q=>q.QuestionID!=question.QuestionID)
            },()=>{
                this.props.onSelectionChanged(this.state.SelectedQuestions);
            });
            return;
        }

        this.setState({
            SelectedQuestions:[ ...this.state.SelectedQuestions, question]
        },()=>{
            this.props.onSelectionChanged(this.state.SelectedQuestions);
        });
    }
    questionHovered(){

    }
    isSelected(question){

        let foundQuestion=this.state.SelectedQuestions.find(q=>q.QuestionID==question.QuestionID);
        return typeof foundQuestion != "undefined";


    }
    render(){
        return <div>
            <QuestionsTableHeader/>
            <QuestionsTable Questions={this.state.Questions}
                            onQuestionClicked={this.questionClicked}
                            onQuestionHover={this.questionHovered}
                            CustomQuestionHeaderCreator={function(){
                                return <tr>
                                    <th>{null}</th>
                                    <th>ID</th>
                                    <th>Question</th>
                                    <th>Type</th>
                                </tr>
                            }}
                            CustomQuestionRowCreator={function(question){
                                if(this.isSelected(question)){
                                    return (
                                        <tr className="selected">
                                            <td><span className="glyphicon glyphicon-check"/></td>
                                            <td>{question.QuestionID}</td>
                                            <td>{question.Question}</td>
                                            <td>{question.Type}</td>
                                        </tr>);
                                }
                                return (
                                    <tr className="">
                                        <td><span className="glyphicon glyphicon-unchecked"/></td>
                                        <td>{question.QuestionID}</td>
                                        <td>{question.Question}</td>
                                        <td>{question.Type}</td>
                                    </tr>);
                            }.bind(this)}
            />
            </div>
    }




}
export  default SelectableQuestionTable