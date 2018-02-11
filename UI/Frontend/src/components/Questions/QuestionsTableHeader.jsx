/**
 * Created by Hector on 5/4/2017.
 */

import React from 'react';
import {QuestionObject,QuestionObjects} from './QuestionObject.jsx';
import CELOButton from '../Tools/CELOButton.jsx';
import Input from '../Tools/Input.jsx';
class QuestionsTableHeader extends React.Component {

    static childContextTypes = {};
    static contextTypes = {
        QuestionsController:React.PropTypes.shape({
            Refresh:React.PropTypes.func,
            setNumberPerPage:React.PropTypes.func,
            setCurrentPage:React.PropTypes.func,
            nextPage:React.PropTypes.func,
            previousPage:React.PropTypes.func,
            searchOn:React.PropTypes.func,
            searchOff:React.PropTypes.func,
            setSearch:React.PropTypes.func,
            clearSelection:React.PropTypes.func,
            setSelection:React.PropTypes.func,
            addSelection:React.PropTypes.func,
            removeSelection:React.PropTypes.func,
            Questions:React.PropTypes.array
        })
    };
    static defaultProps = {};
    static propTypes = {};

    state = {
        isSearchingOptionOn:false,

    };


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

    componentWillUpdate()
    {
        // Right before rendering. Dont Do setStat here. 
    }

    componentDidUpdate()
    {
        // Place to chech for dom stuff
    }

    render()
    {
        return (
            <div className="questions-table-header">
                <CELOButton Enabled={true}  TooltipText={"Previous Page..."} onClick={this.context.QuestionsController.previousPage} Text={"Previous"} className="pull-left" />

                <Input Id={"Search"} IgnoreManual={true} Placeholder={"Search..."} onChange={(e)=>{this.context.QuestionsController.setSearch(e["Search"])}}/>

                <CELOButton Enabled={true} TooltipText={"Next Page..."} onClick={this.context.QuestionsController.nextPage} Text={"Next"} className="pull-right" />
            </div>
        );
    }
}

export default QuestionsTableHeader;