import React from 'react';
import {OverlayTrigger,Tooltip} from 'react-bootstrap';

class CELOButton extends React.Component
{
    static defaultProps={
        Type:"default",
        Enabled:false,
        Text:"Button",
        TooltipText:"Button",
        TooltipDirection:"top",
        onClick:function(){}
    };

    static propTypes={
        Type:React.PropTypes.string,
        Enabled:React.PropTypes.bool,
        Text:React.PropTypes.string,
        TooltipText:React.PropTypes.string,
        TooltipDirection:React.PropTypes.string,
        onClick:React.PropTypes.func,
    };



    render(){
        return <OverlayTrigger placement={this.props.TooltipDirection} overlay={<Tooltip id={this.props.TooltipText}>{this.props.TooltipText}</Tooltip>}>
                    <div className={"btn btn-"+this.props.Type+" "+(this.props.Enabled?"":" disabled")} onClick={(e)=>{e.stopPropagation(); this.props.Enabled && this.props.onClick()}} >{this.props.children?this.props.children:this.props.Text}</div>
                </OverlayTrigger>
    }

}

export default CELOButton