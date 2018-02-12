#!/bin/bash
args=$#
if [ $args -ne 1 ]
then
   echo "   Dependency-Install.sh {webFolder}"
   exit 1
fi

# ------------------------------------------------------------------------ #
webFolder=$1

cd /
cd $webFolder
echo "Running Composer on folder $webFolder"
composer install


