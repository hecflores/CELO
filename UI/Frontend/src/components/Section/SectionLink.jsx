import React from 'react';
import {LayoutLink}  from '../Template/Layout.jsx';
import {Link} from 'react-router';
import CELOLink from '../Tools/CELOLink.jsx';
class SectionLink extends React.Component
{
    static propTypes={
        SectionInfo:React.PropTypes.object,
        to:React.PropTypes.string
    };
    render(){
        let {to, SectionInfo,...rest} = this.props;
        return to?<CELOLink {...rest} to={"/portal/section/"+SectionInfo.SectionID+"/"+to} />:
            <CELOLink {...rest} to={"/portal/section/"+SectionInfo.SectionID} />
    }
}


export default SectionLink;