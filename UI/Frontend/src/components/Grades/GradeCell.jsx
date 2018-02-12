/**
 * Created by Hector on 5/4/2017.
 */

import React from 'react';
import GridCell from '../Grid/GridCell.jsx';
import Grade from '../Tools/Grade.jsx';
class GradeCell extends React.Component {

    static childContextTypes = {};
    static contextTypes = {};
    static defaultProps = {
        Grade:-1
    };
    static propTypes = {
        Grade:React.PropTypes.number,
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

    componentDidUpdate() {
        // Place to chech for dom stuff
    }

    render() {
        let Percent=this.props.Grade?this.props.Grade/100.0:0;

        let GreenH=447;
        let RedH=369;
        let MyH=((GreenH-RedH)*Percent)+RedH;
        let color="hsl("+MyH+",100%,50%)";
        return (<GridCell className="grade-cell"  style={{boxShadow:`inset 0px 0px 100px hsla(${MyH},100%,50%,.3),  0px 0px 10px hsla(${MyH},100%,50%,.3)`,color:"rgb(80,80,80)"}} onClick={this.props.onClick} onHover={this.props.onClick} >
                <Grade Grade={this.props.Grade || 0}/>
                </GridCell>
        );
    }
}

export default GradeCell;