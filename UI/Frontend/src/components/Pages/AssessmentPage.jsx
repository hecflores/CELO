import React from 'react';
import AssessmentRenderingDecider from '../Assessments/AssessmentRenderingDecider.jsx';
import UserLayoutTemplate from '../LayoutTemplates/UserLayoutTemplate.jsx';
import SimpleContainer from '../Tools/SimpleContainer.jsx';
import RunningAssessmentQuestionStatusGrid from "../RunningAssessment/RunningAssessmentQuestionStatusGrid.jsx";
import RunningAssessmentProgressBar from "../RunningAssessment/RunningAssessmentProgressBar.jsx";
import RunningAssessment from "../RunningAssessment/RunningAssessment.jsx";
import AssessmentInfo from '../Assessments/AssessmentInfo.jsx';
import AssessmentLoader from '../Assessments/AssessmentLoader.jsx';
import CourseContentViabilityManager from '../CourseContent/CourseContentViabilityManager.jsx';
import Layout from '../Template/Layout.jsx';
import AssessmentStartButton from '../Assessments/AssessmentStartButton.jsx';
class AssessmentPage extends AssessmentRenderingDecider{


    /**
     * Is Called When The Assessment is currently active
     * @param RunningAssessmentObj
     * @param Assessment
     * @param SubmittedAssessments
     * @param Settings
     */
    renderOnActiveAssessment(RunningAssessmentObj, Assessment, SubmittedAssessments, Settings) {
        return <Layout className="assessment-page" PageTitle={"Assessments Portal"} Template={UserLayoutTemplate}>
                    <Layout.Header>
                        <SimpleContainer>
                            <a>Running a Assessment</a>
                        </SimpleContainer>
                    </Layout.Header>

                    <Layout.LeftSidePanel>
                        <SimpleContainer>
                            <div>
                                <RunningAssessmentQuestionStatusGrid RunningAssessment={RunningAssessmentObj}/>
                                <RunningAssessmentProgressBar RunningAssessment={RunningAssessmentObj}/>
                            </div>
                        </SimpleContainer>
                    </Layout.LeftSidePanel>

                    <Layout.Body>
                        <RunningAssessment RunningAssessment={RunningAssessmentObj}/>
                    </Layout.Body>
                </Layout>
    }

    /**
     * Is Called When The Assessment Ready to be started
     * @param RunningAssessment
     * @param Assessment
     * @param SubmittedAssessments
     * @param Settings
     */
    renderOnReadyAssessment(RunningAssessment, Assessment, SubmittedAssessments, Settings) {
        return <Layout className="assessment-page" PageTitle={"Assessments Page"} Template={UserLayoutTemplate}>
                    <Layout.Header>
                        <SimpleContainer>
                            <a style={{color:"white",fontWeight:"bold"}}>Assessment Ready To Start</a>
                        </SimpleContainer>
                    </Layout.Header>

                    <Layout.LeftSidePanel>
                        <SimpleContainer>
                            <div className="assessment-info">
                                <h1>Have List of Other Assessment</h1>
                            </div>
                        </SimpleContainer>
                    </Layout.LeftSidePanel>

                    <Layout.Body>
                        <SimpleContainer>
                            <div className="assessment-info">
                                <AssessmentInfo {...this.props}/>
                                <AssessmentStartButton {...this.props} />
                            </div>
                        </SimpleContainer>
                    </Layout.Body>
                </Layout>
    }

    /**
     * Is rendered for when the assessment for any reason is not able to be started
     * @param RunningAssessment
     * @param Assessment
     * @param SubmittedAssessments
     * @param Settings
     */
    renderOnLockedAssessment(RunningAssessment, Assessment, SubmittedAssessments, Settings) {
        return <div>
            <h1>Sorry, this assessment is locked for you</h1>
        </div>

    }

    render(){
        let {children, ...rest} = this.props;
        return this.props.AnswerableGroupID?super.render():
            (<AssessmentLoader AnswerableGroupID={parseInt(this.props.params.AnswerableGroupID)}>
                <CourseContentViabilityManager>
                    <AssessmentPage {...rest}/>
                </CourseContentViabilityManager>
            </AssessmentLoader>)
    }

}
export default AssessmentPage
