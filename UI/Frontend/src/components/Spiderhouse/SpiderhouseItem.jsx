import React from 'react';
import Gradewheel from './Gradewheel.jsx';


class SpiderhouseItem extends React.Component{

    static propTypes={
        Text:React.PropTypes.string,
        Weight:React.PropTypes.number,
        MaxScore:React.PropTypes.number,
        CurrentGrade:React.PropTypes.number,
        Grade:React.PropTypes.number
    };


    render()
    {
        return <Gradewheel AngleOffSet={AngleOffset}
                           CircleSize={this.props.CircleSize}
                           PercentFinished={PercentFinished}
                           PercentOfWhole={PercentOfWhole}
                           Text={this.props.Text}
                           className={'spider-house-section '+ Grade+""}
        />
    }


}


export default SpiderhouseItem