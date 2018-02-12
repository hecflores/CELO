/**
 * Created by Hector on 5/9/2017.
 */

import React from 'react';
import CourseContentTemplateAPI from '../../libaries/APIs/CourseContentTemplateAPI.jsx';
import Loader from '../Containers/Loader.jsx';

class CourseContentTemplateLoader extends React.Component {

    static childContextTypes = {
        CourseContentTemplates:React.PropTypes.arrayOf(React.PropTypes.shape({
            CourseContent:React.PropTypes.shape({
                Tree: React.PropTypes.array,
                All: React.PropTypes.array
            }),
            Creator:React.PropTypes.any,
            FileID:React.PropTypes.any,
            Name:React.PropTypes.any,
            Notes:React.PropTypes.any,
            PrivacyOptions:React.PropTypes.any,
            TemplateID:React.PropTypes.any,
        }))
    };
    static contextTypes = {};
    static defaultProps = {};
    static propTypes = {};

    state = {
        Templates:[],
        Loaded:false,
    };


    constructor(props) {
        super(props);
    }

    getChildContext() {
        return {
            CourseContentTemplates:this.state.Templates
        };
    }

    componentWillMount() {
        // Called When is about to mount

        this.AnyIncomingUpdate(this.props, this.context); // To Put updates in one place

        CourseContentTemplateAPI.instance.initiate("get-templates",{},(data)=>
        {
            this.setState({
                Templates:data.data.Templates,
                Loaded:true
            });
        })
    }

    componentDidMount() {
        // Called When it does mount
    }

    componentWillUnmount() {
        // Called When it unmounts


    }

    componentWillReceiveProps(props, context) {
        // Called When it receives props & context

        this.AnyIncomingUpdate(props, context); // To Put updates in one place
    }

    componentWillUpdate() {
        // Right before rendering. Dont Do setStat here. 
    }

    componentDidUpdate() {
        // Place to chech for dom stuff
    }

    AnyIncomingUpdate(props, context) {
        // Both the componentWillMount and componentWillReceiveProps will go here
    }

    render() {
        if(!this.state.Loaded){
            return <div className="template-dropdown-picker"><Loader/></div>;
        }


        return (
            <div className="course-content-template-loader">{this.props.children}</div>
        );
    }
}

export default CourseContentTemplateLoader;