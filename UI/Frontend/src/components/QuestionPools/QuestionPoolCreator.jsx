/**
 * Created by Hector on 5/11/2017.
 */

import React from 'react';
import CELOButton from '../Tools/CELOButton.jsx';
import PopupForm from '../Tools/PopupForm.jsx';
import ValidationInput from '../Tools/ValidationInput.jsx';
class QuestionPoolCreator extends React.Component {

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
        Enabled:React.PropTypes.bool,
        Text:React.PropTypes.string,
        TooltipText:React.PropTypes.string,
        TooltipDirection:React.PropTypes.string,
    };

    state = {
        Show:false
    };


    constructor(props) {
        super(props);

        this.Show=this.Show.bind(this);
        this.Hide=this.Hide.bind(this);
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
    Show(){
        this.setState({
            Show:true
        });
    }
    Hide(){
        this.setState({
            Show:false
        });
    }
    render()
    {

        let {children, ...rest}=this.props;

        return (<div className="question-pool-creator">
                    <CELOButton Enabled={!this.state.Show} onClick={this.Show} Text={"Create Question Pool"} TooltipDirection={"top"} TooltipText={"New Question Pool"} {...rest}/>

                    <PopupForm  action="/api/questions/pools"
                                onClosed={this.Hide}
                                onSubmit={this.context.QuestionPoolsLoader.Refresh}
                                Show={this.state.Show}
                                okText={"Create"}
                                Title={"Create a New Question Pool"}>
                        <input type="hidden" name="__action__" value={"create-question-pool"}/>
                        {this.context.QuestionsPoolSelector.SelectedQuestionPool.QuestionsPoolID!=null?<input type="hidden" name="ParentQuestionPool" value={this.context.QuestionsPoolSelector.SelectedQuestionPool.QuestionsPoolID}/>:null}

                        <ValidationInput Id="Name" Match={/^[A-Z].{5,}$/} MessageOnError={"Capitalized and minimum of 6 characters"} MessageOnSuccess={"Perfect!"} isRequired={true}/>
                        <ValidationInput Id="Description" Match={/^.{10,}$/} MessageOnError={"Minimum of 10 characters"} MessageOnSuccess={"Perfect!"} isRequired={true}/>
                    </PopupForm>
                </div> );
    }
}

export default QuestionPoolCreator;