import React from 'react';
import $ from 'jquery';
import Input from '../Tools/Input.jsx';
import CourseContentViabilityManager from './CourseContentViabilityManager.jsx';
import DateInput from '../Tools/DateInput.jsx';
export class CourseContentGenericRenderDecider extends React.Component{

    static contextTypes={
        ViewMode:React.PropTypes.string,
        onChangeViewMode:React.PropTypes.func,
        refresh:React.PropTypes.func
    };
    static propTypes={
        ViewComponent:React.PropTypes.element,
        onChangeViewMode:React.PropTypes.func,
        EditableComponent:React.PropTypes.element,
        EditingComponent:React.PropTypes.element,
        SubmittingComponent:React.PropTypes.element
    };


    constructor(props){
        super(props);
        this.state={
            LastUpdated:props.LastUpdated,
            Data:props.Data,
            Changes:{},
            TempChanges:{}
        };

        this.setViewModeToView=this.setViewModeToView.bind(this);
        this.setViewModeToEditable=this.setViewModeToEditable.bind(this);
        this.setViewModeToEditing=this.setViewModeToEditing.bind(this);
        this.setViewModeToSubmit=this.setViewModeToSubmit.bind(this);

        this.onChange=this.onChange.bind(this);
        this.onCommit=this.onCommit.bind(this);
        this.refresh=this.refresh.bind(this);
    }
    refresh(){
        this.context.refresh();
    }
    hasChanges(key){
        try {
            let changeFound = eval("this.state.Changes." + key);
            return typeof changeFound != 'undefined';
        }
        catch(e){}
        return false;

    }
    hasTempChanges(key){
        try {
            let changeFound = eval("this.state.TempChanges." + key);

            return typeof changeFound != 'undefined';
        }
        catch (e){}
    }
    getChangesClass(key){
        return (this.hasChanges(key)?" not-saved ":"")+
            (this.hasTempChanges(key)?" not-comited ":"");
    }

    onCommit(){
        let Changes=this.state.TempChanges;
        this.setState({
            TempChanges:{}
        },function() {
            this.props.onChange(Changes);
        }.bind(this))
    }
    onChange(data){

        this.setState({
            Data:$.extend(true,this.state.Data,data),
            Changes:$.extend(true,this.state.Changes,data),
            TempChanges:$.extend(true,this.state.TempChanges,data)
        });
    }

    componentWillReceiveProps(props,context){
        if(typeof context=="undefined"){
            return;
        }
        let {id,...input}=(props.Input?props.Input:{id:null});
        if(context.ViewMode!=this.context.ViewMode) {
            this.setState({
                LastUpdated:props.LastUpdated,
                Data:props.Data,
                Changes:input,
                TempChanges:{}
            });
            return;
        }
        this.setState({
            LastUpdated: props.LastUpdated,
            Data: (props.LastUpdated!=this.state.LastUpdated)?props.Data:this.state.Data,
            Changes: (props.LastUpdated!=this.state.LastUpdated)?input:this.state.Changes,
            TempChanges: {}
        })

    }


    setViewMode(mode){
        if(this.context.onChangeViewMode){
            this.context.onChangeViewMode(mode);
            return;
        }
        this.setState({
            ViewMode:mode || null
        })

    }

    /**
     * Renders only the view side of the component
     * @return {null}|React.Component
     */
    renderViewMode(){
        if(this.props.ViewComponent){
            return this.props.ViewComponent;
        }
        throw new Error("Must be overwritten");
    }

    /**
     * Sets the View Mode to View
     */
    setViewModeToView(){
        this.setViewMode("view");
    }
    /**
     * Renders only the view side of the component
     * @return {null}|React.Component
     */
    renderEditableMode(){
        if(this.props.EditableComponent){
            return this.props.EditableComponent;
        }
        throw new Error("Must be overwritten");
    }

    /**
     * Sets the View Mode to Editable
     */
    setViewModeToEditable(){
        this.setViewMode("editable");
    }
    /**
     * Renders only the view side of the component
     * @return {null}|React.Component
     */
    renderEditingMode(){
        if(this.props.EditingComponent){
            return this.props.EditingComponent;
        }
        throw new Error("Must be overwritten");
    }

    /**
     * Sets the View Mode to Editing
     */
    setViewModeToEditing(){
        this.setViewMode("editing");
    }
    /**
     * Renders only the view side of the component
     * @return {null}|React.Component
     */
    renderSubmittingMode(){
        if(this.props.SubmittingComponent){
            return this.props.SubmittingComponent;
        }
        throw new Error("Must be overwritten");
    }

    /**
     * Sets the View Mode to Submitting
     */
    setViewModeToSubmit(){
        this.setViewMode("submitting");
    }


    render(){
        if(this.context.ViewMode==null){
            return <div className="need--visability-manager">
                        <CourseContentViabilityManager {...this.props}/>
                    </div>
        }
        if(this.context.ViewMode=='view'){
            return this.renderViewMode();
        }
        if(this.context.ViewMode=='editable'){
            return this.renderEditableMode();
        }
        if(this.context.ViewMode=='editing'){
            return this.renderEditingMode();
        }
        if(this.context.ViewMode=='submitting'){
            return this.renderSubmittingMode();
        }

        return <b style={{display:"inline-block", opacity:1, fontSize:"2em"}} className="text-danger">Unkown View Mode({this.context.ViewMode})</b>
    }
}
export class EditableField extends CourseContentGenericRenderDecider
{
    static propTypes={
        Id:React.PropTypes.string.isRequired,
        Title:React.PropTypes.string.isRequired,
        CustomElement:React.PropTypes.element,
    };
    renderEditingMode(){
        let value;
        try{
            value=eval("this.state.Data."+this.props.Id);
            if(typeof value=="undefined"){
                value="";
            }
        }
        catch(e){}


        return <Input Id={this.props.Id}
                      className={this.getChangesClass(this.props.Id)}
                      Title={this.props.Title}
                      value={value}
                      onBlur={this.onCommit}
                      Placeholder={this.props.Title}
                      CustomElement={this.props.CustomElement?this.props.CustomElement:<input type="text"/>}
                      onChange={(data)=>{this.onChange(data)}}/>;
    }
    renderEditableMode(){
        let value;
        try{
            value=eval("this.props.Data."+this.props.Id);
            if(typeof value=="undefined"){
                value="";
            }
        }
        catch(e){}

        return <dl className={"course-content-property property-"+this.props.Id.replace(".","_")}>
            <dh>{this.props.Title}</dh>
            <dd>{value}</dd>
        </dl>
    }
    renderSubmittingMode(){
        let value;
        try{
            value=eval("this.state."+this.props.Id);
            if(typeof value=="undefined"){
                value="";
            }
        }
        catch(e){}

        return <dl className={"course-content-property property-"+this.props.Id.replace(".","_")}>
            <dh>{this.props.Title}</dh>
            <dd>{value}</dd>
        </dl>
    }
    renderViewMode(){
        let value;
        try{
            value=eval("this.props."+this.props.Id);
            if(typeof value=="undefined"){
                value="";
            }
        }
        catch(e){}

        return <dl className={"course-content-property property-"+this.props.Id.replace(".","_")}>
            <dh>{this.props.Title}</dh>
            <dd>{value}</dd>
        </dl>
    }
}

export class ImportDate extends CourseContentGenericRenderDecider{
    static propTypes={
        Id:React.PropTypes.string.isRequired,
        Title:React.PropTypes.string.isRequired,
        CustomElement:React.PropTypes.element,
    };
    render(){
        return <EditableField {...this.props}  CustomElement={<DateInput {...this.props} />}/>
    }
}

export class ImportProperties extends CourseContentGenericRenderDecider
{
    static propTypes={
        Id:React.PropTypes.string.isRequired,
        Title:React.PropTypes.string.isRequired,
        CustomElement:React.PropTypes.element,
    };
    renderEditingMode(){
        let value;
        try{
            value=eval("this.state.Data.Properties."+this.props.Id);
            if(typeof value=="undefined"){
                value="";
            }
        }
        catch(e){}


        return <Input Id={this.props.Id}
                      className={this.getChangesClass("Properties."+this.props.Id)}
                      Title={this.props.Title}
                      value={value}
                      onBlur={this.onCommit}
                      Placeholder={this.props.Title}
                      CustomElement={this.props.CustomElement?this.props.CustomElement:<input type="text"/>}
                      onChange={(data)=>{this.onChange({Properties:data})}}/>;
    }
    renderEditableMode(){
        let value;
        try{
            value=eval("this.state.Data.Properties."+this.props.Id);
            if(typeof value=="undefined"){
                value="";
            }
        }
        catch(e){}

        return <dl className={"course-content-property property-"+this.props.Id.replace(".","_")}>
                    <dh>{this.props.Title}</dh>
                    <dd>{value}</dd>
               </dl>
    }
    renderSubmittingMode(){
        let value;
        try{
            value=eval("this.props.Data.Properties."+this.props.Id);
            if(typeof value=="undefined"){
                value="";
            }
        }
        catch(e){}

        return <dl className={"course-content-property property-"+this.props.Id.replace(".","_")}>
            <dh>{this.props.Title}</dh>
            <dd>{value}</dd>
        </dl>
    }
    renderViewMode(){
        let value;
        try{
            value=eval("this.state.Data.Properties."+this.props.Id);
            if(typeof value=="undefined"){
                value="";
            }
        }
        catch(e){}

        return <dl className={"course-content-property property-"+this.props.Id.replace(".","_")}>
            <dh>{this.props.Title}</dh>
            <dd>{value}</dd>
        </dl>
    }
}

class ToggleBtn extends React.Component{

    static defaultProps={
        Enabled:false,
        YesValue:"Yes",
        NoValue:"No",
        onToggleChange:function(){}
    };
    static propTypes={
        Enabled:React.PropTypes.bool,
        YesValue:React.PropTypes.string,
        NoValue:React.PropTypes.string,
        onToggleChange:React.PropTypes.func
    };
    constructor(props){
        super(props);
        this.onChange=this.onChange.bind(this);
    }
    onChange(e){
        if(e.target.checked){
            this.props.onToggleChange(true);
            return;
        }
        this.props.onToggleChange(false);
    }
    render(){
        return <label className="switch">
                    <input type="checkbox" checked={this.props.Enabled} onChange={this.onChange}/>
                    <div className="slider round"/>
                </label>
    }
}
class ToggleInput extends React.Component{

    static propTypes={
        Id:React.PropTypes.string.isRequired,
        Title:React.PropTypes.string,
        Placeholder:React.PropTypes.string,
        value:React.PropTypes.bool,
        onChange:React.PropTypes.func,
        onBlur:React.PropTypes.func,
        CustomElement:React.PropTypes.element,
        Enabled:React.PropTypes.bool,
        YesValue:React.PropTypes.string,
        NoValue:React.PropTypes.string,
        onToggleChange:React.PropTypes.func
    };
    static defaultProps={
        Title:"Unkown",
        Placeholder:"",
        onBlur:function(){},
        onChange:function(){},

        CustomElement:<ToggleBtn/>

    };
    constructor(props){
        super(props);

        this.onChange=this.onChange.bind(this);
    }
    onChange(value){
        this.props.onChange({
            [this.props.Id]:value
        });
        this.props.onBlur({
            [this.props.Id]:value
        });

    }

    render(){
        return  <div className={"true-false-input  "+"course-content-property property-"+this.props.Id+" "+(this.props.className || "")} id={"property_"+this.props.Id}  >
                    <div className="form-group">
                        <label htmlFor={"property-"+this.props.Id}>{this.props.Title}</label>
                        <div id={"property-"+this.props.Id} className="">
                            {React.cloneElement(this.props.CustomElement,{
                                Enabled:this.props.Enabled,
                                YesValue:this.props.YesValue,
                                NoValue:this.props.NoValue,
                                onToggleChange:this.onChange
                            })}
                        </div>
                    </div>
                </div>

    }
}
export class ImportPropertyTrueFalse extends CourseContentGenericRenderDecider
{
    static propTypes={
        Id:React.PropTypes.string.isRequired,
        Title:React.PropTypes.string.isRequired,
        CustomElement:React.PropTypes.element,
    };
    renderEditingMode(){
        let value;
        try{
            value=eval("this.state.Data.Properties."+this.props.Id);
            if(typeof value=="undefined"){
                value=false;
            }
            if(typeof value!="boolean"){
                value=false;
            }
        }
        catch(e){}


        return <ToggleInput
                            Id={this.props.Id}
                            className={this.getChangesClass("Properties."+this.props.Id)}
                            Title={this.props.Title}
                            Enabled={value}
                            onBlur={this.onCommit}
                            Placeholder={this.props.Title}
                            CustomElement={this.props.CustomElement?this.props.CustomElement:<ToggleBtn/>}
                            onChange={(data)=>{this.onChange({Properties:data})}}/>;
    }
    renderEditableMode(){
        let value;
        try{
            value=eval("this.state.Data.Properties."+this.props.Id);

            if(typeof value=="undefined"){
                value=<span className="false-value"/>;
            }
            else if(value){
                value=<span className="true-value"/>;
            }
            else
            {
                value=<span className="false-value"/>;
            }
        }
        catch(e){
            value=<span className="false-value"/>;
        }

        return <dl className={"property-true-false course-content-property property-"+this.props.Id.replace(".","_")}>
            <dh>{this.props.Title}</dh>
            <dd>{value}</dd>
        </dl>
    }
    renderSubmittingMode(){
        return this.renderEditableMode();
    }
    renderViewMode(){
        return this.renderEditableMode();
    }
}
export default CourseContentGenericRenderDecider