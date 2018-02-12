/**
 * Created by Hector on 5/11/2017.
 */

import React from 'react';

import Layout from '../Template/Layout.jsx';
import StaffLayoutTemplate from '../LayoutTemplates/StaffLayoutTemplate.jsx';
import QuestionsTableHeader from '../Questions/QuestionsTableHeader.jsx';
import SimpleContainer from '../Tools/SimpleContainer.jsx';
import QuestionPoolsLoader from '../QuestionPools/QuestionPoolsLoader.jsx';
import QuestionPoolCreator from '../QuestionPools/QuestionPoolCreator.jsx';
import QuestionPoolsListGlobal from '../QuestionPools/QuestionPoolsListGlobal.jsx';
import QuestionsPage from './QuestionsPage.jsx';
import QuestionPoolsList from '../QuestionPools/QuestionPoolsList.jsx';
import QuestionsPoolSelector from '../QuestionPools/QuestionsPoolSelector.jsx';
import QuestionPoolInfo from '../QuestionPools/QuestionPoolInfo.jsx';
class MainQuestionsPage extends React.Component {

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
    };
    static defaultProps = {};
    static propTypes = {
        params:React.PropTypes.oneOfType([React.PropTypes.shape({
            QuestionsPoolID:React.PropTypes.number
        }),React.PropTypes.object])
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
        if(typeof this.context.QuestionPoolsLoader == "undefined"){
            return  <QuestionPoolsLoader QuestionsPoolID={this.props.params.QuestionsPoolID?parseInt(this.props.params.QuestionsPoolID):null}>

                            <MainQuestionsPage {...this.props}/>
                    </QuestionPoolsLoader>
        }

        return <Layout  PageTitle={"Questions"} Template={StaffLayoutTemplate}>
                    <Layout.Header>

                    </Layout.Header>
                    <Layout.LeftSidePanel>

                    </Layout.LeftSidePanel>
                    <Layout.Body >
                        <SimpleContainer>
                            <div className="questions-page-info">

                                <div className="question-pool">
                                    <QuestionPoolCreator/>
                                    <QuestionPoolsListGlobal/>
                                    <QuestionPoolInfo QuestionPool={this.context.QuestionsPoolSelector.SelectedQuestionPool}/>
                                </div>
                                {this.props.children}
                            </div>
                        </SimpleContainer>
                    </Layout.Body>
                </Layout>
    }
}

export default MainQuestionsPage;