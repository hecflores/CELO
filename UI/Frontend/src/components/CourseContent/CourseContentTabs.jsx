import React from 'react';
import CourseContentTab from './CourseContentTab.jsx';
import CourseContentChildren from './CourseContentChildren.jsx';

class CourseContentTabs extends React.Component{

    state={
        SelectedCourseContent:-1
    };
    constructor(props){
        super(props);



    }
    selectCourseContentTab(index){
        this.setState({
            SelectedCourseContent:index
        });
    }
    render(){

        let {parent,CourseContent,CourseContentID,...props}=this.props;
        return <CourseContentChildren  Children={this.props.CourseContent["Children"]}>
                    {function (courseContent, index, onClick) {
                        return <div tabIndex={index} className={this.state.SelectedCourseContent==index?"wrapper is-selected":"wrapper"}>
                                    <CourseContentTab onClick={(e)=>{this.selectCourseContentTab(index); onClick?onClick(e):false;}}  CourseContentID={courseContent["ContentID"]} CourseContent={courseContent} {...props} Parent={parent}  />
                               </div>
                    }.bind(this)}
               </CourseContentChildren>
    }
}

export default CourseContentTabs