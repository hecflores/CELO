/**
 * Created by Hector on 5/22/2017.
 */

import React from 'react';
import CumulativeSpiderhouseItem from './CumulativeSpiderhouseItem.jsx';
import SpiderhouseItemCalculations from './SpiderhouseItemCalculations.jsx';
import Gradewheel from './Gradewheel.jsx';
import Gradetext from './Gradetext.jsx';
import GradewheelCalculations from './GradewheelCalculations.jsx';

class CumulativeSpiderHouse extends React.Component {

    static childContextTypes = {};
    static contextTypes = {};
    static defaultProps = {};
    static propTypes = {};

    state = {};


    constructor(props) {
        super(props);
    }

    getChildContext() {
        return {};
    }

    componentWillMount() {
        // Called When is about to mount

        this.AnyIncomingUpdate(this.props, this.context); // To Put updates in one place
    }

    componentDidMount() {
        // Called When it does mount
    }

    componentWillUnmount() {
        // Called When it unmounts
    }

    componentWillReceiveProps(props, context) {
        // Called When it receives props & context

        this.AnyIncomingUpdate(props, context); // To Put updates in one place
    }

    componentWillUpdate() {
        // Right before rendering. Dont Do setStat here. 
    }

    componentDidUpdate() {
        // Place to chech for dom stuff
    }

    AnyIncomingUpdate(props, context) {
        // Both the componentWillMount and componentWillReceiveProps will go here
    }

    render() {
        let spiderhouses=React.Children.toArray(this.props.children);

        let MaxScore=0;
        spiderhouses.forEach(function(item){

            MaxScore += item.props.Weight;
        });
        let CurrentGrade=0;

        let spiderhousesNew=[];
        let spiderHouseGroups=[];
        spiderhouses.forEach(function (item2) {

            let CircleSize=this.props.Size;

            let CurrentPercentStart=0;
            let FirstTime=true;

            let MaxGradingScore=0;
            item2.props.children.forEach(function(item) {
                MaxGradingScore+=100;//item.props.Grade==0?5:item.props.Grade;
            });

            item2.props.children.forEach(function(item){
                let Grade=item.props.Grade==0?10:item.props.Grade;


                let element = React.cloneElement(item, {
                    Title:item2.props.Title,
                    Grade:Grade,
                    MaxScore: MaxScore,
                    MaxDisplayGrade:MaxGradingScore,
                    CircleSize: CircleSize,
                    CurrentGrade: CurrentGrade,
                    PercentOfStart:CurrentPercentStart
                });

                CurrentPercentStart+=(100)/MaxGradingScore;
                spiderhousesNew.push(element);
                if(FirstTime){
                    spiderHouseGroups.push(element);
                    FirstTime=false;
                }


            }.bind(this));
            CurrentGrade += item2.props.Weight;

        }.bind(this));


        return <svg className="spider_house" width={this.props.Size+100} height={this.props.Size+100} style={{padding:50}}>
            <filter id="dropshadow" height="130%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                <feOffset dx="2" dy="2" result="offsetblur"/>
                <feMerge>
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            <circle className="back-circle" cx={this.props.Size/2} cy={this.props.Size/2} r={(this.props.Size/2)}  />
            {(function(){
                let circles=[];
                for(let i=.1;i<1;i+=.1){
                    let GreenH=447;
                    let RedH=369;
                    var MyH=((GreenH-RedH)*(1-i))+RedH;

                    //circles.push(<circle key={i*10} stroke={"hsl("+MyH+",60%,70%)"} className="inner-grade-bound" cx={this.props.Size/2} cy={this.props.Size/2}  r={(this.props.Size/2)*i}  />);
                }
                return circles
            }.bind(this))()}


            <g className="spider-house-sections">
                {spiderhousesNew.map(function(element,index){

                    return <SpiderhouseItemCalculations key={index} {...element.props}>
                                <GradewheelCalculations  >
                                    <Gradewheel/>
                                </GradewheelCalculations>
                            </SpiderhouseItemCalculations>;
                }.bind(this))}
            </g>
            <g className="spider-house-text">
                {spiderHouseGroups.map(function(element,index){

                    return <SpiderhouseItemCalculations key={index} {...element.props}>
                        <GradewheelCalculations>
                            <Gradetext Text={element.props.Title}/>
                        </GradewheelCalculations>
                    </SpiderhouseItemCalculations>;
                }.bind(this))}
            </g>


            <circle style={{filter:"url(#dropshadow)"}} className="outer-border" cx={this.props.Size} cy={this.props.Size} r={(this.props.Size/2)}  />
        </svg>
    }
}

export default CumulativeSpiderHouse;