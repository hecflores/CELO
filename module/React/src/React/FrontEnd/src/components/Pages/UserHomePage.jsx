import React from 'react';
import UserContext from '../Users/UserContext.jsx';
import Layout from '../Template/Layout.jsx';
import {LayoutLink}  from '../Template/Layout.jsx';
import UserRenderChooser from '../Users/UserRenderChooser.jsx';
import UserProfileWidget from '../Users/UserProfileWidget.jsx';
import CoursesBasicList from '../Courses/CoursesBasicList.jsx';
import StaffLayoutTemplate from '../LayoutTemplates/StaffLayoutTemplate.jsx';
import SimpleContainer from '../Tools/SimpleContainer.jsx';
import MainCoursesPage from '../Courses/MainCoursesPage.jsx';
import ValidationInput from '../Tools/ValidationInput.jsx';
import WidgetModule from '../Pages/WidgetModule.jsx';
import WidgetModules from '../Pages/WidgetModules.jsx';
import QuestionsSearchWidget from '../Questions/QuestionsSearchWidget.jsx';
class UserHomePage extends UserRenderChooser
{
    static contextTypes={
        UserInfo:React.PropTypes.object
    };
    renderForStaff(){
        return <Layout Template={StaffLayoutTemplate} PageTitle={"Instructor Home"}>

                    <Layout.Body>
                        <SimpleContainer>
                            <div>

                                <WidgetModules>
                                    <WidgetModule Title={"Courses"} Module={<MainCoursesPage/>}/>
                                    <WidgetModule Title={"Welcome Message"} Module={<div className="welcome-message">
                                        Welcome, {this.context.UserInfo.FirstName}

                                        <p>Here you can add courses and/or sections. If you wish to navigate to the class to make modifications to your class/section
                                            then please navigate to the appropriate class/section


                                        </p>
                                    </div>}/>



                                </WidgetModules>

                            </div>
                        </SimpleContainer>
                    </Layout.Body>

               </Layout>

    }
    renderForStudent(){
        return <Layout Template={StaffLayoutTemplate} PageTitle={"Student Home"}>

                    <Layout.Body>
                        <SimpleContainer>
                            <div>

                                <WidgetModules>
                                    <WidgetModule Title={"Courses"} Module={<MainCoursesPage/>}/>
                                    <WidgetModule Title={"Welcome Message"} Module={<div className="welcome-message">
                                        Welcome, {this.context.UserInfo.FirstName}

                                        <p>See what classes you are enrolled in and click the class that you wish to explore.
                                            If you are missing a class contact your professor.
                                        </p>
                                    </div>}/>
                                </WidgetModules>
                            </div>
                        </SimpleContainer>
                    </Layout.Body>

                </Layout>
    }


}

export  default  UserHomePage;

