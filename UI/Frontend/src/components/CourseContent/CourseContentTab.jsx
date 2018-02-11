import React from 'react';
import CourseContentAction from './CourseContentAction.jsx';
import CourseContentIcon from './CourseContentIcon.jsx';
import {ImportProperties,CourseContentGenericRenderDecider} from './CourseContentGenericRenderDecider.jsx';
import CourseContentTitle from './CourseContentTitle.jsx';
import CourseContentDescription from './CourseContentDescription.jsx';
import Loader from 'components/Containers/Loader.jsx';
import CourseContentViabilityManager from './CourseContentViabilityManager.jsx';
import CourseContentAPI from '../../libaries/APIs/CourseContentAPI.jsx';
class CourseContentTab extends CourseContentGenericRenderDecider{


    static propTypes={
        CourseContent:React.PropTypes.object.isRequired,
        onClick:React.PropTypes.func,
        ShowMessage:React.PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state.ShowMessage=false;

        this.deleteCourseContent=this.deleteCourseContent.bind(this);
    }

    deleteCourseContent(e){
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            ShowMessage:"Deleting...",

        },()=>
        {
            CourseContentAPI.instance.initiate("delete-course-content",{id:this.props.CourseContent["ContentID"]},()=>
            {
                this.setState({
                    Deleted: true
                },()=> {
                    this.refresh();
                });

            });
        });


    }
    renderEditingMode(){
        return <CourseContentAction disable={true} {...this.props} className={this.state.ShowMessage?"loading":""}>
                    <div tabIndex={this.props.CourseContent.CourseContentNumber} onClick={this.props.onClick} className={this.state.ShowMessage?"course-content-tab showing-message":"course-content-tab"}>
                        <div className="course-content-title-tab-container">
                            {this.state.ShowMessage?(
                                    <div className="course-content-info-overlay show-overlay"><div className="overlay-content">{this.state.ShowMessage}</div></div>
                                ):<div className="course-content-info-overlay"></div>}
                            <div className="course-content-tab-info">
                                <CourseContentTitle {...this.props} ViewMode="view"/>
                                <CourseContentDescription {...this.props}  ViewMode="view"/>
                                <div className="delete-button" onClick={this.deleteCourseContent}/>
                            </div>
                        </div>
                    </div>
                </CourseContentAction>
    }
    renderSubmittingMode(){
        return (
            <CourseContentAction {...this.props} className={this.state.ShowMessage?"loading":""}>
                <div onClick={this.props.onClick} className={this.state.ShowMessage?"course-content-tab showing-message":"course-content-tab"}>
                    <div className="course-content-title-tab-container">
                        {this.state.ShowMessage?(
                                <div className="course-content-info-overlay show-overlay"><div className="overlay-content">{this.state.ShowMessage}</div></div>
                            ):<div className="course-content-info-overlay"></div>}
                        <div className="course-content-tab-info">
                            <CourseContentTitle {...this.props}/>
                            <CourseContentDescription {...this.props}/>
                        </div>
                    </div>
                </div>
            </CourseContentAction>
        )
    }
    renderViewMode(){
        return (
            <CourseContentAction {...this.props} className={this.state.ShowMessage?"loading":""}>
                <div onClick={this.props.onClick} className={this.state.ShowMessage?"course-content-tab showing-message":"course-content-tab"}>
                    <div className="course-content-title-tab-container">
                        {this.state.ShowMessage?(
                                <div className="course-content-info-overlay show-overlay"><div className="overlay-content">{this.state.ShowMessage}</div></div>
                            ):<div className="course-content-info-overlay"></div>}
                        <div className="course-content-tab-info">
                            <CourseContentTitle {...this.props}/>
                            <CourseContentDescription {...this.props}/>
                        </div>
                    </div>
                </div>
            </CourseContentAction>
        )
    }
    renderEditableMode(){
        return (
            <CourseContentAction {...this.props} className={this.state.ShowMessage?"loading":""}>
                <div onClick={this.props.onClick} className={this.state.ShowMessage?"course-content-tab showing-message":"course-content-tab"}>
                    <div className="course-content-title-tab-container">
                        {this.state.ShowMessage?(
                                <div className="course-content-info-overlay show-overlay"><div className="overlay-content">{this.state.ShowMessage}</div></div>
                            ):<div className="course-content-info-overlay"></div>}
                        <div className="course-content-tab-info">
                            <CourseContentTitle {...this.props}/>
                            <CourseContentDescription {...this.props}/>
                            <div className="delete-button" onClick={this.deleteCourseContent}/>
                        </div>
                    </div>
                </div>
            </CourseContentAction>
        )
    }
    componentWillReceiveProps(props)
    {
        this.setState({
            ShowMessage:false,

        });
    }

    render(){

        return <CourseContentViabilityManager>
            {super.render()}
                </CourseContentViabilityManager>
    }

}


export default CourseContentTab