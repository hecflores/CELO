import React from 'react';
import APIComponent from '../Containers/APIComponent.jsx';
import DataInput from '../Containers/DataInput.jsx';
import CoursesAPI from "../../libaries/APIs/CoursesAPI.jsx";
import {ButtonGroup,Button} from 'react-bootstrap';
import Loader from '../Containers/Loader.jsx';
import SectionCreatorPopup from '../Section/SectionCreatorPopup.jsx';
import UserRenderChooser from "../Users/UserRenderChooser.jsx";
import UserAuthenticator from '../Users/UserAuthenticator.jsx';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router'
class CourseDisplay extends UserRenderChooser
{
    static contextTypes={
        refresh:React.PropTypes.func,
        UserAuthenticator:React.PropTypes.instanceOf(UserAuthenticator)
    };
    static propTypes={
        Course:React.PropTypes.object,
        Index:React.PropTypes.number
    };
    constructor(props) {
        super(props);
        this.state={
            AddingSection:false,
            AddingSectionSaving:false
        };

        this.AddSection=function(){
            this.setState({
                AddingSection:true
            });
        }.bind(this);
        this.SavingAddingSection=function(){
            this.setState({
                AddingSectionSaving:true
            });
        }.bind(this);
        this.FinishedAddingSection=function(){
            this.context.refresh();
        }.bind(this);
    }


    render(){
        return (
            <div className="course-root" tabIndex={this.props.Index}>
                <div className="course-container">
                    <div className="course-name-tuple">
                        <div className="course-category">{this.props.Course["CourseCategory"]}</div>
                        <div className="course-id">{this.props.Course["CourseID"]}</div>
                        <div className="course-name">{this.props.Course["CourseName"]}</div>
                    </div>
                </div>
                <div className="course-sections">

                    <div className="sections-container" >
                        {
                            (this.props.Course["Sections"] && this.props.Course["Sections"].length>0?
                                (this.props.Course["Sections"][0]["SectionID"]!=null)?this.props.Course["Sections"].map(function(section,index) {
                                        return (
                                            <Link className="section-item" key={index} to={"/portal/section/"+section["SectionID"]}>
                                                {section["SectionNumber"]}
                                            </Link>);
                                    }):(<div>{"No Sections Found"}</div>)
                                :(<div>{"Sections Was Not Found. Error"}</div>))
                        }
                    </div>
                    <SectionCreatorPopup onClose={this.FinishedAddingSection} onSubmit={this.FinishedAddingSection} CourseUniqueID={this.props.Course["CourseUniqueID"]} Show={this.state.AddingSection}/>
                    {this.context.UserAuthenticator.isStaff()?<div className="sections-control-panel">
                        <div className="add-section-container">
                            <button onClick={this.AddSection} className="btn btn-default" >Add Section</button>
                        </div>
                    </div>:null}
                </div>
            </div>
        )
    }
}
class CoursesList extends UserRenderChooser{
    constructor(props) {
        super(props);


    }

    render(){
        return <div className={this.isStaff()?"staff-view courses-list":"student-view courses-list"}>{
            (this.props.Courses ? (
                    this.props.Courses.map(function (item, index) {
                        //console.debug("Displaying Course("+index+")");
                        return (<div className="course-item" key={index}>{this.props.Displayer(item)}</div>);
                    }.bind(this))

                ) : (
                    <APIComponent Message="Loading Courses..." APIListener={CoursesAPI.instance} Event="get"
                                  Fetch={true}>
                        {function (data, change, getTrigger, putTrigger) {
                            return (<CoursesList Displayer={this.props.Displayer.bind(this)} Courses={data}/>);
                        }.bind(this)}
                    </APIComponent>
                ))
        }</div>;
    }
}

CoursesList.propTypes={
    Courses:React.PropTypes.arrayOf(React.PropTypes.object),
    Displayer:React.PropTypes.func.isRequired
};

CoursesList.Displays={
    default:function(course){

        return (<div >{course["CourseCategory"]+" "+course["CourseID"]+"-"+course["CourseName"]}</div>)
    },
    ver1_replica:function(course, index){
        return (
            <CourseDisplay Course={course} Index={index}/>
        )
    }
};


export default CoursesList;