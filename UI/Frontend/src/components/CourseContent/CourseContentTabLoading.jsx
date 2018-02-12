import React from 'react';

class CourseContentTabs extends React.Component{


    render(){
        return <CourseContentChildren Children={this.props.CourseContent["Children"]}>
            {function (courseContent, index, onClick) {
                return <CourseContentTab onClick={onClick} CourseContent={courseContent} />
            }}
        </CourseContentChildren>
    }
}
export default CourseContentTabs