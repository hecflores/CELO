import React from 'react';
import SectionRootCourseContent from '../Section/SectionRootCourseContent.jsx';
import SectionLoader from '../Section/SectionLoader.jsx';

class SectionCourseContentPage extends React.Component {
    render() {
        return (React.Children.count(this.props.children) == 0 ?


            <SectionLoader SectionID={parseInt(this.props.params.sectionID)}>
                <SectionRootCourseContent {...this.props}/>
            </SectionLoader> :
            this.props.children);
    }
}
export default SectionCourseContentPage