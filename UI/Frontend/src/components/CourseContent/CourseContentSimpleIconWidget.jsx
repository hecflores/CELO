/**
 * Created by Hector on 5/4/2017.
 */

import React from 'react';
import CourseContentTitle from './CourseContentTitle.jsx';
import CourseContentIcon from './CourseContentIcon.jsx';
import {Popover, OverlayTrigger} from 'react-bootstrap';


class CourseContentSimpleIconWidget extends React.Component {

    static childContextTypes = {};
    static contextTypes = {};
    static defaultProps = {
        onHoverShowContent:true,
        TooltipDirection:"top"

    };
    static propTypes = {
        CourseContent:React.PropTypes.object,
        TooltipDirection:React.PropTypes.oneOf(["top","left","right","bottom"]),
        onHoverShowContent:React.PropTypes.bool,
        ShowPopover:React.PropTypes.bool
    };

    state = {
        isPopoverOpened:false
    };


    constructor(props) {
        super(props);

        this.ShowPopover=this.ShowPopover.bind(this);
        this.HidePopover=this.HidePopover.bind(this);
        this.WidgetLeaving=this.WidgetLeaving.bind(this);
        this.WidgetHovering=this.WidgetHovering.bind(this);
    }

    getChildContext() {
        return {};
    }

    componentWillMount() {
        // Called When is about to mount

        if(typeof this.props.ShowPopover == 'boolean'){
            this.setState({
                isPopoverOpened: this.props.ShowPopover
            })
        }
    }

    componentDidMount() {
        // Called When it does mount
    }

    componentWillUnmount() {
        // Called When it unmounts
    }

    componentWillReceiveProps(props, context) {
        // Called When it receives props & context
        if(typeof props.ShowPopover == 'boolean'){
            this.setState({
                isPopoverOpened: props.ShowPopover
            })
        }
    }

    componentWillUpdate() {
        // Right before rendering. Dont Do setStat here.
    }

    componentDidUpdate() {
        // Place to chech for dom stuff
    }


    ShowPopover(){
        this.setState({
            isPopoverOpened: true
        });
    }
    HidePopover(){
        this.setState({
            isPopoverOpened: true
        });
    }
    WidgetHovering(){
        if(this.props.onHoverShowContent){
            this.ShowPopover();
        }
    }
    WidgetLeaving(){
        if(this.props.onHoverShowContent){
            this.HidePopover();
        }
    }

    render() {

        const popupOver=(
            <Popover id={"courseContent"+this.props.CourseContent["ContentID"]+"_popover"} title={this.props.CourseContent.Type}>
                <CourseContentTitle CourseContent={this.props.CourseContent}/>
                {this.props.children}
            </Popover>
        );
        return (
            <div className="course-content-simple-icon-widget">
                <OverlayTrigger  placement={this.props.TooltipDirection} overlay={popupOver}>
                    <CourseContentIcon CourseContent={this.props.CourseContent}/>
                </OverlayTrigger>
            </div>
        );
    }
}

export default CourseContentSimpleIconWidget;