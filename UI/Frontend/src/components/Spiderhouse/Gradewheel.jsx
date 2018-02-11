import React from 'react';


class Gradewheel extends React.Component
{

    static propTypes={
        Path:React.PropTypes.string
    };


    constructor(props){
        super(props);

    }


    render(){

        let Percent=this.props.PercentFinished;

        let GreenH=447;
        let RedH=369;
        let MyH=((GreenH-RedH)*Percent)+RedH;



        return <path fill={"hsl("+MyH+",100%,50%)"} style={{filter:"url(#dropshadow)"}} d={this.props.Path} className={"spider-house-section "+(this.props.className?this.props.className:"")} />
    }


}

export default Gradewheel