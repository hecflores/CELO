import React from 'react';


class SectionTitle extends  React.Component{

    static propTypes={
        SectionInfo:React.PropTypes.object
    };

    render(){
        return  <div className="section-title">
                    {this.props.SectionInfo.Name}
                </div>;
    }
}

export  default SectionTitle;