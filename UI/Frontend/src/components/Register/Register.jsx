import React from 'react';
import StudentRegister from './StudentRegister.jsx';
import InstructorRegister from './InstructorRegister.jsx';
import {Nav,NavItem} from 'react-bootstrap';

class Register extends React.Component
{

    static propTypes={
        Choice:React.PropTypes.string
    };
    state={
        Choice:"student"
    };

    constructor(props){
        super(props);
        if(this.props.Choice){
            this.state={
                Choice:this.props.Choice
            };
        }

        this.setChoice=this.setChoice.bind(this);
    }
    setChoice(choice){
        this.setState({
            Choice:choice
        });
    }
    componentWillReceiveProps(props){
        if(props.Choice){
            this.setChoice(props.Choice);
        }
    }
    render(){

        return <div className="register-component">
                    <Nav bsStyle="tabs" activeKey={this.state.Choice} onSelect={this.setChoice}>
                        <NavItem href="student" eventKey="student">Student</NavItem>
                        <NavItem href="instructor" eventKey="instructor">Instructor</NavItem>
                    </Nav>
                {({
                    student:(<StudentRegister/>),
                    instructor:(<InstructorRegister/>)

                })[this.state.Choice]}
                </div>
    }

}

export default Register