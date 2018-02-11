/**
 * Created by Hector on 5/21/2017.
 */

import React from 'react';

import QuestionsPoolSelector from '../QuestionPools/QuestionsPoolSelector.jsx';
import QuestionPoolsLoader from '../QuestionPools/QuestionPoolsLoader.jsx';
import QuestionPoolsListGlobal from '../QuestionPools/QuestionPoolsListGlobal.jsx';
import QuestionPoolInfo from '../QuestionPools/QuestionPoolInfo.jsx';
import QuestionsController from '../Questions/QuestionsController.jsx';
import Popup from '../Tools/Popup.jsx';
import QuestionsTableHeader from '../Questions/QuestionsTableHeader.jsx';
import QuestionsTable from '../Questions/QuestionsTable.jsx';
class QuestionsPoolPopupSelection extends React.Component {

    static childContextTypes = {};
    static contextTypes = {
        QuestionsPoolSelector:React.PropTypes.shape({
            setSelectedQuestionPool:React.PropTypes.func,
            selectQuestionPools:React.PropTypes.func,
            unSelectQuestionPools:React.PropTypes.func,
            SelectedQuestionPool:React.PropTypes.oneOfType([
                React.PropTypes.bool,
                React.PropTypes.number
            ]),
            SelectedQuestionPools:React.PropTypes.oneOfType([
                React.PropTypes.bool,
                React.PropTypes.arrayOf(React.PropTypes.number)
            ])
        }),
        QuestionPoolsLoader:React.PropTypes.shape({
            Refresh:React.PropTypes.func,
            Loaded:React.PropTypes.bool,
            QuestionsPoolID:React.PropTypes.number,
            CreateQuestionPool:React.PropTypes.func,
            AddQuestion:React.PropTypes.func,
            QuestionPool:React.PropTypes.shape({
                QuestionsPoolID: React.PropTypes.number,
                ParentQuestionPool: React.PropTypes.number,
                Name: React.PropTypes.string,
                Description: React.PropTypes.string,
                Parameters: React.PropTypes.any,
                User: React.PropTypes.shape({
                    UserID: React.PropTypes.string,
                    FirstName: React.PropTypes.string,
                    LastName: React.PropTypes.string,
                    Email: React.PropTypes.string,
                    PhoneNumber: React.PropTypes.string,
                    UserName: React.PropTypes.string,
                    Role: React.PropTypes.string,
                    UHID: React.PropTypes.number
                }),
                Children: React.PropTypes.arrayOf(React.PropTypes.shape({
                        QuestionsPoolID: React.PropTypes.number,
                        ParentQuestionPool: React.PropTypes.number,
                        Name: React.PropTypes.string,
                        Description: React.PropTypes.string,
                        Parameters: React.PropTypes.any,
                        User: React.PropTypes.shape({
                            UserID: React.PropTypes.string,
                            FirstName: React.PropTypes.string,
                            LastName: React.PropTypes.string,
                            Email: React.PropTypes.string,
                            PhoneNumber: React.PropTypes.string,
                            UserName: React.PropTypes.string,
                            Role: React.PropTypes.string,
                            UHID: React.PropTypes.number
                        })
                    })
                )
            }),
            QuestionPools:React.PropTypes.arrayOf(React.PropTypes.shape({
                QuestionsPoolID:React.PropTypes.number,
                ParentQuestionPool:React.PropTypes.number,
                Name:React.PropTypes.string,
                Description:React.PropTypes.string,
                Parameters:React.PropTypes.any,
                User:React.PropTypes.shape({
                    UserID:React.PropTypes.string,
                    FirstName:React.PropTypes.string,
                    LastName:React.PropTypes.string,
                    Email:React.PropTypes.string,
                    PhoneNumber:React.PropTypes.string,
                    UserName:React.PropTypes.string,
                    Role:React.PropTypes.string,
                    UHID:React.PropTypes.number
                }),
                Children:React.PropTypes.arrayOf(React.PropTypes.shape({
                    QuestionsPoolID: React.PropTypes.number,
                    ParentQuestionPool: React.PropTypes.number,
                    Name: React.PropTypes.string,
                    Description: React.PropTypes.string,
                    Parameters: React.PropTypes.any,
                    User: React.PropTypes.shape({
                        UserID: React.PropTypes.string,
                        FirstName: React.PropTypes.string,
                        LastName: React.PropTypes.string,
                        Email: React.PropTypes.string,
                        PhoneNumber: React.PropTypes.string,
                        UserName: React.PropTypes.string,
                        Role: React.PropTypes.string,
                        UHID: React.PropTypes.number
                    })
                })),
                Questions:React.PropTypes.array

            }))
        }),
        QuestionsController:React.PropTypes.shape({
            Refresh:React.PropTypes.func,
            setNumberPerPage:React.PropTypes.func,
            setCurrentPage:React.PropTypes.func,
            nextPage:React.PropTypes.func,
            previousPage:React.PropTypes.func,
            searchOn:React.PropTypes.func,
            searchOff:React.PropTypes.func,
            setSearch:React.PropTypes.func,
            clearSelection:React.PropTypes.func,
            setSelection:React.PropTypes.func,
            addSelection:React.PropTypes.func,
            removeSelection:React.PropTypes.func,
            Questions:React.PropTypes.array
        })
    };
    static defaultProps = {
        Show:false,
        onClosed:function(){}
    };
    static propTypes = {
        onSelection:React.PropTypes.func,
        onClosed:React.PropTypes.func,
        Show:React.PropTypes.bool
    };

    state = {
        SelectedQuestionsPool:false,
        ShowQuestions:false
    };


    constructor(props) {
        super(props);
        
        this.setSelectedQuestionPool=this.setSelectedQuestionPool.bind(this);
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
    setSelectedQuestionPool() {
        this.setState({
            SelectedQuestionsPool:this.context.QuestionsPoolSelector.SelectedQuestionPool?this.context.QuestionsPoolSelector.SelectedQuestionPool:null
        },()=>{
            this.props.onSelection(this.state.SelectedQuestionsPool);
        });
    }


    render() {

        let {children, ...rest}=this.props;

        if(typeof this.context.QuestionPoolsLoader == "undefined"){

            return <QuestionPoolsLoader>
                        <QuestionsPoolPopupSelection {...this.props}/>
                    </QuestionPoolsLoader>
        }
        if(typeof this.context.QuestionsPoolSelector == "undefined") {
            return <QuestionsPoolSelector>
                        <QuestionsPoolPopupSelection {...this.props}/>
                   </QuestionsPoolSelector>
        }
        if(typeof this.context.QuestionsController == "undefined" ){

            return <QuestionsController Questions={this.context.QuestionsPoolSelector.SelectedQuestionPool.Questions || []}>
                        <QuestionsPoolPopupSelection {...this.props}/>
                    </QuestionsController>

        }

        return (<Popup Show={this.props.Show} OkEnabled={this.context.QuestionsPoolSelector.SelectedQuestionPool?true:false} okText={"Select"} onClosed={this.props.onClosed}  onSubmit={this.setSelectedQuestionPool} Title={"Select the Question Pool To Use"} >
                    <div className="QuestionsPoolPopupSelection">
                        <QuestionPoolsListGlobal/>
                        <div className={this.state.ShowQuestions?"show-question-btn showing":"show-question-btn not-showing"} onClick={()=>{this.setState({ShowQuestions:!this.state.ShowQuestions})}}/>
                        {this.state.ShowQuestions?(
                                <div className="show-questions">
                                    <QuestionsTableHeader/>
                                    <QuestionsTable Questions={this.context.QuestionsController.Questions}/>
                                </div>):null}
                    </div>
                </Popup>
        );
    }
}

export default QuestionsPoolPopupSelection;