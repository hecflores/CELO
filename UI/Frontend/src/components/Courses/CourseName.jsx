import React from 'react'

const CourseName=(props)=>
{
    if(props.Course) {
        return <span className="course-name">
                <span className="course-category">
                    {props.Course.CourseCategory}
                </span> <span className="course-id">{props.Course.CourseID}</span></span>;
    }

    return <span className="course-name error">No Course Found</span>

};
export default CourseName