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
    'fabricWindow'
], function (angular, _, _s, JSZip, async) {
    'use strict';

    _.mixin(_s.exports());

    var app = angular.module('bannerAppApp.controllers.ConversationCtrl', [
        'classy',
        'classy-extends',
        'classy-initScope',
        'common.fabric',
        'common.fabric.utilities',
        'common.fabric.constants'
    ])

    app.classy.controller({
        name: 'ConversationCtrl',
        inject: [
            '$rootScope',
            '$scope',
            '$log',
            '$timeout',
            '$q',

            'Fabric',
            'FabricConstants',
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
            imgPreview: []
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

            this.$.errorFiles = [];

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
        onFileSelect: function($files) {
            this.$log.log('onFileSelect', $files);
            this._handleMultipleFiles($files);
        },
        onFileChange: function($files, index) {
            var self = this, 
                 log = this.$log;

            var file = $files[0];

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

                        var ratio = width/height, direction;
                        if( ratio == 1 ) {
                            direction = 'default';
                        } else if( ratio > 1 ) {
                            direction = 'landscape';
                        } else {
                            direction = 'portrait';
                        }

                        self._fileSizes += blob.size;

                        var dimension = self.$.dimensions[direction];
                        self.$.imgPreview[index] = {
                            error: null,
                            index: index,
                            src  : img,
                            data : {
                                blob: blob,
                                name: filename, 
                                dimension: dimension,
                                direction: direction
                            }
                        };
                        self.$.$apply();

                        log.log('imgPreview', self.$.imgPreview[index]);
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
            this.$.imgPreview.splice(index, 1);
        },

        /** @private **/

        _fileSizes: 0, 
        _handleMultipleFiles: function(files){
            var self = this;

            var tasks = []
            for (var i = 0; i < files.length; i++) {
                tasks.push(
                    self._queue(files[i]).then(function(res){ 
                        console.log("resolve", res);
                        var index = res.index;
                        self.$.imgPreview[index] = { loading:false, src:res.src, data:res.data };
                        return res; 
                    }, function reject(error) {
                        console.log("reject", error);
                        var index = error.index;
                        self.$.imgPreview[index] = { loading:false, error: error.message, src:error.src };
                        return error;
                    })
                );
            }

            this.$q.all(tasks).then(function(res) {
                console.log("imgPreview", self.$.imgPreview);
                console.log("Finished add to list", res, self._fileSizes);
            });
        },
        // add queue request
        _queue: function(file){
            var defer = this.$q.defer();

            var self = this;
            var log = this.$log;

            var index = self.$.imgPreview.length;

            self.$.imgPreview.push({ loading: true });

            // validation image
            var valid = this._validation(file, false);
            if(!valid.status) {
                log.warn(valid.message);

                defer.reject({ 
                    index: index,
                    message: valid.message 
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
                                    index: index,
                                    message: 'File '+ name +' is too small!!',
                                    src: img
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

                                log.info('added', filename);

                                self._fileSizes += blob.size;

                                var dimension = self.$.dimensions[direction];
                                defer.resolve({
                                    index: index,
                                    error: null,
                                    src  : img,
                                    data : {
                                        blob  : blob,
                                        name  : filename, 
                                        dimension: dimension,
                                        direction: direction
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
        // file validation
        _validation: function(file, showAlert){
            var response = { status: true };

            var currentImages = this.$.imgPreview;
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
                    type: 'image',
                    image: 'images/conversation/tpl-1.png',
                    sendBack: true,
                    options: {
                        name: 'background',
                        left: 0,
                        top : 0,
                        hasControls: false,
                        lockObject: true,
                        lockRotation: true,
                        lockUniScaling: true,
                        lockScalingY: true,
                        lockScalingX: true,
                        lockMovementX: true,
                        lockMovementY: true
                    }
                },
                {
                    type: 'polaroid',
                    image: 'images/default/165x45.png',
                    options: {
                        name: 'logo',
                        top : 80,
                        left: 40
                    }
                },
                {
                    type: 'polaroid',
                    image: 'images/default/70x70.png',
                    options: {
                        name: 'element-1',
                        top : 265,
                        left: 40
                    }
                },
                {
                    type: 'polaroid',
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
            this.$.fabric.setImageObject('background', imgURL);
        }
    });
});