<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2015 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Application;

return array(
    'router' => array(
        'routes' => array(
            'get-file'=>array(
                'type' => 'segment',
                'options' => array(
                    'route' => '/files/:FileID',
                    'constraints' => array(
                        "FileID"=>'[a-zA-Z0-9_-]+',
                    ),
                    'defaults' => array(
                        'controller' => 'Files\Controller\FileManager',
                        'action'     => 'getFile',
                        'roles' => array(
                            Roles::$ADMIN,
                            Roles::$INSTRUCTOR,
                            Roles::$TA,
                        ),
                        'title'=>"Get File"
                    ),
                )
            )
        )
    ),
    'service_manager' => array(
        'abstract_factories' => array(
            'Zend\Cache\Service\StorageCacheAbstractServiceFactory',
            'Zend\Log\LoggerAbstractServiceFactory',
        ),
        'factories' => array(
            'translator' => 'Zend\Mvc\Service\TranslatorServiceFactory',
        ),
    ),
    'translator' => array(
        'locale' => 'en_US',
        'translation_file_patterns' => array(
            array(
                'type'     => 'gettext',
                'base_dir' => __DIR__ . '/../language',
                'pattern'  => '%s.mo',
            ),
        ),
    ),
    'controllers' => array(
        'invokables' => array(
            'Files\Controller\Index' => 'Files\Controller\IndexController',
            'Files\Controller\FileManager' => 'Files\Controller\FileManagerController',
        ),
    ),
    'view_manager' => array(
        'template_path_stack' => array(
            __DIR__ . '/../view',
        ),
    ),
    // Placeholder for console routes
    'console' => array(
        'router' => array(
            'routes' => array(
            ),
        ),
    ),
);
