/**
 * Created by Hector on 5/21/2017.
 */

import React from 'react';
import NumberInput from '../Tools/NumberInput.jsx';
import InputQuestionPool from '../QuestionPools/InputQuestionPool.jsx';
class InputGeneratingQuestions extends React.Component {

    static childContextTypes = {};
    static contextTypes = {};
    static defaultProps = {
        onChanged:function(){},
        MaxNumberOfQuestions:-1
    };
    static propTypes = {
        onChanged:React.PropTypes.func,
        MaxNumberOfQuestions:React.PropTypes.number
    };

    state = {
        QuestionPool:false,
        Groupings:{},
        FinalQuestions:[]
    };


    constructor(props) {
        super(props);

        this.setQuestionPool=this.setQuestionPool.bind(this);
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

        $(this.breadown).on("click",".question-group-input",function(){
            $(this).select();
        });
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
    setQuestionPool(questionPool){
        this.setState({
            QuestionPool:questionPool
        },()=>{
            this.GenerateGroups();
        });
    }
    GenerateGroups(){
        /*******************************************************************/
        let QuestionPool=this.state.QuestionPool;
        if(typeof QuestionPool != "object"){
            return;
        }

        /*******************************************************************/
        let Questions=this.state.QuestionPool.Questions;

        let GroupsFound=Questions.reduce((combiner,transformer)=>{combiner[transformer.QuestionType]=combiner[transformer.QuestionType]?
            combiner[transformer.QuestionType]+1:1; return combiner},{});

        let finalGroup=Object.keys(this.state.Groupings).filter((group)=>typeof GroupsFound[group]!= "undefined").reduce((obj, item)=>{obj[item]=this.state.Groupings[item]; return obj;},{});


        Object.keys(GroupsFound).forEach((item)=>{

            if(finalGroup[item]){
                if(finalGroup[item]>GroupsFound[item]){
                    finalGroup[item]=GroupsFound[item];
                }
                return;
            }
            finalGroup[item]=GroupsFound[item];
        });

        this.setState({
            Groupings:finalGroup
        },()=>{
            this.GenerateQuestions();
        });

    }
    GenerateQuestions(){

        /*******************************************************************/
        let QuestionPool=this.state.QuestionPool;
        if(typeof QuestionPool != "object"){
            return;
        }

        /*******************************************************************/
        let Questions=this.state.QuestionPool.Questions;

        let GroupsFound=Questions.reduce((combiner,transformer)=>{combiner[transformer.QuestionType]=combiner[transformer.QuestionType]?
            combiner[transformer.QuestionType].length:0; return combiner});



        /*******************************************************************/
        let FinalQuestions=[];
        Object.keys(this.state.Groupings).reverse().forEach((group)=>{
            let NumberOfItemsForThisGroup=this.state.Groupings[group];
            let NumberCurrentOfQuestions=FinalQuestions.length;

            if(this.props.MaxNumberOfQuestions>0) {
                let RemaingQuestions=Math.min(this.props.MaxNumberOfQuestions-NumberCurrentOfQuestions,NumberOfItemsForThisGroup);
                FinalQuestions=[
                    ...FinalQuestions,
                    ...Questions.filter((item)=>{return item.QuestionType==group}).filter((item)=>{return RemaingQuestions>0?RemaingQuestions-- && true:false; })
                ];
            }
            else
            {
                let RemaingQuestions=NumberOfItemsForThisGroup;
                FinalQuestions=[
                    ...FinalQuestions,
                    ...Questions.filter((item)=>{return item.QuestionType==group}).filter((item)=>{return RemaingQuestions>0?RemaingQuestions-- && true:false; })
                ];
            }


        });


        /*******************************************************************/
        this.setState({
            FinalQuestions:FinalQuestions
        },()=>{
            this.props.onChanged(this.state.FinalQuestions);
        });


    }
    setGrouping(group, number){
        this.setState({
            Groupings:{...this.state.Groupings,[group]:number}
        },()=>{
            this.GenerateGroups();
        });
    }
    render() {
        return (
            <div className="InputGeneratingQuestions">
                <InputQuestionPool name={"QuestionPool"} onChanged={this.setQuestionPool}/>
                <div className="final-questions-count">{this.state.FinalQuestions.length}</div>
                <div className="final-questions-count-breakdown" ref={(element)=>{this.breadown=element}}>
                    {Object.keys(this.state.Groupings).map((group,index)=>{
                        let groupNum=this.state.Groupings[group];
                        return <div key={index} className="question-group-input-container"><div className="question-group-input-title">{group}</div><input className="question-group-input"  value={groupNum} onChange={(e)=>{this.setGrouping(group,e.target.value)}}/></div>
                    })}
                </div>

            </div>
        );
    }
}

export default InputGeneratingQuestions;