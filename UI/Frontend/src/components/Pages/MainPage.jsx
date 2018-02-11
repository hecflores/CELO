import React from 'react';
import UserContext from '../Users/UserContext.jsx';
import Layout from '../Template/Layout.jsx';
import {LayoutLink}  from '../Template/Layout.jsx';
import RedirectToHomeIfSignedIn from '../Users/RedirectToHomeIfSignedIn.jsx';
import GuestLayoutTemplate from '../LayoutTemplates/GuestLayoutTemplate.jsx';
import SimpleContainer from '../Tools/SimpleContainer.jsx';
class MainPage extends React.Component
{



    render(){
        return <RedirectToHomeIfSignedIn>
                <Layout PageTitle={"Guest Page"} Template={GuestLayoutTemplate}>
                    <Layout.Body>
                        <SimpleContainer>
                            {this.props.children}
                        </SimpleContainer>
                    </Layout.Body>
                </Layout>

               </RedirectToHomeIfSignedIn>

    }
}

export  default  MainPage;


