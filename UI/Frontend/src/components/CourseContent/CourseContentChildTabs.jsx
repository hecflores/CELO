import React from 'react';
import CourseContentChildTab from './CourseContentChildTab.jsx';
import CourseContentChildren from './CourseContentChildren.jsx';
class CourseContentChildTabs extends React.Component{

    static propTypes={
        CourseContent:React.PropTypes.object
    };
    state={
        SelectedCourseContent:-1
    };
    constructor(props){
        super(props);



    }
    componentWillMount(){
        this.selectCourseContentTab(this.props["CourseContent"]["ContentID"]);
    }
    selectCourseContentTab(index){
        this.setState({
            LastCourseContent:this.state.SelectedCourseContent,
            SelectedCourseContent:index
        });
    }
    componentWillReceiveProps(props){
        if(props.LastCourseContent!=props["CourseContent"]["ContentID"]) {
            this.selectCourseContentTab(props["CourseContent"]["ContentID"]);
        }
    }

    render(){
        if(typeof this.props.CourseContent.Breadcrums == "undefined"){
            return null;
        }
        if(this.props.CourseContent.Breadcrums.length==0){
            return <div className="course-content-children empty"></div>
        }
        let {parent,CourseContent,CourseContentID,...props}=this.props;
        return  <CourseContentChildren className="parent-course-content"  Children={this.props.CourseContent["Breadcrums"][0]["Children"]}>
            {function (courseContent, index, onClick) {
                return <div tabIndex={index} className={this.state.SelectedCourseContent==courseContent["ContentID"]?"wrapper is-selected":"wrapper"}>
                            <CourseContentChildTab onClick={(e)=>{this.selectCourseContentTab(courseContent["ContentID"]); onClick(e);}} CourseContentID={courseContent["ContentID"]} CourseContent={courseContent} {...props} Parent={parent}  />
                       </div>
            }.bind(this)}
        </CourseContentChildren>


    }

}

export default CourseContentChildTabs