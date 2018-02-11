import React from 'react';
import CourseContentAction from './CourseContentAction.jsx';
import CourseContentIcon from './CourseContentIcon.jsx';
import {ImportProperties,CourseContentGenericRenderDecider} from './CourseContentGenericRenderDecider.jsx';
import CourseContentTitle from './CourseContentTitle.jsx';
import CourseContentDescription from './CourseContentDescription.jsx';
import Loader from 'components/Containers/Loader.jsx';
class CourseContentChildTab extends CourseContentGenericRenderDecider{

    static propTypes={
        CourseContent:React.PropTypes.object.isRequired,
        onClick:React.PropTypes.func,
        ShowMessage:React.PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state.ShowMessage=false;
    }

    renderEditingMode(){
        return <CourseContentAction disable={true} {...this.props} className={this.state.ShowMessage?"loading":""}>
            <div onClick={this.props.onClick} className={this.state.ShowMessage?"course-content-tab showing-message":"course-content-tab"}>
                <div className="course-content-title-tab-container">
                    {this.state.ShowMessage?(
                            <div className="course-content-info-overlay"><div className="overlay-content"></div></div>
                        ):<div className="course-content-info-overlay"></div>}
                    <div className="course-content-tab-info">
                        <CourseContentTitle {...this.props} ViewMode="view"/>
                        <CourseContentDescription {...this.props}  ViewMode="view"/>
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
                                <div className="course-content-info-overlay "><div className="overlay-content"></div></div>
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
                                <div className="course-content-info-overlay "><div className="overlay-content"></div></div>
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
                                <div className="course-content-info-overlay "><div className="overlay-content"></div></div>
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
    componentWillReceiveProps(props)
    {
        this.setState({
            ShowMessage:props.isFetching?"Loading...":false
        });
    }

}


export default CourseContentChildTab