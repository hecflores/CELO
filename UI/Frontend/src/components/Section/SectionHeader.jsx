import React from 'react';
import SectionTitle from './SectionTitle.jsx';
import SectionHeaderLink from './SectionHeaderLink.jsx';

class SectionHeader extends React.Component{

    static propTypes={
        SectionInfo:React.PropTypes.object
    };

    render(){
        return <div className="section-header">
                  <SectionTitle {...this.props}/>
                  <SectionHeaderLink  {...this.props} to={"course-content/"+this.props.SectionInfo.MainCourseContentID} >Course Content</SectionHeaderLink>
                  <SectionHeaderLink  {...this.props} to={"assessments"}>Assessments</SectionHeaderLink>
                  <SectionHeaderLink  {...this.props} to={"questions"}>Questions</SectionHeaderLink>
               </div>
    }
}

export  default SectionHeader;