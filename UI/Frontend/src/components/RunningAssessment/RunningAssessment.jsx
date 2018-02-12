import React from 'react';
import AnswerableQuestions from '../Questions/AnsweredQuestions/AnswerableQuestions.jsx'
import RunningAssessmentAPI from '../../libaries/APIs/RunningAssessmentAPI.jsx';
import RunningAssessmentProgressBar from './RunningAssessmentProgressBar.jsx';
import RunningAssessmentQuestionStatusGrid from './RunningAssessmentQuestionStatusGrid.jsx';
import CourseContentAPI from '../../libaries/APIs/CourseContentAPI.jsx';
import {browserHistory} from 'react-router';
class RunningAssessment extends React.Component{

    static childContextTypes={
        refresh:React.PropTypes.func
    };
    static propTypes={
        RunningAssessment:React.PropTypes.oneOfType([
            React.PropTypes.object,
        ])
    };

    /**
     * @var {APIHook}
     */
    ApiHook;

    constructor(props){
        super(props);
        this.state={
            RunningAssessment:this.props.RunningAssessment
        };

        this.ApiHook=RunningAssessmentAPI.instance.hook().on("get-running-assessment",function(data){
             this.setState({RunningAssessment:data.data.ActiveAssessment});
        }.bind(this));

        this.onAnswered=this.onAnswered.bind(this);
        this.refresh=this.refresh.bind(this);
        this.submitAssessment=this.submitAssessment.bind(this);
    }
    getChildContext(){
        return {
            refresh:()=>{this.refresh()}
        }
    }
    componentDidMount(){
        this.ApiHook.open();
    }
    componentWillUnmount(){
        this.ApiHook.close();
    }
    refresh(){
        CourseContentAPI.instance.initiate("get-course-content-with-assessment",{AnswerableGroupID:this.state.RunningAssessment.AnswerableGroupID,Details:true});
    }
    onAnswered(){
        this.refresh();
    }
    submitAssessment(){
        this.ApiHook.getListener().initiate("submit-assessment",{id:this.state.RunningAssessment.AnsweringGroupID},()=>{
            browserHistory.push(`/portal/section/${this.props.RunningAssessment.CourseContent.SectionID}/course-content/${this.props.RunningAssessment.CourseContent.ContentID}`);
            this.refresh();
        });
    }

    render(){

        return <div className="running-assessment">

                    <div>
                        <AnswerableQuestions onAnswered={this.onAnswered} AnswerableQuestions={this.state.RunningAssessment.Questions}/>
                    </div>
                    <div style={{float:"right"}}>
                        {/*<RunningAssessmentQuestionStatusGrid {...this.props} RunningAssessment={this.state.RunningAssessment}/>*/}
                        <RunningAssessmentProgressBar {...this.props} RunningAssessment={this.state.RunningAssessment}/>

                        {/*<span onClick={this.submitAssessment.bind(this)} className="btn btn-default submit-assessment-btn">Submit</span>*/}
                    </div>
                    <div className={'main-status-and-submition-container ' + (this.props.RunningAssessment.Finished==100?"ready-to-submit":"")} >
                        <div className='submit-assessment-container'>
                            <div onClick={this.submitAssessment} >Submit</div>
                        </div>
                        <div className='assessment-progress-status-main-container' >
                            <div className='progress'>
                                <div className='progress-bar progress-bar-finished' role='progressbar' style={{width:this.props.RunningAssessment.Finished+"%"}}>
                                    {Math.floor(this.props.RunningAssessment.Finished)}%
                                </div>
                            </div>
                        </div>
                    </div>;
               </div>
    }
}

export default RunningAssessment