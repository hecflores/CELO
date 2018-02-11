import React from 'react';
import Register from '../Register/Register.jsx';
import Layout from '../Template/Layout.jsx';
import GuestLayoutTemplate from '../LayoutTemplates/GuestLayoutTemplate.jsx';
class RegisterPage extends React.Component
{
    render(){
        return <Register Choice={this.props.params.Choice}/>
    }
}

export default RegisterPage;