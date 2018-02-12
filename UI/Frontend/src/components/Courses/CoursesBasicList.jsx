import React from 'react';
import CourseLoader from './CoursesLoader.jsx';
import CELOLink from '../Tools/CELOLink.jsx';
import CourseLink from './CourseLink.jsx';

class CoursesBasicList extends React.Component
{
    static propTypes={
        Courses:React.PropTypes.array
    };
    render(){
        return this.props.Courses?
                <div className="courses-basic-list">
                    <ul className="courses-simple-list">
                    {(function() {
                        return this.props.Courses.map(function(course,index){
                            return <li key={index}><CourseLink Course={course}/></li>
                        }.bind(this));
                    }.bind(this))()}
                    </ul>
                </div>:
               <CourseLoader>
                    <CoursesBasicList/>
               </CourseLoader>
    }


}

export default CoursesBasicList