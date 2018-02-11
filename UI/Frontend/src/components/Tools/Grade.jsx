import React from 'react';


class Grade extends React.Component {


    static propTypes={
        Grade:React.PropTypes.number,

        LowBound:React.PropTypes.number,
        MiddleBound:React.PropTypes.number,
        HighBound:React.PropTypes.number,

        MissingBound:React.PropTypes.element,
        LowBoundComponent:React.PropTypes.element,
        MiddleBoundComponent:React.PropTypes.element,
        HighBoundComponent:React.PropTypes.element

    };
    static defaultProps={
        LowBound:60,
        MiddleBound:80,
        HighBound:90,

        MissingBound:<div className="missing"/>,
        LowBoundComponent:<div className="low-bound-reached"/>,
        MiddleBoundComponent:<div className="middle-bound-reached"/>,
        HighBoundComponent:<div className="high-bound-reached"/>,
        ReallyHighBoundComponent:<div className="really-high-bound-reached"/>,
    };



    constructor(props) {
        super(props);
    }


    render()
    {
        /*******************************************************************/
        let element=this.props.MissingBound;
        if(this.props.Grade<=this.props.LowBound){
            element=this.props.LowBoundComponent;
        }
        else if(this.props.Grade<=this.props.MiddleBound){
            element=this.props.MiddleBoundComponent;
        }
        else if(this.props.Grade<=this.props.HighBound){
            element=this.props.HighBoundComponent;
        }
        else if(this.props.Grade){
            element=this.props.ReallyHighBoundComponent;
        }


        /*******************************************************************/
        return (
            <div className="grade">
                {React.cloneElement(element,{children:<span className="actual-grade">{Math.round(this.props.Grade)}</span>})}
            </div>
        );
    }
}



export default Grade;