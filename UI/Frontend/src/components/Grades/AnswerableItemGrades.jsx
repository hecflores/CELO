/**
 * Created by Hector on 5/4/2017.
 */

import React from 'react';
import AnswerableItemGrade from './AnswerableItemGrade.jsx';

class AnswerableItemGrades extends React.Component {

    static childContextTypes = {};
    static contextTypes = {};
    static defaultProps = {};
    static propTypes = {
        AnswerableItems:React.PropTypes.array.isRequired,
        CustomRender:React.PropTypes.func
    };

    state = {};

    constructor(props) {
        super(props);

        this.onItemClicked=this.onItemClicked.bind(this);
        this.onItemHovered=this.onItemHovered.bind(this);
    }

    getChildContext() {
        return {};
    }
    onItemClicked(item){

    }
    onItemHovered(item){

    }
    render() {
        let Renderer=AnswerableItemGrade;
        if(this.props.CustomRender){
            Renderer=this.props.CustomRender;
        }
        return (
            <div className="answerable-grade-container">
                {this.props.AnswerableItems.map((item,index)=>{
                    return <Renderer key={index} AnswerableItem={item} onClick={this.onItemClicked} onHover={this.onItemHovered}/>
                })}
            </div>
        );
    }
}

export default AnswerableItemGrades;