
import React from 'react';
// import AssessmentsLoader from '../Assessments/AssessmentsLoader.jsx';
import Layout from '../Template/Layout.jsx';
import CourseContentGenericRenderDecider from '../CourseContent/CourseContentGenericRenderDecider.jsx';
import UserLayoutTemplate from '../LayoutTemplates/UserLayoutTemplate.jsx';
import AssessmentsGradeTable from '../Assessments/AssessmentsGradeTable.jsx';
class AssessmentsPage extends CourseContentGenericRenderDecider
{
    renderEditableMode(){

    }
    renderSubmittingMode(){

    }
    renderViewMode(){

    }
    renderEditingMode(){

    }


    render()
    {
        let {children,...rest}=this.props;
        return <div> {React.cloneElement(this.props.children,rest)}</div>
    }
}


export default AssessmentsPage;