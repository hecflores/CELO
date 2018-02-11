/**
 * Created by Hector on 5/6/2017.
 */

import React from 'react';
import CourseContentTemplateAPI from '../../libaries/APIs/CourseContentTemplateAPI.jsx';
import Loader from '../Containers/Loader.jsx';
import CourseContentTemplateLoader from './CourseContentTemplateLoader.jsx';
import {MenuItem, DropdownButton} from 'react-bootstrap';
class CourseContentTemplateDropdownPicker extends React.Component {

    static childContextTypes = {};
    static contextTypes = {
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
    static defaultProps = {};
    static propTypes = {};

    state = {
        SelectedIndex:0
    };


    constructor(props) {
        super(props);

        this.setSelectedIndex=this.setSelectedIndex.bind(this);
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
    setSelectedIndex(index){
        this.setState({
            SelectedIndex:index
        });
    }
    render() {
        if(typeof this.context.CourseContentTemplates == 'undefined'){
            return <CourseContentTemplateLoader><CourseContentTemplateDropdownPicker {...this.props}/></CourseContentTemplateLoader>
        }





        if(this.context.CourseContentTemplates.length==0){
            return <div className="template-dropdown-picker">
                <input type="hidden" name={"TemplateID"} value={null}/>
                <DropdownButton title={"No Templates Found"} id={"courseTemplate"}/>
            </div>
        }
        return (
            <div className="template-dropdown-picker">
                <div className="form-group">
                    <label>Template
                        <DropdownButton title={this.state.SelectedIndex>0?this.context.CourseContentTemplates[this.state.SelectedIndex-1]["Name"]:'None'} id={"courseTemplate"}>
                                    <MenuItem eventKey={0} key={0} onClick={()=>{this.setSelectedIndex(0)}}>None</MenuItem>
                        {this.context.CourseContentTemplates.map((template,index)=>{
                            return  <MenuItem eventKey={index+1} key={index+1} onClick={()=>{this.setSelectedIndex(index+1)}}>
                                        <div className="course-content-template-name">{template["Name"]}</div>
                                        <div className="course-content-template-name">{template["Notes"]}</div>
                                    </MenuItem>;
                        })}
                        </DropdownButton>
                    </label>
                </div>

                {this.state.SelectedIndex>0?<input type="hidden" name={"TemplateID"} value={this.context.CourseContentTemplates[this.state.SelectedIndex-1]["TemplateID"]}/>:
                    <input type="hidden" name={"TemplateID"} />}
            </div>
        );
    }
}

export default CourseContentTemplateDropdownPicker;