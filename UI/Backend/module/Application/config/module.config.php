<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2015 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Application;

use Zend\Permissions\Rbac\Role;

return array(
    'router' => array(
        'routes' => array(
            'testing2'=>array(
                'type' => 'Zend\Mvc\Router\Http\Literal',
                'options' => array(
                    'route'    => '/testing/hector/testing/code-coverage/start',
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'startCodeCoverage',
                        'roles' => array(
                            Roles::$GUEST
                        ),
                        'title'=>"Start Code Coverage"
                    ),
                ),

            ),
            'testingStop'=>array(
                'type' => 'Zend\Mvc\Router\Http\Literal',
                'options' => array(
                    'route'    => '/testing/hector/testing/code-coverage/stop',
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'startCodeCoverage',
                        'roles' => array(
                            Roles::$GUEST
                        ),
                        'title'=>"Stop Code Coverage"
                    ),
                ),

            ),
            /***************************************************************/
            /*                     J s o n   A P I                         */
            /***************************************************************/
            'api' => array(
                'type' => 'Zend\Mvc\Router\Http\Literal',
                'options' => array(
                    'route'    => '/api',
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                        'roles' => array(
                            Roles::$GUEST
                        ),
                        'title'=>"Home"
                    ),
                ),


                'may_terminate' => true,
                'child_routes' => array(
                    'tags'=>array(
                        'type' => 'Zend\Mvc\Router\Http\Literal',
                        'options' => array(
                            'route'    => '/tags',
                            'defaults' => array(
                                'controller' => 'Application\Controller\Repository',
                                'action'     => 'tags',
                                'roles' => array(
                                    Roles::$STUDENT,
                                    Roles::$ADMIN,
                                    Roles::$TA,
                                    Roles::$INSTRUCTOR,
                                ),
                                'title'=>"Tags"
                            ),
                        ),
                    ),
                    /*******************************************************/
                    /* User                                                */
                    /*******************************************************/
                    'users' => array(
                        'type' => 'Zend\Mvc\Router\Http\Literal',
                        'options' => array(
                            'route'    => '/users',
                            'defaults' => array(
                                'controller' => 'Application\Controller\Repository',
                                'action'     => 'Users',
                                'roles' => array(
                                    Roles::$GUEST,
                                    Roles::$INSTRUCTOR,
                                    Roles::$STUDENT,
                                    Roles::$ADMIN,
                                    Roles::$TA
                                ),
                                'title'=>"Users(Repo)"
                            ),
                        ),
                        'may_terminate' => true,
                        'child_routes' => array(
                            // Segment route for viewing one blog post
                            'user' => array(
                                'type' => 'segment',
                                'options' => array(
                                    'route' => '/[:id]',
                                    'constraints' => array(
                                        'id' => '[a-zA-Z0-9_-]+',
                                    ),
                                    'defaults' => array(
                                        'controller' => 'Application\Controller\Repository',
                                        'action'     => 'User',
                                        'roles' => array(
                                            Roles::$GUEST,
                                            Roles::$INSTRUCTOR,
                                            Roles::$STUDENT,
                                            Roles::$ADMIN,
                                            Roles::$TA
                                        ),
                                        'title'=>"User(Repo)"
                                    ),
                                ),
                            ),
                        ),

                    ),
                    /*******************************************************/
                    /* Courses                                             */
                    /*******************************************************/
                    'courses' => array(
                        'type' => 'Zend\Mvc\Router\Http\Literal',
                        'options' => array(
                            'route'    => '/courses',
                            'defaults' => array(
                                'controller' => 'Application\Controller\Repository',
                                'action'     => 'Courses',
                                'roles' => array(
                                    Roles::$GUEST
                                ),
                                'title'=>"Courses(Repo)"
                            ),
                        ),
                        'may_terminate' => true,
                        'child_routes' => array(
                            // Segment route for viewing one blog post
                            'course' => array(
                                'type' => 'segment',
                                'options' => array(
                                    'route' => '/[:id]',
                                    'constraints' => array(
                                        'id' => '[a-zA-Z0-9_-]+',
                                    ),
                                    'defaults' => array(
                                        'controller' => 'Application\Controller\Repository',
                                        'action'     => 'Course',
                                        'roles' => array(
                                            Roles::$GUEST
                                        ),
                                        'title'=>"Course(Repo)"
                                    ),
                                ),
                            ),
                        ),
                    ),
                    /*******************************************************/
                    /* Answerable Items                                    */
                    /*******************************************************/
                    'answerable-items' => array(
                        'type' => 'Zend\Mvc\Router\Http\Literal',
                        'options' => array(
                            'route'    => '/answerable-items',
                            'defaults' => array(
                                'controller' => 'Application\Controller\Repository',
                                'action'     => 'AnswerableItems',
                                'roles' => array(
                                    Roles::$ADMIN,
                                    Roles::$INSTRUCTOR,
                                    Roles::$STUDENT,
                                    Roles::$TA
                                ),
                                'title'=>"Answerable Items(Repo)"
                            ),
                        ),
                        'may_terminate' => true,
                        'child_routes' => array(
                            // Segment route for viewing one blog post
                            'answerable-item' => array(
                                'type' => 'segment',
                                'options' => array(
                                    'route' => '/[:id]',
                                    'constraints' => array(
                                        'id' => '[a-zA-Z0-9_-]+',
                                    ),
                                    'defaults' => array(
                                        'controller' => 'Application\Controller\Repository',
                                        'action'     => 'AnswerableItem',
                                        'roles' => array(
                                            Roles::$ADMIN,
                                            Roles::$INSTRUCTOR,
                                            Roles::$STUDENT,
                                            Roles::$TA
                                        ),
                                        'title'=>"Answerable Item(Repo)"
                                    ),
                                ),
                            ),
                        ),
                    ),
//                    /*******************************************************/
//                    /* Assessment                                          */
//                    /*******************************************************/
//                    'assessments' => array(
//                        'type' => 'Zend\Mvc\Router\Http\Literal',
//                        'options' => array(
//                            'route'    => '/assessments',
//                            'defaults' => array(
//                                'controller' => 'Application\Controller\Repository',
//                                'action'     => 'Assessments',
//                                'roles' => array(
//                                    Roles::$ADMIN,
//                                    Roles::$INSTRUCTOR,
//                                    Roles::$STUDENT,
//                                    Roles::$TA
//                                ),
//                                'title'=>"Assessments(Repo)"
//                            ),
//                        ),
//                        'may_terminate' => true,
//                        'child_routes' => array(
//                            // Segment route for viewing one blog post
//                            'assessment' => array(
//                                'type' => 'segment',
//                                'options' => array(
//                                    'route' => '/[:id]',
//                                    'constraints' => array(
//                                        'id' => '[a-zA-Z0-9_-]+',
//                                    ),
//                                    'defaults' => array(
//                                        'controller' => 'Application\Controller\Repository',
//                                        'action'     => 'Assessment',
//                                        'roles' => array(
//                                            Roles::$ADMIN,
//                                            Roles::$INSTRUCTOR,
//                                            Roles::$STUDENT,
//                                            Roles::$TA
//                                        ),
//                                        'title'=>"Assessment(Repo)"
//                                    ),
//                                ),
//                            ),
//                        ),
//                    ),
                    /*******************************************************/
                    /* Course Content                                      */
                    /*******************************************************/
                    'course-contents' => array(
                        'type' => 'Zend\Mvc\Router\Http\Literal',
                        'options' => array(
                            'route'    => '/course-contents',
                            'defaults' => array(
                                'controller' => 'Application\Controller\Repository',
                                'action'     => 'CourseContents',
                                'roles' => array(
                                    Roles::$ADMIN,
                                    Roles::$INSTRUCTOR,
                                    Roles::$STUDENT,
                                    Roles::$TA
                                ),
                                'title'=>"Course Contents(Repo)"
                            ),
                        ),
                        'may_terminate' => true,
                        'child_routes' => array(
                            // Segment route for viewing one blog post
                            'templates' => array(
                                'type' => 'Zend\Mvc\Router\Http\Literal',
                                'options' => array(
                                    'route' => '/templates',

                                    'defaults' => array(
                                        'controller' => 'Application\Controller\Repository',
                                        'action'     => 'CourseContentTemplates',
                                        'roles' => array(
                                            Roles::$ADMIN,
                                            Roles::$INSTRUCTOR,
                                            Roles::$TA
                                        ),
                                        'title'=>"Course Content Templates(Repo)"
                                    ),
                                ),
                                'may_terminate' => true,
                                'child_routes' => array(
                                    // Segment route for viewing one blog post
                                    'template' => array(
                                        'type' => 'segment',
                                        'options' => array(
                                            'route' => '/[:id]',
                                            'constraints' => array(
                                                'id' => '[a-zA-Z0-9_-]+',
                                            ),
                                            'defaults' => array(
                                                'controller' => 'Application\Controller\Repository',
                                                'action'     => 'CourseContentTemplate',
                                                'roles' => array(
                                                    Roles::$ADMIN,
                                                    Roles::$INSTRUCTOR,
                                                    Roles::$STUDENT,
                                                    Roles::$TA
                                                ),
                                                'title'=>"Course Content Template(Repo)"
                                            ),
                                        ),
                                    ),
                                ),
                            ),
                            'course-content' => array(
                                'type' => 'segment',
                                'options' => array(
                                    'route' => '/[:id]',
                                    'constraints' => array(
                                        'id' => '[0-9_-]+',
                                    ),
                                    'defaults' => array(
                                        'controller' => 'Application\Controller\Repository',
                                        'action'     => 'CourseContent',
                                        'roles' => array(
                                            Roles::$ADMIN,
                                            Roles::$INSTRUCTOR,
                                            Roles::$STUDENT,
                                            Roles::$TA
                                        ),
                                        'title'=>"Course Content(Repo)"
                                    ),
                                ),
                            ),
                        ),
                    ),

//                    /*******************************************************/
//                    /* Running Assessment                                  */
//                    /*******************************************************/
//                    'runningAssessments' => array(
//                        'type' => 'Zend\Mvc\Router\Http\Literal',
//                        'options' => array(
//                            'route'    => '/running-assessments',
//                            'defaults' => array(
//                                'controller' => 'Application\Controller\Repository',
//                                'action'     => 'RunningAssessments',
//                                'roles' => array(
//                                    Roles::$ADMIN,
//                                    Roles::$INSTRUCTOR,
//                                    Roles::$STUDENT,
//                                    Roles::$TA
//                                ),
//                                'title'=>"Running Assessments(Repo)"
//                            ),
//                        ),
//                        'may_terminate' => true,
//                        'child_routes' => array(
//                            // Segment route for viewing one blog post
//                            'runningAssessment' => array(
//                                'type' => 'segment',
//                                'options' => array(
//                                    'route' => '/[:id]',
//                                    'constraints' => array(
//                                        'id' => '[a-zA-Z0-9_-]+',
//                                    ),
//                                    'defaults' => array(
//                                        'controller' => 'Application\Controller\Repository',
//                                        'action'     => 'RunningAssessment',
//                                        'roles' => array(
//                                            Roles::$ADMIN,
//                                            Roles::$INSTRUCTOR,
//                                            Roles::$STUDENT,
//                                            Roles::$TA
//                                        ),
//                                        'title'=>"Running Assessment(Repo)"
//                                    ),
//                                ),
//                            ),
//                        ),
//                    ),
                    /*******************************************************/
                    /* Sections                                            */
                    /*******************************************************/
                    'sections' => array(
                        'type' => 'Zend\Mvc\Router\Http\Literal',
                        'options' => array(
                            'route'    => '/sections',
                            'defaults' => array(
                                'controller' => 'Application\Controller\Repository',
                                'action'     => 'Sections',
                                'roles' => array(
                                    Roles::$GUEST
                                ),
                                'title'=>"Sections"
                            ),
                        ),
                        'may_terminate' => true,
                        'child_routes' => array(
                            // Segment route for viewing one blog post
                            'section' => array(
                                'type' => 'segment',
                                'options' => array(
                                    'route' => '/[:id]',
                                    'constraints' => array(
                                        'id' => '[a-zA-Z0-9_-]+',
                                    ),
                                    'defaults' => array(
                                        'controller' => 'Application\Controller\Repository',
                                        'action'     => 'Section',
                                        'roles' => array(
                                            Roles::$GUEST
                                        ),
                                        'title'=>"Sections(Repo)"
                                    ),
                                )
                            ),
                        ),
                    ),


                    /*******************************************************/
                    /* Questions                                           */
                    /*******************************************************/
                    'questions' => array(
                        'type' => 'Zend\Mvc\Router\Http\Literal',
                        'options' => array(
                            'route'    => '/questions',
                            'defaults' => array(
                                'controller' => 'Application\Controller\Repository',
                                'action'     => 'Questions',
                                'roles' => array(
                                    Roles::$ADMIN,
                                    Roles::$INSTRUCTOR,
                                    Roles::$STUDENT,
                                    Roles::$TA
                                ),
                                'title'=>"Questions"
                            ),
                        ),
                        'may_terminate' => true,
                        'child_routes' => array(

                            /*******************************************************/
                            /* Answered Questions                                  */
                            /*******************************************************/
                            'questionsAnswered' => array(
                                'type' => 'Zend\Mvc\Router\Http\Literal',
                                'options' => array(
                                    'route'    => '/answered',
                                    'defaults' => array(
                                        'controller' => 'Application\Controller\Repository',
                                        'action'     => 'AnsweredQuestions',
                                        'roles' => array(
                                            Roles::$ADMIN,
                                            Roles::$INSTRUCTOR,
                                            Roles::$STUDENT,
                                            Roles::$TA
                                        ),
                                        'title'=>"Answered Questions(Repo)"
                                    ),
                                ),
                                'may_terminate' => true,
                                'child_routes' => array(
                                    // Segment route for viewing one blog post
                                    'questionAnswered' => array(
                                        'type' => 'segment',
                                        'options' => array(
                                            'route' => '/[:answeredQuestion]',
                                            'constraints' => array(
                                                'answeredQuestion' => '[0-9]+',
                                            ),
                                            'defaults' => array(
                                                'controller' => 'Application\Controller\Repository',
                                                'action'     => 'AnsweredQuestion',
                                                'roles' => array(
                                                    Roles::$ADMIN,
                                                    Roles::$INSTRUCTOR,
                                                    Roles::$STUDENT,
                                                    Roles::$TA
                                                ),
                                                'title'=>"Answered Question(Repo)"
                                            ),
                                        ),
                                    ),
                                ),
                            ),
                            /*******************************************************/
                            /* Answerable Questions                                */
                            /*******************************************************/
                            'questionsAnswerable' => array(
                                'type' => 'Zend\Mvc\Router\Http\Literal',
                                'options' => array(
                                    'route'    => '/answerable',
                                    'defaults' => array(
                                        'controller' => 'Application\Controller\Repository',
                                        'action'     => 'AnswerableQuestions',
                                        'roles' => array(
                                            Roles::$ADMIN,
                                            Roles::$INSTRUCTOR,
                                            Roles::$STUDENT,
                                            Roles::$TA
                                        ),
                                        'title'=>"Answerable Questions(Repo)"
                                    ),
                                ),
                                'may_terminate' => true,
                                'child_routes' => array(
                                    // Segment route for viewing one blog post
                                    'questionAnswerable' => array(
                                        'type' => 'segment',
                                        'options' => array(
                                            'route' => '/[:id]',
                                            'constraints' => array(
                                                'id' => '[0-9]+',
                                            ),
                                            'defaults' => array(
                                                'controller' => 'Application\Controller\Repository',
                                                'action'     => 'AnswerableQuestion',
                                                'roles' => array(
                                                    Roles::$ADMIN,
                                                    Roles::$INSTRUCTOR,
                                                    Roles::$STUDENT,
                                                    Roles::$TA
                                                ),
                                                'title'=>"Answerable Question(Repo)"
                                            ),
                                        ),
                                    ),
                                ),
                            ),
                            /*******************************************************/
                            /* Answerable Questions                                */
                            /*******************************************************/
                            'question-pools' => array(
                                'type' => 'Zend\Mvc\Router\Http\Literal',
                                'options' => array(
                                    'route'    => '/pools',
                                    'defaults' => array(
                                        'controller' => 'Application\Controller\Repository',
                                        'action'     => 'QuestionPools',
                                        'roles' => array(
                                            Roles::$ADMIN,
                                            Roles::$INSTRUCTOR,
                                            Roles::$STUDENT,
                                            Roles::$TA
                                        ),
                                        'title'=>"Question Pools(Repo)"
                                    ),
                                ),
                                'may_terminate' => true,
                                'child_routes' => array(
                                    // Segment route for viewing one blog post
                                    'question-pool' => array(
                                        'type' => 'segment',
                                        'options' => array(
                                            'route' => '/[:id]',
                                            'constraints' => array(
                                                'id' => '[0-9]+',
                                            ),
                                            'defaults' => array(
                                                'controller' => 'Application\Controller\Repository',
                                                'action'     => 'QuestionPool',
                                                'roles' => array(
                                                    Roles::$ADMIN,
                                                    Roles::$INSTRUCTOR,
                                                    Roles::$STUDENT,
                                                    Roles::$TA
                                                ),
                                                'title'=>"Question Question(Repo)"
                                            ),
                                        ),
                                    ),
                                ),
                            ),
                            /*******************************************************/
                            /* Answering Questions                                  */
                            /*******************************************************/
                            'questionsAnswering' => array(
                                'type' => 'Zend\Mvc\Router\Http\Literal',
                                'options' => array(
                                    'route'    => '/answering',
                                    'defaults' => array(
                                        'controller' => 'Application\Controller\Repository',
                                        'action'     => 'AnsweringQuestions',
                                        'roles' => array(
                                            Roles::$ADMIN,
                                            Roles::$INSTRUCTOR,
                                            Roles::$STUDENT,
                                            Roles::$TA
                                        ),
                                        'title'=>"Answering Questions(Repo)"
                                    ),
                                ),
                                'may_terminate' => true,
                                'child_routes' => array(
                                    // Segment route for viewing one blog post
                                    'questionAnswering' => array(
                                        'type' => 'segment',
                                        'options' => array(
                                            'route' => '/[:id]',
                                            'constraints' => array(
                                                'id' => '[0-9]+',
                                            ),
                                            'defaults' => array(
                                                'controller' => 'Application\Controller\Repository',
                                                'action'     => 'AnsweringQuestion',
                                                'roles' => array(
                                                    Roles::$ADMIN,
                                                    Roles::$INSTRUCTOR,
                                                    Roles::$STUDENT,
                                                    Roles::$TA
                                                ),
                                                'title'=>"Answering Question(Repo)"
                                            ),
                                        ),
                                    ),
                                ),
                            ),
                            // Segment route for viewing one blog post
                            'question' => array(
                                'type' => 'segment',
                                'options' => array(
                                    'route' => '/[:id]',
                                    'constraints' => array(
                                        'id' => '[0-9]+',
                                    ),
                                    'defaults' => array(
                                        'controller' => 'Application\Controller\Repository',
                                        'action'     => 'Question',
                                        'roles' => array(
                                            Roles::$GUEST
                                        ),
                                        'title'=>"Question(Repo)"
                                    ),
                                ),
                            ),

                            'questionTypes' => array(
                                'type' => 'Zend\Mvc\Router\Http\Literal',
                                'options' => array(
                                    'route'    => '/types',
                                    'defaults' => array(
                                        'controller' => 'Application\Controller\Repository',
                                        'action'     => 'QuestionTypes',
                                        'roles' => array(
                                            Roles::$ADMIN,
                                            Roles::$INSTRUCTOR,
                                            Roles::$TA,
                                            Roles::$STUDENT,
                                        ),
                                        'title'=>"Question Types(Repo)"
                                    ),
                                ),
                                'may_terminate' => true,
                                'child_routes' => array(
                                    // Segment route for viewing one blog post
                                    'questionType' => array(
                                        'type' => 'segment',
                                        'options' => array(
                                            'route' => '/[:id]',
                                            'constraints' => array(
                                                'id' => '[a-zA-Z0-9_-]+',
                                            ),
                                            'defaults' => array(
                                                'controller' => 'Application\Controller\Repository',
                                                'action'     => 'QuestionType',
                                                'roles' => array(
                                                    Roles::$GUEST
                                                ),
                                                'title'=>"Question Type(Repo)"
                                            ),
                                        ),
                                    ),
                                ),
                            ),
                        ),
                    ),

                )


            ),

            /***************************************************************/
//            'home' => array(
//                'type' => 'Zend\Mvc\Router\Http\Literal',
//                'options' => array(
//                    'route'    => '/',
//                    'defaults' => array(
//                        'controller' => 'Application\Controller\Index',
//                        'action'     => 'index',
//                        'roles' => array(
//                            Roles::$GUEST
//                        ),
//                        'title'=>"Home"
//                    ),
//                ),
//            ),

//            'login' => array(
//                'type' => 'Zend\Mvc\Router\Http\Literal',
//                'options' => array(
//                    'route'    => '/login',
//                    'defaults' => array(
//                        'controller' => 'Application\Controller\Index',
//                        'action'     => 'login',
//                        'roles' => array(
//                            Roles::$GUEST
//                        ),
//                        'title'=>"Login"
//                    ),
//                ),
//            ),
            'invitation_request' => array(
                'type' => 'segment',
                'options' => array(
                    'route'    => '/invitations/[:invitationID]',
                    'constraints' => array(
                        'invitationID' => '[a-zA-Z0-9_-]+',
                    ),
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'invite',
                        'roles' => array(
                            Roles::$GUEST
                        ),
                        'title'=>"Invitation"
                    ),
                ),
            ),

        ),
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
            'Application\Controller\Index' => 'Application\Controller\IndexController',
            'Application\Controller\Repository' => 'Application\Controller\RepositoryController'
        ),
    ),
    'view_manager' => array(
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',
        'template_path_stack' => array(
            __DIR__ . '/../view',
        ),
        'strategies' => array(
            'ViewJsonStrategy',
        )
    ),
    // Placeholder for console routes
    'console' => array(
        'router' => array(
            'routes' => array(
            ),
        ),
    ),
);
