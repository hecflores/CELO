import React from 'react';
import Gradewheel from './Gradewheel.jsx';

class SpiderhouseItemCalculations extends React.Component{

    static defaultProps={
        MaxDisplayGrade:100
    };
    static propTypes={
        Text:React.PropTypes.string,
        Weight:React.PropTypes.number,
        MaxScore:React.PropTypes.number,
        CurrentGrade:React.PropTypes.number,
        Grade:React.PropTypes.number,
        CircleSize:React.PropTypes.number,
        MaxDisplayGrade:React.PropTypes.number,
    };


    render(){
        let AngleOffset=((Math.PI*2)/(this.props.MaxScore))*this.props.CurrentGrade;

        let PercentFinished=this.props.Grade/this.props.MaxDisplayGrade;
        let PercentOfWhole=this.props.Weight/this.props.MaxScore;
        let Grade="f";
        if(this.props.Grade>70)
        {
            Grade="c";
        }
        if(this.props.Grade>=80)
        {
            Grade="b";
        }
        if(this.props.Grade>=90)
        {
            Grade="a";
        }

        let {children, ...rest}=this.props;
        return React.cloneElement(this.props.children,{AngleOffSet:AngleOffset,
                           CircleSize:this.props.CircleSize,
                           PercentFinished:this.props.Grade/100,
                           PercentFinishedDisplay:PercentFinished,
                           PercentOfWhole:PercentOfWhole,
                           Text:this.props.Text,
                           className:Grade+" ",
                            ...rest});
    }


}


export default SpiderhouseItemCalculations