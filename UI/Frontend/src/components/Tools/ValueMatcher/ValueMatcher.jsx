import React from 'react';

class ValueMatcher extends React.Component{
    constructor(props){
        super(props);

    }
    componentWillMount(){
        if(this.props.component) {
            this.element = React.createElement(this.props.component, this.props);
        }
    }
    componentWillReceiveProps(){
        if(this.props.component) {
            this.element = React.createElement(this.props.component, this.props);
        }
    }
    render()
    {
        if(this.props.component){
            return React.createElement(this.props.component,this.props);
        }
        return React.Children.map(function(child,index){
            return React.cloneElement(child, this.props);
        }.bind(this));

    }
}
ValueMatcher.propTypes={
    match:React.PropTypes.string,
    component:React.PropTypes.func
};

export default ValueMatcher