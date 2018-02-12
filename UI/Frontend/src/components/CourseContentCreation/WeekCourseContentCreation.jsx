import React from 'react';
import {ImportPropertyTrueFalse,ImportProperties,CourseContentGenericRenderDecider} from '../CourseContent/CourseContentGenericRenderDecider.jsx';
class WeekCourseContentCreation extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return  <div>
                    <ImportProperties ViewMode="editing" Title={"Start Date"} Id={"startDate"} CustomElement={<input type="date"/>} {...this.props}/>
                    <ImportProperties ViewMode="editing" Title={"End Date"} Id={"endDate"} CustomElement={<input type="date"/>} {...this.props}/>
                </div>
    }
}

export default WeekCourseContentCreation
