/**
 * Created by Hector on 5/6/2017.
 */

import React from 'react';


class CourseContentClipboardManager extends React.Component {

    static childContextTypes = {

    };
    static contextTypes = {};
    static defaultProps = {};
    static propTypes = {
        CurrentContentID:React.PropTypes.number
    };

    state = {
        CourseContentInClipboard:[]
    };


    constructor(props) {
        super(props);
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

    render() {
        return (
            <div className="course-content-clipboard-manager"></div>
        );
    }
}

export default CourseContentClipboardManager;