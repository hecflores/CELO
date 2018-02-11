import React from 'react';
import {ImportPropertyTrueFalse,CourseContentGenericRenderDecider} from '../CourseContent/CourseContentGenericRenderDecider.jsx';


class AssessmentRenderingDecider extends CourseContentGenericRenderDecider
{
    static propTypes={
        CourseContent:React.PropTypes.object
    };

    state={
        Status:"unkown",
        ErrorMessage:null
    };


    isAssessmentActive(){
        return this.state.Status=="active";
    }
    isAssessmentReady(){
        return this.state.Status=="ready";
    }
    isAssessmentLocked(){
        return this.state.Status=="locked";
    }


    ActiveAssessmentWillReceiveProps(props){

    }
    ReadyAssessmentWillReceiveProps(props){

    }
    LockedAssessmentWillReceiveProps(props){

    }

    ActiveAssessmentMounted(){

    }
    ReadyAssessmentMounted(){

    }
    LockedAssessmentMounted(){

    }
    componentDidMount(props){

        this.testAssessment(this.props,()=>
        {
            (({
                active:this.ActiveAssessmentMounted,
                ready:this.ReadyAssessmentMounted,
                locked:this.LockedAssessmentMounted,
                failed:function(){

                }
            })[this.state.Status].bind(this))();
        });
    }
    componentWillReceiveProps(props){
        super.componentWillReceiveProps(props);
        this.testAssessment(props,()=>
        {
            (({
                active:this.ActiveAssessmentWillReceiveProps,
                ready:this.ReadyAssessmentWillReceiveProps,
                locked:this.LockedAssessmentWillReceiveProps,
                failed:function(){

                }
            })[this.state.Status].bind(this))();
        });

    }
    testAssessment(props,callback){
        if(typeof props.CourseContent == "undefined"){

            this.setState({
                Status:"failed",
                ErrorMessage:<h1 className="text-danger">No Course Content Found/></h1>
            },callback);
            return
        }

        let {AnswerableQuestionGroup,AnsweringQuestionGroup,LastedSubmissions,...rest}=props.CourseContent;
        let {allowMultipleAttempts,...rest2}=props.CourseContent.Properties;

        /*******************************************************************/
        /* If Assessment is Active                                         */
        /*******************************************************************/
        if(AnsweringQuestionGroup){
            this.setState({
                Status:"active"
            },callback);
            return;
        }

        /*******************************************************************/
        /* Check the Number of Assessments and the Number of allowed       */
        /*******************************************************************/
        if(LastedSubmissions /* && Array.isArray(SubmittedAssessments) */ && LastedSubmissions.length>0)
        {
            if(allowMultipleAttempts)
            {
                this.setState({
                    Status:"ready"
                },callback);
                return;
            }
            this.setState({
                Status:"locked"
            },callback);
            return;
        }

        /*******************************************************************/
        /* Error, Something is wrong with Submitted Assessments            */
        /*******************************************************************/
        else if(!(LastedSubmissions /* && Array.isArray(SubmittedAssessments) */))
        {
            this.setState({
                Status:"failed",
                ErrorMessage:<h1 className="text-danger">Submitted Assessments has issues<div dangerouslySetInnerHTML={{__html:Tools.prettyJson(this.props.CourseContent)}}/></h1>
            },callback);
            return;
        }


        /*******************************************************************/
        /* Assessment is Ready                                             */
        /*******************************************************************/
        this.setState({
            Status:"ready"
        },callback);
        return;
    }
    render()
    {
        let {AnswerableQuestionGroup,AnsweringQuestionGroup,LastedSubmissions,...rest}=this.props.CourseContent;
        if(this.state.Status=="active"){
            return this.renderOnActiveAssessment(AnsweringQuestionGroup,AnswerableQuestionGroup,LastedSubmissions,rest);
        }
        if(this.state.Status=="ready"){
            return this.renderOnReadyAssessment(AnsweringQuestionGroup,AnswerableQuestionGroup,LastedSubmissions,rest);
        }
        if(this.state.Status=="locked"){
            return this.renderOnLockedAssessment(AnsweringQuestionGroup,AnswerableQuestionGroup,LastedSubmissions,rest);
        }
        if(this.state.Status=="failed"){
            return <div>{this.state.ErrorMessage}</div>
        }
        return <h1 className="text-danger">Unkown Status {this.state.Status}</h1>
     }


    /**
     * Is Called When The Assessment is currently active
     * @param RunningAssessment
     * @param Assessment
     * @param SubmittedAssessments
     * @param Settings
     */
    renderOnActiveAssessment(RunningAssessment,Assessment,SubmittedAssessments,Settings){

    }

    /**
     * Is Called When The Assessment Ready to be started
     * @param RunningAssessment
     * @param Assessment
     * @param SubmittedAssessments
     * @param Settings
     */
    renderOnReadyAssessment(RunningAssessment,Assessment,SubmittedAssessments,Settings){

    }

    /**
     * Is rendered for when the assessment for any reason is not able to be started
     * @param RunningAssessment
     * @param Assessment
     * @param SubmittedAssessments
     * @param Settings
     */
    renderOnLockedAssessment(RunningAssessment,Assessment,SubmittedAssessments,Settings){


    }
}

export default AssessmentRenderingDecider;