import React from 'react';
import LayoutTemplate from '../Template/LayoutTemplate.jsx';
import {LayoutLink,Layout} from '../Template/Layout.jsx';
import RootLayoutTemplate from './RootLayoutTemplate.jsx';
import SimpleContainer from '../Tools/SimpleContainer.jsx';
import CELOLinkButton from '../Tools/CELOLinkButton.jsx';
class HomeLayoutTemplate extends LayoutTemplate
{

    render(){
        let {children,...rest}=this.props;
        return <Layout {...rest} Template={RootLayoutTemplate}>
                    <Layout.Header>
                        <SimpleContainer>
                            <div>

                                <CELOLinkButton Text="Main Home Page" TooltipDirection={"bottom"} to="/">Home</CELOLinkButton>
                                {this.getHeader()}
                            </div>
                        </SimpleContainer>
                    </Layout.Header>
               </Layout>

    }
}
export default HomeLayoutTemplate;