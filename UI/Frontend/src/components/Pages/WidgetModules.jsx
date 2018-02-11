/**
 * Created by Hector on 5/9/2017.
 */

import React from 'react';


class WidgetModules extends React.Component {

    static childContextTypes = {
        Modules:React.PropTypes.instanceOf(WidgetModules)
    };
    static contextTypes = {};
    static defaultProps = {};
    static propTypes = {
        children: React.PropTypes.oneOfType([React.PropTypes.arrayOf(React.PropTypes.element), React.PropTypes.element])
    };

    state = {};


    constructor(props) {
        super(props);
    }

    getChildContext() {
        return {
            Modules:this
        };
    }

    componentWillMount() {
        // Called When is about to mount

        this.AnyIncomingUpdate(this.props, this.context); // To Put updates in one place
    }

    componentDidMount() {
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
            <div className="widget-modules">
                {this.props.children}
            </div>
        );
    }
}

export default WidgetModules;