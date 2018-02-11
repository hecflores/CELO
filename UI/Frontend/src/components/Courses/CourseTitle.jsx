import React from 'react';
import APIComponent from '../Containers/APIComponent.jsx';
import DataInput from '../Containers/DataInput.jsx';
import CoursesAPI from "../../libaries/APIs/CoursesAPI.jsx";
import {ButtonGroup, Button} from 'react-bootstrap';
import Loader from '../Containers/Loader.jsx';
class CourseTitle extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="course-title">
                <div className="course-category">{this.props.Course["CourseCategory"]}</div>
                <div className="course-id">{this.props.Course["CourseID"]}</div>
                <div className="course-name">{this.props.Course["CourseName"]}</div>
            </div>
        );
    }
}

CourseTitle.propTypes = {
    Course:React.PropTypes.object.isRequired
};

CourseTitle.Displays = {};


export default CourseTitle;