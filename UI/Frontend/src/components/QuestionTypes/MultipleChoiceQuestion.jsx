import React from 'react';


class MultipleChoiceQuestion extends React.Component
{
    /***********************************************************************/
    /* Used for the automated organization                                 */
    /***********************************************************************/
    static _id="Multiple Choice";
    static _Description="Choose one option from a list of options";

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
            choices:React.PropTypes.arrayOf(React.PropTypes.string),
            question:React.PropTypes.string
        }),
        Answer:React.PropTypes.string,
        Enabled:React.PropTypes.bool,
        onAnswered:React.PropTypes.func
    };
    constructor(props){
        super(props);

        this.onItemClicked=this.onItemClicked.bind(this);
    }
    componentWillMount(){
        this.setState({
            ...this.props
        });
    }
    componentWillReceiveProps(props){

        this.setState({
            ...props
        });
    }
    onItemClicked(choice){
        if(!this.props.Enabled){
            return;
        }
        this.setState({
            Answer:choice
        },function(){
            this.props.onAnswered(choice);
        }.bind(this));

    }
    render(){
        return <div className="question-basics multiple-choice">
                    <div className="question" dangerouslySetInnerHTML={{__html:this.props.Parameters.question}}/>
                    <div className="questions">
                        {this.props.Parameters.answers.map(function(choice,index){
                            return <div key={index} className={"answer-choice "+((choice==this.state.Answer)?"chosen":"")}>
                                        <span onClick={()=>{this.onItemClicked(choice)}} className="answer-choice-selection-btn" >{String.fromCharCode(65+index)}</span>
                                        <span className="answer-choice-text" dangerouslySetInnerHTML={{__html:choice}}/>
                                   </div>
                        }.bind(this))}
                    </div>
               </div>
    }

}


export default MultipleChoiceQuestion