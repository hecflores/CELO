import React from 'react';
import {Link,browserHistory} from 'react-router';
class CourseContentAction extends React.Component{

    static propTypes={
        CourseContent:React.PropTypes.object.isRequired,
        BaseElement:React.PropTypes.element
    };
    constructor(props){
        super(props);

        this.redirect=this.redirect.bind(this);
    }
    redirect(){
        browserHistory.push("/portal/section/"+this.props.CourseContent["SectionID"]+"/course-content/"+this.props.CourseContent["ContentID"]);
    }
    render(){
        if(this.props.BaseElement){
            let element=React.cloneElement(this.props.BaseElement,{onClick:this.redirect});
            return <element>
                {this.props.children}
                   </element>
        }

        return this.props.disable?<a className="course-content-link">
                {React.Children.count(this.props.children)==0?
                    (this.props.CourseContent.Name):
                    this.props.children}
            </a>:
            <Link to={"/portal/section/"+this.props.CourseContent["SectionID"]+"/course-content/"+this.props.CourseContent["ContentID"]} className={"course-content-link "+this.props.className}>
                   {React.Children.count(this.props.children)==0?
                       (this.props.CourseContent.Name):
                       this.props.children}
               </Link>
    }
}

export default CourseContentAction