import React from 'react';
const basicStyle={backgroundSize: "contain",backgroundPosition: "50% 50%",backgroundRepeat: "no-repeat",width: "60px",height: "40px"};
import NotFound_data   from "./not-found.jpg";
import Assessment_data   from "./assessment.png";
import Course_data   from "./course.png";
import DeleteBtn_data   from "./deleteBtn.png";
import File_data   from "./file.png";
import Folder_data   from "./folder.png";
/* import MagicPoints_data   from "./magic-points.png"; */
import Section_data   from "./section.png";
import Topic_data   from "./topic.png";
import Tab_data   from "./tab.png";
/* import Week_data   from "./week.png"; */

import MagicPoints_data   from "./magic-points-logo.png";
import Week_data   from "./week-logo.png";
import MainLogo_data   from "./celo_logo.png";

const MainLogo_url  = '/img/MainLogo.png';
class CourseContentIconImages{



    static get MainLogo2(){
        return <div className="main-logo" style={{backgroundSize: "contain",
            backgroundPosition: "50% 50%",
            backgroundRepeat: "no-repeat",
            /* width: 60px; */
            width: "50vw",
            height: "20vh",

            top: "0px",
            backgroundImage:`url(${MainLogo_url})`}}/>;
    }
    static get MainLogo(){
        return <div style={{backgroundSize: "contain",
            backgroundPosition: "50% 50%",
            backgroundRepeat: "no-repeat",
            /* width: 60px; */
            width: "100px",
            height: "50px",
            position: "absolute",
            top: "0px",
            left: "50%",
            backgroundImage:`url(${MainLogo_data})`}}/>;
    }
    static get NotFound(){
        return <div style={{backgroundSize: "contain",backgroundPosition: "50% 50%",backgroundRepeat: "no-repeat",width: "60px",height: "40px",backgroundImage:`url(${NotFound_data})`}}/>;
    }
    static get Assessment(){
        return <div style={{backgroundSize: "contain",backgroundPosition: "50% 50%",backgroundRepeat: "no-repeat",width: "60px",height: "40px",backgroundImage:`url(${Assessment_data})`}}/>;
    }
    static get Course(){
        return <div style={{backgroundSize: "contain",backgroundPosition: "50% 50%",backgroundRepeat: "no-repeat",width: "60px",height: "40px",backgroundImage:`url(${Course_data})`}}/>;
    }
    static get DeleteBtn(){
        return <div style={{backgroundSize: "contain",backgroundPosition: "50% 50%",backgroundRepeat: "no-repeat",width: "60px",height: "40px",backgroundImage:`url(${DeleteBtn_data})`}}/>;
    }
    static get File(){
        return <div style={{backgroundSize: "contain",backgroundPosition: "50% 50%",backgroundRepeat: "no-repeat",width: "60px",height: "40px",backgroundImage:`url(${File_data})`}}/>;
    }
    static get Folder(){
        return <div style={{backgroundSize: "contain",backgroundPosition: "50% 50%",backgroundRepeat: "no-repeat",width: "60px",height: "40px",backgroundImage:`url(${Folder_data})`}}/>;
    }
    static get MagicPoints(){
        return <div style={{backgroundSize: "contain",backgroundPosition: "50% 50%",backgroundRepeat: "no-repeat",width: "60px",height: "40px",backgroundImage:`url(${MagicPoints_data})`}}/>;
    }
    static get Section(){
        return <div style={{backgroundSize: "contain",backgroundPosition: "50% 50%",backgroundRepeat: "no-repeat",width: "60px",height: "40px",backgroundImage:`url(${Section_data})`}}/>;
    }
    static get Topic(){
        return <div style={{backgroundSize: "contain",backgroundPosition: "50% 50%",backgroundRepeat: "no-repeat",width: "60px",height: "40px",backgroundImage:`url(${Topic_data})`}}/>;
    }
    static get Tab(){
        return <div style={{backgroundSize: "contain",backgroundPosition: "50% 50%",backgroundRepeat: "no-repeat",width: "60px",height: "40px",backgroundImage:`url(${Tab_data})`}}/>;
    }
    static get Week(){
        return <div style={{backgroundSize: "contain",backgroundPosition: "50% 50%",backgroundRepeat: "no-repeat",width: "60px",height: "40px",backgroundImage:`url(${Week_data})`}}/>;
    }



}

export default CourseContentIconImages