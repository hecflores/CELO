
import React from 'react';
import UserRenderChooser from '../Users/UserRenderChooser.jsx';
import CourseContentAction from '../CourseContent/CourseContentAction.jsx';
import CourseContentTitle from '../CourseContent/CourseContentTitle.jsx';
import CourseLink from '../Courses/CourseLink.jsx';
import AnswerableItemGradesProgressWheel from './AnswerableItemGradesProgressWheel.jsx';
import UsersGradesProgressWheel from './UsersGradesProgressWheel.jsx';

import AnswerableItemGrades from './AnswerableItemGrades.jsx';
import GradesGrid from './GradesGrid.jsx';
class GradesTableView_AnswerableGroup extends UserRenderChooser
{
    static propTypes={
        AnswerableGroup:React.PropTypes.object,
    };

    renderForStaff(){
        return <div className="answerable-group">
                    <div className="title">
                        <CourseLink Course={this.props.AnswerableGroup.Course}/>
                        <CourseContentAction CourseContent={this.props.AnswerableGroup.CourseContent}>
                            <CourseContentTitle CourseContent={this.props.AnswerableGroup.CourseContent}/>
                        </CourseContentAction>
                    </div>
                    {Array.isArray(this.props.AnswerableGroup.Submissions)?this.props.AnswerableGroup.Submissions.map((submission,index)=>
                        {
                            return <div className="submission">
                                        <div className="grade">{submission.Grade}%</div><div className="percent-done">{submission.PercentDone}</div>
                                   </div>
                        }):null}
               </div>
    }
    renderForStudent(){

    }
}
class GradesTable extends UserRenderChooser
{
    static contextTypes={
        Grades:React.PropTypes.array,
        SectionID:React.PropTypes.number,
        UserInfo:React.PropTypes.object
    };

    state={
        Grades:false
    };
    componentWillMount(){
        let finalGrades=[];
        this.context.Grades.forEach((grade)=>
        {
            if(grade.SectionID==this.props.SectionID){
                finalGrades.push(grade);
            }
        });

        this.setState({
            Grades:finalGrades
        });
    }

    renderForStaff()
    {
        return  <div className="answerable-group">
            <UsersGradesProgressWheel AnswerableItems={this.context.Grades}/>
            <GradesGrid AnswerableItems={this.context.Grades}/>
        </div>

    }
    renderForStudent(){
        return  <div className="answerable-group">
                    <AnswerableItemGradesProgressWheel AnswerableItems={this.context.Grades}/>
                    <AnswerableItemGrades AnswerableItems={this.context.Grades}/>
                </div>
    }

}

export  default GradesTable