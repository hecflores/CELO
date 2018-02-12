import React from 'react';
import CELOButton from '../Tools/CELOButton.jsx';
import SectionHeader from '../Section/SectionHeader.jsx';
import APIComponent from '../Containers/APIComponent.jsx';
import DataInput from '../Containers/DataInput.jsx';
import CourseContent from '../CourseContent/CourseContent.jsx';
import SectionsAPI from "../../libaries/APIs/SectionsAPI.jsx";
import CourseTitle from '../Courses/CourseTitle.jsx';
import {SectionLoader, SectionLoaderIndicator} from '../Section/SectionLoader.jsx';
import {ButtonGroup,Button} from 'react-bootstrap';
import Loader from '../Containers/Loader.jsx';
import Layout from '../Template/Layout.jsx';
import UserRenderChooser from '../Users/UserRenderChooser.jsx';
import StaffLayoutTemplate from '../LayoutTemplates/StaffLayoutTemplate.jsx';
import SimpleContainer from '../Tools/SimpleContainer.jsx';
import CourseContentViabilityManager from '../CourseContent/CourseContentViabilityManager.jsx';
import CourseContentTabs from '../CourseContent/CourseContentTabs.jsx';
import SectionLink from '../Section/SectionLink.jsx';
import SectionAPI from '../../libaries/APIs/SectionsAPI.jsx';
class SectionUsers extends UserRenderChooser{
    static propTypes={
        SectionInfo:React.PropTypes.object,
        SectionID:React.PropTypes.number,
    };

    constructor(props)
    {
        super(props);
        this.uhidInputChanged=this.uhidInputChanged.bind(this);
        this.addUHID=this.addUHID.bind(this);
        this.deleteUser=this.deleteUser.bind(this);
    }

    uhidInputChanged(e){
        let UHIDs=[];
        let html=e.target.value.replace(/(.*)(\n|$)/g,function(x, $0,$1){

            return "<div class='line'>"+x.replace(/(\d{7})/g,function(y){
               UHIDs.push(y);
               return  "<span class='"+'found'+"'>"+y+"</span>"
            })+"</div>";
        });
        this.setState({
            UHIDInput:e.target.value,
            UHIDInputFormated:html,
            FoundUHIDs:UHIDs
        });
    }
    addUHID(e){
        SectionAPI.instance.initiate("add-uhids-in-section",
            {SectionID:this.props.SectionID,UHID:this.state.FoundUHIDs},()=>{
                this.setState({
                    UHIDInput:"",
                    UHIDInputFormated:"",
                    FoundUHIDs:[]
                });
            });
    }
    componentWillMount() {
        this.uhidInputChanged({target:{value:""}});
    }
    componentDidUpdate() {
        // Place to chech for dom stuff

        if(this.UHIDsInput==null){
            return;
        }



        let $Input=$(this.UHIDsInput);
        let $Overlay=$(this.UHIDsInputOverlay);
        let $Container=$(this.UHIDsInputContainer);

        $Container.css({
            "display":"flex",
            "align-items":"stretch"
        });
        $Input.css({
            "flex-grow":"1",
            "width":"50%"
        });
        $Overlay.css({
            "flex-grow":"1",
            "width":"50%"
        });
        {/*$Input.css({*/}
            {/*"background":"transparent",*/}
            {/*"color":"black",*/}
            {/*"zIndex":"2",*/}
            {/*"left":"0px",*/}
            {/*"fontFamily":"Trajan Pro",*/}
            {/*"fontSize":"1.2em",*/}
            {/*"top":"0px",*/}
            {/*"position":"absolute",*/}
        {/*}).attr("spellcheck","false");*/}


        {/*$Container.css({*/}
        //     "display":"block",
        //     "position":"relative",
        //     "width":$Input.outerWidth(true,true),
        //     "minHeight":"2em",
        //     "height":$Input.outerHeight(true,true),
        //     "left":"0px",
        //     "top":"0px",
        // });
        //
        // $Overlay.css({
        //     "-webkit-text-fill-color":"black",
        //     "padding":$Input.css("padding"),
        //     "fontFamily":"Trajan Pro",
        //     "fontSize":"1.2em",
        //     "opacity":"1",
        //     "display":"inline-block",
        //     "color":"black",
        //     "left":"0px",
        //     "top":"0px",
        //     "background":"white",
        //     "width":$Container.outerWidth(true,true),
        //     "height":$Container.outerHeight(true,true),
        //     "position":"absolute",
        //
        // });


    }


    deleteUser(user){

    }
    renderForInstructor()
    {
        return <div className="section-users">
                    {/*<div className="form-group">*/}
                        {/*<label>Search</label>*/}
                        {/*<input type="string" className="form-control" placeholder="Search..."/>*/}
                    {/*</div>*/}
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Active</th>
                                <th>UHID</th>
                                <th>Name</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.props.SectionInfo.Users.map(function(user,index){
                            return <tr key={index} className="user-tuple-in-section">
                                        <td>{user.isActive?<span className="true-value"/>:<span className="false-value"/>}</td>
                                        <td>{user.UHID}</td>
                                        <td>{user.LastName+", "+user.FirstName}</td>
                                        <td>{user.Role}</td>
                                        <td><span className="delete-user" onChange={()=>{this.deleteUser(user)}}/> </td>
                                   </tr>
                        }.bind(this))}
                        </tbody>
                    </table>
                    <div className="form-group">
                        <label>Add UHIDs</label>
                        <div onMouseMove={()=>{this.forceUpdate()}} ref={(input)=>{this.UHIDsInputContainer=input}} className="searching-container" >

                            <textarea ref={(input)=>{this.UHIDsInput=input}} onChange={this.uhidInputChanged} className="input-user-uhids-input" placeholder="UHIDs">{this.state.UHIDInput}</textarea>
                            <div ref={(input)=>{this.UHIDsInputOverlay=input}} className="text-box-overlay" dangerouslySetInnerHTML={{__html:this.state.UHIDInputFormated}}/>

                        </div>
                    </div>
                    <CELOButton Enabled={true} onClick={this.addUHID} TooltipText={"Click to add UHID"}>Add</CELOButton>
               </div>


    }
    renderForStudent(){
        return <div></div>;
    }


}



export default SectionUsers;