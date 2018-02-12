import React from 'react';
import SpiderhouseItem from './SpiderhouseItem.jsx';
import SpiderhouseItemCalculations from './SpiderhouseItemCalculations.jsx';
import Gradewheel from './Gradewheel.jsx';
import Gradetext from './Gradetext.jsx';
import GradewheelCalculations from './GradewheelCalculations.jsx';
class Spidershouse extends React.Component
{
    static propTypes={
        Size:React.PropTypes.number
    };
    render(){
        let spiderhouses=React.Children.toArray(this.props.children);

        let MaxScore=0;
        spiderhouses.forEach(function(item){
            if(item.type!=SpiderhouseItem){
                throw new Error("All must be a SpiderhouseItem ");
            }
            MaxScore+=item.props.Weight;
        });
        let CurrentGrade=0;
        let spiderhousesNew=spiderhouses.map(function (item) {

            let element = React.cloneElement(item, {
                MaxScore: MaxScore,
                CircleSize: this.props.Size,
                CurrentGrade: CurrentGrade,
            });
            CurrentGrade += item.props.Weight;
            return element;

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

                    circles.push(<circle key={i*10} stroke={"hsl("+MyH+",60%,70%)"} className="inner-grade-bound" cx={this.props.Size/2} cy={this.props.Size/2}  r={(this.props.Size/2)*i}  />);
                }
                return circles
            }.bind(this))()}


            <g className="spider-house-sections">
                {spiderhousesNew.map(function(element,index){

                    return <SpiderhouseItemCalculations key={index} {...element.props}>
                                <GradewheelCalculations>
                                    <Gradewheel/>
                                </GradewheelCalculations>
                            </SpiderhouseItemCalculations>;
                }.bind(this))}
            </g>
            <g className="spider-house-text">
                {spiderhousesNew.map(function(element,index){

                    return <SpiderhouseItemCalculations key={index} {...element.props}>
                                <GradewheelCalculations>
                                    <Gradetext Text={Math.round(element.props.Grade)+"%"}/>
                                </GradewheelCalculations>
                            </SpiderhouseItemCalculations>;
                }.bind(this))}
            </g>


            <circle style={{filter:"url(#dropshadow)"}} className="outer-border" cx={this.props.Size} cy={this.props.Size} r={(this.props.Size/2)}  />
        </svg>

    }
}

export default Spidershouse;