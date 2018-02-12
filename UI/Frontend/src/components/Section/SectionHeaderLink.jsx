import React from 'react';
import {LayoutLink}  from '../Template/Layout.jsx';
import {Link} from 'react-router';
import CELOLink from '../Tools/CELOLink.jsx';
class SectionHeaderLink extends React.Component
{
    static propTypes={
        SectionInfo:React.PropTypes.object,
        to:React.PropTypes.string,
    };
    render(){
        let {to, SectionInfo,...rest} = this.props;
        return <LayoutLink {...rest} to={"/section/"+SectionInfo.SectionID+"/"+to} />
    }
}


export default SectionHeaderLink;