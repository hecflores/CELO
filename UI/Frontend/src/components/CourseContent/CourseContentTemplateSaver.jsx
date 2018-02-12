/**
 * Created by Hector on 5/6/2017.
 */

import React from 'react';
import ValidationInput from '../Tools/ValidationInput.jsx';
import CELOButton from '../Tools/CELOButton.jsx';
import PopupForm from '../Tools/PopupForm.jsx';
class CourseContentTemplateSaver extends React.Component {

    static childContextTypes = {};
    static contextTypes = {};
    static defaultProps = {};
    static propTypes = {
        CourseContent:React.PropTypes.object,

    };

    state = {
        Show:false
    };


    constructor(props) {
        super(props);

        this.showDialog=this.showDialog.bind(this);
        this.closeDialog=this.closeDialog.bind(this);
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
    showDialog(){
        this.setState({
            Show:true
        });
    }
    closeDialog(){
        this.setState({
            Show:false
        });
    }
    render() {
        return (
            <div className="course-content-template-saver">
                <CELOButton TooltipDirection={"right"} Enabled={true} onClick={this.showDialog} Text={"Save As Template"} TooltipText={"Saves Current Course Content Template"}/>
                <PopupForm Show={this.state.Show} action={"/api/course-contents/"+this.props.CourseContent["ContentID"]} method="POST" onClosed={this.closeDialog}>
                    <input type="hidden" name="__action__" value="save-root-as-template"/>
                    <input type="hidden" name="SectionID" value={this.props.CourseContent.SectionID}/>
                    <ValidationInput Id="Name" Match={/.{5}/} isRequired={true} MessageOnError={"At least 5 letters"} MessageOnSuccess={"Perfect!"} />
                </PopupForm>
            </div>
        );
    }
}

export default CourseContentTemplateSaver;