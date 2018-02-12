/**
 * Created by Hector on 5/9/2017.
 */

import React from 'react';
import AjaxForm from './AjaxForm.jsx';
import APIListener from '../../libaries/APIs/APIListener.jsx';
class AjaxFormWithEventAPI extends React.Component {

    static childContextTypes = {};
    static contextTypes = {};
    static defaultProps = {
    };
    static propTypes = {
        APIListener: React.PropTypes.instanceOf(APIListener).isRequired,
        Event:React.PropTypes.string.isRequired
    };

    state = {
        action:"",
        method:""
    };


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

        let results=props.APIListener.generate(props.Event,{});

        this.setState({
            action:results.url,
            method:results.method,
        });
    }

    render() {
        return (
                <AjaxForm action={this.state.action} method={this.state.method} beforeSubmit={this.props.beforeSubmit} onSubmit={this.props.onSubmit} onValidChanged={this.props.onValidChanged}>
                    {this.state.method.toLowerCase()=='post'?
                        <input type="hidden" name="__action__" value={this.props.Event}/>:
                        <input type="hidden" name="__fetcher__" value={this.props.Event}/>}

                        {this.props.children}
                </AjaxForm>

        );
    }
}

export default AjaxFormWithEventAPI;