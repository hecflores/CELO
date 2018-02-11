import React from 'react';
import CourseContentMainInformation from './CourseContentMainInformation.jsx';
import PopupForm from '../Tools/PopupForm.jsx';
import CELOButton from 'components/Tools/CELOButton.jsx';
import CourseContentCreation from '../CourseContentCreation/CourseContentCreation.jsx';
import {DropdownButton,MenuItem,OverlayTrigger,Tooltip} from 'react-bootstrap';
import CourseContentAPI from "../../libaries/APIs/CourseContentAPI.jsx";
import AjaxForm from '../Tools/AjaxForm.jsx';
import SubmitButton from '../Tools/SubmitButton.jsx';
class CourseContentCreationMenu extends React.Component
{
    state={
        Valid:false,
        Opened:false,
        Data:{},
        SelectedType:Object.keys(CourseContentMainInformation.Items)[0]
    };

    static contextTypes={
        refresh:React.PropTypes.func
    };
    constructor(props){
        super(props);

        this.open=this.open.bind(this);
        this.close=this.close.bind(this);
        this.updateData=this.updateData.bind(this);
        this.validInputOrNot=this.validInputOrNot.bind(this);
        this.addEssentialItems=this.addEssentialItems.bind(this);
        this.create=this.create.bind(this);
        this.beforeSubmit=this.beforeSubmit.bind(this);
        this.onSubmit=this.onSubmit.bind(this);

        this.apiHook=CourseContentAPI.instance.hook();
    }
    componentDidMount(){



        this.apiHook.open();
        this.apiHook.on("create-course-content",function(data){
            this.close();
        }.bind(this));
    }
    componentWillMount(){
        this.addEssentialItems();
    }
    componentWillUnmount(){
        this.apiHook.close();
    }
    componentWillReceiveProps(props){
        this.addEssentialItems();



    }
    componentWillUpdate(){
        $(this.form).ajaxForm({
            dataType: 'json',
            beforeSubmit: this.beforeSubmit,
            success: this.onSubmit
        });
    }
    validInputOrNot(valid){
        this.setState({
            Valid:valid
        });
    }
    addEssentialItems(){
        this.setState({
            Data:$.extend(this.state.Data,{id:this.props.CourseContentID,
                                            Type:this.state.SelectedType})
        });
    }
    updateData(data){
        this.setState({
           Data:data
        });
    }
    open(){
        this.setState({
            Opened:true
        });
    }
    close(){
        this.setState({
            Opened:false
        });
    }
    setType(type){

        this.setState({
            SelectedType:type,
            Opened:true,
            Data:$.extend(this.state.Data,{id:this.props.CourseContentID,
                Type:type})

        });

    }
    create()
    {

        this.context.refresh();

    }
    onSubmit(e){


    }
    beforeSubmit(e){

        this.setState({
            Creating:true
        });
    }
    render(){



        return <div className="create-course-content-menu">
                        <OverlayTrigger trigger={['hover']} placement={"right"} overlay={<Tooltip id={"create-menu-tooltip"}>Add New Items</Tooltip>}>
                            <DropdownButton id="creationTypeDropdown"  title={"New"}  >
                                {CourseContentMainInformation.MenuItems(this.props).map(function(item,index ){
                                    return <MenuItem  onClick={(e)=>{ this.setType(item.Key)}} eventKey={index} key={index}>{item.IconImage}{item.Text}</MenuItem>
                                }.bind(this))}
                            </DropdownButton>
                        </OverlayTrigger>
                            <PopupForm Show={this.state.Opened}
                                       okText={this.state.Creating?"Creating..":"Create"}
                                       OkEnabled={this.state.Valid}
                                       onClosed={this.close}
                                       onSubmit={this.create}
                                       Title={"Create Course Content"}
                                       encType="multipart/form-data" action={"/api/course-contents/"+this.props.CourseContentID} method="POST" ref={(form)=>{this.form=form;}} onValidChanged={this.validInputOrNot}>
                                <input type="hidden" name="Type" value={this.state.SelectedType}/>
                                <input type="hidden" name="__action__" value={"create-new-content"}/>
                                <div>
                                    <CourseContentCreation ContentType={this.state.SelectedType} {...this.props} CurrentData={this.state.Data} onDataChanged={this.updateData} onValidityChanged={this.validInputOrNot}/>
                                </div>
                            </PopupForm>
                   </div>
    }
}


export default CourseContentCreationMenu
