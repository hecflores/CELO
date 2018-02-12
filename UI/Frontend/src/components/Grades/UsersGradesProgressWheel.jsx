/**
 * Created by Hector on 5/22/2017.
 */

import React from 'react';
import CumulativeSpiderhouseItem from '../Spiderhouse/CumulativeSpiderhouseItem.jsx';
import CumulativeSpiderHouse from '../Spiderhouse/CumulativeSpiderHouse.jsx';
import SpiderhouseItem from '../Spiderhouse/SpiderhouseItem.jsx';

class UsersGradesProgressWheel extends React.Component {

    static childContextTypes = {};
    static contextTypes = {};
    static defaultProps = {};
    static propTypes = {
        AnswerableItems:React.PropTypes.array.isRequired
    };

    state = {
        SpiderhouseSize:300,
        UserGrades:[]
    };


    constructor(props) {
        super(props);
    }

    getChildContext() {
        return {};
    }

    componentWillMount() {
        // Called When is about to mount

        this.AnyIncomingUpdate(this.props, this.context); // To Put updates in one place


        $(window).on("resize",function(){
            this.setState({SpiderhouseSize:$(window).width()/2});
        }.bind(this));
    }

    componentDidMount() {
        // Called When it does mount

        this.setState({SpiderhouseSize:$(window).width()/2});
    }

    componentWillUnmount() {
        // Called When it unmounts
        $(window).unbind("resize");
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


        this.setState({
            UserGrades:props.AnswerableItems.reduce((final,item)=>{
                Object.keys(item.UserSubmissions).forEach((userItem)=> {
                    if(typeof final[userItem] == "undefined"){
                        final[userItem]={
                            UserInfo:item.UserSubmissions[userItem]["User"],
                            Grades:[]
                        };
                    }
                    let UserGrade=item.UserSubmissions[userItem];
                    final[userItem]["Grades"].push({
                        Name:"Unkown",
                        Grade:UserGrade["Grade"]?UserGrade["Grade"]:0,
                        Submissions:UserGrade["Submissions"],
                        CourseContent:item["CourseContent"]
                    });

                });
                return final;

            },{})

        });
    }

    render() {
        return (
            <div className="answerable-item-grades-progress-wheel">
                <CumulativeSpiderHouse Size={this.state.SpiderhouseSize} >
                    {Object.keys(this.state.UserGrades).map(function(item,index){
                        return <CumulativeSpiderhouseItem key={index} Title={this.state.UserGrades[item].UserInfo["UHID"]} Weight={1}>
                                {this.state.UserGrades[item]["Grades"].map((item,index)=>{
                                    return <SpiderhouseItem key={index} CurrentGrade={item.Grade} MaxScore={100} Grade={item.Grade} Text={item.CourseContent.Name} Weight={1}/>;
                                })}
                                </CumulativeSpiderhouseItem>
                    }.bind(this))}

                </CumulativeSpiderHouse>
            </div>
        );
    }
}

export default UsersGradesProgressWheel;