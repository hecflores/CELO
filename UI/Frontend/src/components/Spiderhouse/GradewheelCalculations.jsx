import React from 'react';


class GradewheelCalculations extends React.Component
{
    static defaultProps={
        PercentOfStart:0
    };
    static propTypes={
        PercentOfStart:React.PropTypes.number,
        CircleSize:React.PropTypes.number,
        PercentFinished:React.PropTypes.number,
        PercentOfWhole:React.PropTypes.number,
        AngleOffSet:React.PropTypes.number,
        Text:React.PropTypes.string
    };


    constructor(props){
        super(props);
        this.state={
            Path:this.generatePath( props.CircleSize,
                props.PercentFinished,
                props.PercentOfWhole,
                props.AngleOffSet )
        }
    }
    componentWillReceiveProps(props){
        this.updatePath(props);
    }
    updatePath(props)
    {
        this.setState({
            Path:this.generatePath( props.CircleSize,
                props.PercentFinishedDisplay,
                props.PercentOfWhole,
                props.AngleOffSet )
        });
    }
    /**
     * Generates the Path that will be the section.
     * @param circleSize Size of the Circle creating
     * @param percentageFinished Percentage that has been completed
     * @param percentageOfWhole Percentage relative to the whole circle
     * @param angleOffset Angle to Start
     */
    getPositionForText(circleSize,percentageFinished, percentageOfWhole, angleOffset)
    {
        let circleSizeSmaller=circleSize/2 + 20;
        let percentage=percentageFinished;
        let angleSize=(Math.PI*2)*percentageOfWhole;

        /***************************************************************/
        /* Helpful Angles                                              */
        /***************************************************************/
        let angleAtCenterOfSection=angleOffset+(angleSize/2);
        let angleSizeOfEnd=angleSize;

        /***************************************************************/
        /* Get points at the outer size of circle                      */
        /***************************************************************/
        let circleSizeOuter=(circleSize/2)*(1.0-this.props.PercentOfStart);

        let angle1=angleOffset;
        let angle2=angleOffset+angleSize;

        let x1=Math.cos(angle1)*circleSizeOuter + (circleSize/2);
        let y1=Math.sin(angle1)*circleSizeOuter + (circleSize/2);

        let x2=Math.cos(angle2)*circleSizeOuter + (circleSize/2);
        let y2=Math.sin(angle2)*circleSizeOuter + (circleSize/2);

        /***************************************************************/
        /* Get points on inner side of circle                          */
        /***************************************************************/
        let circleSizeInner=circleSizeSmaller*(1.0-(percentage))*(1.0-this.props.PercentOfStart) ;

        let angle_inner1=angleAtCenterOfSection-(angleSizeOfEnd/2);
        let angle_inner2=angleAtCenterOfSection+(angleSizeOfEnd/2);


        let xInner1=Math.cos(angleAtCenterOfSection)*circleSizeInner + (circleSize/2);
        let yInner1=Math.sin(angleAtCenterOfSection)*circleSizeInner + (circleSize/2);

        let xInner1Left=Math.cos(angle_inner1)*circleSizeInner + (circleSize/2);
        let yInner1Left=Math.sin(angle_inner1)*circleSizeInner + (circleSize/2);

        let xInner1Right=Math.cos(angle_inner2)*circleSizeInner + (circleSize/2);
        let yInner1Right=Math.sin(angle_inner2)*circleSizeInner + (circleSize/2);

        let xOuter1=Math.cos(angleAtCenterOfSection)*circleSizeSmaller + (circleSize/2);
        let yOuter1=Math.sin(angleAtCenterOfSection)*circleSizeSmaller + (circleSize/2);

        let xOuter1Left=Math.cos(angle_inner1)*circleSizeSmaller + (circleSize/2);
        let yOuter1Left=Math.sin(angle_inner1)*circleSizeSmaller + (circleSize/2);

        let xOuter1Right=Math.cos(angle_inner2)*circleSizeSmaller + (circleSize/2);
        let yOuter1Right=Math.sin(angle_inner2)*circleSizeSmaller + (circleSize/2);



        return {
                InnerCenterPoint: {x: xInner1, y:yInner1},
                InnerLeftPoint: {x: xInner1Left, y:yInner1Left},
                InnerRightPoint: {x: xInner1Right, y:yInner1Right},
                OuterCenterPoint: {x: xOuter1, y:yOuter1},
                OuterLeftPoint: {x: xOuter1Left, y:yOuter1Left},
                OuterRightPoint: {x: xOuter1Right, y:yOuter1Right},
               }


    }
    /**
     * Generates the Path that will be the section.
     * @param circleSize Size of the Circle creating
     * @param percentageFinished Percentage that has been completed
     * @param percentageOfWhole Percentage relative to the whole circle
     * @param angleOffset Angle to Start
     * @return {string} Which is the path to be used
     */
    generatePath(circleSize,percentageFinished, percentageOfWhole, angleOffset)
    {
        let circleSizeSmaller=circleSize/2;
        let percentage=percentageFinished;
        let angleSize=(Math.PI*2)*percentageOfWhole;



        /***************************************************************/
        /* Helpful Angles                                              */
        /***************************************************************/
        let angleAtCenterOfSection=angleOffset+(angleSize/2);
        let angleSizeOfEnd=angleSize;//*(1.0-percentage);

        /***************************************************************/
        /* Get points at the outer size of circle                      */
        /***************************************************************/
        let angle1=angleOffset;
        let angle2=angleOffset+angleSize;
        let circleSizeOuter=circleSizeSmaller*(1.0-this.props.PercentOfStart);

        let x1=Math.cos(angle1)*circleSizeOuter + (circleSize/2);
        let y1=Math.sin(angle1)*circleSizeOuter + (circleSize/2);

        let x2=Math.cos(angle2)*circleSizeOuter + (circleSize/2);
        let y2=Math.sin(angle2)*circleSizeOuter + (circleSize/2);

        /***************************************************************/
        /* Get points on inner side of circle                          */
        /***************************************************************/
        let circleSizeInner=circleSizeSmaller*(1.0-(percentage))*(1.0-this.props.PercentOfStart);
        let angle_inner1=angleAtCenterOfSection-(angleSizeOfEnd/2);
        let angle_inner2=angleAtCenterOfSection+(angleSizeOfEnd/2);

        let xInner1=Math.cos(angle_inner1)*circleSizeInner + (circleSize/2);
        let yInner1=Math.sin(angle_inner1)*circleSizeInner + (circleSize/2);

        let xInner2=Math.cos(angle_inner2)*circleSizeInner + (circleSize/2);
        let yInner2=Math.sin(angle_inner2)*circleSizeInner + (circleSize/2);

        return "M "+x1+","+y1+" A "+circleSizeOuter     +", "+circleSizeOuter     +", "+angle1      +", "+0+", "+1+", "+x2     +", "+y2     +" L "+xInner2+", "+yInner2+
            " A "+circleSizeInner+", "+circleSizeInner+", "+angle_inner1+", "+0+", "+0+", "+xInner1+", "+yInner1+" L "+x1     +", "+y1;
    }

    render(){



        let pos=this.getPositionForText( this.props.CircleSize,
            this.props.PercentFinishedDisplay,
            this.props.PercentOfWhole,
            this.props.AngleOffSet );

        let {children,...rest} = this.props;

        return this.props.children?
            React.cloneElement(this.props.children,{Path:this.state.Path,...pos,...rest,...this.props.children.props}):null;
    }


}

export default GradewheelCalculations