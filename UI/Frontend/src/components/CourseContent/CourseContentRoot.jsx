import React from 'react';
import CourseContent from './CourseContent.jsx';
import CourseContentLoader from './CourseContentLoader.jsx';
import CourseContentSaver from './CourseContentSaver.jsx';
import CourseContentViabilityManager from './CourseContentViabilityManager.jsx';
import CourseContentGenericRenderDecider from './CourseContentGenericRenderDecider.jsx';

class CourseContentRoot extends CourseContentGenericRenderDecider{

    static defaultProps={
        onUpdated:function(){}
    };

    static propTypes={
        CourseContentID:React.PropTypes.number,
        onUpdated:React.PropTypes.func
    };

    renderSubmittingMode()
    {
        return (<CourseContent {...this.props} />)
    }
    renderViewMode()
    {
        return (<CourseContentSaver {...this.props} isFetching={typeof this.props.CourseContent != 'object'}>
                  <CourseContent/>{/* Will be filled with info by above*/}
                </CourseContentSaver>)
    }
    renderEditableMode()
    {
        return (<CourseContentSaver {...this.props} isFetching={typeof this.props.CourseContent != 'object'}>
                  <CourseContent/>{/* Will be filled with info by above*/}
                </CourseContentSaver>)
    }
    renderEditingMode()
    {
        return (<CourseContentSaver {...this.props} isFetching={typeof this.props.CourseContent != 'object'}>
                    <CourseContent/>{/* Will be filled with info by above*/}
                </CourseContentSaver>)
    }
    render(){
        return <CourseContentViabilityManager>
                  <CourseContent {...this.props} />
               </CourseContentViabilityManager>
    }

}

export default CourseContentRoot