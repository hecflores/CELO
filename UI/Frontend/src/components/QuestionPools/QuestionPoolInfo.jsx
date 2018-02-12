/**
 * Created by Hector on 5/12/2017.
 */

import React from 'react';
import UserActionItem from '../Users/UserActionItem.jsx';
import QuestionPoolCreator from '../QuestionPools/QuestionPoolCreator.jsx';
class QuestionPoolInfo extends React.Component {

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
            QuestionPools:React.PropTypes.arrayOf(React.PropTypes.shape({
                QuestionsPoolID:React.PropTypes.number,
                ParentQuestionPool:React.PropTypes.number,
                Name:React.PropTypes.string,
                Description:React.PropTypes.string,
                Parameters:React.PropTypes.object,
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
                    Parameters: React.PropTypes.object,
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
    static defaultProps = {};
    static propTypes = {
        QuestionPool:React.PropTypes.object
    };

    state = {};


    constructor(props) {
        super(props);
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

    render() {
        let QuestionPool=this.props.QuestionPool?this.props.QuestionPool:this.context.QuestionsPoolSelector.SelectedQuestionPool;


        return (QuestionPool?<div className="question-pool-info">
                    <dl>
                        <dt>Name</dt>
                        <dd>{QuestionPool.Name}</dd>

                        <dt>Description</dt>
                        <dd>{QuestionPool.Description}</dd>


                        <dt>Creator</dt>
                        <dd><UserActionItem User={QuestionPool.User}/></dd>

                        <dt>Users</dt>
                        <dd>...</dd>

                        <dd>{QuestionPool.Questions.length} Questions</dd>

                    </dl>
                </div>:null);
    }
}

export default QuestionPoolInfo;