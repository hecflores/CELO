import React from 'react';

export class UnkownValueMatch extends React.Component{
    constructor(props) {
        super(props);
    }
    render(){
        return null;//<h1 className="text-danger">Unkown Value Match{this.props.MatchValue}</h1>;
    }
}

export default UnkownValueMatch