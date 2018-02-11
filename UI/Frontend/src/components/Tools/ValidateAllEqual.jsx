/**
 * Created by Hector on 5/9/2017.
 */

import React from 'react';
import ValidationInput from './ValidationInput.jsx';

class ValidateAllEqual extends React.Component {

    static childContextTypes = {};
    static contextTypes = {};
    static defaultProps = {};
    static propTypes = {
        children:React.PropTypes.arrayOf(React.PropTypes.element),
        MessageOnSuccess:React.PropTypes.string,

    };

    state = {
        Value:""
    };


    constructor(props) {
        super(props);

        this.updateInput=this.updateInput.bind(this);
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
    updateInput(input){
        this.setState({
            value:input
        });

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
        return (<div className="validation-group">
                    {React.Children.map(this.props.children,(child,key)=>{
                        return React.cloneElement(child,{Match:this.state.value, onInputChanged:this.updateInput});
                    })}
                </div>);
    }
}

export default ValidateAllEqual;