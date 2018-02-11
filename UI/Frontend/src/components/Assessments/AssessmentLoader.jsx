import React from 'react';
import CourseContentAPI from '../../libaries/APIs/CourseContentAPI.jsx';
import APIComponent from '../Containers/APIComponent.jsx';
class AssessmentLoader extends React.Component
{

    static propTypes={
        AnswerableGroupID:React.PropTypes.number.isRequired
    };


    constructor(props){
        super(props);
    }

    componentDidMount(){
        CourseContentAPI.instance.initiate("get-course-content-with-assessment",{AnswerableGroupID:this.props.AnswerableGroupID,Details:true});
    }
    componentWillReceiveProps(props){
        CourseContentAPI.instance.initiate("get-course-content-with-assessment",{AnswerableGroupID:props.AnswerableGroupID,Details:true});
        if(this.props.AnswerableGroupID!=props.AnswerableGroupID){

        }
    }

    render() {
        return <APIComponent APIListener={CourseContentAPI.instance} Event={"get-course-content-with-assessment"} initialInput={{AnswerableGroupID:this.props.AnswerableGroupID, Details:true}}>
                    {function(data,change,refresh){
                        if(data){
                            if(typeof this.props.children == "undefined"){
                                return null;
                            }
                            if(Array.isArray(this.props.children))
                            {
                                return React.Children.map((child,index)=>
                                {
                                    return React.cloneElement(child,{key:index,Assessment:data,onRefresh:refresh});
                                });
                            }

                            return React.cloneElement(this.props.children,{Data:data,AnswerableGroupID:this.props.AnswerableGroupID, Assessment:data["AnsweringQuestionGroup"],CourseContent:data});
                        }
                    }.bind(this)}
               </APIComponent>
    }

}

export default AssessmentLoader
