/**
 * Created by Hector on 5/4/2017.
 */

import React from 'react';
import Spidershouse from '../Spiderhouse/Spidershouse.jsx';
import SpiderhouseItem from '../Spiderhouse/SpiderhouseItem.jsx';
import SpiderhouseItemCalculations from '../Spiderhouse/SpiderhouseItemCalculations.jsx';

class AnswerableItemGradesProgressWheel extends React.Component {

    static childContextTypes = {};
    static contextTypes = {};
    static defaultProps = {};
    static propTypes = {
        AnswerableItems:React.PropTypes.array.isRequired
    };

    state = {
        SpiderhouseSize:300
    };


    constructor(props) {
        super(props);
    }

    componentWillMount(){
        $(window).on("resize",function(){
            this.setState({SpiderhouseSize:$(window).width()/4});
        }.bind(this));
    }
    componentWillUnmount(){
        $(window).unbind("resize");
    }
    getChildContext() {
        return {};
    }

    render() {
        return (
            <div className="answerable-item-grades-progress-wheel">
                <Spidershouse Size={this.state.SpiderhouseSize}>
                    {this.props.AnswerableItems.map(function(item,index){
                        return <SpiderhouseItem key={index} CurrentGrade={item.Grade} MaxScore={100} Grade={item.Grade} Text={item.CourseContent.Name} Weight={1}/>
                    }.bind(this))}

                </Spidershouse>
            </div>
        );
    }
}

export default AnswerableItemGradesProgressWheel;