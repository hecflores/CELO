net stop wampapache64
net stop wampmysqld64

copy php-settings_nodebuging.ini C:\wamp64\bin\apache\apache2.4.37\bin\php.ini

net start wampapache64
net start wampmysqld64

