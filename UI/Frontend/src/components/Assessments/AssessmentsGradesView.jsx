import React from 'react';
import Gradewheel from '../Spiderhouse/Gradewheel.jsx';
import SpiderhouseItem from '../Spiderhouse/SpiderhouseItem.jsx';
import Spiderhouse from '../Spiderhouse/Spidershouse.jsx';

class AssessmentsGradesView extends React.Component{

    static propTypes={
        Assessments:React.PropTypes.array
    };

    render(){
        return <Spiderhouse Size={200}>
                    {this.props.Assessments.map(function(assessment,index)
                    {
                        return <SpiderhouseItem key={index} Grade={assessment.Grade} Weight={1} />
                    }.bind(this))}
               </Spiderhouse>
    }

}

export  default AssessmentsGradesView