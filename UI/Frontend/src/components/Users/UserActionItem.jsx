/**
 * Created by Hector on 5/4/2017.
 */

import React from 'react';


class UserActionItem extends React.Component {

    static childContextTypes = {};
    static contextTypes = {};
    static defaultProps = {
        onClick:function(){},
        onHover:function(){}
    };
    static propTypes = {
        User:React.PropTypes.object,
        onClick:React.PropTypes.func,
        onHover:React.PropTypes.func
    };

    state = {
        ViewMode:"original"
    };


    constructor(props) {
        super(props);

        this.switchBack=this.switchBack.bind(this);
        this.switchView=this.switchView.bind(this);
    }

    getChildContext() {
        return {};
    }

    componentWillMount() {
        // Called When is about to mount
    }

    componentDidMount() {
        // Called When it does mount
    }

    componentWillUnmount() {
        // Called When it unmounts
    }

    componentWillReceiveProps(props, context) {
        // Called When it receives props & context
    }

    componentWillUpdate() {
        // Right before rendering. Dont Do setStat here. 
    }

    componentDidUpdate() {
        // Place to chech for dom stuff
    }
    switchView(){
        this.setState({
            ViewMode:"name"
        });
    }
    switchBack(){
        this.setState({
            ViewMode:"original"
        });
    }
    render() {
        return (
            <div onClick={()=>{this.props.onClick(this.props.User)}} onMouseEnter={this.switchView} onMouseLeave={this.switchBack} className={"user-action-item-container "+this.props.User.Role}>
                {(function(){
                    if(this.state.ViewMode=="name"){
                        return <div className="user-name">{this.props.User.LastName+", "+this.props.User.FirstName}</div>
                    }
                    if(typeof this.props.User != "object"){
                        return <div className="missing">No User Found</div>
                    }
                    if(this.props.User.Role=="Student") {
                        return <div className="UHID">{this.props.User.UHID}</div>
                    }
                    return <div className="user-name">{this.props.User.LastName+", "+this.props.User.FirstName}</div>

                }.bind(this))()}
            </div>
        );
    }
}

export default UserActionItem;