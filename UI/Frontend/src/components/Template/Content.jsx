import React from "react";
import $ from 'jquery';
import {Router, Route, browserHistory,IndexRoute} from "react-router";
import UserLogin from "../UserLogin/UserLogin.jsx";

import MultipleRoleLogin from '../UserLogin/MultipleRoleLogin.jsx';
import {Navbar,NavItem,Nav,MenuItem,NavDropdown} from 'react-bootstrap';
import AnswerableQuestions from "../Questions/AnsweredQuestions/AnswerableQuestions.jsx";
import CourseContentRootPage from "../Pages/CourseContentRootPage.jsx";
import SectionHomePage from "../Pages/SectionHomePage.jsx";
import TitledHomePage from "./TitledHomePage.jsx";
import Heading from "./Heading.jsx";
import MainPage from '../Pages/MainPage.jsx';
import HomePage from '../Pages/HomePage.jsx';
import UserPage from '../Pages/UserPage.jsx';
import UserHomePage from '../Pages/UserHomePage.jsx';
import Assessments from '../Pages/AssessmentsPage.jsx';
import SectionCourseContentPage from '../Pages/SectionCourseContentPage.jsx';
import AssessmentsGrades from '../Assessments/AssessmentsGrades.jsx';
import RegisterPage from '../Pages/RegisterPage.jsx';
import AssessmentHomePage from '../Pages/AssessmentHomePage.jsx';
import AssessmentPage from '../Pages/AssessmentPage.jsx';
import GradesPage from '../Pages/GradesPage.jsx';
import QuestionsPage from '../Pages/QuestionsPage.jsx';
import MainQuestionsPage from '../Pages/MainQuestionsPage.jsx';
import UploadQuestionPage from '../Pages/UploadQuestionPage.jsx';

import QuestionsController from '../Questions/QuestionsController.jsx';
import RootCoursesPage from "../Pages/RootCoursesPage.jsx";
import Section from '../Section/Section.jsx';
class App extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            title:""
        }
    }
    setTitle(title){
        this.setState({
            title:title
        });
    }
    getChildContext() {
        return $.extend({
            setTitle: this.setTitle.bind(this)
        },this.state);
    }
    componentDidMount(){

    }
    render() {
        return (<Router history={browserHistory} >
                    <Route path="/" component={MainPage}>
                        <IndexRoute component={HomePage}/>
                        <Route path="login" component={MultipleRoleLogin} />
                        <Route path={"register(/:Choice)"} component={RegisterPage}/>
                    </Route>

                    <Route path="/portal" component={UserPage}>
                        <IndexRoute component={UserHomePage}/>

                        <Route path="section/:sectionID" component={SectionHomePage}>
                            <Route path="grades" component={GradesPage}/>
                            <Route path="course-content" component={SectionCourseContentPage}>
                                <Route path=":courseContentID" component={CourseContentRootPage}/>
                            </Route>
                        </Route>

                        <Route path={"questions"} component={MainQuestionsPage}>
                            <IndexRoute component={QuestionsPage}/>
                            <Route path={"upload"} component={UploadQuestionPage}/>
                        </Route>

                        <Route path="courses" component={RootCoursesPage}/>
                        <Route path="assessments" component={Assessments} >
                            <IndexRoute component={AssessmentHomePage}/>
                            <Route path={"grades"} component={AssessmentsGrades}/>
                            <Route path={":AnswerableGroupID"} component={AssessmentPage}/>


                        </Route>
                    </Route>

                </Router>

        )
    }
}
App.childContextTypes = {
    setTitle: React.PropTypes.func,
    title:React.PropTypes.string
};
export default App;