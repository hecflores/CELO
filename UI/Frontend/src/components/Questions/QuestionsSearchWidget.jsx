/**
 * Created by Hector on 5/9/2017.
 */

import React from 'react';
import QuestionsController from '../Questions/QuestionsController.jsx';
import QuestionsTableHeader from '../Questions/QuestionsTableHeader.jsx';
import QuestionCreator from '../Questions/QuestionCreator.jsx';
import QuestionsTable from '../Questions/QuestionsTable.jsx';

class QuestionsSearchWidget extends React.Component {

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

    state = {};


    constructor(props) {
        super(props);
    }

    getChildContext() {
        return {};
    }

    componentWillMount() {
        // Called When is about to mount

        this.AnyIncomingUpdate(this.props, this.context); // To Put updates in one place
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
        if(typeof this.context.QuestionsController == 'undefined'){
            return <QuestionsController><QuestionsSearchWidget/></QuestionsController>
        }
        return (
            <div className="questions-search-widget">
                <QuestionsController>
                    <QuestionsTableHeader/>
                    <QuestionCreator/>
                    <QuestionsTable Questions={this.context.QuestionsController.Questions}/>
                </QuestionsController>
            </div>
        );
    }
}

export default QuestionsSearchWidget;