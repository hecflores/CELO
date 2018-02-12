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
                ),

            ),
//            'upload-file'=>array(
//
//            ),



            /***************************************************************/
            /*                     J s o n   A P I                         */
            /***************************************************************/
            'course-content-create' => array(
                'type' => 'segment',
                'options' => array(
                    'route' => '/:instructor/section/[:sectionID]/course-content/create',
                    'constraints' => array(
                        "sectionID"=>'[a-zA-Z0-9_-]+',
                    ),
                    'defaults' => array(
                        'controller' => 'Files\Controller\Index',
                        'action'     => 'create',
                        'roles' => array(
                            Roles::$ADMIN,
                            Roles::$INSTRUCTOR,
                            Roles::$TA,
                        ),
                        'title'=>"Content Create"
                    ),
                ),
            ),

            'course-content' => array(
                'type' => 'segment',
                'options' => array(
                    'route'    => '/[:role]/section/[:sectionID]/course-content/[:contentID]',
                    'constraints' => array(
                        'contentID' => '[0-9]+',
                        "sectionID"=>'[a-zA-Z0-9_-]+',
                        "role"=>'administrator|student|ta|instructor'
                    ),
                    'defaults' => array(
                        'controller' => 'Instructor\Controller\User',
                        'action'     => 'sectionHome',
                        'roles' => array(
                            Roles::$INSTRUCTOR,
                            Roles::$STUDENT,
                            Roles::$TA,
                            Roles::$INSTRUCTOR,
                        ),
                        'title'=>"Course Content"
                    ),
                ),

                'may_terminate' => true,
                'child_routes' => array(
                    // Segment route for viewing one blog post

                    'view' => array(
                        'type' => 'literal',
                        'options' => array(
                            'route' => '/view',
                            'defaults' => array(
                                'controller' => 'Files\Controller\Index',
                                'action'     => 'view',
                                'roles' => array(
                                    Roles::$ADMIN,
                                    Roles::$INSTRUCTOR,
                                    Roles::$TA,
                                    Roles::$STUDENT,
                                ),
                                'title'=>"Content View"
                            ),
                        ),
                    ),

                    'run' => array(
                        'type' => 'literal',
                        'options' => array(
                            'route' => '/run',
                            'defaults' => array(
                                'controller' => 'Files\Controller\Index',
                                'action'     => 'run',
                                'roles' => array(
                                    Roles::$ADMIN,
                                    Roles::$INSTRUCTOR,
                                    Roles::$TA,
                                    Roles::$STUDENT,
                                ),
                                'title'=>"Content Run"
                            ),
                        ),
                    ),
                ),
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
