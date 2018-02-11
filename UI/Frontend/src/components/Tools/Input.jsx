import React from 'react';

export class Input extends React.Component{

    static propTypes={
        Id:React.PropTypes.string.isRequired,
        Title:React.PropTypes.string,
        Placeholder:React.PropTypes.string,
        value:React.PropTypes.any,
        onChange:React.PropTypes.func,
        onBlur:React.PropTypes.func,
        containerCss:React.PropTypes.string,
        CustomElement:React.PropTypes.element,
        IgnoreManual:React.PropTypes.bool

    };

    static defaultProps={
        Title:"Unkown",
        Placeholder:"",
        onBlur:function(){},
        onChange:function(){},
        CustomElement:<input type="text"/>

    };

    constructor(props){
        super(props);

        this.onBlur=this.onBlur.bind(this);
        this.onChange=this.onChange.bind(this);
    }

    onChange(e){
        if(this.props.IgnoreManual)
        {
            this.props.onChange({[this.props.Id]:e.target.value});
            return;
        }
        let splited=this.props.Id.split(".");
        let str="";
        splited=[...splited];
        let lastRoot="obj";
        splited.forEach(function(key,index){
            if(index==splited.length-1){
                str+=lastRoot+"."+key+"=e.target.value; ";
                return;
            }

            str+=lastRoot+"."+key+"={}; ";
            lastRoot=lastRoot+"."+key;
        });

        let obj={};
        eval(str);


        this.props.onChange(obj);
    }
    onBlur(e){
        if(this.props.IgnoreManual){
            return;
        }
        let splited=this.props.Id.split(".");
        let str="";
        splited=[...splited];
        let lastRoot="obj";
        splited.forEach(function(key,index){
            if(index==splited.length-1){
                str+=lastRoot+"."+key+"=e.target.value; ";
                return;
            }

            str+=lastRoot+"."+key+"={}; ";
            lastRoot=lastRoot+"."+key;
        });

        let obj={};
        eval(str);


        this.props.onBlur(obj);
    }

    render(){
        return <div className={"form-group " + this.props.containerCss}>
            <label htmlFor={this.props.Id+"_input"}>{this.props.Title}</label>
            {this.props.DisplayOnly?<span className="form-control">{this.props.value}</span>:(
                        React.cloneElement(this.props.CustomElement,{name:this.props.name?this.props.name:this.props.Id, className:("form-control "+(this.props.className || "")), onChange:this.onChange, onBlur:this.onBlur, value:this.props.value}))}
            {this.props.children}
        </div>
    }
}
export class PasswordMatcher extends React.Component
{
    static defaultProps={
        onValid:function(){},
        onInValid:function(){},
        onChange:function(){},
        onBlur:function(){},
    };
    static propTypes={
        Id:React.PropTypes.string.isRequired,
        Title:React.PropTypes.string,
        Placeholder:React.PropTypes.string,
        value:React.PropTypes.any,
        onChange:React.PropTypes.func,
        onBlur:React.PropTypes.func,
        containerCss:React.PropTypes.string,
        CustomElement:React.PropTypes.element,
        onValid:React.PropTypes.func,
        onInValid:React.PropTypes.func
    };
    state={
        data:{}
    };

    constructor(props){
        super(props);

        this.onChange=this.onChange.bind(this);
    }
    onChange(data2){
        let data={...this.state.data,...data2};
        this.setState({data:data},function(){
            let valueMain=null;
            let Matched=true;
            Object.values(this.state).forEach(function(value,index){
                if(index==0){
                    valueMain=value;
                    return;
                }
                Matched &=valueMain!=value;
            });
            this.setState({
                Valid:Matched
            },function(){
                Matched?this.props.onValid():this.props.onInValid();
            }.bind(this));


            this.props.onChange({[this.props.Id]:this.state.data[this.props.Id]});

        }.bind(this));
    }

    render(){
        let {
            Placeholder,
            Title,
            onChange,
            children,
            ...rest
        }=this.props;

        return <div className="validation" >
                    <Input {...rest} Title={Title}           Placeholder={Placeholder}           Id={this.props.Id} onChange={this.onChange}/>
                    <Input {...rest} Title={Title+"(Match)"} Placeholder={Placeholder+"(Match)"} Id={this.props.Id} onChange={this.onChange}/>
               </div>
    }

}
export default Input