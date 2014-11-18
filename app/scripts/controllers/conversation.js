define([
    'angular',
    'lodash',
    'underscore.string',
    'jszip',
    'async',

    'angular-file-upload',

    'fabricAngular',
    'fabricCanvas',
    'fabricConstants',
    'fabricDirective',
    'fabricDirtyStatus',
    'fabricUtilities',
    'fabricWindow',

    'jquery-blockui'
], function (angular, _, _s, JSZip, async) {
    'use strict';

    _.mixin(_s.exports());

    var app = angular.module('bannerAppApp.controllers.ConversationCtrl', [
        'classy',
        'classy-extends',
        'classy-initScope',
        'common.fabric',
        'common.fabric.utilities',
        'common.fabric.constants',
        'common.fabric.window'
    ])

    app.classy.controller({
        name: 'ConversationCtrl',
        inject: [
            '$rootScope',
            '$scope',
            '$log',
            '$timeout',
            '$q',
            '$compile',

            'Fabric',
            'FabricConstants',
            'FabricWindow',
            'Keypress'
        ],
        initScope: {
            fabric: {},
            fullEditor: false,
            uploadOptions: {
                background: {
                    data: {
                        id    : 'conversation',
                        name  : 'background',
                        width : 403,
                        height: 403
                    }
                },
                logo: {
                    data: {
                        id    : 'conversation',
                        name  : 'logo',
                        width : 165,
                        height: 45
                    }
                }
            },
            templates: [
                {
                    title: 'Template 1',
                    open: true,
                    template: {
                        default  : 'tpl-1.png',
                        landscape: 'tpl-1-landscape.png',
                        potrait  : 'tpl-1-potrait.png'
                    }
                },
                {
                    title: 'Template 2',
                    open : false,
                    template: {
                        default  : 'tpl-2.png',
                        landscape: 'tpl-2-landscape.png',
                        potrait  : 'tpl-2-potrait.png'
                    }
                },
                {
                    title: 'Template 3',
                    open: false,
                    template: {
                        default  : 'tpl-3.png',
                        landscape: 'tpl-3-landscape.png',
                        potrait  : 'tpl-3-potrait.png'
                    }
                },
                {
                    title: 'Template 4',
                    open: false,
                    template: {
                        default  : 'tpl-4.png',
                        landscape: 'tpl-4-landscape.png',
                        potrait  : 'tpl-4-potrait.png'
                    }
                },
                {
                    title: 'Template 5',
                    open: false,
                    template: {
                        default  : 'tpl-5.png',
                        landscape: 'tpl-5-landscape.png',
                        potrait  : 'tpl-5-potrait.png'
                    }
                },
                {
                    title: 'Template 6',
                    open: false,
                    template: {
                        default  : 'tpl-6.png',
                        landscape: 'tpl-6-landscape.png',
                        potrait  : 'tpl-6-potrait.png'
                    }
                }
            ],
            dimensions: {
                'default': {
                    w: 403,
                    h: 403
                },
                'portrait': {
                    w: 403,
                    h: 550
                },
                'landscape': {
                    w: 550,
                    h: 403
                }
            },
            backgrounds: {
                progress: -1,
                size: 0,
                errors: 0,
                data: []
            },
            showPreview: false
        },
        init: function() {
            var self = this;

            this.$.conversation = {
                images: {
                    logo: null
                },
                config: {
                    logo: {
                        enable: true,
                        placeholder: true
                    },
                    elements: {
                        1: {
                            enable: true,
                            placeholder: true,
                            default: true
                        },
                        2: {
                            enable: true,
                            placeholder: true,
                            default: true
                        }
                    }
                }
            };

            this.$.$on('canvas:created', this._onCanvasCreated);
        },
        watch: {
            '{object}templates': '_onChangeTemplate'
        },
        _watchAsync: function($scope) {
            var self = this,
                log  = this.$log;

            log.log("$evalAsync", $scope);

            $scope.$watch('fabric.controls.angle', function(angle) {
                if(!angle) return;
                $scope.fabric.angleControl();
            });
            $scope.$watch('fabric.controls.scale', function(scale) {
                if(!scale) return;
                $scope.fabric.scaleControl();
            });
            $scope.$watch('fabric.controls.left', function(left) {
                if(!left) return;
                $scope.fabric.leftControl();
            });
            $scope.$watch('fabric.controls.top', function(top) {
                if(!top) return;
                $scope.fabric.topControl();
            });

            $scope.$watch('fabric.selectedObject.hasShadow', function(hasShadow) {
                if (!hasShadow) return;

                var shadow = null;
                if (hasShadow) {
                    shadow = {
                        color: 'rgba(0,0,0,0.3)',
                        blur: 10,
                        offsetX: 10,
                        offsetY: 10
                    };
                }
                $scope.fabric.selectedObject.set({ shadow:shadow });
                $scope.fabric.render();
            });
            $scope.$watch('fabric.selectedObject.hasPlaceholder', function(hasPlaceholder) {
                if (!$scope.fabric.selectedObject || _.isUndefined(hasPlaceholder)) return;
                $scope.fabric.selectedObject.setPlaceholder(hasPlaceholder);
                $scope.fabric.render();
            });
            $scope.$watch('fabric.selectedObject.H_PADDING', function(newVal, oldVal) {
                if (!oldVal) return;
                $scope.fabric.render();
            });
        },

        getObjectTitle: function(type) {
            if(!this.$.fabric.selectedObject) return null;
            return _.titleize(this.$.fabric.selectedObject[type]);
        },

        /**
         * Atur file background (multiple)
         * @param  {FILE} $files file input
         * @return {Void}        _handleMultipleFiles
         */
        onFileSelect: function($files) {
            var self = this,
                log = self.$log;

            angular.element('body').animate({
                scrollTop: angular.element("#preview").offset().top
            }, 1000, function() {
                log.info('Start chaining...');
                self._handleMultipleFiles($files).then(function (response) {
                    log.info('End chain...');
                    log.log('completed', response, self.$.backgrounds);
                });
            });
        },

        onFileChange: function($files, index) {
            var self = this, 
                log = this.$log,
                dimensions = this.$.dimensions,
                backgrounds = this.$.backgrounds;

            var file = $files[0];

            // validation
            var valid = this._validation(file, true);
            if(valid === false) return;

            // file reader
            var fileReader = new FileReader();
            fileReader.onload = (function(blob){
                return function(e){
                    var name = blob.name;
                    var filename = name.substr(0, name.lastIndexOf('.')) || name;

                    var image = new Image();
                    image.src = e.target.result;
                    image.onload = function(){
                        var img = this.src;

                        // parse integer
                        var width  = parseInt(this.width);
                        var height = parseInt(this.height);

                        // gambar terlalu kecil ? max width n height = 403
                        if(width <= 403 && height <= 403) {
                            alert('File '+ name +' is too small!!');
                            return;
                        }

                        var type = self._getImageType(width, height);

                        backgrounds.size += blob.size;

                        backgrounds.data[index] = {
                            notify: 'waiting',
                            src  : img,
                            data : {
                                blob: blob,
                                name: filename, 
                                dimension: dimensions[type],
                                type: type
                            }
                        };

                        backgrounds.errors -= 1;

                        self.$.$apply();
                    };
                };
            })(file);
            // read as data uri
            fileReader.readAsDataURL(file);
        },
        doChangeImg: function($event) {
            angular.element($event.currentTarget).next().trigger('click');
        },
        doDeleteImg: function(index) {
            var backgrounds = this.$.backgrounds;
            backgrounds.errors -= 1;
            backgrounds.data.splice(index, 1);
        },

        doGenerate: function() {
            var self = this;
            var log = this.$log;
            var requests = this.$.backgrounds.data;

            angular.forEach(requests, function(value, key){
                self.$timeout(function() {
                    var el = angular.element('#background-preview-'+ key);
                    var message = '<i class="fa fa-spinner fa-spin"></i> <span class="notify">waiting..<span>';
                    el.block({ 
                        message: message, 
                        css: { 
                            backgroundColor: 'transparent',
                            width: '200px',
                            border: 'none' 
                        },
                        overlayCSS:  { 
                            backgroundColor: '#fff', 
                            opacity: 0.8
                        },   
                    });
                });
            });

            angular.element('body').animate({
                scrollTop: angular.element("#preview").offset().top - 60
            }, 1000, function() {
                log.info('Start generating...');
                self.$.backgrounds.progress = 0;
                self._doGenerate(requests).then(function(response){
                    log.info('End generate...');
                    log.log('response', response);
                });
            });
        },

        _doGenerate: function(requests) {
            var self = this, 
                log = this.$log;

            var until = requests.length - 1,
                size = 0;

            var defer = this.$q.defer();

            var promises = requests.reduce(function(promise, request, index) {
                log.log('request', index, request);
                return promise.then(function() {
                    var el = angular.element('#background-preview-'+ index);
                    return self._doSomething(index)
                        .then(function resolve(response) {
                            log.log('resolve', index, response);
                        }, function reject(response) {
                            log.log('reject', index, response);
                        }, function notify(response) {
                            log.log('notify', index, response);
                            // el.find('.blockMsg > .notify').text(response);
                            var message = '<i class="fa fa-spinner fa-spin"></i> <span class="notify">'+ response +'<span>';
                            el.block({ 
                                message: message, 
                                css: { 
                                    backgroundColor: 'transparent',
                                    width: '200px',
                                    border: 'none' 
                                },
                                overlayCSS:  { 
                                    backgroundColor: '#fff', 
                                    opacity: 0.8
                                },   
                            });
                        })
                        .then(function() {
                            el.unblock();
                            size += request.data.blob.size;
                            var total = self.$.backgrounds.size;
                            var progress = size/total * 100;
                            self.$.backgrounds.progress = progress
                            log.log('progress', progress);

                            if(index != 0 && index % 3 == 0) {
                                angular.element('body').animate({
                                    scrollTop: el.offset().top - 60
                                }, 1000);
                            }

                            if(index == until) return 'completed';
                        });
                });
            }, defer.promise);

            defer.resolve();

            return promises;
        },
        _doSomething: function(index) {
            var self = this,
                log = self.$log,
                timeout = self.$timeout;

            var backgroundId = '#background-preview-' + index,
                backgroundImage = self.$.backgrounds.data[index].src;

            var originalCanvas = self.$.fabric.canvas,
                width = originalCanvas.originalWidth, 
                height = originalCanvas.originalHeight,
                canvasScale = self.$.fabric.canvasScale;

            var defer = this.$q.defer();

            timeout(function() { defer.notify('Preparing...'); });

            var json = JSON.stringify(originalCanvas.toJSON([]));
            
            var canvasEl = document.createElement('canvas');
            var canvas = new self.FabricWindow.Canvas(canvasEl);
            canvas.loadFromJSON(json, function() {
                canvas.originalWidth = width;
                canvas.originalHeight = height;
                canvas.setWidth(width * canvasScale);
                canvas.setHeight(height * canvasScale);

                var objects = canvas.getObjects();
                for (var i in objects) {
                    objects[i].lockObject = true;
                    objects[i].hasControls = false;
                    objects[i].setCoords();
                }

                canvas.setBackgroundImage(backgroundImage, canvas.renderAll.bind(canvas), {
                    scaleX: canvasScale,
                    scaleY: canvasScale
                });
            });

            canvasEl.style.position = 'relative';
            angular.element(backgroundId).find('.image').html(canvasEl);

            timeout(function() {
                defer.notify('Generating...');
                timeout(function() {
                    defer.resolve('completed ' + index)
                }, Math.floor(Math.random() * 1000));
            }, Math.floor(Math.random() * 1000));


            return defer.promise;
        },

        /** @private **/
 
        _handleMultipleFiles: function(files){
            var self = this,
                log = this.$log;

            var backgrounds = self.$.backgrounds;

            var until = files.length - 1;

            var defer = self.$q.defer();

            var promises = files.reduce(function (promise, file, index) {
                return promise.then(function() {
                    return self._queue(file)
                        .then(function resolve(response) {
                            log.log('resolve', index, response);
                            response.loading = false;
                            backgrounds.data[index] = response;
                        }, function reject(response) {
                            log.warn('reject', index, response);
                            response.loading = false;
                            backgrounds.errors += 1;
                            backgrounds.data[index] = response;
                        }, function notify(message) {
                            log.info('notify', index, message);
                            backgrounds.data.push({ loading:true, notify:message });
                        })
                        .then(function() {
                            log.info('finally', index);

                            if(index != 0 && index % 3 == 0) {
                                angular.element('body').animate({
                                    scrollTop: angular.element('#background-preview-'+ index).offset().top - 60
                                }, 1000);
                            }

                            if(index == until) return 'completed';
                        });
                });
            }, defer.promise);

            defer.resolve();

            return promises;
        },
        // add queue request
        _queue: function(file){
            var defer = this.$q.defer();

            var self = this;
            var log = this.$log;

            var dimensions = this.$.dimensions,
                backgrounds = this.$.backgrounds;

            var index = backgrounds.data.length;

            this.$timeout(function() { defer.notify('checking file...'); });

            // validation image
            var valid = this._validation(file, false);
            if(!valid.status) {
                log.warn(valid.message);

                defer.reject({ 
                    src: 'images/default/file.png',
                    error: valid.message 
                });

            } else {

                // file reader
                var fileReader = new FileReader();
                fileReader.onload = (function(blob){
                    return function(e){
                        var name = blob.name;
                        var filename = name.substr(0, name.lastIndexOf('.')) || name;

                        var image = new Image();
                        image.src = e.target.result;
                        image.onload = function(){
                            var img = this.src;

                            // parse integer
                            var width  = parseInt(this.width);
                            var height = parseInt(this.height);

                            // gambar terlalu kecil ? max width n height = 403
                            if(width <= 403 && height <= 403) {

                                log.warn('File '+ name +' is too small!!');

                                defer.reject({
                                    error: 'File '+ name +' is too small!!',
                                    src  : img
                                });

                            } else {

                                var ratio = width/height, direction;
                                if( ratio == 1 ) {
                                    direction = 'default';
                                } else if( ratio > 1 ) {
                                    direction = 'landscape';
                                } else {
                                    direction = 'portrait';
                                }

                                log.info('File added', filename);

                                var type = self._getImageType(width, height);

                                backgrounds.size += blob.size;

                                defer.resolve({
                                    notify: 'waiting',
                                    src  : img,
                                    data : {
                                        blob  : blob,
                                        name  : filename, 
                                        dimension: dimensions[type],
                                        type: type
                                    }
                                });

                            }
                        };
                    };
                })(file);
                // read as data uri
                fileReader.readAsDataURL(file);

            }

            // return promise
            return defer.promise;
        },
        /**
         * Jenis gambar : default, potrait, landscape
         * @param  {Integer} width  Lebar gambar
         * @param  {Integer} height Tinggi gambar
         * @return {Sting}        Jenis gambar
         */
        _getImageType: function(width, height) {
            var ratio = width/height, type;
            if( ratio == 1 ) {
                type = 'default';
            } else if( ratio > 1 ) {
                type = 'landscape';
            } else {
                type = 'portrait';
            }
            return type;
        },
        // file validation
        _validation: function(file, showAlert){
            var response = { status: true };

            var currentImages = this.$.backgrounds;
            // validation file image selected
            if (!(file.type && file.type.match('image.*'))) {
                var message = 'File '+ file.name +' is not an image. Only JPG, PNG or GIF files are allowed';
                if( showAlert ) {
                    alert(message);
                    return false;
                }
                response = {
                    status: false,
                    message: message
                };
            }
            // max 10 mB
            else if (!(file.size && file.size < 10485760)) {
                var message = 'File '+ file.name +' is too big!!';
                if( showAlert ) {
                    alert(message);
                    return false;
                }
                response = {
                    status: false,
                    message: message
                };
            }
            // current image
            else if (currentImages.length > 0) {
                var found = _.find(currentImages, function(image) {
                    if(!image.data) return null;
                    return image.data.blob.name == file.name;
                });

                if( found ) {

                    var message = 'File '+ file.name +' is already added!';
                    if( showAlert ) {
                        alert(message);
                        return false;
                    }
                    response = {
                        status: false,
                        message: message
                    };

                }
            }

            return response;
        },

        _onCanvasCreated: function(event, args) {
            var self = this;

            this.$log.log('initialize canvas:created', args);

            var canvasFabric   = args.canvasId;

            var fabric = self.$.fabric = new self.Fabric(canvasFabric, {
                canvasBackgroundColor: 'rgba(0,0,0,0.7)',
                JSONExportProperties: self.FabricConstants.JSONExportProperties,
                textDefaults        : self.FabricConstants.textDefaults,
                shapeDefaults       : self.FabricConstants.shapeDefaults,
                CustomAttributes    : self.FabricConstants.CustomAttributes,
                canvasOriginalWidth : 403,
                canvasOriginalHeight: 403
            });

            var objects = [
                {
                    type: 'overlay',
                    image: 'images/conversation/tpl-1.png'
                },
                {
                    type: 'image',
                    image: 'images/default/165x45.png',
                    options: {
                        name: 'logo',
                        top : 80,
                        left: 40
                    }
                },
                {
                    type: 'image',
                    image: 'images/default/70x70.png',
                    options: {
                        name: 'element-1',
                        top : 265,
                        left: 40
                    }
                },
                {
                    type: 'image',
                    image: 'images/default/70x70.png',
                    options: {
                        name: 'element-2',
                        top : 265,
                        left: 283
                    }
                }
            ];

            fabric.buildObjects(objects);

            self.$log.debug('objects', fabric.getObjects());

            self.$.$evalAsync(self._watchAsync);
        },
        _onChangeTemplate: function(newVal, oldVal) {
            var selected = _.find(newVal, { open:true });
            this.$log.log('_onChangeTemplate', selected);

            var imgURL = 'images/conversation/' + selected.template.default;
            this.$.fabric.setOverlayImage(imgURL);
        }
    });
});