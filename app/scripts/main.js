/*jshint unused: vars */
require.config({
    paths: {
        'angular': '../bower_components/angular/angular.min',
        'angular-route': '../bower_components/angular-route/angular-route.min',
        'angular-cookies': '../bower_components/angular-cookies/angular-cookies.min',
        'angular-sanitize': '../bower_components/angular-sanitize/angular-sanitize.min',
        'angular-resource': '../bower_components/angular-resource/angular-resource.min',
        'angular-http-auth': '../bower_components/angular-http-auth/src/http-auth-interceptor',
        'angular-mocks': '../bower_components/angular-mocks/angular-mocks.min',

        'angular-animate': '../bower_components/angular-animate/angular-animate.min',
        'angular-bootstrap': '../bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
        'angular-ui-utils': '../bower_components/angular-ui-utils/ui-utils.min',
        'angular-spinkit': '../bower_components/angular-spinkit/build/angular-spinkit.min',
        'angular-file-upload': '../bower_components/ng-file-upload/angular-file-upload',
        'angular-file-upload-shim': '../bower_components/ng-file-upload-shim/angular-file-upload-shim',
        // 'angular-snap': '../bower_components/angular-snap/angular-snap',

        'angular-slide-push': 'lib/slide-push/slide.and.push',

        'webfontloader': 'lib/font-select/libs/webfontloader',
        'angular-font-select': 'lib/font-select/angular-fontselect',

        'jquery': '../bower_components/jquery/dist/jquery.min',
        'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min',
        // 'snap': 'lib/snap.min',
        'qrcode': 'lib/jquery.qrcode.min',

        'raphael': 'lib/raphael/raphael',
        'raphael-group': 'lib/raphael/raphael.group',
        'raphael-filter': 'lib/raphael/fraphael',
        'raphael-transform': 'lib/raphael/raphael.transform',
        'raphael-json': 'lib/raphael/raphael.json',
        // 'raphael-svg-import': '../bower_components/raphael-svg-import-classic/raphael-svg-import.min',

        'fabric': 'lib/fabric/fabric',
        'fabricUtils': 'lib/fabric/utils',

        'fabricAngular': 'lib/fabric/fabricAngular',
        'fabricCanvas': 'lib/fabric/fabricCanvas',
        'fabricConstants': 'lib/fabric/fabricConstants',
        'fabricDirective': 'lib/fabric/fabricDirective',
        'fabricDirtyStatus': 'lib/fabric/fabricDirtyStatus',
        'fabricUtilities': 'lib/fabric/fabricUtilities',
        'fabricWindow': 'lib/fabric/fabricWindow'
    },
    shim: {
        'angular': {
            deps: ['angular-file-upload-shim'],
            'exports': 'angular'
        },
        'angular-route': ['angular'],
        'angular-cookies': ['angular'],
        'angular-sanitize': ['angular'],
        'angular-resource': ['angular'],
        'angular-http-auth': ['angular'],
        'angular-mocks': {
            deps: ['angular'],
            'exports': 'angular.mock'
        },
        'angular-animate': ['angular'],
        'angular-bootstrap': ['angular'],
        'angular-ui-utils': ['angular'],
        'angular-spinkit': ['angular'],
        'angular-file-upload': ['angular'],
        // 'angular-file-upload-shim': ['angular'],
        // 'angular-snap': ['angular', 'snap'],

        'angular-font-select': ['angular', 'webfontloader'],
        'angular-slide-push': ['angular'],

        // 'snap': {
        //     'exports': 'snap'
        // },
        'webfontloader': {
            'exports': 'webfontloader'
        },

        'bootstrap': ['jquery'],
        'qrcode': ['jquery'],

        'raphael': ['jquery'],
        'raphael-group': ['raphael'],
        'raphael-filter': ['raphael'],
        'raphael-transform': ['raphael'],
        'raphael-json': ['raphael'],
        // 'raphael-svg-import': ['raphael'],

        'fabric': ['jquery'],
        'fabricUtils': ['fabric'],

        'fabricAngular': ['fabric'],
        'fabricCanvas': ['fabric'],
        'fabricConstants': ['fabric'],
        'fabricDirective': ['fabric'],
        'fabricDirtyStatus': ['fabric'],
        'fabricUtilities': ['fabric'],
        'fabricWindow': ['fabric']
    },
    priority: [
        'angular'
    ]
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = 'NG_DEFER_BOOTSTRAP!';

require([
    'jquery',
    'angular-file-upload-shim',
    'angular',
    'app',
    'angular-route',
    'angular-cookies',
    'angular-sanitize',
    'angular-resource',
    'angular-http-auth',
    'angular-bootstrap',
    'angular-ui-utils',
    'angular-animate',
    'angular-spinkit',
    // 'snap',
    // 'angular-snap',
    // 'angular-font-select',
    'angular-slide-push',
    'bootstrap'
], function(jquery, angularFileUploadShim, angular, app) {
    'use strict';
    /* jshint ignore:start */
    var $html = angular.element(document.getElementsByTagName('html')[0]);
    /* jshint ignore:end */
    angular.element().ready(function() {
        angular.resumeBootstrap([app.name]);
    });
});
