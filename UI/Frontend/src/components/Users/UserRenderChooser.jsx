import React from 'react';


class UserRenderChooser extends  React.Component{

    static contextTypes={
        UserInfo:React.PropTypes.object
    };

    constructor(props){
        super(props);

        this.renders={
            "Instructor":this.renderForInstructor.bind(this),
            "Student":this.renderForStudent.bind(this),
            "Ta":this.renderForTa.bind(this),
            "Staff":this.renderForStaff.bind(this),
            "Administrator":this.renderForAdministrator.bind(this),

        }
    }
    isStaff(){
        let role=this.context.UserInfo.Role;
        return role!="Student";
    }
    renderForStudent(){

    }
    renderForInstructor(){

    }
    renderForTa(){

    }
    renderForStaff(){

    }
    renderForAdministrator(){

    }
    render()
    {
        /**
         * @type {string}
         */
        let role=this.context.UserInfo.Role;
        let staffOrStudent=role=="Student"?"student":"staff";


        /*******************************************************************/
        /* Capitalize                                                      */
        /*******************************************************************/
        role.toLowerCase();
        staffOrStudent.toLowerCase();

        role=role.charAt(0).toUpperCase()+role.slice(1);
        staffOrStudent=staffOrStudent.charAt(0).toUpperCase()+staffOrStudent.slice(1);
        let funFound;
        if((funFound=this["renderFor"+staffOrStudent]())){
            return funFound;
        }

        if((funFound=this["renderFor"+role]())){
            return funFound;
        }
        return <div className="error-getting-render-for-user">User Role Not Found</div>


    }

}

export default UserRenderChooser