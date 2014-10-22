define(['angular', 'angular-file-upload'], function(angular) {
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
                        '<span ng-show="loadingProgress > 0"><i class="fa fa-circle-o-notch fa-spin"></i> Uploading {{loadingProgress}}%</span>'+
                        '<span ng-show="loadingProgress == 0">{{ text }}</span>'+
                    '</button>' +
                    '<input type="file" ng-file-select="onFileSelect($files)" onclick="this.value=null" style="display:none" />' +
                '</div>',
                restrict: 'E',
                replace: true,
                controller: ['$scope', '$http', '$log', '$timeout', '$upload', 'API',
                    function($scope, $http, $log, $timeout, $upload, API) {

                        var uploadURL = API.URL + '/upload';

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
                            for (var i = 0; i < $files.length; i++) {
                                var $file = $files[i];
                                if (window.FileReader && $file.type.indexOf('image') > -1) {
                                    var fileReader = new FileReader();
                                    fileReader.readAsDataURL($files[i]);
                                    var loadFile = function(fileReader, index) {
                                        fileReader.onload = function(e) {
                                            $log.debug('onload', e)
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
                                    // $scope.text = 'Change Image'; 
                                    $log.debug('$scope.image', $scope.image)
                                    if( angular.isArray($scope.image) )
                                        $scope.image.push(response.data.url);
                                    else
                                        $scope.image = response.data.dataURI;
                                    $log.debug('$scope.image', $scope.image)
                                }, function(response) {
                                    if (response.status > 0) {
                                        $scope.errorMsg = response.status + ': ' + JSON.stringify(response.data);
                                    if( $scope.onError ) $scope.onError(response);
                                    }
                                }, function(evt) {
                                    // Math.min is to fix IE which reports 200% sometimes
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
