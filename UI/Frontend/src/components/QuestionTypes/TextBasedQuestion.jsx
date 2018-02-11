import React from 'react';


class TextBasedQuestion extends React.Component
{
    /***********************************************************************/
    /* Used for the automated organization                                 */
    /***********************************************************************/
    static _id="Text Based";
    static _Description="Would need to be manually graded";

    static get id() {
        return this._id;
    }

    /**
     * @return {number}
     */
    static get DatabaseId() {
        return this._DatabaseId;
    }

    /**
     * @return {string}
     */
    static get Description() {
        return this._Description;
    }

    static defaultProps={
        onAnswered:function(){ },
        Enabled:true
    };
    static propTypes={
        Parameters:React.PropTypes.shape({
            question:React.PropTypes.string
        }),
        Answer:React.PropTypes.string,
        Enabled:React.PropTypes.bool,
        onAnswered:React.PropTypes.func
    };
    constructor(props){
        super(props);


        this.updateMyState=this.updateMyState.bind(this);
        this.answerChanged=this.answerChanged.bind(this);
        this.onAnswerChosen=this.onAnswerChosen.bind(this);
    }
    componentWillMount(){
        this.updateMyState(this.props);
    }
    componentWillReceiveProps(props){
        this.updateMyState(props);
    }
    updateMyState(props){
        this.setState({
            Answer:props.Answer || ""
        });
    }
    answerChanged(e){
        this.updateMyState({Answer:e.target.value});
    }

    onAnswerChosen(choice){
        if(!this.props.Enabled){
            return;
        }
        this.props.onAnswered(choice);
    }
    render(){
        return <div className="question-basics multiple-choice">
            <div className="question" dangerouslySetInnerHTML={{__html:this.props.Parameters.question}}/>
            <div className="form-group">
                <label htmlFor="textBasedQuestion">Please enter your response:</label>
                <textarea onChange={this.answerChanged} className="form-control" >{this.state.Answer}</textarea>
            </div>
            <span onClick={this.onAnswerChosen} className="btn btn-default">Save</span>
        </div>
    }

}


export default TextBasedQuestion