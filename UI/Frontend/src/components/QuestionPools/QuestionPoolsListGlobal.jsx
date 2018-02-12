/**
 * Created by Hector on 5/11/2017.
 */

import React from 'react';
import QuestionPoolsList from './QuestionPoolsList.jsx';

class QuestionPoolsListGlobal extends React.Component {

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
        })
    };
    static defaultProps = {};
    static propTypes = {
        Component:React.PropTypes.func
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
        return (<QuestionPoolsList Selected={this.context.QuestionsPoolSelector.SelectedQuestionPool.QuestionsPoolID} onClick={(pool)=>this.context.QuestionsPoolSelector.setSelectedQuestionPool([pool])} QuestionPools={this.context.QuestionPoolsLoader.QuestionPools} Component={this.props.Component}/>);
    }
}

export default QuestionPoolsListGlobal;