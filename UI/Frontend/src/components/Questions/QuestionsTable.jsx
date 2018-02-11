import React from 'react';




class QuestionsTable extends  React.Component{


    static contextTypes = {

    };
    static defaultProps={
        onQuestionHover:function(){},
        onQuestionClicked:function(){},
        onQuestionDoubleClicked:function(){},
        showQuestionID:true,
        showQuestion:true,
        showQuestionType:true,
        showCratedBy:true,
    };

    static propTypes=
    {
        Questions:React.PropTypes.array,
        onQuestionHover:React.PropTypes.func,
        onQuestionClicked:React.PropTypes.func,
        onQuestionDoubleClicked:React.PropTypes.func,
        CustomQuestionRowCreator:React.PropTypes.func,
        CustomQuestionHeaderCreator:React.PropTypes.func,
        showQuestionID:React.PropTypes.bool,
        showQuestion:React.PropTypes.bool,
        showQuestionType:React.PropTypes.bool,
        showCreatedBy:React.PropTypes.bool,

    };

    state={

    };
    componentWillMount(){

    }
    componentWillReceiveProps(props){

    }
    render()
    {

        return <div className="questions-table">

                  <table className={"table questions-table"+(this.props.className || "")}>
                    <thead>
                    {
                        this.props.CustomQuestionHeaderCreator ?
                            this.props.CustomQuestionHeaderCreator() :
                            <tr>
                                {this.props.showQuestionID ? <th>ID</th> : null}
                                {this.props.showQuestion ? <th>Question</th> : null}
                                {this.props.showQuestionType ? <th>Creator</th> : null}
                            </tr>
                    }
                    </thead>
                    <tbody>
                    {this.props.Questions.map(function(question,index){

                        if(this.props.CustomQuestionRowCreator){
                            return React.cloneElement(this.props.CustomQuestionRowCreator(question),
                                {
                                    key:index,
                                    onClick:()=>{this.props.onQuestionClicked(question);},
                                    onDoubleClick:()=>{this.props.onQuestionDoubleClicked(question);},
                                    onMouseOver:()=>{this.props.onQuestionHover(question);}
                                });
                        }

                        /***************************************************/
                        return <tr key={index}  className={"question-table-row"}>
                                    {this.props.showQuestionID?<td>{question.QuestionID}</td>:null}
                                    {this.props.showQuestion?<td>{question.Question}</td>:null}
                                    {this.props.showQuestionType?<td>{question.CreatedBy.LastName+", "+question.CreatedBy.FirstName}</td>:null}
                               </tr>
                    }.bind(this))}
                    </tbody>
               </table>
            </div>
    }
}

export default QuestionsTable