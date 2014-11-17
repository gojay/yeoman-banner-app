define([
    'angular', 
    'angular-file-upload',
    'jquery-blockui',
    'jquery-imgareaselect'
], function(angular) {
    'use strict';

    angular.module('bannerAppApp.directives.Uploadimage', [])
        .directive('uploadImage', function() {
            return {
                scope: {
                    image: '=ngModel',
                    uploadOptions: '=uploadImageOptions'
                },
                template: '<div>' +
                    '<button class="btn btn-sm">'+
                        '<span ng-show="loadingProgress > 0"><i class="fa fa-circle-o-notch fa-spin"></i> Uploading..</span>'+
                        '<span ng-show="loadingProgress == 0">{{ text }}</span>'+
                    '</button>' +
                    '<input type="file" ng-file-select="onFileSelect($files)" onclick="this.value=null" style="display:none" />' +
                '</div>',
                restrict: 'E',
                replace: true,
                controller: ['$scope', '$http', '$log', '$timeout', '$window', '$compile', '$upload', 'API',
                    function($scope, $http, $log, $timeout, $window, $compile, $upload, API) {
                        var self = this;
                        var uploadURL = API.URL + '/upload';

                        this.cropController = {
                            parentEl : '.blockUI.blockPage',
                            imgEl    : null,
                            mime     : null,
                            selection: {},
                            init     : function(file) {
                                var _this = this;

                                var fileReader = new FileReader();
                                fileReader.readAsDataURL(file);
                                fileReader.onload = (function(file) {
                                    return function(e) {
                                        var image = new Image();
                                        image.src = e.target.result;
                                        image.onload = function() {
                                            $scope.dataUrls[0] = image.src;
                                            $scope.progress[0] = -1;
                                            _this.open(image);
                                        };
                                    }
                                })(file);
                            },
                            open: function(image) {
                                var _this = this;
                                
                                _this.imgEl = angular.element(image);

                                var top  = ($window.innerHeight - image.height) / 2, 
                                    left = ($window.innerWidth - image.width) / 2;
                                $.blockUI({
                                    message   : _this.imgEl,
                                    overlayCSS:{
                                        cursor : 'default'
                                    },
                                    css: {
                                        cursor : 'default',
                                        border : 'none',
                                        top    : 60  + 'px',
                                        left   : left + 'px',
                                        width  : image.width + 'px'
                                    },
                                    onBlock: function(){
                                        // disable body scroll
                                        // angular.element('body')
                                        //     .css('overflow', 'hidden')
                                        //     .on('mousewheel', function(e) {
                                        //         e.preventDefault();
                                        //         e.stopPropagation();
                                        //     });

                                        var cropSelection = _this._position(image);
                                        _this.imgEl.imgAreaSelect({
                                            x1 : cropSelection.x1,
                                            y1 : cropSelection.y1,
                                            x2 : cropSelection.x2,
                                            y2 : cropSelection.y2,
                                            parent    : _this.parentEl,
                                            resizable : false,
                                            handles   : true,
                                            onInit    : function(img, selection){ 
                                                _this.selection = selection;
                                                // init config handle template
                                                var template = _this._handleTemplate({
                                                    width: image.width,
                                                    left : left
                                                });
                                                // append into body, then compile it
                                                angular.element('body').append($compile(template)($scope));
                                            },
                                            onSelectEnd : function(img, selection){
                                                _this.selection = selection;
                                            }
                                        });
                                    },
                                    onUnblock: function() {
                                        // enable body scroll
                                        // angular.element('body')
                                        //     .css('overflow', 'inherit')
                                        //     .unbind('mousewheel');
                                    }
                                });
                            },
                            close: function() {
                                this.imgEl.remove();
                                angular.element('[class^=imgareaselect]').remove();
                                $.unblockUI();
                            },
                            toBlob: function (dataURI) {
                                // convert base64/URLEncoded data component to raw binary data held in a string
                                var byteString;
                                if (dataURI.split(',')[0].indexOf('base64') >= 0) {
                                    byteString = atob(dataURI.split(',')[1]);
                                } else {
                                    byteString = unescape(dataURI.split(',')[1]);
                                }

                                // separate out the mime component
                                var mimeString = this.mime = dataURI.split(',')[0].split(':')[1].split(';')[0];

                                // write the bytes of the string to a typed array
                                var ia = new Uint8Array(byteString.length);
                                for (var i = 0; i < byteString.length; i++) {
                                    ia[i] = byteString.charCodeAt(i);
                                }

                                return new Blob([ia], {type:mimeString});
                            },
                            getBlob: function(toURI) {
                                var canvas = document.createElement('canvas');
                                canvas.width  = this.selection.width;
                                canvas.height = this.selection.height;
                                canvas.getContext('2d').drawImage(
                                    this.imgEl[0],
                                    this.selection.x1, 
                                    this.selection.y1, 
                                    this.selection.width, 
                                    this.selection.height,
                                    0, 0, 
                                    this.selection.width, 
                                    this.selection.height
                                );

                                var dataURI = canvas.toDataURL();
                                return toURI ? dataURI : this.toBlob(dataURI);
                            },
                            handle: function ( act ) {
                                var _this = this;
                                switch(act) {
                                    case 'crop':
                                        var blob = this.getBlob();
                                        $log.debug('blob', blob);

                                        // $scope.image = blob;

                                        // upload
                                        $scope.selectedFiles[0] = blob;
                                        $scope.start(0);

                                        $scope.$on('uploadimage:completed', function(data, percent){
                                            _this.close();
                                        });
                                        break;

                                    case 'ratio':
                                    case 'fit':
                                        var ratio = (act == 'ratio') ? 1 : 0 ;
                                        angular.extend($scope.uploadOptions.data, { ratio: ratio }); 

                                        $log.log('[data]', $scope.uploadOptions.data);
                                        $scope.start(0);
                                        $scope.$on('uploadimage:completed', function(data, percent){
                                            _this.close();
                                        });
                                        break;

                                    default:
                                        this.close();
                                        break;
                                }
                            },
                            _position: function(image) {
                                if(!image) return {};

                                var blockEl = angular.element(this.parentEl);
                                var options = $scope.uploadOptions.data;

                                var x1 = parseInt((blockEl.width() - options.width) / 2),
                                    y1 = parseInt((blockEl.height() - options.height) / 2) - 60;

                                return {
                                    x1: x1,
                                    y1: y1,
                                    x2 : parseInt(x1 + options.width),
                                    y2 : parseInt(y1 + options.height)
                                };
                            },
                            _styles: function(style) {
                                var styles = [
                                    'width: 100%',
                                    'position: fixed',
                                    'top: 0',
                                    'z-index: 2000',
                                    'padding: 10px 0',
                                    'background-color: rgba(0, 0, 0, 0.2)',
                                    'text-align: center',
                                ];

                                return styles.join(';');
                            },
                            _handleTemplate: function(styles) {
                                var styles = this._styles();
                                return '<div class="imgareaselect-crop-wrapper" style="'+ styles +'"><div class="btn-group">'+
                                    '<button type="button" class="btn btn-success" ng-click="cropHandle(\'crop\')" ng-disabled="loadingProgress > 0" tooltip-placement="bottom" tooltip="Ok, crop it! :)"><i class="fa fa-crop"></i> Crop</button>'+
                                    '<button type="button" class="btn btn-info" ng-click="cropHandle(\'ratio\')" ng-disabled="loadingProgress > 0" tooltip-placement="bottom" tooltip="resize this image with ratio"><i class="fa fa-expand"></i> Aspect Ratio</button>'+
                                    '<button type="button" class="btn btn-default" ng-click="cropHandle(\'fit\')" ng-disabled="loadingProgress > 0" tooltip-placement="bottom" tooltip="resize this image with auto fit"><i class="fa fa-arrows-alt"></i> Auto Fit</button>'+
                                    '<button type="button" class="btn btn-danger" ng-click="cropHandle(\'cancel\')" ng-disabled="loadingProgress > 0">Cancel</button>'+
                                '</div></div>';
                            }
                        };

                        $scope.cropHandle = function(act) {
                            return self.cropController.handle(act);
                        };

                        if( angular.isUndefined($scope.uploadOptions) ) $scope.uploadOptions = { headers:{}, data:{} };

                        $scope.howToSend = 1;
                        $scope.fileReaderSupported = window.FileReader != null;
                        $scope.uploadRightAway = true;
                        $scope.loadingProgress = 0;

                        $scope.hasUploader = function(index) {
                            return $scope.upload[index] != null;
                        };
                        $scope.abort = function(index) {
                            $scope.upload[index].abort();
                            $scope.upload[index] = null;
                        };

                        $scope.onFileSelect = function($files) {
                            $scope.selectedFiles = [];
                            $scope.progress = [];
                            if ($scope.upload && $scope.upload.length > 0) {
                                for (var i = 0; i < $scope.upload.length; i++) {
                                    if ($scope.upload[i] != null) {
                                        $scope.upload[i].abort();
                                    }
                                }
                            }
                            $scope.upload = [];
                            $scope.uploadResult = [];
                            $scope.selectedFiles = $files;
                            $scope.dataUrls = [];

                            // if crop is enabled, only single file
                            if( $scope.enableCrop ) {
                                var file = $files[0];
                                self.cropController.init(file);
                            } else {
                                for (var i = 0; i < $files.length; i++) {
                                    var $file = $files[i];
                                    if (window.FileReader && $file.type.indexOf('image') > -1) {
                                        var fileReader = new FileReader();
                                        fileReader.readAsDataURL($files[i]);
                                        var loadFile = function(fileReader, index) {
                                            fileReader.onload = function(e) {
                                                $timeout(function() {
                                                    $scope.dataUrls[index] = e.target.result;
                                                });
                                            }
                                        }(fileReader, i);
                                    }
                                    $scope.progress[i] = -1;
                                    if ($scope.uploadRightAway) {
                                        $scope.start(i);
                                    }
                                }
                            }
                        };

                        $scope.start = function(index) {
                            $scope.progress[index] = 0;
                            $scope.errorMsg = null;
                            if ($scope.howToSend == 1) {
                                $scope.upload[index] = $upload.upload({
                                    url: uploadURL,
                                    method: 'POST',
                                    // headers: $scope.uploadOptions.headers,
                                    data: $scope.uploadOptions.data,
                                    file: $scope.selectedFiles[index],
                                    fileFormDataName: 'image'
                                }).then(function(response) {
                                    $log.debug('response', response);

                                    $scope.upload[index] = null;
                                    $scope.loadingProgress = 0;
                                    $scope.uploadResult.push(response.data);
                                    $scope.text = 'Change Image'; 

                                    if( angular.isArray($scope.image) )
                                        $scope.image.push(response.data.url);
                                    else {
                                        $scope.image = response.data.url + '?r=' + Math.random().toString(36).substring(7);
                                    }
                                    
                                    $log.debug('[uploadImage]image', $scope.image);
                                }, function(response) {
                                    if (response.status > 0) {
                                        $scope.errorMsg = response.status + ': ' + JSON.stringify(response.data);
                                    if( $scope.onError ) $scope.onError(response);
                                    }
                                }, function(evt) {
                                    // Math.min is to fix IE which reports 200% sometimes
                                    $log.info('[uploadImage] ' + Math.min(100, parseInt(100.0 * evt.loaded / evt.total)))
                                    $scope.progress[index] = $scope.loadingProgress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                                });

                                // $scope.upload[index].xhr(function(xhr){
                                // xhr.upload.addEventListener('abort', function() {$log.debug('abort complete')}, false);
                                // });
                            } else {
                                var fileReader = new FileReader();
                                fileReader.onload = function(e) {
                                    $scope.upload[index] = $upload.http({
                                        url: uploadURL,
                                        headers: {
                                            'Content-Type': $scope.selectedFiles[index].type
                                        },
                                        data: e.target.result
                                    }).then(function(response) {
                                        $scope.uploadResult.push(response.data);
                                    }, function(response) {
                                        if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                                    }, function(evt) {
                                        // Math.min is to fix IE which reports 200% sometimes
                                        $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                                    });
                                }
                                fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
                            }
                        };
                    }
                ],
                link: function(scope, element, attrs, ctrl) {

                    var el = angular.element(element);
                    var button = el.find('button');
                    var input  = el.find('input');

                    if (angular.isUndefined(scope.text)) scope.text = 'Browse';
                    if (attrs.uploadImageClass) button.addClass(attrs.uploadImageClass);

                    scope.enableCrop = angular.isDefined(attrs.uploadImageEnableCrop) ? attrs.uploadImageEnableCrop : false;

                    var multiple = ( !scope.enableCrop && angular.isDefined(attrs.multiple) && attrs.multiple === "true" );
                    input.prop('multiple', multiple);

                    button.unbind('click').bind('click', function(){ input.trigger('click') });
                }
            };
        });
});
