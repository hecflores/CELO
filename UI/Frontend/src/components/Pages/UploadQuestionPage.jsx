/**
 * Created by Hector on 5/22/2017.
 */

import React from 'react';
import Layout from '../Template/Layout.jsx';
import StaffLayoutTemplate from '../LayoutTemplates/StaffLayoutTemplate.jsx';
import QuestionsTableHeader from '../Questions/QuestionsTableHeader.jsx';
import SimpleContainer from '../Tools/SimpleContainer.jsx';
import QuestionPoolsLoader from '../QuestionPools/QuestionPoolsLoader.jsx';
import QuestionPoolCreator from '../QuestionPools/QuestionPoolCreator.jsx';
import QuestionPoolsListGlobal from '../QuestionPools/QuestionPoolsListGlobal.jsx';
import QuestionsPage from './QuestionsPage.jsx';
import QuestionPoolsList from '../QuestionPools/QuestionPoolsList.jsx';
import QuestionsPoolSelector from '../QuestionPools/QuestionsPoolSelector.jsx';
import QuestionPoolInfo from '../QuestionPools/QuestionPoolInfo.jsx';
import AjaxForm from '../Tools/AjaxForm.jsx';
class UploadQuestionPage extends React.Component {

    static childContextTypes = {};
    static contextTypes = {
        QuestionsPoolSelector:React.PropTypes.shape({
            setSelectedQuestionPool:React.PropTypes.func,
            selectQuestionPools:React.PropTypes.func,
            unSelectQuestionPools:React.PropTypes.func,
            SelectedQuestionPool:React.PropTypes.oneOfType([
                React.PropTypes.bool,
                React.PropTypes.number
            ]),
            SelectedQuestionPools:React.PropTypes.oneOfType([
                React.PropTypes.bool,
                React.PropTypes.arrayOf(React.PropTypes.number)
            ])
        }),
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
        return (<Layout  PageTitle={"Questions"} Template={StaffLayoutTemplate}>
                    <Layout.Header>

                    </Layout.Header>
                    <Layout.LeftSidePanel>

                    </Layout.LeftSidePanel>
                    <Layout.Body >
                        <SimpleContainer>
                            <AjaxForm action="/api/questions" method="post" encType='multipart/form-data' >
                                <input type="hidden" className="form-control" name="QuestionsPoolID" value={this.context.QuestionsPoolSelector.SelectedQuestionPool.QuestionsPoolID}/>
                                <input type="file" className="form-control" name="File"/>
                                <input type="submit" className="btn btn-default" value="Upload"/>
                                <input type="hidden" value="upload-questions" name="__action__"/>
                            </AjaxForm>
                        </SimpleContainer>
                    </Layout.Body>
                </Layout>

        );
    }
}

export default UploadQuestionPage;