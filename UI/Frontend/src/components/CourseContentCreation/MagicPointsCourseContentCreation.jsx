import React from 'react';
import AjaxForm from '../Tools/AjaxForm.jsx';
import NumberInput from '../Tools/NumberInput.jsx';
import PopupQuestionSelectionOneSelection from '../Questions/PopupQuestionSelectionOneSelection.jsx';
import InputGeneratingQuestions from '../QuestionPools/InputGeneratingQuestions.jsx';
export class MagicPointsCell extends React.Component
{
    static contextTypes={
        isFormValid:React.PropTypes.bool,
        setFormValid:React.PropTypes.func,
        validFields:React.PropTypes.object
    };

    static propTypes={
        Row:React.PropTypes.number.isRequired,
        Column:React.PropTypes.number.isRequired,
        QuestionID:React.PropTypes.number
    };
    state={
        Points:2
    };



    constructor(props){
        super(props);
        this.state={
            Points:this.props.Points || 2,
            QuestionID:this.props.QuestionID
        };

        this.openQuestionsMenu=this.openQuestionsMenu.bind(this);
        this.closeQuestionsMenu=this.closeQuestionsMenu.bind(this);
        this.onSelected=this.onSelected.bind(this);
    }

    componentDidMount()
    {
        let isValid=typeof this.state.Points!="undefined" && typeof this.state.QuestionID!="undefined";
        this.context.setFormValid("CELL_"+this.props.Row+","+this.props.Column,isValid);
    }
    openQuestionsMenu()
    {
        this.setState({
            OpenMenu:true
        });
    }
    closeQuestionsMenu(){
        this.setState({
            OpenMenu:false
        });
    }
    onSelected(questions){
        this.setState({
            QuestionID:questions[0].QuestionID,
            OpenMenu:false
        },function()
        {
            this.context.setFormValid("CELL_"+this.props.Row+","+this.props.Column,typeof this.state.QuestionID !="undefined");
        }.bind(this));
    }
    render(){
        return <div className="magic-points-cell" style={{position:"absolute",transition:"all 500ms",top:"0px",left:"0px",...this.props.style}}>
            <div className="point-adjuster">
                <div className="raise" onClick={()=>{
                    this.setState({Points:this.state.Points+1})}
                }/>
                <div className={"lower "+(this.state.Points<=0?"disabled":"")} onClick={()=>{
                    if(this.state.Points<=0){return;}
                    this.setState({Points:this.state.Points-1});
                }}/>
            </div>
            <div className="right-stuff">
                <div className="points">{this.state.Points+"pt"}</div>
                <div className="question" onClick={this.openQuestionsMenu}>{this.state.QuestionID?<div className="question-is-set"/>:<div className="question-not-set"/>}</div>
            </div>
            <input type="hidden" name={"Json[Properties][Grid]["+this.props.Row+"]["+this.props.Column+"][QuestionID]"} value={this.state.QuestionID}/>
            <input type="hidden" name={"Json[Properties][Grid]["+this.props.Row+"]["+this.props.Column+"][Weight]"} value={this.state.Points}/>
            <PopupQuestionSelectionOneSelection onClose={this.closeQuestionsMenu} onSelected={this.onSelected} SelectedQuestions={[{QuestionID:this.props.QuestionID}]} Show={this.state.OpenMenu}/>
        </div>
    }


}
export class MagicPointsRowAndColumn extends React.Component
{
    state={
        Rows:0,
        Columns:0
    };

    static propTypes={
        onChanged:React.PropTypes.func
    };
    constructor(props){
        super(props);

        this.updateColumns=this.updateColumns.bind(this);
        this.updateRows=this.updateRows.bind(this);
    }
    updateRows(num){
        this.setState({
            Rows:num
        },()=>
        {
            this.props.onChanged(this.state);
        });
    }
    updateColumns(num){
        this.setState({
            Columns:num
        },()=>
        {
            this.props.onChanged(this.state);
        });
    }
    render(){
        return  <div className="magic-points-row-column">
            <NumberInput className="rows" value={this.state.Rows} Title="Rows" onInputChanged={this.updateRows}  Placeholder="Number of Rows..."  Id="Json[Properties][GridSize][Rows]"/>
            <span className="row-column-separator"/>
            <NumberInput className="columns"  value={this.state.Columns} Title="Columns" onInputChanged={this.updateColumns}  Placeholder="Number of Columns..."  Id="Json[Properties][GridSize][Columns]"/>
        </div>
    }
}
class MagicPointsCells extends  React.Component
{
    static defaultProps={
        Margins:10,
        Padding:0,
        Size:50,
        Rows:0,
        Columns:0,

    };
    static propTypes={
        Margins:React.PropTypes.number,
        Padding:React.PropTypes.number,
        Size:React.PropTypes.number,
        Rows:React.PropTypes.number,
        Columns:React.PropTypes.number,
        Questions:React.PropTypes.array
    };

    render()
    {
        let width=(this.props.Size+this.props.Margins)*this.props.Columns;
        let height=(this.props.Size+this.props.Margins)*this.props.Rows;
        return <div className="magic-points-cells" style={{position:"relative",left:"50%",transform:"translateX(-50%)",width:width,height:height}}>
            {(function(array){
                let QuestionIndex=0;
                for(let row = 0; row<this.props.Rows;row++){
                    for(let column = 0;column < this.props.Columns; column++,QuestionIndex++){
                        array.push(<MagicPointsCell QuestionID={this.props.Questions[QuestionIndex]} style={{
                            width:this.props.Size,
                            height:this.props.Size,
                            left:column*(this.props.Size+this.props.Margins)+"px",
                            top:row*(this.props.Size+this.props.Margins)+"px"
                        }} Column={column} Row={row} key={"CELL_"+row+","+column}/>);
                    }
                }
                return array;
            }.bind(this))([])}
        </div>
    }
}
class MagicPointsCourseContentCreation extends React.Component {

    state={
        Rows:0,
        Columns:0
    };
    constructor(props) {
        super(props);
        this.state={

        };
        this.updateRowsAndColumns=this.updateRowsAndColumns.bind(this);
        this.QuestionsChanged=this.QuestionsChanged.bind(this);

    }
    QuestionsChanged(questions){
        this.setState({
            Questions:questions.map((question)=>question["QuestionID"])
        }, ()=> {
            this.props.onChanged(this.state.Questions);
        });
    }
    updateRowsAndColumns(rowsColumns){
        this.setState(rowsColumns);
    }
    render()
    {
        return  <div className={"magic-points-creation "} >
                    <MagicPointsRowAndColumn onChanged={this.updateRowsAndColumns}/>
                    {(this.state.Rows*this.state.Columns)>0?<InputGeneratingQuestions  onChanged={this.QuestionsChanged} MaxNumberOfQuestions={this.state.Rows*this.state.Columns}/>:null}
                    {this.state.Questions?<MagicPointsCells Questions={this.state.Questions} Columns={parseInt(this.state.Columns)} Rows={parseInt(this.state.Rows)} Size={60} Margins={15}/>:null}
                </div>

    }
}



export default MagicPointsCourseContentCreation
