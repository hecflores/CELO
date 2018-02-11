/**
 * Created by Hector on 5/11/2017.
 */

import React from 'react';
import QuestionAPI from '../../libaries/APIs/QuestionsAPI.jsx';
import Loader from '../Containers/Loader.jsx';
import QuestionsPoolSelector from './QuestionsPoolSelector.jsx';
class QuestionPoolsLoader extends React.Component {

    static childContextTypes = {
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
        })
    };
    static contextTypes = {};
    static defaultProps = {};
    static propTypes = {
        QuestionsPoolID:React.PropTypes.number
    };

    state = {
        Fetching:false,
        Loaded:false,
        QuestionPools:[]
    };


    constructor(props) {
        super(props);


    }

    getChildContext() {
        return {
            QuestionPoolsLoader:{
                Refresh:this.Refresh.bind(this),
                Loaded:this.state.Loaded,
                CreateQuestionPool:this.CreateQuestionPool.bind(this),
                AddQuestion:this.AddQuestion.bind(this),
                QuestionsPoolID:this.props.QuestionsPoolID,
                QuestionPool:this.state.QuestionPools.length!=1?null:this.state.QuestionPools[0],
                QuestionPools:this.state.QuestionPools,

            }
        };
    }

    componentWillMount() {
        // Called When is about to mount

        this.AnyIncomingUpdate(this.props, this.context); // To Put updates in one place
    }

    componentDidMount() {
        // Called When it does mount

        this.Refresh();
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
    CreateQuestionPool(data){
        QuestionAPI.instance.initiate("add-question-pools",{...data,ParentQuestionPool:this.props.QuestionsPoolID},(data)=>{
            this.setState({
                Loaded:true,
                QuestionPools:data.data.Questions
            });
        });
    }
    AddQuestion(data){
        QuestionAPI.instance.initiate("get-question-pools",{...data, QuestionsPoolID:this.props.QuestionsPoolID},(data)=>{
            this.setState({
                Loaded:true,
                QuestionPools:data.data.Questions
            });
        });
    }
    Refresh(QuestionPoolID=this.props.QuestionsPoolID){

        this.setState({
            Fetching:true
        },()=>{
            QuestionAPI.instance.initiate("get-question-pools",{QuestionsPoolID:QuestionPoolID},(data)=>{
                this.setState({
                    Fetching:false,
                    Loaded:true,
                    QuestionPools:data.data.Questions
                });
            });
        })



    }

    AnyIncomingUpdate(props, context) {
        // Both the componentWillMount and componentWillReceiveProps will go here

        if(props.QuestionsPoolID!=this.props.QuestionsPoolID){
            this.Refresh(props.QuestionsPoolID);
        }
    }

    render() {
        return (this.state.Loaded?<div className="question-pools-loader">

                    {this.state.Fetching?<div className="full-screen">Loading Question Pools...<Loader/></div>:null}
                <QuestionsPoolSelector>
                    {this.props.children}
                </QuestionsPoolSelector>
                </div>:<div className="question-pools-loader"><div className="full-screen">Loading Question Pools...<Loader/></div></div>
        );
    }
}

export default QuestionPoolsLoader;