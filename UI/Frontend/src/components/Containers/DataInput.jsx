import React from 'react';
import $ from 'jquery';


class DataInput extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            Value:this.props.Value
        };

        this.onChangedTrigger=function(e)
        {
            if (e.key === 'Enter') {
                this.props.onKeyEnter();
                return;
            }
            if (e.key === 'Escape') {
                this.props.onKeyEscape();
                return;
            }

            //console.debug("DataInput: onChangedTrigger(value:"+e.target.value+")");
            this.setState({
                Value:e.target.value
            });
            var updateWith={};
            updateWith[this.props.Key]=e.target.value;
            this.props.onChanged.forEach(function(callback){

                callback(updateWith);
            }.bind(this));

        }.bind(this);

        this.onEnteredTrigger=function(e){
            //console.debug("DataInput: onEnteredTrigger(value:"+e.target.value+")");
            this.props.onEntered(this.props.Key,this.state.Value);
        }.bind(this);

        this.onLeavedTrigger=function(e){
            //console.debug("DataInput: onLeavedTrigger(value:"+e.target.value+")");
            this.props.onLeaved(this.props.Key,this.state.Value);
        }.bind(this);

        this.onFocusTrigger=function(e){
            //console.debug("DataInput: onFocusTrigger(value:"+e.target.value+")");
            this.props.onFocus(this.props.Key,e.target.value);
        }.bind(this);
        this.onBlurTrigger=function(e){
            //console.debug("DataInput: onBlurTrigger(value:"+e.target.value+")");
            this.props.onBlur(this.props.Key,e.target.value);
        }.bind(this);
    }
    componentDidMount()
    {
        if(this.props.IsHiddenInput || this.props.ViewableOnly){
            this.props.onChanged.forEach(function(callback){
                const attr={};
                attr[this.props.Key]=this.props.Value;
                callback(attr);
            }.bind(this));
        }
        /* his.api.getListener().initiate(this.props.Event,this.state.data.input); */
    }
    render() {
        //console.debug("DataInput: render");
        return (
            <div className='data-input' name={this.props.Name}>
                {this.props.IsHiddenInput?"":
                    (this.props.ViewableOnly?this.props.Value:
                        (
                            <div onFocus={this.onFocusTrigger} onMouseEnter={this.onEnteredTrigger} onMouseLeave={this.onLeavedTrigger}  onBlur={this.onBlurTrigger}  className="form-group">
                                {this.props.Name.length==0?null:(<label>{this.props.Name}</label>)}
                                <input autoFocus={this.props.Focus} onKeyUp={this.onChangedTrigger} onFocus={this.props.onFocus}  type={this.props.Type} className="form-control"/>
                            </div>
                        )
                    )
                }
            </div>);
    }
}
DataInput.propTypes = {
    Focus:React.PropTypes.bool,
    ViewableOnly:React.PropTypes.bool,
    IsHiddenInput:React.PropTypes.bool,
    Name: React.PropTypes.string,
    Key: React.PropTypes.string,
    Value: React.PropTypes.string,
    onKeyEnter:React.PropTypes.func,
    onKeyEscape:React.PropTypes.func,
    onChanged:React.PropTypes.arrayOf(React.PropTypes.func),
    onEntered:React.PropTypes.func,
    onLeaved:React.PropTypes.func,
    onFocus:React.PropTypes.func,
    onBlur:React.PropTypes.func,
    Type:function(props, propName, componentName) {
        if (!/text|password/.test(props[propName])) {
            return new Error(
                'Invalid prop `' + propName + '` supplied to' +
                ' `' + componentName + '`. Validation failed.'
            );
        }
    }
};

DataInput.defaultProps = {
    onKeyEnter:function(){

    },
    onKeyEscape:function(){

    },
    Focus:false,
    Name: 'Unkown',
    Key:'Unkown',
    Value:'',
    onChanged:[function(attribute, value){

    }],
    Type:"text",
    onBlur:function(){},
    onEntered:function(attribute, value){},
    onLeaved:function(attribute, value){},
    onFocus:function(attribute, value){}
};

export default DataInput;