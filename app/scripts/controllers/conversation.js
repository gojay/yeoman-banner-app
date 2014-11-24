define([
    'angular',
    'lodash',
    'underscore.string',
    'jszip',

    'angular-file-upload',

    'fabricAngular',
    'fabricCanvas',
    'fabricConstants',
    'fabricDirective',
    'fabricDirtyStatus',
    'fabricUtilities',
    'fabricWindow',

    'jquery-blockui',
    'jquery-imgareaselect'
], function (angular, _, _s, JSZip) {
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
    ]);

    app.directive('imgShowCrop', function() {
        return {
            scope: {
                background: '=imgShowCrop'
            },
            restrict: 'A',
            link: function($scope, $element, $attrs) {
                var self = this;
                var parentId = '#' + $attrs.imgShowCropParent;
                var isShouldbeCrop = $scope.background.error || $scope.background.act != 'crop';

                var $crop;

                var getCenterCropSelection = function() {
                    var image = $scope.background.image,
                        resize = $scope.background.resize;

                    var x1 = parseInt((image.width - resize.width) / 2),
                        y1 = parseInt((image.height - resize.height) / 2);

                    var selection = {
                        x1 : x1,
                        y1 : y1,
                        x2 : parseInt(x1 + resize.width),
                        y2 : parseInt(y1 + resize.height)
                    };
                    $scope.background.crop.selection = selection;
                    return selection;
                };

                var getCropSelection = function() {
                    var image = $scope.background.image;
                    // get ratio
                    var ratioWidth = $element.width() / image.width;
                    var ratioHeight = $element.height() / image.height;
                    // get original center selection
                    var originalSelection = $scope.background.crop.selection || getCenterCropSelection();
                    // send scale selection
                    return {
                        x1: originalSelection.x1 * ratioWidth,
                        y1: originalSelection.y1 * ratioHeight,
                        x2: originalSelection.x2 * ratioWidth,
                        y2: originalSelection.y2 * ratioHeight
                    }
                };

                var showCropSelection = function() {
                    if( isShouldbeCrop ) {
                        return;
                    }
                    console.log('showCropSelection:selection', $scope.background.crop.selection);
                    // get crop selection
                    var selection = getCropSelection();
                    // remove imgareaselect
                    $element.imgAreaSelect({remove:true});
                    // instance imgareaselect
                    $crop = $element.imgAreaSelect({
                        x1: selection.x1, 
                        y1: selection.y1, 
                        x2: selection.x2, 
                        y2: selection.y2,
                        parent    : parentId,
                        resizable : false,
                        movable   : false,
                        disable   : true,
                        instance  : true
                    });
                };
                
                // img onload
                $element.bind('load', showCropSelection);

                $scope.$watch('background.crop.selection', function(newVal, oldVal) {
                    if(newVal == oldVal) return;
                    showCropSelection();
                });
                $scope.$watch('background.act', function(newVal, oldVal) {
                    if(newVal == oldVal || !$crop) return;

                    if(newVal == 'crop') {
                        $crop.setOptions({ show: true });
                    } else {
                        $crop.setOptions({ hide: true });
                    }
                    $crop.update();
                });
                $scope.$watch('background.generate', function(newVal, oldVal) {
                    console.log('background.generate', newVal, oldVal);
                    if(!$crop) return;

                    if(newVal) {
                        console.log('remove:imgAreaSelect', $element);
                        // remove imgareaselect
                        $element.imgAreaSelect({ hide:true });
                    } else {
                        $element.imgAreaSelect({ show:true });
                        $element.parent().find('canvas').remove();
                    }
                });
            }
        }
    });

    app.classy.controller({
        name: 'ConversationCtrl',
        inject: [
            '$rootScope',
            '$scope',
            '$log',
            '$timeout',
            '$q',
            '$compile',
            '$sce',

            'Fabric',
            'FabricConstants',
            'FabricWindow',
            'Keypress'
        ],
        initScope: {
            fabric: {},
            fulleditor: false,
            uploadoptions: {
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
            dimensions: {
                'default': {
                    width: 403,
                    height: 403
                },
                'portrait': {
                    width: 403,
                    height: 550
                },
                'landscape': {
                    width: 550,
                    height: 403
                }
            }
        },
        init: function() {
            var self = this;

            this.$.backgrounds = {
                completed: false,
                reading : false,
                editing : true,
                progress: -1,
                size    : 0,
                errors  : [],
                data    : []
            };
            this.$.templates = [
                {
                    title: 'Template 1',
                    open: true,
                    template: {
                        default  : 'tpl-1.png',
                        landscape: 'tpl-1-landscape.png',
                        portrait  : 'tpl-1-portrait.png'
                    }
                },
                {
                    title: 'Template 2',
                    open : false,
                    template: {
                        default  : 'tpl-2.png',
                        landscape: 'tpl-2-landscape.png',
                        portrait  : 'tpl-2-portrait.png'
                    }
                },
                {
                    title: 'Template 3',
                    open: false,
                    template: {
                        default  : 'tpl-3.png',
                        landscape: 'tpl-3-landscape.png',
                        portrait  : 'tpl-3-portrait.png'
                    }
                },
                {
                    title: 'Template 4',
                    open: false,
                    template: {
                        default  : 'tpl-4.png',
                        landscape: 'tpl-4-landscape.png',
                        portrait  : 'tpl-4-portrait.png'
                    }
                },
                {
                    title: 'Template 5',
                    open: false,
                    template: {
                        default  : 'tpl-5.png',
                        landscape: 'tpl-5-landscape.png',
                        portrait  : 'tpl-5-portrait.png'
                    }
                },
                {
                    title: 'Template 6',
                    open: false,
                    template: {
                        default  : 'tpl-6.png',
                        landscape: 'tpl-6-landscape.png',
                        portrait  : 'tpl-6-portrait.png'
                    }
                }
            ];
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

            this.$.$on('uploadimage:close:selection', this._onCropSelection);
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

        setHandle: function(index, act) {
            this.$log.log(index, act);
            var backgound = this.$.backgrounds.data[index];
            if( act == 'resize' ) {
                backgound.act = 'resize';
            } else {
                backgound.act = 'crop';
                backgound.crop.type = act;
                if( act == 'custom' ) {
                    // open crop window...
                    this.$rootScope.$broadcast('uploadimage:open:selection', { 
                        index: index, 
                        image: backgound.image, 
                        selection: backgound.crop.selection 
                    });
                } else {
                    // set default selection (center)
                    backgound.crop.selection = null;
                }
            }
        },

        openFileSelect: function(evt) {
            angular.element(evt.currentTarget).next().trigger('click');
        },
        /**
         * Atur input file background (multiple)
         * @param  {Object} $files Input files
         * @return {void}          _chainReadFiles
         */
        onFileSelect: function($files) {
            var self = this,
                log = self.$log;

            angular.element('body').animate({
                scrollTop: angular.element("#preview").offset().top
            }, 1000, function() {
                log.info('Start reading files...');
                self.$.backgrounds.reading = true;
                self._chainReadFiles($files).then(function (response) {
                    log.info('End chain...');
                    log.log('completed', response, self.$.backgrounds);
                    self.$.backgrounds.reading = false;
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
                        // parse integer
                        var width  = parseInt(this.width);
                        var height = parseInt(this.height);

                        // gambar terlalu kecil ? max width n height = 403
                        if(width <= 403 && height <= 403) {
                            alert('File '+ name +' is too small!!');
                            return;
                        }

                        backgrounds.size += blob.size;
                        // remove index errors
                        _.remove(backgrounds.errors, function(num) { return num == index; });

                        var attrs = self._getImageAttributes(width, height);
                        backgrounds.data[index] = angular.extend({
                            generate: false,
                            image: image,
                            blob: blob,
                            name: filename
                        }, attrs);

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
            // remove backgrounds errors
            _.remove(backgrounds.errors, function(num) { return num == index; });
            // remove backgrounds data by index
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
                        }  
                    });
                });
            });

            self.$.fabric.setZoom(0.6);

            angular.element('body').animate({
                scrollTop: angular.element("#preview").offset().top - 60
            }, 1000, function() {
                log.info('Start generating...');
                // set progress to 0
                self.$.backgrounds.progress = 0;
                self.$.backgrounds.completed = false;
                self._chainGenerateBackground(requests).then(function(zip){
                    log.log('completed', self.$.backgrounds);
                    log.log('zip', zip);

                    self.$.fabric.resetZoom();

                    // generate download link
                    var DOMURL = window.URL || window.mozURL;
                    var downloadlink = DOMURL.createObjectURL(zip.generate({type:"blob"}));

                    // get anchor
                    var link = angular.element('#download')[0];
                    link.download = Date.now() + '.zip';
                    link.href = downloadlink;

                    self.$.backgrounds.completed = true;
                });
            });
        },
        doEmptyFiles: function() {
            this.$.backgrounds = {
                progress: -1,
                size: 0,
                errors: [],
                data: []
            };
        },

        toggleSettings: function() {
            var backgrounds = this.$.backgrounds;

            backgrounds.editing = !backgrounds.editing;

            if(backgrounds.progress != 100) return;

            _.forEach(backgrounds.data, function(background) {
                background.generate = false;
            });
            backgrounds.progress = -1;
        },

        renderHtml: function (htmlCode) {
            return this.$sce.trustAsHtml(htmlCode);
        },

        /** @private **/
 
        _chainReadFiles: function(files){
            var self = this,
                log = this.$log;

            var backgrounds = self.$.backgrounds,
                size = backgrounds.data.length;
            var until = size + files.length - 1;

            log.info('until', until);

            var defer = self.$q.defer();

            var promises = files.reduce(function (promise, file, index) {
                var index = size + index;
                return promise.then(function() {
                    return self._readFile(file)
                        .then(function resolve(response) {
                            log.log('resolve', index, response);
                            response.loading = false;
                            backgrounds.data[index] = response;
                        }, function reject(response) {
                            log.warn('reject', index, response);
                            response.loading = false;
                            backgrounds.errors.push(index);
                            backgrounds.data[index] = response;
                        }, function notify(message) {
                            log.info('notify', index, message);
                            backgrounds.data.push({ loading:true, notify:message });
                        })
                        .then(function() {
                            log.info('finally', index);

                            if(index % 3 == 0) {
                                angular.element('body').animate({
                                    scrollTop: angular.element('#background-preview-'+ index).offset().top - 60
                                }, 400);
                            }

                            if(index == until) return 'completed';
                        });
                });
            }, defer.promise);

            defer.resolve();

            return promises;
        },
        _readFile: function(file){
            var self = this, 
                log = this.$log;

            var backgrounds = this.$.backgrounds, 
                index = backgrounds.data.length;

            var defer = this.$q.defer();

            this.$timeout(function() { defer.notify('Reading file...'); });

            // validation image
            var valid = this._validation(file, false);
            if(!valid.status) {
                log.warn(valid.message);

                defer.reject({ 
                    image: { src: 'images/default/file.png' },
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
                            // parse integer
                            var width  = parseInt(this.width);
                            var height = parseInt(this.height);

                            // gambar terlalu kecil ? max width n height = 403
                            if(width < 403 || height < 403) {

                                log.warn('File '+ name +' is too small!!');

                                defer.reject({
                                    error: 'File '+ name +' is too small!!',
                                    image: { src: this.src }
                                });

                            } else {

                                log.info('File added', filename);

                                backgrounds.size += blob.size;

                                var attrs = self._getImageAttributes(width, height);
                                var response = angular.extend({
                                    generate: false,
                                    image: image,
                                    blob: blob,
                                    name: filename
                                }, attrs);

                                defer.resolve(response);

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
         * file validation
         * @param  {Object} file       File input
         * @param  {Boolean} showAlert Tampikan "alert"
         * @return {Void|Object}       Respons validasi
         */
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
        /**
         * Attribut gambar : direction, handle, size
         * @param  {Integer} width  Lebar gambar
         * @param  {Integer} height Tinggi gambar
         * @return {Object}
         */
        _getImageAttributes: function(width, height) {
            var template, act, crop;

            if(width == 403 && height == 403) {
                template = 'default';
                act = crop = null;
            } else if((width >= 403 && height < 550) || (width < 550 && height >= 403)) {
                template = 'default';
                act = 'crop';
                crop = { type: 'center', selection: null };
            } else {
                act = 'crop';
                crop = { type: 'center', selection: null };
                template = ((width/height) > 1) ? 'landscape' : 'portrait' ;
            }

            var resize = this.$.dimensions[template];
            var attrs = {
                act: act,
                crop: crop,
                resize: resize,
                template: template
            };
            return attrs;
        },

        _chainGenerateBackground: function(requests) {
            var self = this, 
                log = this.$log;

            var until = requests.length - 1,
                size = 0;

            var zip = new JSZip();

            var defer = this.$q.defer();

            var promises = requests.reduce(function(promise, request, index) {
                log.log('request', index, request);
                return promise.then(function() {
                    var el = angular.element('#background-preview-'+ index);
                    return self._generateBackground(el, request)
                        .then(function resolve(img) {
                            log.log('resolve', index, img);
                            var name = (index+1) +'.png';
                            var data = img.replace('data:image/png;base64,', '');
                            zip.file(name , data, { base64:true });
                        }, function reject(response) {
                            log.log('reject', index, response);
                        }, function notify(response) {
                            log.log('notify', index, response);
                            el.find('.blockMsg > .notify').text(response);
                        })
                        .then(function() {
                            // unblock element
                            el.unblock();

                            // calculate progress size
                            size += request.blob.size;
                            var total = self.$.backgrounds.size;
                            var progress = size/total * 100;
                            self.$.backgrounds.progress = progress

                            // scroll to element
                            if(index % 4 == 0) {
                                angular.element('body').animate({
                                    scrollTop: el.offset().top - 60
                                }, 400);
                            }

                            // completed
                            if(index == until) { 
                                return zip;
                            }
                        });
                });
            }, defer.promise);

            defer.resolve();

            return promises;
        },
        _generateBackground: function(element, background) {
            var self = this,
                log = self.$log,
                timeout = self.$timeout;

            // define original canvas
            var originalCanvas = self.$.fabric.canvas,
                canvasScale = self.$.fabric.canvasScale;

            var defer = this.$q.defer();

            ///////////////////////////////////
            // 1. Prepare background image //
            ///////////////////////////////////
            timeout(function() { defer.notify('Preparing background...'); });
            // set generate true
            background.generate = true;

            var backgroundImage;
            if( background.act === 'crop' ) {
                timeout(function() { defer.notify('Cropping background...'); });
                // do crop background image
                backgroundImage = this._getCropImage(background);
            } else if( background.act === 'resize' ) {
                timeout(function() { defer.notify('Resizing background...'); });
                // do upload 'resize' background image...
            } else {
                // background default is fit!
                backgroundImage = background.image.src;
            }

            //////////////////////////////
            // 2. Create canvas preview //
            //////////////////////////////
            timeout(function() { defer.notify('Creating canvas...'); });

            // get objects original canvas
            var canvasProperties = originalCanvas.toJSON([
                'background',
                'overlayImage',
                'objects',
                'originalHeight',
                'originalWidth',
                'height',
                'width'
            ]);
            // get json objects
            var json = JSON.stringify(canvasProperties);
            log.log('canvasProperties', canvasProperties);
            // objects length + background + overlay
            var renderingUntil = canvasProperties.objects.length + 2;

            // get selected template 
            var templates = _.find(self.$.templates, { open:true });
            var overlayImage = 'images/conversation/' +templates.template[background.template];
            var images = {
                background: backgroundImage,
                overlay:overlayImage
            };

            // set rendering
            var rendering = 0;
            var canvasPreview = self._createCanvas(canvasProperties, background, images, canvasScale, null);
            canvasPreview.on('after:render', function() {
                rendering++;
                log.log('preview:after:render', rendering);

                if(rendering == renderingUntil) {
                    log.log('render completed', canvasPreview);

                    var canvasEl = canvasPreview.getElement();
                    // set relative position
                    canvasEl.style.position = 'relative';
                    // add fabric canvas element
                    element.find('.image').parent().find('canvas').remove();
                    element.find('.image').append(canvasEl);

                    /////////////////////////////////
                    // 3. Create original canvas //
                    /////////////////////////////////
                    timeout(function() {
                        defer.notify('Generating...');

                        var rendering = 0;
                        var canvasOri = self._createCanvas(canvasProperties, background, images, 1, canvasScale);
                        canvasOri.on('after:render', function() {
                            rendering++;
                            log.log('original:after:render', rendering);
                            if(rendering == renderingUntil) {
                                var canvasOriEl = canvasOri.getElement();
                                defer.resolve(canvasOriEl.toDataURL());
                            }
                        });
                    });
                }
            });

            return defer.promise;
        },

        _createCanvas: function(canvasProperties, background, images, canvasScale, oldScale) {
            // get json objects
            var json = JSON.stringify(canvasProperties);
            // get canvas size by background
            var canvasSize = background.resize;

            var canvasEl = document.createElement('canvas');
            var canvas = new this.FabricWindow.Canvas(canvasEl);
            canvas.loadFromJSON(json, function() {
                // set canvas dimension
                canvas.originalWidth = canvasSize.width;
                canvas.originalHeight = canvasSize.height;
                canvas.setWidth(canvasSize.width * canvasScale);
                canvas.setHeight(canvasSize.height * canvasScale);

                // set position & lock objects
                var objects = canvas.getObjects();
                angular.forEach(objects, function(object, key){
                    if( oldScale ) {
                        object.scaleX = canvasScale;
                        object.scaleY = canvasScale;
                        object.left = object.left / oldScale;
                        object.top  = object.top / oldScale;
                    }
                    if(background.template == 'landscape') {
                        object.left = canvas.originalWidth/canvasProperties.originalWidth * object.left;
                    } else if(background.template == 'portrait') {
                        object.top = canvas.originalHeight/canvasProperties.originalHeight * object.top;
                    }                   
                    object.lockObject = true;
                    object.hasControls = false;
                    object.setCoords();
                });

                // set backgound image
                canvas.setBackgroundImage(images.background, canvas.renderAll.bind(canvas), {
                    top : 0,
                    left: 0,
                    scaleX: canvasScale,
                    scaleY: canvasScale
                });
                // set overlay image
                canvas.setOverlayImage(images.overlay, canvas.renderAll.bind(canvas), {
                    top : 0,
                    left: 0,
                    scaleX: canvasScale,
                    scaleY: canvasScale
                });
            });
            return canvas;
        },

        _getCropImage: function(file) {
            var image = file.image;
            var selection = file.crop.selection || this._getCropSelection(file);

            var canvas = document.createElement('canvas');
            canvas.width  = image.width;
            canvas.height = image.height;
            canvas.getContext('2d').drawImage(
                image,
                selection.x1, 
                selection.y1, 
                selection.x2, 
                selection.y2,
                0, 0, 
                image.width, 
                image.height
            );
            return canvas.toDataURL();
        },
        _getCropSelection: function(file) {
            var image = file.image,
                resize = file.resize;

            var x1 = parseInt((image.width - resize.width) / 2),
                y1 = parseInt((image.height - resize.height) / 2);

            return {
                x1: x1,
                y1: y1,
                x2 : parseInt(x1 + resize.width),
                y2 : parseInt(y1 + resize.height)
            };
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
        },
        _onCropSelection: function(event, args) {
            this.$log.log('_onCropSelection', event, args);
            this.$.backgrounds.data[args.index].crop.selection = args.selection;
        }
    });
});