/*jshint unused: vars */
require.config({
    paths: {
        'angular': '../bower_components/angular/angular.min',
        'angular-route': '../bower_components/angular-route/angular-route.min',
        'angular-cookies': '../bower_components/angular-cookies/angular-cookies.min',
        'angular-sanitize': '../bower_components/angular-sanitize/angular-sanitize.min',
        'angular-resource': '../bower_components/angular-resource/angular-resource.min',
        'angular-classy': '../bower_components/angular-classy/angular-classy.min',
        'classy-extends': '../bower_components/classy-extends/classy-extends',
        'classy-init-scope': '../bower_components/classy-initScope/classy-initScope',
        
        // 'angular-http-auth': '../bower_components/angular-http-auth/src/http-auth-interceptor',
        'angular-http-auth': 'lib/http-auth-interceptor',
        
        // 'angular-mocks': '../bower_components/angular-mocks/angular-mocks.min',

        'angular-animate': '../bower_components/angular-animate/angular-animate.min',
        'angular-bootstrap': '../bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
        'angular-ui-utils': '../bower_components/angular-ui-utils/ui-utils.min',
        'angular-spinkit': '../bower_components/angular-spinkit/build/angular-spinkit.min',
        'angular-file-upload': '../bower_components/ng-file-upload/angular-file-upload',
        'angular-file-upload-shim': '../bower_components/ng-file-upload-shim/angular-file-upload-shim',
        'angular-gravatar': '../bower_components/angularjs-gravatar/dist/angularjs-gravatardirective.min',
        // 'angular-snap': '../bower_components/angular-snap/angular-snap',
        
        // 'angular-loading-bar': '../bower_components/angular-loading-bar/build/loading-bar.min',
        'angular-loading-bar': 'lib/loading-bar',
        'angular-elastic': '../bower_components/angular-elastic/elastic',
        'angular-toggle-switch': '../bower_components/angular-toggle-switch/angular-toggle-switch.min',

        'angular-slide-push': 'lib/slide-push/slide.and.push',

        'webfontloader': 'lib/font-select/libs/webfontloader',
        'angular-font-select': 'lib/font-select/angular-fontselect',

        'jquery': '../bower_components/jquery/dist/jquery.min',
        'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min',

        'jquery-qrcode': 'lib/jquery.qrcode.min',
        'jquery-imgareaselect': '../bower_components/imgareaselect/jquery.imgareaselect.dev',
        'jquery-blockui': '../bower_components/blockui/jquery.blockUI',

        'raphael': 'lib/raphael/raphael',
        'raphael-group': 'lib/raphael/raphael.group',
        'raphael-filter': 'lib/raphael/fraphael',
        'raphael-transform': 'lib/raphael/raphael.transform',
        'raphael-json': 'lib/raphael/raphael.json',
        // 'raphael-svg-import': '../bower_components/raphael-svg-import-classic/raphael-svg-import.min',

        'fabric': 'lib/fabric/fabric',
        'fabricUtils': 'lib/fabric/utils',
        'fabric-1_4_12': 'lib/fabric/fabric.1.4.12',
        'fabricAngular': 'lib/fabric/fabricAngular',
        'fabricCanvas': 'lib/fabric/fabricCanvas',
        'fabricConstants': 'lib/fabric/fabricConstants',
        'fabricDirective': 'lib/fabric/fabricDirective',
        'fabricDirtyStatus': 'lib/fabric/fabricDirtyStatus',
        'fabricUtilities': 'lib/fabric/fabricUtilities',
        'fabricWindow': 'lib/fabric/fabricWindow',

        'pusher': 'http://js.pusher.com/2.2/pusher.min',
        'moment': '../bower_components/moment/moment',
        'jsrsasign':'lib/jsrsasign-4.1.4-all-min',
        'json':'lib/json-sans-eval-min',
        'jwt':'lib/jws-3.0',

        'lodash': '../bower_components/lodash/dist/lodash.min',
        'underscore.string': '../bower_components/underscore.string/dist/underscore.string.min',

        'jszip': '../bower_components/jszip/dist/jszip.min'
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

        'angular-classy': ['angular'],
        'classy-extends': ['angular', 'angular-classy'],
        'classy-init-scope': ['angular', 'angular-classy'],
        
        'angular-animate': ['angular'],
        'angular-bootstrap': ['angular'],
        'angular-ui-utils': ['angular'],
        'angular-spinkit': ['angular'],
        'angular-file-upload': ['angular'],
        'angular-gravatar': ['angular'],
        'angular-loading-bar': ['angular'],

        'angular-font-select': ['angular', 'webfontloader'],
        'angular-slide-push': ['angular'],
        'angular-elastic': ['angular'],
        'angular-toggle-switch': ['angular'],

        'webfontloader': {
            'exports': 'webfontloader'
        },

        'bootstrap': ['jquery'],
        'jquery-qrcode': ['jquery'],
        'jquery-imgareaselect': ['jquery'],
        'jquery-blockui': ['jquery'],

        'raphael': ['jquery'],
        'raphael-group': ['raphael'],
        'raphael-filter': ['raphael'],
        'raphael-transform': ['raphael'],
        'raphael-json': ['raphael'],
        // 'raphael-svg-import': ['raphael'],

        'fabric': ['jquery'],
        'fabricUtils': ['fabric'],
        
        'fabricAngular': ['fabric-1_4_12'],
        'fabricCanvas': ['fabric-1_4_12'],
        'fabricConstants': ['fabric-1_4_12'],
        'fabricDirective': ['fabric-1_4_12'],
        'fabricDirtyStatus': ['fabric-1_4_12'],
        'fabricUtilities': ['fabric-1_4_12'],
        'fabricWindow': ['fabric-1_4_12'],

        'jwt': ['jsrsasign', 'json'],

        'underscore.string': ['lodash']
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
    'angular-classy',
    'classy-extends',
    'classy-init-scope',
    'angular-http-auth',
    'angular-bootstrap',
    'angular-ui-utils',
    'angular-animate',
    'angular-spinkit',
    'angular-gravatar',
    'angular-loading-bar',
    // 'snap',
    // 'angular-snap',
    // 'angular-font-select',
    'angular-slide-push',
    'angular-toggle-switch',
    'bootstrap',
    // 'jquery-cookie'
], function(jquery, angularFileUploadShim, angular, app) {
    'use strict';
    /* jshint ignore:start */
    var $html = angular.element(document.getElementsByTagName('html')[0]);
    /* jshint ignore:end */
    angular.element().ready(function() {
        angular.resumeBootstrap([app.name]);
    });
});
