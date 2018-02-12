import React from 'react';
import $ from 'jquery';

import Heading from './Heading.jsx';
import Content from './Content.jsx';
import Footer from './Footer.jsx';

class App extends React.Component {

    static childContextTypes = {
        refresh:React.PropTypes.func
    };
    constructor(props) {
        super(props);

        this.state={headingTitle:"SHRPAS Home"};

    }
    getChildContext() {
        return {refresh:()=>this.forceUpdate()};
    }

    setHeadingTitle(title){
        this.setState({headingTitle:title});
    }
    render() {
        return (
            <div className="">
                <Content OnRequestApp={()=>{return this;}}/>
                <Footer/>
            </div>

        )
    }
}

export default App;