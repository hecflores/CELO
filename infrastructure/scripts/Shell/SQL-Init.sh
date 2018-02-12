#!/bin/bash
args=$#
if [ $args -ne 3 ]
then
   echo "   SQL-Init.sh {databaseUser} {databasePassword} {databaseSQLFile}"
   exit
fi

# ------------------------------------------------------------------------ #
databaseUser=$1
databasePassword=$2
databaseSQLFile=$3

echo "Execute SQL file $databaseSQLFile"
mysql -u $databaseUser -p$databasePassword < $databaseSQLFile