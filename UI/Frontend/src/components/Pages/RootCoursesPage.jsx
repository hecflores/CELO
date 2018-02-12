/**
 * Created by Hector on 5/9/2017.
 */

import React from 'react';
import StaffLayoutTemplate from '../LayoutTemplates/StaffLayoutTemplate.jsx';
import Layout from '../Template/Layout.jsx';
import SimpleContainer from '../Tools/SimpleContainer.jsx';
import MainCoursesPage from '../Courses/MainCoursesPage.jsx';
class RootCoursesPage extends React.Component {

    static childContextTypes = {};
    static contextTypes = {};
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
        return (<Layout Template={StaffLayoutTemplate} PageTitle={"Instructor Home"}>

            <Layout.Body>
                <SimpleContainer>
                    <div>
                        <MainCoursesPage/>
                    </div>
                </SimpleContainer>
            </Layout.Body>
            </Layout>
        );
    }
}

export default RootCoursesPage;