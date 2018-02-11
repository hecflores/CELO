import React from 'react';
import Input from './Input.jsx';


class ValidationInput extends  React.Component{

    static contextTypes={
        isFormValid:React.PropTypes.bool,
        setFormValid:React.PropTypes.func,
        validFields:React.PropTypes.object
    };

    static defaultProps={
        Match:/.*/,
        MessageOnError:"Unkown",
        isRequired:false,
        onInputChanged:function(){},
        UseInputValueAsPrepOnly:false
    };

    static propTypes={
        Match:React.PropTypes.oneOfType([React.PropTypes.instanceOf(RegExp),React.PropTypes.string]),
        MessageOnError:React.PropTypes.string,
        MessageOnSuccess:React.PropTypes.string,
        isRequired:React.PropTypes.bool,
        onValidDataChange:React.PropTypes.func,
        onInputChanged:React.PropTypes.func,
        value:React.PropTypes.any,
        UseInputValueAsPrepOnly:React.PropTypes.bool,
        DisplayOnly:React.PropTypes.bool

    };

    state={
        Input:"",
        Valid:false
    };

    constructor(props){
        super(props);
        this.updateValidProps=this.updateValidProps.bind(this);
    }
    componentWillMount(){
        this.setState({
            Input:this.props.value || "",
            Valid:false
        });
        this.testValue();
    }
    componentWillReceiveProps(props){
        if(this.props.UseInputValueAsPrepOnly){
            return;
        }
        if(props.value){
            this.setState({
                Input:props.value
            },()=>
            {
                this.testValue(props);
            })
            return;
        }

        this.testValue(props);
    }
    testValue(props=this.props){
        if(this.state.Input.length==0){

            if(!props.isRequired){
                if(this.state.Valid){
                    return;
                }
                this.setState({
                    Valid:true
                },this.updateValidProps);
                return;
            }

            if(props.isRequired ){
                if(this.state.Input.length>0){
                    return;
                }
                this.setState({
                    Valid:false
                },this.updateValidProps);
                return;
            }
        }
        if(((typeof props.Match == 'string') && props.Match!=this.state.Input) || (props.Match instanceof RegExp && !props.Match.test(this.state.Input))){
            if(!this.state.Valid){
                return;
            }
            this.setState({
                Valid:false
            },this.updateValidProps);
            return;
        }
        if(this.state.Valid){
            this.updateValidProps();
            return;
        }
        this.setState({
            Valid:true
        },this.updateValidProps);
    }
    updateData(data)
    {
        this.setState({
            Input:data[this.props.Id]
        },function(){
            this.props.onInputChanged(this.state.Input);
            this.testValue();
        }.bind(this));
    }
    updateValidProps()
    {
        this.context.setFormValid(this.props.Id,this.state.Valid);
        if(this.state.Valid){
            this.props.onChange && this.props.onChange(this.state.Input)
        }
    }
    render(){
        let {onChange,...rest} = this.props;


        return  <Input DisplayOnly={this.props.DisplayOnly} IgnoreManual={true} value={this.state.Input} className={this.state.Valid?"form-control-success":"form-control-danger"} containerCss={!this.props.isRequired && this.state.Valid?"":(this.state.Valid?"has-success":"has-danger")} {...rest} onChange={(data)=>{this.updateData(data);}}>
                    {!this.props.isRequired && this.state.Valid?null:(this.state.Valid?<div className="form-control-feedback">{this.props.MessageOnSuccess}</div>:<div className="form-control-feedback">{this.props.MessageOnError}</div>)}
                </Input>

    }
}

export default ValidationInput