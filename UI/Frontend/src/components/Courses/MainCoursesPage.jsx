import React from 'react';
import DataInput from "../Containers/DataInput.jsx";
import CoursesList from "./CoursesList.jsx";
import CoursesAPI from "../../libaries/APIs/CoursesAPI.jsx";
import APIComponent from "../Containers/APIComponent.jsx";
import {Modal} from 'react-bootstrap';
import UserRenderChooser from "../Users/UserRenderChooser.jsx";
import CourseContentTemplateDropdownPicker from '../CourseContentTemplate/CourseContentTemplateDropdownPicker.jsx';
import PopupForm from '../Tools/PopupForm.jsx';
import ValidationInput from '../Tools/ValidationInput.jsx';
import WidgetModule from '../Pages/WidgetModule.jsx';
import WidgetModules from '../Pages/WidgetModules.jsx';
class MainCoursesPage extends UserRenderChooser{
    constructor(props) {
        super(props);
        this.state={
            CreatingCourse:false
        };
        this.CreateCourse=function(){
            this.setState({
                CreatingCourse:true
            });
        }.bind(this);

        this.CreateCourseFinished=function(){
            this.setState({
                CreatingCourse:false
            });
        }.bind(this);
    }
    renderForStudent(){

        return (
            <div className="student-home-page-modules">

                    <CoursesList Displayer={CoursesList.Displays.ver1_replica}/>


                

            </div>
        );
    }
    renderForStaff(){
        return (
            <div className="">

                <div onClick={this.CreateCourse} className="create-new-course-btn">Create</div>
                <CoursesList Displayer={CoursesList.Displays.ver1_replica}/>
                <PopupForm Show={this.state.CreatingCourse} action="/api/courses" method="POST" onClosed={this.CreateCourseFinished} >
                    <input type="hidden" name="__action__" value={"create-new-course"}/>
                    <ValidationInput Id="CourseCategory" Title="Course Category" Placeholder="COSC, GEOL..." Match={/^[A-Z]{4}$/} MessageOnError={"4 capital letters please :)"} MessageOnSuccess={"Thats Right on the Money!"} isRequired={true} />
                    <ValidationInput Id="CourseID" Title="Course ID" Placeholder="1122, 3322..." Match={/^\d{4}$/} MessageOnError={"4 numbers only please"} MessageOnSuccess={"Thats Perfect!"}  isRequired={true} />
                    <ValidationInput Id="CourseName" Title="Course Name" Placeholder="Data Structures..." Match={/^[A-Z].+$/} MessageOnError={"Capitalized and more then 1 letter"} MessageOnSuccess={"Perfect!"} isRequired={true} />
                    <ValidationInput Id="Description" Title="Description" Placeholder="Say some general workds about.." Match={/^([\w\d]{1,30}( |$)){10,40} ?$/} MessageOnError={"10 to 40 words"} MessageOnSuccess={"Perfect!"} isRequired={true} />
                    <CourseContentTemplateDropdownPicker/>
                </PopupForm>
            </div>
        );
    }
}

MainCoursesPage.propTypes={
};

export default MainCoursesPage;
