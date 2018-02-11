import CourseContentIconImages from './CourseContentIcon/Images/CourseContentIconImages.jsx';
import React from 'react';
import AssessmentCourseContent from '../CourseContentDetails/AssessmentCourseContent.jsx';
import FileCourseContent from '../CourseContentDetails/FileCourseContent.jsx';
import FolderCourseContent from '../CourseContentDetails/FolderCourseContent.jsx';
import MagicPointsCourseContent from '../CourseContentDetails/MagicPointsCourseContent.jsx';
import SectionCourseContent from '../CourseContentDetails/SectionCourseContent.jsx';
import TopicCourseContent from '../CourseContentDetails/TopicCourseContent.jsx';
import WeekCourseContent from '../CourseContentDetails/WeekCourseContent.jsx';
import TabCourseContent from '../CourseContentDetails/TabCourseContent.jsx';
import CourseCourseContent from '../CourseContentDetails/CourseCourseContent.jsx';

import AssessmentCourseContentCreation from '../CourseContentCreation/AssessmentCourseContentCreation.jsx';
import FileCourseContentCreation from '../CourseContentCreation/FileCourseContentCreation.jsx';
import FolderCourseContentCreation from '../CourseContentCreation/FolderCourseContentCreation.jsx';
import MagicPointsCourseContentCreation from '../CourseContentCreation/MagicPointsCourseContentCreation.jsx';
import SectionContentCreation from '../CourseContentCreation/SectionContentCreation.jsx';
import TopicCourseContentCreation from '../CourseContentCreation/TopicCourseContentCreation.jsx';
import WeekCourseContentCreation from '../CourseContentCreation/WeekCourseContentCreation.jsx';
import TabCourseContentCreation from '../CourseContentCreation/TabCourseContentCreation.jsx';

import CourseContentImageDisplayer from './CourseContentImageDisplayer.jsx';
class CourseContentInformation{

    _Key;
    _Text;
    _Description;
    _IconImage;
    _DetailsElement;
    _CreationElement;
    _ChildCourseContentAllowed;

    /**
     *
     * @param Text
     * @param Description
     * @param IconImage
     * @param DetailsElement
     * @param CreationElement
     */
    constructor(Key, Text, Description, IconImage, DetailsElement, CreationElement ){
        this._ChildCourseContentAllowed=[];
        this._Text = Text;
        this._Description = Description;
        this._IconImage = IconImage;
        this._DetailsElement = DetailsElement;
        this._CreationElement = CreationElement;
        this._Key = Key;
    }

    get Key() {
        return this._Key;
    }

    /**
     *
     * @param courseContent
     * @return {CourseContentInformation}
     */
    addAllowedCourseContent(courseContent){
        this._ChildCourseContentAllowed.push(courseContent);
        return this;
    }


    get Text() {
        return this._Text;
    }

    get Description() {
        return this._Description;
    }

    get IconImage() {
        return <CourseContentImageDisplayer Image={this._IconImage}/>;
    }

    get DetailsElement() {
        return this._DetailsElement;
    }

    get CreationElement() {
        return this._CreationElement;
    }

    get ChildCourseContentAllowed() {
        return this._ChildCourseContentAllowed;
    }
}
class CourseContentMainInformation {

    /**
     *
     * @type {{assessment: CourseContentInformation, file: CourseContentInformation, folder: CourseContentInformation, magic-points: CourseContentInformation, section: CourseContentInformation, topic: CourseContentInformation, week: CourseContentInformation}}
     */
    static Items={
        "course":new CourseContentInformation(
            "course",
            "Course",                        //Text
            "",                                   //Description
            CourseContentIconImages.Course,   //Icon
            CourseCourseContent,              //Course Content Details
            null),

        "assessment":new CourseContentInformation(
            "assessment",
            "Assessments",                        //Text
            "",                                   //Description
            CourseContentIconImages.Assessment,   //Icon
            AssessmentCourseContent,              //Course Content Details
            AssessmentCourseContentCreation),

        "file":new CourseContentInformation(
            "file",
            "File",                               //Text
            "",                                   //Description
            CourseContentIconImages.File,         //Icon
            FileCourseContent,                    //Course Content Details
            FileCourseContentCreation),

        "folder":new CourseContentInformation(
            "folder",
            "Folder",                             //Text
            "",                                   //Description
            CourseContentIconImages.Folder,       //Icon
            FolderCourseContent,                  //Course Content Details
            FolderCourseContentCreation),

        "magic-points":new CourseContentInformation(
            "magic-points",
            "Magic Points",                       //Text
            "",                                   //Description
            CourseContentIconImages.MagicPoints,  //Icon
            MagicPointsCourseContent,             //Course Content Details
            MagicPointsCourseContentCreation),

        "section":new CourseContentInformation(
            "section",
            "Section",                            //Text
            "",                                   //Description
            CourseContentIconImages.Section,      //Icon
            SectionCourseContent,                 //Course Content Details
            SectionContentCreation),

        "topic":new CourseContentInformation(
            "topic",
            "Topic",                              //Text
            "",                                   //Description
            CourseContentIconImages.Topic,        //Icon
            TopicCourseContent,                   //Course Content Details
            TopicCourseContentCreation),

        "week":new CourseContentInformation(
            "week",
            "Week",                               //Text
            "",                                   //Description
            CourseContentIconImages.Week,         //Icon
            WeekCourseContent,                    //Course Content Details
            WeekCourseContentCreation),

        "tab":new CourseContentInformation(
            "tab",
            "Tab",                                //Text
            "",                                   //Description
            CourseContentIconImages.Tab,          //Icon
            TabCourseContent,                     //Course Content Details
            TabCourseContentCreation)
    };

    /**
     *
     * @param CourseContent
     * @return React.Component
     * @constructor
     */
    static Icon(props)
    {
        let FoundCourseContent;
        if( typeof props =="string"){
            FoundCourseContent=CourseContentMainInformation.Items[props];
        }
        else
        {
            FoundCourseContent=CourseContentMainInformation.Items[props.CourseContent.Type];
        }
        /**
         * @param FoundCourseContent CourseContentInformation
         */

        if(FoundCourseContent){
            return FoundCourseContent.IconImage;
        }
        return <CourseContentImageDisplayer Image={CourseContentIconImages.NotFound}/>
    }


    static Details(props){
        /**
         * @param FoundCourseContent CourseContentInformation
         */
        let FoundCourseContent;
        if( typeof props =="string"){
            FoundCourseContent=CourseContentMainInformation.Items[props];
        }
        else
        {
            FoundCourseContent=CourseContentMainInformation.Items[props.CourseContent.Type];
        }
        if(FoundCourseContent){
            return React.cloneElement(FoundCourseContent.DetailsElement,props);
        }
        return <CourseContentImageDisplayer Image={CourseContentIconImages.NotFound}/>
    }

    static Creator(props){
        /**
         * @param FoundCourseContent CourseContentInformation
         */
        let FoundCourseContent;
        if( typeof props =="string"){
            FoundCourseContent=CourseContentMainInformation.Items[props];
        }
        else
        {
            FoundCourseContent=CourseContentMainInformation.Items[props.CourseContent.Type];
        }
        if(FoundCourseContent){
            return React.cloneElement(FoundCourseContent.CreationElement,props);
        }
        return <CourseContentImageDisplayer Image={CourseContentIconImages.NotFound}/>
    }

    static MenuItems(props){


        /**
         * @param FoundCourseContent CourseContentInformation
         */
        let FoundCourseContent;
        if( typeof props =="string"){
            FoundCourseContent=CourseContentMainInformation.Items[props];
        }
        else
        {
            FoundCourseContent=CourseContentMainInformation.Items[props.CourseContent.Type];
        }
        if(FoundCourseContent) {
            return FoundCourseContent.ChildCourseContentAllowed;
        }
        return [];
    }
}
CourseContentMainInformation.Items["course"]
    .addAllowedCourseContent(CourseContentMainInformation.Items["tab"]);

CourseContentMainInformation.Items["tab"]
    .addAllowedCourseContent(CourseContentMainInformation.Items["folder"])
    .addAllowedCourseContent(CourseContentMainInformation.Items["section"])
    .addAllowedCourseContent(CourseContentMainInformation.Items["week"])
    .addAllowedCourseContent(CourseContentMainInformation.Items["file"]);

CourseContentMainInformation.Items["folder"]
    .addAllowedCourseContent(CourseContentMainInformation.Items["folder"])
    .addAllowedCourseContent(CourseContentMainInformation.Items["section"])
    .addAllowedCourseContent(CourseContentMainInformation.Items["week"])
    .addAllowedCourseContent(CourseContentMainInformation.Items["file"]);

CourseContentMainInformation.Items["section"]
    .addAllowedCourseContent(CourseContentMainInformation.Items["file"])
    .addAllowedCourseContent(CourseContentMainInformation.Items["topic"])
    .addAllowedCourseContent(CourseContentMainInformation.Items["assessment"])
    .addAllowedCourseContent(CourseContentMainInformation.Items["magic-points"]);

CourseContentMainInformation.Items["topic"]
    .addAllowedCourseContent(CourseContentMainInformation.Items["file"])
    .addAllowedCourseContent(CourseContentMainInformation.Items["assessment"]);

CourseContentMainInformation.Items["week"]
    .addAllowedCourseContent(CourseContentMainInformation.Items["file"])
    .addAllowedCourseContent(CourseContentMainInformation.Items["topic"])
    .addAllowedCourseContent(CourseContentMainInformation.Items["assessment"])
    .addAllowedCourseContent(CourseContentMainInformation.Items["magic-points"]);

export default CourseContentMainInformation