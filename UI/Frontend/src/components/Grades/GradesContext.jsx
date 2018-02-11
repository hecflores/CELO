import React from 'react';
import APIComponent from '../Containers/APIComponent.jsx';
import AnswerableItemsAPI from '../../libaries/APIs/AnswerableItems.jsx';

class GradesContext extends React.Component
{

    static propTypes={
        Grades:React.PropTypes.array
    };

    static childContextTypes={
        Grades:React.PropTypes.array,
        Refresh:React.PropTypes.func,
    };


    getChildContext(){

        let grades=this.props.Grades;
        grades=grades.map((grade)=> {
            let {Submissions, ...basicGrades}=grade;

            grade.Submissions = Submissions.map((submission) => {
                return {...basicGrades,...submission }
            });

            return grade;
        });

        return {
            Grades:grades,
            Refresh:this.Refresh.bind(this)
        }
    }
    Refresh(){
        AnswerableItemsAPI.instance.initiate("get");
    }

    render()
    {
        return <div className="grades-context">
                 {this.props.children}
               </div>
    }
}

export  default GradesContext