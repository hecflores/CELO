import React from 'react';
import CourseContentChildren from './CourseContentChildren.jsx';
class CourseContentTabs extends React.Component{


    render(){
        return <CourseContentChildren Children={this.props.CourseContent["Children"]}>
            {function (courseContent, index, onClick) {
                return <CourseContentTabLoading onClick={onClick} CourseContent={courseContent} />
            }}
               </CourseContentChildren>
    }
}

export default CourseContentTabs