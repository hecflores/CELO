import React from 'react';
import CELOButton from './CELOButton.jsx';
class SubmitButton extends React.Component
{
    static contextTypes={
        isLoading:React.PropTypes.func,
        submitForm:React.PropTypes.func,
        isFormValid:React.PropTypes.bool,
        setFormValid:React.PropTypes.func,
        validFields:React.PropTypes.object
    };


    render(){


        return <CELOButton {...this.props} Enabled={this.context.isFormValid} TooltipText={this.context.isFormValid?this.props.TooltipText:"Not all fields were successfully validated"} onClick={this.context.submitForm} >{this.props.children}</CELOButton>;
    }
}

export default SubmitButton;