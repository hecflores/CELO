import React from 'react';
import AssessmentAPI from '../../libaries/APIs/AssessmentAPI.jsx';
import CEOLButton from '../Tools/CELOButton.jsx';
import {SimpleLoader} from '../Containers/Loader.jsx';
import {browserHistory} from 'react-router';
class AssessmentStartButton extends React.Component
{
    static contextTypes={
        refresh:React.PropTypes.func
    };
    state={
        isStarting:React.PropTypes.bool
    };
    static defaultProps={
        isStarting:false,
        Text:"Start"
    };
    static propTypes={
        AnswerableGroupID:React.PropTypes.number.isRequired,
        Text:React.PropTypes.string
    };


    constructor(props){
        super(props);
        this.state={
            isStarting:props.isStarting
        };
        this.StartAssessment=this.StartAssessment.bind(this);
    }
    StartAssessment()
    {

        this.setState({
            isStarting:true
        },function(){
            AssessmentAPI.instance.initiate("start-assessment",{id:this.props.AnswerableGroupID},()=>
            {
                browserHistory.push(`/portal/assessments/${this.props.AnswerableGroupID}`);
            });
        }.bind(this));

    }
    render()
    {
        let test=<CEOLButton className="assessment-start-button" TooltipText={"Start Assessment"}  Enabled={!this.state.isStarting}  Text={this.state.isStarting?<SimpleLoader/>:this.props.Text} onClick={this.StartAssessment}/>;
        let propsForChild={};
        if(this.state.isStarting){propsForChild["children"]=<SimpleLoader/>;}
        return this.props.children?React.cloneElement(this.props.children,{ onClick:this.StartAssessment, ...propsForChild  }):test;
    }
}

export default AssessmentStartButton