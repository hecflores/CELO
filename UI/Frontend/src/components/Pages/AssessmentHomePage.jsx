import React from 'react';
import CELOLinkButton from '../Tools/CELOLinkButton.jsx';
class AssessmentHomePage extends React.Component{



    render(){
        return <div>
                    <h1>Assessment Home Page</h1>
                     <CELOLinkButton to={"/portal/assessments/grades"} Enabled={true} TooltipText={"See your Grades here"}>Grades</CELOLinkButton>
                </div>
    }
}


export  default  AssessmentHomePage