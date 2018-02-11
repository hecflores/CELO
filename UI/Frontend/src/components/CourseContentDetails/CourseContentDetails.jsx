import React from 'react';
import CourseContentGenericRenderDecider from '../CourseContent/CourseContentGenericRenderDecider.jsx';
import ValueMatches from "components/Tools/ValueMatcher/ValueMatches.jsx";
import ValueMatcher from "components/Tools/ValueMatcher/ValueMatcher.jsx";

import AssessmentCourseContent from './AssessmentCourseContent.jsx';
import FileCourseContent from './FileCourseContent.jsx';
import FolderCourseContent from './FolderCourseContent.jsx';
import MagicPointsCourseContent from './MagicPointsCourseContent.jsx';
import SectionCourseContent from './SectionCourseContent.jsx';
import TopicCourseContent from './TopicCourseContent.jsx';
import WeekCourseContent from './WeekCourseContent.jsx';
import CourseCourseContent from './CourseCourseContent.jsx';
import TabCourseContent from './TabCourseContent.jsx';
class CourseContentDetails extends React.Component
{

    static propTypes={
        CourseContent:React.PropTypes.object
    };
    render(){
        return <ValueMatches __Value={this.props.CourseContent.Type} {...this.props}>
                    <ValueMatcher match={"assessment"}  component={AssessmentCourseContent} />
                    <ValueMatcher match={"file"} component={FileCourseContent} />
                    <ValueMatcher match={"folder"} component={FolderCourseContent} />
                    <ValueMatcher match={"magic-points"} component={MagicPointsCourseContent} />
                    <ValueMatcher match={"week"} component={WeekCourseContent} />
                    <ValueMatcher match={"section"} component={SectionCourseContent} />
                    <ValueMatcher match={"topic"} component={TopicCourseContent} />
                    <ValueMatcher match={"course"} component={CourseCourseContent} />
                    <ValueMatcher match={"tab"} component={TabCourseContent} />

               </ValueMatches>
    }
}

export default CourseContentDetails;