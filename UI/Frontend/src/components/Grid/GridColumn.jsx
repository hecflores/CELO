/**
 * Created by Hector on 5/4/2017.
 */

import React from 'react';


class GridColumn extends React.Component {

    static childContextTypes = {};
    static contextTypes = {};
    static defaultProps = {};
    static propTypes = {
        isSelected:React.PropTypes.bool
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
            <div className="grid-column">
                {this.props.isSelected?<div className="overlay"></div>:null}
                {this.props.children}
            </div>
        );
    }
}

export default GridColumn;