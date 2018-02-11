import React from 'react';
import CourseContent from '../CourseContent/CourseContent.jsx';
import CourseContentViabilityManager from '../CourseContent/CourseContentViabilityManager.jsx';
import CourseContentRootPage from '../Pages/CourseContentRootPage.jsx';
class SectionRootCourseContent extends React.Component
{

    static propTypes={
        SectionInfo:React.PropTypes.object
    };


    render(){
        let {children,params, ...rest}=this.props;
        return <CourseContentRootPage params={{courseContentID:this.props.Data["CourseContent"]["ContentID"]}} />

    }
}

export default SectionRootCourseContent