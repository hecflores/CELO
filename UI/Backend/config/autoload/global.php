<?php
/**
 * Global Configuration Override
 *
 * You can use this file for overriding configuration values from modules, etc.
 * You would place values in here that are agnostic to the environment and not
 * sensitive to security.
 *
 * @NOTE: In practice, this file will typically be INCLUDED in your source
 * control, so do not include passwords or other sensitive information in this
 * file.
 */

return array(
    'db' => array(
        'driver'         => 'Mysqli',
        'database'       => 'CELO',
        'hostname'       =>'localhost',
        'driver_options' => array(
            MYSQLI_INIT_COMMAND => 'SET NAMES \'UTF8\''
        ),
        'options' => array(
            //if you're using mysqli driver
            //you should set buffer_results => true
            'buffer_results' => true
        ),
    ),
    'service_manager' => array(
        'factories' => array(
            'Zend\Db\Adapter\Adapter' =>
                 'Zend\Db\Adapter\AdapterServiceFactory',


        ),
     ),
    // ...
);
