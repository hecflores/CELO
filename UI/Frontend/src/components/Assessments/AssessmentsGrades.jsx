import React from 'react';
import AssessmentsLoader from '../Assessments/AssessmentsLoader.jsx';
import AssessmentsGradesView from '../Assessments/AssessmentsGradesView.jsx';

import UserRenderChooser from '../Users/UserRenderChooser.jsx';

class AssessmentsGrades extends UserRenderChooser
{
    renderForStaff(){
        return  <AssessmentsLoader>
                    <AssessmentsGradesView/>
                </AssessmentsLoader>;
    }
    renderForStudent(){
        return  <AssessmentsLoader>
                    <AssessmentsGradesView/>
                </AssessmentsLoader>;
    }
}


export default AssessmentsGrades