import React from 'react';
import $ from 'jquery';

export const SimpleLoader = (props)=>{
    return <div className="spinner"/>;
};
export class Loader extends React.Component {

    static propTypes = {
        Simple:React.PropTypes.bool
    };
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div style={{position:"relative",height:"50px"}}>
                <div className="spinner-container" style={{
                    position:"absolute",
                    width:"50px",
                    height:"50px",
                    top:"50%",
                    left:"50%",
                    transform:"translate(-50%,-50%)"
                }}>
                    <div className="spinner" style={{top:"0px",left:"0px",height:"50px",width:"50px"}}></div>
                </div>
            </div>);

    }
}

Loader.defaultProps = {

};

export default Loader;