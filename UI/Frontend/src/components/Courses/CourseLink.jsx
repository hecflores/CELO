import React from 'react';
import CourseName from './CourseName.jsx';
import CELOLink from '../Tools/CELOLink.jsx';
class CourseLink extends React.Component
{
    static propTypes={
        Course:React.PropTypes.object
    };

    state={
        ShowSections:false
    };

    render(){
        let Enabled=typeof this.props.Course=="object";
        Enabled=Enabled && (Array.isArray(this.props.Course.Sections));

        /*******************************************************************/
        if(!Enabled){
            return <CELOLink className="course-link" Enabled={Enabled}>Woops...Lost that one...</CELOLink>
        }

        /*******************************************************************/
        if(this.props.Course.Sections.length==0){
            return <CELOLink className="course-link"  Enabled={false} TooltipDirection={"right"} TooltipText={"No Sections Found"}>
                        <CourseName {...this.props}/>
                    </CELOLink>
        }

        /*******************************************************************/
        if(this.props.Course.Sections.length==1){
            return <CELOLink className="course-link"  TooltipDirection={"right"}  to={"/portal/section/"+this.props.Course.Sections[0].SectionID} Enabled={true} TooltipText={this.props.Course.CourseName+" ("+this.props.Course.Sections[0].SectionNumber+")"}>
                        <CourseName {...this.props}/>
                    </CELOLink>
        }

        /*******************************************************************/
        if(!this.state.ShowSections){
            return <CELOLink className="course-link"  TooltipDirection={"right"}  TooltipText={this.props.Course.CourseName + "("+this.props.Course.Sections.length+" Sections )"} onClick={()=>{this.setState({ShowSections:true})}}>
                        <CourseName {...this.props}/>
                    </CELOLink>

        }

        /*******************************************************************/
        return <span>
                    <CELOLink className="course-link" TooltipDirection={"right"}  TooltipText={this.props.Course.CourseName + "("+this.props.Course.Sections.length+" Sections )"} to={"/portal/courses/"+this.props.Course.CourseUniqueID}>
                        <CourseName {...this.props}/>
                    </CELOLink>
                    <ul className="sections-list">
                        {this.props.Course.Sections.map(function(section,index) {
                            return <li className="section-list-link" key={index}><CELOLink TooltipDirection={"right"}  TooltipText={"Click to see"}
                                                 to={"/portal/section/" + section.SectionID}>Section({section.SectionNumber})</CELOLink>
                            </li>
                        }.bind(this))}
                    </ul>
                </span>
    }
}

export default CourseLink