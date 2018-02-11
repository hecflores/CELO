import React from 'react';
import PopupForm from '../Tools/PopupForm.jsx';
import NumberInput from '../Tools/NumberInput.jsx';
import ValidationInput from '../Tools/ValidationInput.jsx';
import CourseContentTemplateDropdownPicker from '../CourseContentTemplate/CourseContentTemplateDropdownPicker.jsx';
class SectionCreatorPopup extends React.Component
{
    static defaultProps={
        onSubmit:function(){},
        onClose:function(){},
        Show:false
    };
    static propTypes={
        Show:React.PropTypes.bool,
        CourseUniqueID:React.PropTypes.number.isRequired,
        onSubmit:React.PropTypes.func,
        onClose:React.PropTypes.func
    };

    render(){
        return <PopupForm action="/api/courses"
                          method="POST"
                          Show={this.props.Show}
                          Title={"Add New Section"}
                          onSubmit={this.props.onSubmit}
                          onClosed={this.props.onClose}
        >
                    <input name="__action__" type="hidden" value="add-section"/>
                    <input name="CourseUniqueID" type="hidden" value={this.props.CourseUniqueID}/>
                    <NumberInput Id={"SectionNumber"} Title={"Section Number"} Placeholder={"Can be any random number..."}/>
                    <ValidationInput isRequired={true} MessageOnError={"Is Required"} MessageOnSuccess={"Lets Do it!"} Id={"TextBookInformation"} Title="Textbook Info" />
                    <CourseContentTemplateDropdownPicker/>

               </PopupForm>

    }
}

export default SectionCreatorPopup