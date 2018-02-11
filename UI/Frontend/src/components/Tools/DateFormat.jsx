/**
 * Created by Hector on 5/8/2017.
 */

import React from 'react';
import DateInterpreter from './DateInterpreter.jsx';

class DateFormat extends React.Component {

    static childContextTypes = {};
    static contextTypes = {};
    static defaultProps = {};

    static propTypes = {
        ...DateInterpreter.propTypes
    };

    state = {};

    /**
     * @property {string} inputArtist search artist
     */
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

    componentWillUpdate() {
        // Right before rendering. Dont Do setStat here. 
    }

    componentDidUpdate() {
        // Place to chech for dom stuff
    }

    render() {
        if(typeof this.props.DatePretty == 'undefined'){
            return <DateInterpreter Date={this.props.Date}>
                      <DateFormat {...this.props} />
                   </DateInterpreter>
        }
        return <div className="date-format">{this.props.DatePretty}</div>

    }
}

export default DateFormat;