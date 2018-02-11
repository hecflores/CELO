import React from 'react';
import UserContext from '../Users/UserContext.jsx';
import Layout from '../Template/Layout.jsx';
import {LayoutLink}  from '../Template/Layout.jsx';
import CourseContentIconImages from '../CourseContent/CourseContentIcon/Images/CourseContentIconImages.jsx';
import CELOLinkButton from '../Tools/CELOLinkButton.jsx';
const InlineIcon=(props)=>{
    return <div className="inline-icon" style={{display:"inline-block"}}>{props.children}</div>
}
class HomePage extends React.Component
{



    render(){
        return <div className="welcome-home-page-pretty-dom">
                    {React.cloneElement(CourseContentIconImages.MainLogo2,{style:{...CourseContentIconImages.MainLogo2.props.style,width:'100%'}})}
                    <h2>Hello,</h2>
                    <p>Here at CELO our goal is to ensure that when students need to do homework they have a comfortable environment to do it.
                        With the help of fun ways of answering questions as does magic points. <InlineIcon>{CourseContentIconImages.MagicPoints}</InlineIcon>
                    </p>
                     <p>For Instructors you can create course content as well as create question collections to help with the delivery of the lesson.</p>
                    <div className="things-to-do">
                        <CELOLinkButton TooltipText={"Perfect. Already have an account"} TooltipDirection={"top"} Enabled={true} to={"/login"}>Login</CELOLinkButton>
                        <CELOLinkButton TooltipText={"New? Thats Fine lets get started"} TooltipDirection={"top"} Enabled={true} to={"/register"}>Register</CELOLinkButton>
                    </div>
                </div>

    }
}

export  default  HomePage;

