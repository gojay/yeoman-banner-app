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

                        var uploadURL = API.URL + '/upload';

                        var $tempImg = null, 
                            cropSelection = {};

                        function dataURItoBlob(dataURI) {
                            // convert base64/URLEncoded data component to raw binary data held in a string
                            var byteString;
                            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                                byteString = atob(dataURI.split(',')[1]);
                            else
                                byteString = unescape(dataURI.split(',')[1]);

                            // separate out the mime component
                            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

                            // write the bytes of the string to a typed array
                            var ia = new Uint8Array(byteString.length);
                            for (var i = 0; i < byteString.length; i++) {
                                ia[i] = byteString.charCodeAt(i);
                            }

                            return new Blob([ia], {type:mimeString});
                        }

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

                        $scope.cropHandle = function(act) {
                            if(act == 'cancel') {
                                $tempImg.remove();
                                $('.imgareaselect-outer').remove();
                                $('#crop-wrapper').remove();
                                $.unblockUI();
                            } else if (act == 'crop') {
                                $log.log('dataUrls', $scope.dataUrls);
                                var crop_canvas;

                                crop_canvas = document.createElement('canvas');
                                crop_canvas.width  = cropSelection.width;
                                crop_canvas.height = cropSelection.height;
                                 
                                crop_canvas.getContext('2d').drawImage($tempImg[0], cropSelection.x1, cropSelection.y1, cropSelection.width, cropSelection.height, 0, 0, cropSelection.width, cropSelection.height);
                                var dataURI = crop_canvas.toDataURL("image/jpeg");
                                var blob = dataURItoBlob(dataURI);

                                $log.debug('blob', blob);
                                window.open(dataURI);
                            }
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

                            $log.debug('$window', $window)

                            var file = $files[0];

                            var fr = new FileReader();
                            fr.readAsDataURL(file);
                            fr.onload = (function(file) {
                                return function(e) {
                                    var image = new Image();
                                    image.src = e.target.result;
                                    image.onload = function() {
                                        $scope.dataUrls[0] = image.src;
                                        $scope.progress[0] = -1;
                                        var x1 = parseInt((image.width - 810) / 2),
                                            y1 = parseInt((image.height - 381) / 2);
                                        var pos = {
                                            x1: x1,
                                            y1: y1,
                                            x2 : parseInt(x1 + 810),
                                            y2 : parseInt(y1 + 381)
                                        };
                                        $tempImg = angular.element(image);
                                        var leftPosition = ($window.innerWidth - image.width) / 2;
                                        $.blockUI({
                                            message   : $tempImg,
                                            overlayCSS:{
                                                cursor : 'default'
                                            },
                                            css: {
                                                cursor : 'default',
                                                border : 'none',
                                                top    : '60px',
                                                left   : leftPosition + 'px',
                                                width  : image.width + 'px'
                                            },
                                            onBlock: function(){
                                                $tempImg.imgAreaSelect({
                                                    x1 : pos.x1,
                                                    y1 : pos.y1,
                                                    x2 : pos.x2,
                                                    y2 : pos.y2,
                                                    resizable : false,
                                                    handles   : true,
                                                    onInit    : function(img, selection){
                                                        console.log('imgAreaSelect init', selection);
                                                        cropSelection = selection;
                                                        // set cropSelection
                                                        var $handle = $('.imgareaselect-handle').parent();
                                                        $handle.parent().append($compile('<div id="crop-wrapper" style="width:'+image.width+'px; left:'+leftPosition+'px"><div class="btn-group">'+
                                                            '<button type="button" class="btn btn-success" ng-click="cropHandle(\'crop\')"><i class="fa fa-crop"></i> Crop</button>'+
                                                            '<button type="button" class="btn btn-info" ng-click="cropHandle(\'ratio\')"><i class="fa fa-expand"></i> Aspect Ratio</button>'+
                                                            '<button type="button" class="btn btn-default" ng-click="cropHandle(\'fit\')"><i class="fa fa-arrows-alt"></i> Auto Fit</button>'+
                                                            '<button type="button" class="btn btn-danger" ng-click="cropHandle(\'cancel\')">Cancel</button>'+
                                                        '</div></div>')($scope));
                                                    },
                                                    onSelectEnd : function(img, selection){
                                                        console.log('imgAreaSelect end', selection);
                                                        cropSelection = selection;
                                                    }
                                                });
                                            }
                                        });
                                    };
                                }
                            })(file);

                            // for (var i = 0; i < $files.length; i++) {
                            //     var $file = $files[i];
                            //     if (window.FileReader && $file.type.indexOf('image') > -1) {
                            //         var fileReader = new FileReader();
                            //         fileReader.readAsDataURL($files[i]);
                            //         var loadFile = function(fileReader, index) {
                            //             fileReader.onload = function(e) {
                            //                 $log.debug('[uploadImage]onload', e);
                            //                 $timeout(function() {
                            //                     $scope.dataUrls[index] = e.target.result;
                            //                 });
                            //             }
                            //         }(fileReader, i);
                            //     }
                            //     $scope.progress[i] = -1;
                            //     if ($scope.uploadRightAway) {
                            //         $scope.start(i);
                            //     }
                            // }
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
                                    $log.debug('$scope.image', $scope.image)
                                    if( angular.isArray($scope.image) )
                                        $scope.image.push(response.data.url);
                                    else {
                                        $scope.image = response.data.url + '?r=' + Math.random().toString(36).substring(7);
                                    }
                                    $log.debug('[uploadImage]image', $scope.image);
                                    $.unblockUI();
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
                    var multiple = ( angular.isDefined(attrs.multiple) && attrs.multiple === "true" );
                    input.prop('multiple', multiple);

                    button.unbind('click').bind('click', function(){ input.trigger('click') });
                }
            };
        });
});
