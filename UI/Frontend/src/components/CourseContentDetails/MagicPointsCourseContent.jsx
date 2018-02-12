import React from 'react';
import CourseContentGenericRenderDecider from '../CourseContent/CourseContentGenericRenderDecider.jsx';
import CourseContentTabs from '../CourseContent/CourseContentTabs.jsx';
import AnswerableQuestion from 'components/Questions/AnsweredQuestions/AnswerableQuestion.jsx';
import {OverlayTrigger,Tooltip} from 'react-bootstrap';
import CourseContentAPI from '../../libaries/APIs/CourseContentAPI.jsx';

export class BasicComponentWillTooltip extends React.Component
{
    static propTypes={
        Component:React.PropTypes.element.isRequired,
        Message:React.PropTypes.string
    };
    render()
    {
        return <OverlayTrigger placement={"top"} overlay={<Tooltip id={this.props.Message}>{this.props.Message}</Tooltip>}>
                    <div  className={"basic-component "+this.props.className}>{React.cloneElement(this.props.Component)}</div>
                </OverlayTrigger>;
    }
}
export class ErrorComponent extends React.Component{

    static propTypes={
        Message:React.PropTypes.string
    };
    static defaultProps={
        Message:"Error"
    };
    render()
    {
        return <BasicComponentWillTooltip Component={<div  className="error-item"><span className="glyphicon glyphicon-ban-circle"/></div>} Message={this.props.Message}/>
    }
}
export class MagicPointsCellViewing extends React.Component
{
    static contextTypes={
        CurrentlyBeingAnswered:React.PropTypes.object,
        setCurrentlyBeingAnswered:React.PropTypes.func,

    };
    static propTypes={
        Row:React.PropTypes.number.isRequired,
        Column:React.PropTypes.number.isRequired,
        AnsweredInfo:React.PropTypes.object,
        StatusFontSize:React.PropTypes.number,
        PointsFontSize:React.PropTypes.number
    };

    state={
        RemainingAttempts:-1,
        AnswerStatus:"",
        Answering:false,
        canAnswer:true
    };

    constructor(props){
        super(props);

        this.onClick=this.onClick.bind(this);
    }
    componentWillMount(){
        this.updateMyState(this.props);
    }
    componentWillReceiveProps(props){
        this.updateMyState(props);
    }
    setAnswering()
    {
        this.context.setCurrentlyBeingAnswered(this.props.AnsweredInfo);
    }
    setAnswerInfo(Answerable, AnswerStatus){
        this.setState({
            canAnswer:Answerable,
            AnswerStatus:AnswerStatus
        });
    }
    updateMyState(props)
    {
        if(props.AnsweredInfo && this.context.CurrentlyBeingAnswered!=null && this.context.CurrentlyBeingAnswered.AnswerableID == props.AnsweredInfo.AnswerableID)
        {
            this.setState({
                Answering:true
            });
        }

        /*******************************************************************/
        if(typeof props.AnsweredInfo != "object"){
            this.setAnswerInfo(false,<ErrorComponent Message={"Answerable Questions was not found"}/>);
            return;
        }

        /*******************************************************************/
        if(!props.AnsweredInfo.HasAnswer){
            this.setAnswerInfo(true,<BasicComponentWillTooltip Component={<div className="not-answered"></div>} Message={"Click to answer"}/>);
            return;
        }

        if(this.context.CurrentlyBeingAnswered!=null && this.context.CurrentlyBeingAnswered.AnswerableID==props.AnsweredInfo.AnswerableID){
            this.context.setCurrentlyBeingAnswered(null);
        }
        /*******************************************************************/
        this.setAnswerInfo(props.AnsweredInfo.Answerable,<BasicComponentWillTooltip Component={<div className={"answered "+(this.props.AnsweredInfo.IsCorrect?"correct":"in-correct")}></div>} Message={"Click to answer"}/>);
    }
    onClick(){
        this.setAnswering();
    }

    render()
    {
        let isCorrect=this.props.AnsweredInfo?(this.props.AnsweredInfo.IsCorrect):false;
        let isAnswered=this.props.AnsweredInfo?(this.props.AnsweredInfo.HasAnswer):false;
        let isError=this.props.AnsweredInfo?false:true;


        return <div onClick={this.onClick} className={" magic-points-cell "+(isCorrect?"correct":"in-correct")+" "+(isAnswered?"answered":"not-answered")+" "+(isError?"has-error":"")} style={{fontSize:this.props.StatusFontSize,position:"absolute",transition:"all 500ms",top:"0px",left:"0px",...this.props.style}}>
                   <div  className="answer-status">{this.state.AnswerStatus}</div>
                   <div style={{fontSize:this.props.PointsFontSize}} className="points">{this.props.AnsweredInfo?(this.props.AnsweredInfo.IsCorrect?this.props.AnsweredInfo.PointsWorth:0):"*"}</div>
               </div>
    }


}
export class MagicPointsCellsViewing extends React.Component
{
    static contextTypes={
        CurrentlyBeingAnswered:React.PropTypes.object,
        setCurrentlyBeingAnswered:React.PropTypes.func,
        MagicPointsData:React.PropTypes.object,
        triggerUpdate:React.PropTypes.func
    };

    static defaultProps={
        Margins:10,
        Padding:0,
        Size:50,
        Rows:0,
        Columns:0
    };
    static propTypes={
        Margins:React.PropTypes.number,
        Padding:React.PropTypes.number,
        Size:React.PropTypes.number,
    };

    state={
        MaxQuestionHeight:0
    };
    constructor(props){
        super(props);

        this.gettingQuestionDom=this.gettingQuestionDom.bind(this);

    }
    gettingQuestionDom(ref){
        this.questionAnsering=ref;
        this.setState({
            MaxQuestionHeight:$(this.questionAnsering).height()
        });
    }

    render()
    {
        /*******************************************************************/
        /* Find Selected Cell                                              */
        /*******************************************************************/
        let RowOfAnswering=-1;
        let ColumnOfAnswering=-1;
        if(this.context.CurrentlyBeingAnswered!=null) {
            this.context.MagicPointsData.Grid.forEach((row, rowIndex) => {
                row.forEach((cell, columnIndex) => {
                    if(cell.AnsweredInfo) {
                        if (cell.AnsweredInfo.AnswerableID == this.context.CurrentlyBeingAnswered.AnswerableID) {
                            RowOfAnswering = rowIndex;
                            ColumnOfAnswering = columnIndex;
                        }
                    }

                });
            });
        }

        /*******************************************************************/
        let maxCellSize=this.props.Size+this.props.Margins;

        let leftPos=0;
        let topPos=0;
        let topAdd=0;
        let FinalCells=[];
        

        this.context.MagicPointsData.Grid.forEach((row, rowIndex) =>
        {
            /***************************************************************/
            leftPos=0;
            topAdd=maxCellSize;

            /***************************************************************/
            row.forEach((cell, columnIndex) => {

                let answeredInfo=cell.AnsweredInfo;

                let fontSize=this.props.Size*(30/107.56);
                let pointsFontSize=this.props.Size*(25/107.56);
                FinalCells.push(<MagicPointsCellViewing key={rowIndex+","+columnIndex} StatusFontSize={fontSize} PointsFontSize={pointsFontSize} style={
                    {
                        width:this.props.Size,
                        height:this.props.Size,
                        top:topPos,
                        left:leftPos,
                        margin:this.props.Margins
                    }
                } Column={columnIndex} Row={rowIndex}  AnsweredInfo={answeredInfo}/>);

                if( answeredInfo && this.context.CurrentlyBeingAnswered!=null && answeredInfo.AnswerableID == this.context.CurrentlyBeingAnswered.AnswerableID){


                    FinalCells.push(<div key={rowIndex+","+columnIndex+" - Question"} style={{left:0,top:topPos+maxCellSize,position:"absolute", width:row.length*maxCellSize,height:3*maxCellSize}}>
                        <AnswerableQuestion onAnswerFinished={this.context.triggerUpdate} onGetDom={this.gettingQuestionDom}  AnswerableQuestion={answeredInfo} Index={rowIndex+columnIndex}/>
                    </div>);
                    topAdd=this.state.MaxQuestionHeight+maxCellSize;

                }

                leftPos+=maxCellSize;
            });

            /***************************************************************/
            topPos+=topAdd;
        });


        return <div style={{position:"relative"}} className="magic-points-cells-viewing">
                    {FinalCells}
               </div>

    }
}
class MagicPoints extends React.Component{

    static childContextTypes={
        CurrentlyBeingAnswered:React.PropTypes.object,
        setCurrentlyBeingAnswered:React.PropTypes.func,
        MagicPointsData:React.PropTypes.object,
        triggerUpdate:React.PropTypes.func
    };
    static defaultProps={
        onTriggerUpdate:function(){}
    };
    static propTypes={
        MagicPointsData:React.PropTypes.object.isRequired,
        onTriggerUpdate:React.PropTypes.func
    };
    state={
        CurrentlyBeingAnswered:null
    };



    setCurrentlyBeingAnswered(question){
        this.setState({
            CurrentlyBeingAnswered:question
        });
    }
    getChildContext(){
        return {
            CurrentlyBeingAnswered:this.state.CurrentlyBeingAnswered,
            setCurrentlyBeingAnswered:this.setCurrentlyBeingAnswered.bind(this),
            MagicPointsData:this.props.MagicPointsData,
            triggerUpdate:this.triggerUpdate.bind(this)
        }
    }
    triggerUpdate(){
        this.props.onTriggerUpdate();
    }
    render(){
        return <div className="magic-ponts">
                  {this.props.children}
               </div>
    }

}
class MagicPointsCourseContent extends CourseContentGenericRenderDecider{

    state={
        MaxWidth:100
    };
    updateWidth(ref){
        if(ref==null){
            return;
        }
        this.ref=ref;
    }
    refresh(){
        CourseContentAPI.instance.initiate("get-course-content",{id:this.props.CourseContent.ContentID});
    }
    renderEditableMode(){
        let MaxWidth=0;
        if(this.ref) {
            MaxWidth=$(this.ref).width() / this.props.CourseContent.Properties.GridSize.Columns
        }
        return <div ref={(ref)=>{this.updateWidth(ref)}} className="magic-points-viewing">
                    <MagicPoints MagicPointsData={this.props.CourseContent.Properties} onTriggerUpdate={this.refresh.bind(this)}>
                        <MagicPointsCellsViewing Margins={MaxWidth*.3} Size={MaxWidth*.7}/>
                    </MagicPoints>
               </div>
    }
    renderEditingMode()
    {
        return <div>
                <h1 className="text-danger">Unfortunately this content cannot be edited</h1>
        </div>
    }
    renderViewMode(){
        let MaxWidth=0;
        if(this.ref) {
            MaxWidth=$(this.ref).width() / this.props.CourseContent.Properties.GridSize.Columns
        }
        return <div ref={(ref)=>{this.updateWidth(ref)}} className="magic-points-viewing">
            <MagicPoints MagicPointsData={this.props.CourseContent.Properties} onTriggerUpdate={this.refresh.bind(this)}>
                <MagicPointsCellsViewing Margins={MaxWidth*.3} Size={MaxWidth*.7}/>
            </MagicPoints>
        </div>
    }
    renderSubmittingMode(){
        let MaxWidth=0;
        if(this.ref) {
            MaxWidth=$(this.ref).width() / this.props.CourseContent.Properties.GridSize.Columns
        }
        return <div ref={(ref)=>{this.updateWidth(ref)}} className="magic-points-viewing">
            <MagicPoints MagicPointsData={this.props.CourseContent.Properties} onTriggerUpdate={this.refresh.bind(this)}>
                <MagicPointsCellsViewing Margins={MaxWidth*.3} Size={MaxWidth*.7}/>
            </MagicPoints>
        </div>
    }
}

export default MagicPointsCourseContent