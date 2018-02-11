import CourseContentIconImages from './CourseContentIcon/Images/CourseContentIconImages.jsx';
import $ from 'jquery';
import CourseContentImageDisplayer from './CourseContentImageDisplayer.jsx';
import ValueMatches from "components/Tools/ValueMatcher/ValueMatches.jsx";
import ValueMatcher from "components/Tools/ValueMatcher/ValueMatcher.jsx";
import React from 'react';


class CourseContentIcon extends React.Component
{

    render() {
        return <ValueMatches __Value={this.props.CourseContent["Type"]} >
                    <ValueMatcher match={"course"} Image={CourseContentIconImages.Course} component={CourseContentImageDisplayer} />
                    <ValueMatcher match={"assessment"} Image={CourseContentIconImages.Assessment} component={CourseContentImageDisplayer} />
                    <ValueMatcher match={"file"} Image={CourseContentIconImages.File} component={CourseContentImageDisplayer} />
                    <ValueMatcher match={"folder"} Image={CourseContentIconImages.Folder} component={CourseContentImageDisplayer} />
                    <ValueMatcher match={"magic-points"} Image={CourseContentIconImages.MagicPoints} component={CourseContentImageDisplayer} />
                    <ValueMatcher match={"week"} Image={CourseContentIconImages.Week} component={CourseContentImageDisplayer} />
                    <ValueMatcher match={"section"} Image={CourseContentIconImages.Section} component={CourseContentImageDisplayer} />
                    <ValueMatcher match={"topic"} Image={CourseContentIconImages.Topic} component={CourseContentImageDisplayer} />
                    <ValueMatcher match={"tab"} Image={CourseContentIconImages.Tab} component={CourseContentImageDisplayer} />
               </ValueMatches>
            }

}

export default CourseContentIcon