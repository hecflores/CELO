import React from 'react';
import CourseContentRoot from './CourseContentRoot.jsx';
import CourseContentSaver from './CourseContentSaver.jsx';

class CourseContentPage extends React.Component
{
    constructor(props) {
        super(props);
        this.state= {

        };
        this.updateCourseContent=this.updateCourseContent.bind(this);
    }
    updateCourseContent(courseContent){
        this.setState({
            CourseContent:courseContent
        });
    }
    componentDidMount()
    {
        this.setState({
            ViewMode:this.props.ViewMode
        });
    }
    render(){
        return (<CourseContentSaver CourseContentID={parseInt(this.props.params.courseContentID)}>
                    <CourseContentRoot onUpdated={this.updateCourseContent} {...this.props} />
                </CourseContentSaver>)
    }
}

export default CourseContentPage