/**
 * Created by Hector on 5/4/2017.
 */

import React from 'react';


class GridCell extends React.Component {

    static childContextTypes = {};
    static contextTypes = {
    };
    static defaultProps = {};
    static propTypes = {
        onClick:React.PropTypes.func,
        onHover:React.PropTypes.func
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

    componentDidUpdate()
    {
        // Place to chech for dom stuff
        if(this.root && $(this.root).outerWidth()!=$(this.root).outerHeight()){
            // $(this.root).css({
            //     height:$(this.root).outerWidth()
            // });

        }
    }

    render() {
        return (
            <div onClick={this.props.onClick} onMouseMove={this.props.onHover} style={{...this.props.style}} className={"grid-cell "+this.props.className} ref={(ref)=>{this.root=ref;}}>
                {this.props.children}
            </div>
        );
    }
}

export default GridCell;