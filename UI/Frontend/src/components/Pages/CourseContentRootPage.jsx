import React from 'react';
import CourseContentPage from '../CourseContent/CourseContentPage.jsx';
import UserRenderChooser from '../Users/UserRenderChooser.jsx';
import CourseContentViabilityManager from '../CourseContent/CourseContentViabilityManager.jsx';
class CourseContentRootPage extends UserRenderChooser{

    constructor(props){
        super(props);
    }

    render()
    {
        return <CourseContentViabilityManager >
                    <CourseContentPage {...this.props}/>
               </CourseContentViabilityManager>
    }
}

export default CourseContentRootPage