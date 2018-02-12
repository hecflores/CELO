import React from 'react'
import $ from 'jquery';
import DataContainer from '../Containers/DataContainer.jsx';

import ValidationInput from 'components/Tools/ValidationInput.jsx';
import ValueMatches from "components/Tools/ValueMatcher/ValueMatches.jsx";
import ValueMatcher from "components/Tools/ValueMatcher/ValueMatcher.jsx";

import AssessmentCourseContentCreation from './AssessmentCourseContentCreation.jsx';
import FileCourseContentCreation from './FileCourseContentCreation.jsx';
import FolderCourseContentCreation from './FolderCourseContentCreation.jsx';
import MagicPointsCourseContentCreation from './MagicPointsCourseContentCreation.jsx';
import SectionContentCreation from './SectionContentCreation.jsx';
import TopicCourseContentCreation from './TopicCourseContentCreation.jsx';
import WeekCourseContentCreation from './WeekCourseContentCreation.jsx';
import TabCourseContentCreation from './TabCourseContentCreation.jsx';

import CELOButton from 'components/Tools/CELOButton.jsx';

class CourseContentCreation extends React.Component
{
    static defaultProps={
        onValidityChanged:function(){},
        onDataChanged:function(){}
    };
    static propTypes={
        CourseContent:React.PropTypes.object.isRequired,
        ContentType:React.PropTypes.string.isRequired,
        onDataChanged:React.PropTypes.func,
        CurrentData:React.PropTypes.object,
        onValidityChanged:React.PropTypes.func
    };

    constructor(props){
        super(props);
        this.state={
            Valid:false,
            data:{},
            ValidData:{}
        };




        this.onIsValid=this.onIsValid.bind(this);
        this.updateData=this.updateData.bind(this);

        this.changeInValid=this.changeInValid.bind(this);
        this.checkValidData=this.checkValidData.bind(this);
    }
    componentWillReceiveProps(props){
        this.setState({
            data:$.extend({id:this.props.CourseContent["id"]},props.CurrentData || {})
        });
    }

    onIsValid(valid){
        this.setState({
            Valid:valid
        }, function(){
            this.props.onValidityChanged(this.state.Valid)
        }.bind(this));

    }
    updateData(data){
        this.setState({
            data:data
        },function(){
            this.props.onDataChanged(this.state.data);
        }.bind(this));
    }
    changeInValid(data)
    {
        this.setState({
            ValidData:$.extend(this.state.ValidData,data)
        },this.checkValidData);
    }
    checkValidData(){
        let valid=true;
        Object.keys(this.state.ValidData).forEach(function(item){
            if(!valid){
                return;
            }
            valid=this.state.ValidData[item];
        }.bind(this));
        if(this.state.Valid!=valid){
            this.onIsValid(valid);

        }

    }

    render()
    {
        return <DataContainer onChange={this.updateData} onSubmit={this.sendData} defaultData={this.state.data} >
                 {function(data,change,send)
                 {
                    return <div className="create-course-content-input">
                                <ValidationInput onValidDataChange={this.changeInValid} MessageOnSuccess={"Perfect!"} isRequired={true} Match={/^.{3,}$/} MessageOnError={"Minimum of 3 characters"} Id={"Name"} Title={"Name"} Placeholder={"Name Of Course Content..."} value={data.Name}  />
                                <ValidationInput onValidDataChange={this.changeInValid} MessageOnSuccess={"Perfect!"} isRequired={true} Match={/^.{3,}$/} MessageOnError={"Minimum of 3 characters"} Id={"Description"} Title={"Description"} Placeholder={"Name Of Course Content..."} value={data.Description}/>
                                <ValueMatches __Value={this.props.ContentType} onChange={change}>
                                    <ValueMatcher match="assessment" component={AssessmentCourseContentCreation}/>
                                    <ValueMatcher match="file" component={FileCourseContentCreation}/>
                                    <ValueMatcher match="folder" component={FolderCourseContentCreation}/>
                                    <ValueMatcher match="magic-points" component={MagicPointsCourseContentCreation}/>
                                    <ValueMatcher match="section" component={SectionContentCreation}/>
                                    <ValueMatcher match="topic" component={TopicCourseContentCreation}/>
                                    <ValueMatcher match="week" component={WeekCourseContentCreation}/>
                                    <ValueMatcher match="tab" component={TabCourseContentCreation}/>
                                </ValueMatches>
                           </div>

                 }.bind(this)}
               </DataContainer>
    }
}

export default CourseContentCreation