import React from 'react';

class FullScreenOverlayLoadingMessage extends React.Component{

    static defaultProps={
        Message:"Loading...",
        ShowSpinner:true,
        Enabled:true
    };

    static propTypes={
        Message:React.PropTypes.string,
        ShowSpinner:React.PropTypes.bool,
        Enabled:React.PropTypes.bool
    };
    render(){
        return <div className={(this.props.Enabled?"":"disabled")+" loading-splash-screen"}>
                    <div className="loading-spinner-container">
                        {this.props.ShowSpinner?<div className="loading-spinner"></div>:null}
                        <div className="loading-message">{this.props.Message}</div>
                    </div>
                </div>
    }
}

export default FullScreenOverlayLoadingMessage;