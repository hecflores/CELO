import ValidationInput from '../Tools/ValidationInput.jsx';
import React from 'react';
const NumberInput=(props)=>
{
    return <ValidationInput  isRequired={true}  MessageOnError={"Only Numbers Excepted"} MessageOnSuccess={"Perfect!"} {...props}   Match={/^\d+$/}/>
};

export default NumberInput