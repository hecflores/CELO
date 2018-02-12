/**
 * Created by Hector on 5/4/2017.
 */

import React from 'react';
import Popup from '../Tools/Popup.jsx';
import QuestionsTable from '../Questions/QuestionsTable.jsx';
import QuestionsLoader from '../Questions/QuestionsLoader.jsx';
import QuestionCreator from '../Questions/QuestionCreator.jsx';
import QuestionsController from '../Questions/QuestionsController.jsx';
import Layout from '../Template/Layout.jsx';
import StaffLayoutTemplate from '../LayoutTemplates/StaffLayoutTemplate.jsx';
import QuestionsTableHeader from '../Questions/QuestionsTableHeader.jsx';
import SimpleContainer from '../Tools/SimpleContainer.jsx';
class QuestionsPage extends React.Component {

    static childContextTypes  = {};
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
    static defaultProps = {};
    static propTypes = {};

    state = {};

    constructor(props) {
        super(props);
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

    render() {
        let {children, ...rest}=this.props;

        if(typeof this.context.QuestionPoolsLoader == "undefined"){
            return <h1 className="text-danger">Question Pool Loader was not fond...</h1>
        }
        if(typeof this.context.QuestionsController == "undefined" ){

                return <QuestionsController Questions={this.context.QuestionsPoolSelector.SelectedQuestionPool.Questions || []}>
                    <QuestionsPage {...this.props}/>
                </QuestionsController>
            return null;

        }

        return <div className="questions-page">
                    <QuestionsTableHeader/>
                    <QuestionCreator/>
                    <QuestionsTable Questions={this.context.QuestionsController.Questions}/>
                </div>



    }
}

export default QuestionsPage;