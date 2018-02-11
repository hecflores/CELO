import React from 'react';
import UserContext from '../Users/UserContext.jsx';
import Layout from '../Template/Layout.jsx';
import {LayoutLink}  from '../Template/Layout.jsx';
import UserRenderChooser from '../Users/UserRenderChooser.jsx';
import UserProfileWidget from '../Users/UserProfileWidget.jsx';

import StaffLayoutTemplate from '../LayoutTemplates/StaffLayoutTemplate.jsx';
class UserMainPage extends UserRenderChooser
{

    renderForStaff(){
        return this.props.children;
    }
    renderForStudent(){
        return this.props.children;
    }


}

export  default  UserMainPage;

