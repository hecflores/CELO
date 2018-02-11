/**
 * Created by Hector on 5/9/2017.
 */

import React from 'react';
import UserRenderChooser from './UserRenderChooser.jsx';

class UserSensativeInfo extends UserRenderChooser {

    static childContextTypes = {};
    static contextTypes = {};
    static defaultProps = {};
    static propTypes = {};

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
        return (<div/>
        );
    }
}

export default UserSensativeInfo;