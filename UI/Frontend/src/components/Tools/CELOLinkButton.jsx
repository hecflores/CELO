import React from 'react';
import {OverlayTrigger,Tooltip} from 'react-bootstrap';
import {Link} from 'react-router';

class CELOLinkButton extends React.Component
{
    static defaultProps={
        Enabled:true,
        TooltipText:"Button",
        TooltipDirection:"top",
        Type:"success"
    };

    static propTypes={
        Enabled:React.PropTypes.bool,
        Text:React.PropTypes.string,
        TooltipText:React.PropTypes.string,
        TooltipDirection:React.PropTypes.string,
        to:React.PropTypes.string,
        onClick:React.PropTypes.func
    };



    render(){
        return <OverlayTrigger placement={this.props.TooltipDirection} overlay={<Tooltip id={this.props.TooltipText}>{this.props.TooltipText}</Tooltip>}>
            {this.props.to?<Link  onClick={this.props.onClick} to={this.props.to} className={" btn btn-"+this.props.Type+(this.props.Enabled?"":" disabled")} >{this.props.children}</Link>:
                <a href="#" onClick={this.props.onClick} className={"btn btn-"+this.props.Type+" "+(this.props.Enabled?"":" disabled")} >{this.props.children}</a>}
        </OverlayTrigger>
    }

}

export default CELOLinkButton