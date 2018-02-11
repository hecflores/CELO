import React from 'react';


class Gradewheel extends React.Component
{

    static propTypes={
        InnerCenterPoint:React.PropTypes.object,
        OuterCenterPoint:React.PropTypes.object,
        Text:React.PropTypes.string
    };


    constructor(props){
        super(props);
    }


    render(){

        return <text className={"spider-house-text "+(this.props.className?this.props.className:"")} {...this.props.OuterCenterPoint} >
                    {this.props.Text}
               </text>
    }


}

export default Gradewheel