import React from 'react';
import $ from 'jquery';
class CourseContentImageDisplayer extends React.Component
{
    static basicStyle={
        backgroundSize: "contain",
        backgroundPosition: "50% 50%",
        backgroundRepeat: "no-repeat",
        width: "60px",
        height: "40px"
    };
    componentWillMount(){

    }
    render(){

        return React.cloneElement(this.props.Image,{className:"course-content-icon"});
    }
};

export default CourseContentImageDisplayer