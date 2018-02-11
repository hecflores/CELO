/**
 * Created by Hector on 5/8/2017.
 */

import React from 'react';


class DateInterpreter extends React.Component {

    static childContextTypes = {};
    static contextTypes = {};
    static defaultProps = {
        IncludeTime:true
    };
    static propTypes = {
        Date:React.PropTypes.oneOfType([React.PropTypes.instanceOf(Date), React.PropTypes.string]).isRequired,
        children:React.PropTypes.element.isRequired,
        IncludeTime:React.PropTypes.bool

    };

    state = {
        // DateObj:Date.now(),
        // DateStr:Date.now().toString(),
        // DatePretty:Date.now().toISOString('MM/DD/YYYY HH:mm')+(date.getHours()>=12?"pm":"pm"),
        // DateJson:Date.now().toJSON(),
    };


    constructor(props) {
        super(props);
    }

    getChildContext() {
        return {};
    }

    componentWillMount() {
        this.AnyIncomingUpdates(this.props,this.context);
    }

    componentDidMount() {
        // Called When it does mount


    }

    componentWillUnmount() {
        // Called When it unmounts
    }

    componentWillReceiveProps(props, context) {
        this.AnyIncomingUpdates(props,context);
    }

    componentWillUpdate() {
        // Right before rendering. Dont Do setStat here. 
    }

    componentDidUpdate() {
        // Place to check for dom stuff
    }

    AnyIncomingUpdates(props, context){
        // Called When it receives props & context
        let date=props.Date;
        if(typeof props.Date == "string"){
            date=new Date(props.Date);
        }
        this.setState({
            DateObj:date,
            DateStr:date==null?'...':`${date.getFullYear()}-${date.getMonth()}-${date.getDay()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`,
            DatePretty:date==null?'...':`${date.getMonth()}/${date.getDay()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()} ${date.getHours()>=12?'pm':'am'}`,
            DateJson:date==null?{}:date.toJSON()
        });
    }
    render() {

        return React.cloneElement(this.props.children,{...this.state});
    }
}

export default DateInterpreter;