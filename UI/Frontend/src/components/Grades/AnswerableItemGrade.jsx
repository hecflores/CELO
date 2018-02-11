/**
 * Created by Hector on 5/4/2017.
 */

import React from 'react';
import CourseContentTitle from '../CourseContent/CourseContentTitle.jsx';
import CELOButton from '../Tools/CELOButton.jsx';
import Grade from '../Tools/Grade.jsx';
import {browserHistory} from 'react-router';
class AnswerableItemGrade extends React.Component {

    static childContextTypes = {};
    static contextTypes = {};
    static defaultProps = {
        onClick:function(){},
        onHover:function(){}
    };
    static propTypes = {
        AnswerableItem:React.PropTypes.object.isRequired,
        onClick:React.PropTypes.func,
        onHover:React.PropTypes.func
    };

    state = {
        ShowPreviousSubmissions:false
    };


    constructor(props) {
        super(props);

        this.toggleShowPreviousSubmissions=this.toggleShowPreviousSubmissions.bind(this);
        this.redirect=this.redirect.bind(this);
    }
    toggleShowPreviousSubmissions(){
        this.setState({
            ShowPreviousSubmissions:!this.state.ShowPreviousSubmissions
        });
}
    getChildContext() {
        return {};
    }
    redirect(){
        browserHistory.push("/portal/section/"+this.props.AnswerableItem.CourseContent["SectionID"]+"/course-content/"+this.props.AnswerableItem.CourseContent["ContentID"]);
    }
    render() {
        return (
            <div onClick={this.redirect} className="answerable-grade-container">
                <CourseContentTitle CourseContent={this.props.AnswerableItem.CourseContent}/>
                <CELOButton onClick={this.toggleShowPreviousSubmissions} Text={this.props.AnswerableItem.Submissions.length+" Submissions"} TooltipText={"See your previous attempts"} Enabled={this.props.AnswerableItem.Submissions.length>1}>

                </CELOButton>
                <Grade Grade={Math.round(this.props.AnswerableItem.Grade)}/>
                {this.state.ShowPreviousSubmissions?<div className="submission-items">
                        {this.props.AnswerableItem.Submissions.map(function(item,index){
                            return <div className="submission-item" key={index}>
                                       <Grade Grade={item.Grade}/>
                                   </div>
                        }.bind(this))}
                    </div>:null}
            </div>
        );
    }
}

export default AnswerableItemGrade;