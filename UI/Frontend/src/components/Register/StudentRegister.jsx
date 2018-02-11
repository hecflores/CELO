import React from 'react';
import APIComponent from '../Containers/APIComponent.jsx';
import UserAPI from '../../libaries/APIs/UserAPI.jsx';
import {PasswordMatcher,Input} from '../Tools/Input.jsx';
import AjaxForm from '../Tools/AjaxForm.jsx';
import ValidationInput from '../Tools/ValidationInput.jsx';
import ValidateAllEqual from '../Tools/ValidateAllEqual.jsx';
import {browserHistory} from 'react-router';
import SubmitButton from '../Tools/SubmitButton.jsx';
class StudentRegister extends React.Component{

    registerStudent(data){
        if(data.success){
            browserHistory.push('/portal');
        }
    }
    render(){
        return <AjaxForm method="POST" action="/api/users" onSubmit={this.registerStudent}>
                    <input type="hidden" name="Role" value={"Student"} />
                    <input type="hidden" name="__action__" value={"register"}/>
                    <ValidationInput  Match={/.{7}$/} isRequired={true} Id="UHID"  Placeholder={"Student UHID"} Title={"Student UHID"} MessageOnError={"7 #s"} MessageOnSuccess={"Thanks! :)"}/>
                    <ValidationInput  Match={/.{7,}$/} isRequired={true} Id="UserName"  Placeholder={"User Name..."} Title={"User Name"} MessageOnError={"At least 7 characters"} MessageOnSuccess={"Thanks! :)"}/>
                    <ValidationInput  Match={/^[A-Z][^\d]+$/} isRequired={true} Id="FirstName"  Placeholder={"First Name..."} Title={"First Name"} MessageOnError={"Capitalized Please"} MessageOnSuccess={"Thanks! :)"}/>
                    <ValidationInput  Match={/^[A-Z][^\d]+$/}  isRequired={true} Id="LastName" Placeholder={"Last Name..."} Title={"Last Name"} MessageOnError={"Capitalized Please"} MessageOnSuccess={"Thanks! :)"}/>
                    <ValidationInput  Match={/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/} isRequired={true} Id="Email" Placeholder={"Email..."} Title={"Email"} MessageOnError={"Email Format"} MessageOnSuccess={"Thanks! :)"}/>
                    <ValidationInput  Match={/^\d{3}-\d{3}-\d{4}$/} isRequired={true} Id="PhoneNumber"  Placeholder={"Phone Number..."} Title={"Phone Number"} MessageOnError={"In ###-###-#### format"} MessageOnSuccess={"Thanks! :)"}/>
                    <ValidateAllEqual>
                        <ValidationInput isRequired={true} Id="Password"  Placeholder={"Password"} Title={"Password"} MessageOnError={"Required"} MessageOnSuccess={"Thanks! :)"}/>
                        <ValidationInput isRequired={true} Id="_" Placeholder={"Repeat Password"} Title={"Repeat Password"} MessageOnError={"Required"} MessageOnSuccess={"Thanks! :)"}/>
                    </ValidateAllEqual>
                    <SubmitButton  TooltipText="Ok, Lets Get Started" value={"Register"} className="btn btn-default btn-inverse">Register</SubmitButton>
                </AjaxForm>

    }
}

export default StudentRegister;