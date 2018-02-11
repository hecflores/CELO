/**
 * Created by Hector on 5/11/2017.
 */

import React from 'react';
import UserActionItem from '../Users/UserActionItem.jsx';
import CELOLink from '../Tools/CELOLink.jsx';

class QuestionPoolsListDefaultItem extends React.Component{

    static propTypes = {
        QuestionPool:React.PropTypes.object,
        onClick:React.PropTypes.func,
        ListElement:React.PropTypes.func.isRequired
    };

    static defaultProps = {
        onClick:function(){},
        Component:(props)=>{

        }
    };
    state={
       DisplayChildren:false
    };
    constructor(props){
        super(props);

        this.onDoubleClick=this.onDoubleClick.bind(this);
    }
    onDoubleClick(){
        this.setState({
            DisplayChildren:!this.state.DisplayChildren
        });
    }
    render(){
        let QuestionPoolsList=this.props.ListElement;

        return <span className={"question-pool-list-item "+(this.props.QuestionPool.QuestionsPoolID==this.props.Selected?"selected":"")}>
                   <div  onDoubleClick={this.onDoubleClick}  className="item" onClick={()=>{this.props.onClick(this.props.QuestionPool)}}>
                       <span className="item-value">{this.props.QuestionPool["Name"]}</span>
                   </div>

            {this.state.DisplayChildren?(this.props.QuestionPool.Children?<QuestionPoolsList Selected={this.props.Selected}  onClick={this.props.onClick} QuestionPools={this.props.QuestionPool.Children}/>:null):null}
                 </span>
    }
}

class QuestionPoolsList extends React.Component {

    static childContextTypes = {};
    static contextTypes = {};
    static defaultProps = {
        onClick:function(){},
        Component:QuestionPoolsListDefaultItem
    };
    static propTypes = {
        onClick:React.PropTypes.func,
        Component:React.PropTypes.func,
        Selected:React.PropTypes.number,
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
            })
        })).isRequired
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
        let Component=this.props.Component;
        return (
            <div className="question-pools-list">
                {this.props.QuestionPools.map((item, index)=>{
                    return <Component ListElement={QuestionPoolsList} QuestionPool={item}  key={index} onClick={this.props.onClick} Selected={this.props.Selected} />
                })}
            </div>
        );
    }
}

export default QuestionPoolsList;