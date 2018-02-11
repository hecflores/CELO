/**
 * Created by Hector on 5/8/2017.
 */

import React from 'react';


class UserAuthenticator {



    constructor(userInfo) {
        this.UserInfo=userInfo;
    }

    isStudent(){
        return this.UserInfo.Role=='Student';
    }
    isStaff(){
        return !this.isStudent();
    }


}

export default UserAuthenticator;