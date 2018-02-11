/**
 * Created by Hector on 5/21/2017.
 */

import React from 'react';
import QuestionsPoolPopupSelection from './QuestionsPoolPopupSelection.jsx';
import QuestionPoolInfo from './QuestionPoolInfo.jsx';

class InputQuestionPool extends React.Component {

    static childContextTypes = {};
    static contextTypes = {
        submitForm:React.PropTypes.func,
        validFields:React.PropTypes.object,
        isFormValid:React.PropTypes.bool,
        setFormValid:React.PropTypes.func,
    };
    static defaultProps = {
        onChanged:function(){}
    };
    static propTypes = {
        name:React.PropTypes.string.isRequired,
        onChanged:React.PropTypes.func
    };

    state = {
        SelectedQuestionPool:false,
        Selecting:false
    };



    constructor(props) {
        super(props);

        this.setSelecting=this.setSelecting.bind(this);
        this.setUnSelecting=this.setUnSelecting.bind(this);
        this.selectQuestionGroup=this.selectQuestionGroup.bind(this);

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
        this.context.setFormValid(this.props.name,false);
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
    setSelecting(){
        this.setState({
            Selecting:true
        });
    }
    setUnSelecting(){
        this.setState({
            Selecting:false
        });
    }
    selectQuestionGroup(QuestionGroupPool) {
        this.setState({
            Selecting:false,
            SelectedQuestionPool:QuestionGroupPool
        },()=>{
            this.props.onChanged(this.state.SelectedQuestionPool);

            if(this.state.SelectedQuestionPool){
                this.context.setFormValid(this.props.name,true);
            }
        });
    }

    render() {
        return (<div className={this.state.SelectedQuestionPool?"question-pool-input selected":"question-pool-input un-selected"} onClick={this.setSelecting}>
                    {this.state.SelectedQuestionPool?
                        <div className="selected-item">{this.state.SelectedQuestionPool.Name}</div>:
                        "No Question Pool Selected"
                    }
                    <QuestionsPoolPopupSelection onSelection={this.selectQuestionGroup} Show={this.state.Selecting} onClosed={this.setUnSelecting}/>
                </div>)

    }
}

export default InputQuestionPool;