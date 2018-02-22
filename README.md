CELO
=======================

Introduction
------------
This is a website that was first proposed by Dr.Rizk from the University of Houston Computer Science Department.
It is to be a website to help better organize and regulate the computer science departments class content.
Essentially, a blackboard for the CS Department.

Instructions on Setting Environment
---------------------------





#### PHP Storm(IDE)
  1. Get the _Educational License_ account for 1 year by [going here to sign up](https://www.jetbrains.com/shop/eform/students).
  2. Download [PHP Storm](https://www.jetbrains.com/phpstorm/) and install. 
  3. Login for the license with the credentials in `1.`
  4. Start a new project with the instructions here to clone from [This repo](https://www.jetbrains.com/help/phpstorm/2017.1/cloning-a-repository-from-github.html).




#### Batch Files that made my life easy
 1. `start_react` - Will start the Front end continues building (_npm start_) basicly, just without the need of finding the front end folder.
    Which is in [module/React/src/React/FrontEnd](https://github.com/hecflores/CELO/tree/master/module/React/src/React/FrontEnd).
 2. `debug_on`/`debug_off` - Will stop the Wamp server and restart them with the debug on or off. Explanation on the debug part is later on.
 3. At this time open up the terminal and type `start start_react`
  
#### Setting Up Local Server
 1. Download [Wamp](http://www.wampserver.com/en/)
 2. Install...
 3. Start Wamp...
 4. You will know if it is working if [localhost](http://localhost) works.
 5. [Modify the host file](https://support.rackspace.com/how-to/modify-your-hosts-file/) by putting the following:
 
        localhost uh-celo.local
 6. Add uh-celo.local to the vhost file `{WAMP FOLDER}\apache\apache2.4.23\conf\extra\httpd-vhosts.conf`
 
        <VirtualHost *:80>
            ServerName uh-celo.local
            DocumentRoot {CELO FOLDER}/public
            <Directory  "{CELO FOLDER}/public">
                Options +Indexes +Includes +FollowSymLinks +MultiViews
                AllowOverride All
                Require local
            </Directory>
        </VirtualHost>
 7. Restart WAMP
 8. Browse to [uh-celo.local](http://uh-celo.local)
 
#### Setting Up Debugging Environment (Optional) - But Helpful! 
 1. Use [Google Chrome](https://www.google.com/chrome/browser/desktop/index.html?brand=CHBD&gclid=Cj0KCQjwytLKBRCXARIsAPchlXoS_a52XSOJrZy6i6433r4T5HY1DRlc_phaVSsIMy2G0BkmDjcn_KEaAmk6EALw_wcB) as the browser
 2. Download [EditThisCookie](https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg?hl=en)
 3. Open New Tab and Browse to [uh-celo.local](http://uh-celo.local)
 4. Click the EditThisCookie Add On(It Looks Like a Cookie)
 5. Click The _Plus Sign_ for adding a new cookie.
        
      _Cookie Key:_ **XDEBUG_SESSION**
      
      _Cookie Value:_ **12345**
      
      _Domain:_ **.uh-celo.local**
      
      _Path:_ **/**
      
      _Expiration:_ **Some Date in one year**
 6. After Opening the Project click the top right button ![Start Listening for PHP Debugger Connection](https://www.jetbrains.com/help/img/idea/2017.1/start_listening_php_debug_connections.png) (_Start Listening for PHP Debugger Connection_)
 7. Then just Refresh and it should stop inside of the code in the IDE.
 8. Read more about this [here](https://www.jetbrains.com/help/phpstorm/zero-configuration-debugging.html).
 
#### Important Code Locations
  - React(Front End Code) : [/module/React/src/React/FrontEnd](https://github.com/hecflores/CELO/tree/master/module/React/src/React/FrontEnd)
  - Main File For API Calls: [/module/Application/src/Application/Controller/RepositoryController.php](https://github.com/hecflores/CELO/blob/master/module/Application/src/Application/Controller/RepositoryController.php)
  - Entry Point for React(Were the Routes Are): [/module/React/src/React/FrontEnd/src/components/Template/Content.jsx](https://github.com/hecflores/CELO/blob/master/module/React/src/React/FrontEnd/src/components/Template/Content.jsx)
 
 
 Any questions on functionality please email **_`hectorhpflore72@gmail.com`_**