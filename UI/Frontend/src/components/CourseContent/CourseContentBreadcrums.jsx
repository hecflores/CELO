/**
 * Created by Hector on 5/6/2017.
 */

import React from 'react';
import {DropdownButton,MenuItem} from 'react-bootstrap';
import CourseContentAction from './CourseContentAction.jsx';
import CourseContentIcon from './CourseContentIcon.jsx';
import {browserHistory} from 'react-router';
class CourseContentBreadcrums extends React.Component {

    static childContextTypes = {};
    static contextTypes = {};
    static defaultProps = {};
    static propTypes = {
        CourseContent:React.PropTypes.object
    };

    state = {};


    constructor(props) {
        super(props);
    }

    getChildContext() {
        return {};
    }

    componentWillMount() {
        // Called When is about to mount
    }

    componentDidMount() {
        // Called When it does mount
    }

    componentWillUnmount() {
        // Called When it unmounts
    }

    componentWillReceiveProps(props, context) {
        // Called When it receives props & context
    }

    componentWillUpdate() {
        // Right before rendering. Dont Do setStat here. 
    }

    componentDidUpdate() {
        // Place to chech for dom stuff
    }

    render() {
        return this.props.CourseContent["Breadcrums"]?(
            <div className="breadcrums">
                {this.props.CourseContent["Breadcrums"].map((courseContent,index)=>{
                    let courseContentSelected=this.props.CourseContent;
                    if(index-1>=0){
                        courseContentSelected=this.props.CourseContent["Breadcrums"][index-1];
                    }
                    return <div key={courseContentSelected.ContentID} className="breadcrum">
                                <DropdownButton id={`breadcrum_${index}`} key={courseContentSelected.ContentID}  title={courseContentSelected["Name"]} >
                                    {courseContent.Children.map((courseContent,index)=>{
                                        return <MenuItem onClick={()=>{browserHistory.push("/portal/section/"+courseContent["SectionID"]+"/course-content/"+courseContent["ContentID"])}}   eventKey={index} key={courseContent.ContentID}>{courseContent.Name}</MenuItem>
                                    })}
                                </DropdownButton>
                           </div>
                })}
            </div>):null;
    }
}

export default CourseContentBreadcrums;