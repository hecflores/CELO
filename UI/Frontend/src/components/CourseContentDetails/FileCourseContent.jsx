import React from 'react';
import CourseContentGenericRenderDecider from '../CourseContent/CourseContentGenericRenderDecider.jsx';
import CourseContentTabs from '../CourseContent/CourseContentTabs.jsx';
class FileCourseContent extends CourseContentGenericRenderDecider{

    renderEditableMode()
    {
        return <div>
            <iframe style={{width:"100%",height:"100vh"}} src={this.props.CourseContent.Properties.File.link}></iframe>
        </div>

    }
    renderEditingMode()
    {
        return <h1>{"File"}</h1>
    }
    renderViewMode()
    {
        return <div>
                    <iframe style={{width:"100%",height:"100vh"}} src={this.props.CourseContent.Properties.File.link}></iframe>
                </div>
    }
    renderSubmittingMode()
    {
        return <h1>{"File"}</h1>
    }
}

export default FileCourseContent