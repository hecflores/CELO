/**
 * Created by Hector on 5/9/2017.
 */

import React from 'react';
import WidgetModules from './WidgetModules.jsx';

class WidgetModule extends React.Component {

    static childContextTypes = {};
    static contextTypes = {
        Modules:React.PropTypes.instanceOf(WidgetModules)
    };
    static defaultProps = {};
    static propTypes = {
        Title:React.PropTypes.string.isRequired,
        Module:React.PropTypes.element.isRequired
    };

    state = {};


    constructor(props) {
        super(props);
    }

    getChildContext() {
        return {};
    }

    componentWillMount() {
        // Called When is about to mount

        this.AnyIncomingUpdate(this.props, this.context); // To Put updates in one place
    }

    componentDidMount() {
        if(typeof this.context.Modules == 'undefined'){
            throw new Error("Widget Module requires the use of WidgetModules as its parent");
        }
        // Called When it does mount
    }

    componentWillUnmount() {
        // Called When it unmounts
    }

    componentWillReceiveProps(props, context) {
        // Called When it receives props & context

        this.AnyIncomingUpdate(props, context); // To Put updates in one place
    }

    componentWillUpdate() {
        // Right before rendering. Dont Do setStat here. 
    }

    componentDidUpdate() {
        // Place to chech for dom stuff
    }

    AnyIncomingUpdate(props, context) {
        // Both the componentWillMount and componentWillReceiveProps will go here
    }

    render() {
        return (
            <div className="widget-module">
                <div className="widget-header">
                    {this.props.Title}
                </div>
                <div className="widget-body">
                    {this.props.Module}
                </div>
            </div>
        );
    }
}

export default WidgetModule;