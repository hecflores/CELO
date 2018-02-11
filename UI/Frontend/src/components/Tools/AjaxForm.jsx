import React from 'react';

class AjaxForm extends React.Component
{

    static childContextTypes={
        submitForm:React.PropTypes.func,
        validFields:React.PropTypes.object,
        isFormValid:React.PropTypes.bool,
        setFormValid:React.PropTypes.func,
    };
    static defaultProps={
        onValidChanged:function(){},
        beforeSubmit:function(){},
        onSubmit:function(){}

    };
    static propTypes={
        onValidChanged:React.PropTypes.func,
        beforeSubmit:React.PropTypes.func,
        onSubmit:React.PropTypes.func
    };
    state={
        validFields:{},
        isFormValid:true
    };

    constructor(props){
        super(props);

        this.beforeSubmit=this.beforeSubmit.bind(this);
        this.onSubmit=this.onSubmit.bind(this);
        this.setFormValid=this.setFormValid.bind(this);
    }

    /**
     *
     * @return {{isFormValid: boolean, setFormValid: AjaxForm.setFormValid}}
     */
    getChildContext(){
        return {
            submitForm:function(){
                $(this.form).submit();
            }.bind(this),
            validFields:this.state.validFields,
            isFormValid:this.state.isFormValid,
            setFormValid:this.setFormValid.bind(this)
        }
    }


    componentDidMount(){
        $(this.form).ajaxForm({
            dataType: 'json',
            beforeSubmit: this.beforeSubmit,
            success: this.onSubmit
        });
    }
    setFormValid(fieldName,valid)
    {
        if(this.state.validFields[fieldName]==valid){
            return;
        }

        /*******************************************************************/
        let isValid=true;
        let validFields={...this.state.validFields,[fieldName]:valid};

        /*******************************************************************/
        for(let fieldName in validFields){
            if(!this.state.validFields.hasOwnProperty(fieldName)){
                break;
            }
            isValid=validFields[fieldName] && isValid;
        }
        
        /*******************************************************************/
        this.setState({
                validFields:validFields,
                isFormValid: isValid
            },()=>
            {

                this.props.onValidChanged(this.state.isFormValid);
            });
    }

    beforeSubmit(){
        this.props.beforeSubmit();
    }
    onSubmit(data){
        this.props.onSubmit(data);
    }
    render()
    {
        let {children,
             method,
             action,
             onValidChanged,
             beforeSubmit,
             onSubmit,
             ...rest} = this.props;

        return <form ref={(form)=>{this.form=form;}} method={method || "POST"} action={action} {...rest} >
                  {children}
               </form>
    }

}

export default AjaxForm