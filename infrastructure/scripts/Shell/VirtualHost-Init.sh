#!/bin/bash
args=$#
if [ $args -ne 4 ]
then
   echo "   VirtualHost-Init.sh {serverUserName} {serverPassword} {virtualHost} {virtualHostFolder}"
   exit 1
fi

# Variables
sitesAvailableFolder="/etc/apache2/sites-available"
sitesEnabledFolder="/etc/apache2/sites-enabled"
serverUsername=$1
serverPassword=$2
virtualHost=$3
virtualHostFolder=$4
virtualHostEntryFolder=$4/public
siteConfigFilePath="${sitesAvailableFolder}/${virtualHost}.conf"
siteEnabledConfigFilePath="${sitesEnabledFolder}/${virtualHost}.conf"

# VirtualHost Content
virtualHostFileContent+="<VirtualHost *:80>\n"
virtualHostFileContent+="	# The ServerName directive sets the request scheme, hostname and port that\n"
virtualHostFileContent+="	# the server uses to identify itself. This is used when creating\n"
virtualHostFileContent+="	# redirection URLs. In the context of virtual hosts, the ServerName\n"
virtualHostFileContent+="	# specifies what hostname must appear in the request\'s Host: header to\n"
virtualHostFileContent+="	# match this virtual host. For the default virtual host (this file) this\n"
virtualHostFileContent+="	# value is not decisive as it is used as a last resort host regardless.\n"
virtualHostFileContent+="	# However, you must set it for any further virtual host explicitly.\n"
virtualHostFileContent+="    ServerAlias ${virtualHost}\n"
virtualHostFileContent+="	\n"
virtualHostFileContent+="	ServerAdmin webmaster@localhost\n"
virtualHostFileContent+="	DocumentRoot ${virtualHostEntryFolder}\n"
virtualHostFileContent+="\n"
virtualHostFileContent+="	# Available loglevels: trace8, ..., trace1, debug, info, notice, warn,\n"
virtualHostFileContent+="	# error, crit, alert, emerg.\n"
virtualHostFileContent+="	# It is also possible to configure the loglevel for particular\n"
virtualHostFileContent+="	# modules, e.g.\n"
virtualHostFileContent+="	#LogLevel info ssl:warn\n"
virtualHostFileContent+="\n"
virtualHostFileContent+="	ErrorLog \${APACHE_LOG_DIR}/error.log\n"
virtualHostFileContent+="	CustomLog \${APACHE_LOG_DIR}/access.log combined\n"
virtualHostFileContent+="\n"
virtualHostFileContent+="	# For most configuration files from conf-available/, which are\n"
virtualHostFileContent+="	# enabled or disabled at a global level, it is possible to\n"
virtualHostFileContent+="	# include a line for only one particular virtual host. For example the\n"
virtualHostFileContent+="	# following line enables the CGI configuration for this host only\n"
virtualHostFileContent+="	# after it has been globally disabled with \"a2disconf\".\n"
virtualHostFileContent+="	#Include conf-available/serve-cgi-bin.conf\n"
virtualHostFileContent+="</VirtualHost>\n"
virtualHostFileContent+="\n"
virtualHostFileContent+="\n"
virtualHostFileContent+="# vim: syntax=apache ts=4 sw=4 sts=4 sr noet\n"
virtualHostFileContent+="\n"

echo "VirtualHost File Content:"
echo "${virtualHostFileContent}"
echo ""

# Write Virtual Host File
echo "Setting virtual file '${siteConfigFilePath}'"
echo $serverPassword | sudo -S sh -c "echo $virtualHostFileContent >> $siteConfigFilePath"

# Create new Site Folder and set permissions
echo $serverPassword | sudo -S mkdir -p $virtualHostFolder
echo $serverPassword | sudo -S chmod -R 777 $virtualHostFolder

# Placeholder HTML
placeHolderHtml=''
placeHolderHtml+="<html>\n"
placeHolderHtml+="   <body>\n"
placeHolderHtml+="   <div style='padding:20px;border-radius:10px;display:inline-block;position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);white-space:nowrap;box-shadow:0px 1px 2px rgba(0,0,0,.3), inset 0px 1px 2px rgba(255,255,255,.2);background:#021349;color:white;font-weight:bold'>\n"
placeHolderHtml+="      <div style='font-size:50px;font-family:serif;letter-spacing:3px'>Currently setting up this site. Comeback later</div>\n"
placeHolderHtml+="   </div>\n"
placeHolderHtml+="   </body>\n"
placeHolderHtml+="</html>\n"

# Create Placeholder if needed
mkdir -p $virtualHostEntryFolder
if [ ! ((-f "${virtualHostEntryFolder}/index.php") -o (-f "${virtualHostEntryFolder}/index.html")) ]; then
	echo "Putting Placeholder ${virtualHostEntryFolder}/index.html"
	echo $serverPassword | sudo -S sh -c "echo $placeHolderHtml >> ${virtualHostEntryFolder}/index.php"
fi

# Enable the site if needed
if [ ! -f "${siteEnabledConfigFilePath}" ]; then
	echo "Enabling Site ${virtualHost}"
	echo $serverPassword | sudo -S a2ensite ${virtualHost}.conf
fi

# Restart the server
echo "Restarting apache2"
echo $serverPassword | sudo -S service apache2 restart


