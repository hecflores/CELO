/**
 * Created by Hector on 5/8/2017.
 */

import React from 'react';
import UserRenderChooser from '../Users/UserRenderChooser.jsx';
import AnswerableItemGrades from './AnswerableItemGrades.jsx';
import Grade from '../Tools/Grade.jsx';
import DateFormat from '../Tools/DateFormat.jsx';
class GradesTableSmallItem extends React.Component{

    static childContextTypes = {};
    static contextTypes={};
    static defaultProps = {};
    static propTypes = {
        AnswerableItem:React.PropTypes.object.isRequired,
        onClick:React.PropTypes.func,
        onHover:React.PropTypes.func
    };
    state={};


    constructor(props) {
        super(props);
    }

    getChildContext() {
        return {};
    }

    componentWillMount(){

    }

    componentDidMount() {
        // Called When it does mount
    }

    componentWillUnmount() {
        // Called When it unmounts
    }

    componentWillReceiveProps(props, context) {
        // Called When it receives props & context
    }

    componentWillUpdate() {
        // Right before rendering. Dont Do setStat here.
    }

    componentDidUpdate() {
        // Place to chech for dom stuff
    }

    render() {

        return (<div className="grade-table-small-item">
            <div className="finished-on-item"><DateFormat Date={this.props.AnswerableItem.FinishedOn}/></div><Grade Grade={this.props.AnswerableItem.Grade}/>
                </div>);
    }
}


class GradesTableSmall extends UserRenderChooser {

    static childContextTypes = {};
    static contextTypes={
        Grades:React.PropTypes.array,
        SectionID:React.PropTypes.number,
        UserInfo:React.PropTypes.object
    };
    static defaultProps = {};
    static propTypes = {};
    state={
        Grades:false
    };


    constructor(props) {
        super(props);
    }

    getChildContext() {
        return {};
    }

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

    componentDidMount() {
        // Called When it does mount
    }

    componentWillUnmount() {
        // Called When it unmounts
    }

    componentWillReceiveProps(props, context) {
        // Called When it receives props & context
    }

    componentWillUpdate() {
        // Right before rendering. Dont Do setStat here. 
    }

    componentDidUpdate() {
        // Place to chech for dom stuff
    }

    render() {
        if(this.context.Grades.length===0){
            return null;
        }
        return (
            <div className="grades-table-small">
                {this.context.Grades[0].Submissions.map((grade,index)=>{
                    return <GradesTableSmallItem AnswerableItem={grade} key={index}/>
                })}
            </div>
        );
    }
}

export default GradesTableSmall;