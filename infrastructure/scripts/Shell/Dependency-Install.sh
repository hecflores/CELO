#!/bin/bash
args=$#
if [ $args -ne 3 ]
then
   echo "   Dependency-Install.sh {webFolder}"
   exit
fi

# ------------------------------------------------------------------------ #
webFolder=$1

cd /
cd $webFolder
echo "Running Composer on folder $webFolder"
composer install


