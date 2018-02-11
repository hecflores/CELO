import React from 'react';
import CourseContentPage from '../CourseContent/CourseContentPage.jsx';
import UserRenderChooser from '../Users/UserRenderChooser.jsx';
class CourseContentViabilityManager extends UserRenderChooser{

    static childContextTypes={
        ViewMode:React.PropTypes.string,
        onChangeViewMode:React.PropTypes.func
    };
    static contextTypes={
        UserInfo:React.PropTypes.object
    };
    constructor(props){
        super(props);
        this.state={};
        this.setNewViewMode=this.setNewViewMode.bind(this);
    }
    getChildContext() {
        return {ViewMode: this.state.ViewMode,
            onChangeViewMode:this.setNewViewMode};
    }
    componentDidMount(){
        this.setState({
            ViewMode:this.isStaff()?"editable":"view"
        });
    }
    setNewViewMode(mode)
    {
        this.setState({
            ViewMode:mode
        });
    }
    render()
    {
        let {children, ...rest}=this.props;
        return this.props.children?(
            React.Children.count(this.props.children)>1?<div className={"view-mode-"+this.state.ViewMode}>{React.Children.map(this.props.children,function(child,index) {
                        return React.cloneElement(child,{key:index, ...rest});
                    }.bind(this))}</div>:React.cloneElement(this.props.children,rest)):null;

    }
}

export default CourseContentViabilityManager