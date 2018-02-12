import React from "react";
import $ from 'jquery';
import {Router, Route, browserHistory} from "react-router";
import UserLogin from "../UserLogin/UserLogin.jsx";
import MainCoursesPage from "../Courses/MainCoursesPage.jsx";
import MultipleRoleLogin from '../UserLogin/MultipleRoleLogin.jsx';
import {Navbar,NavItem,Nav,MenuItem,NavDropdown} from 'react-bootstrap';
import AnswerableQuestions from "../Questions/AnsweredQuestions/AnswerableQuestions.jsx";
import CourseContentPage from "../CourseContent/CourseContentPage.jsx";
import SectionHomePage from "../Section/SectionHomePage.jsx";
class TitledHomePage extends React.Component {

    constructor(props)
    {
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
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}
TitledHomePage.childContextTypes = {
    setTitle: React.PropTypes.func,
    title:React.PropTypes.string
};
export default TitledHomePage;