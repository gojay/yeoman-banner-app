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

    /**
     * Directive imgShowCrop
     *
     * @description show crop selection on image with imgAreaSelect
     * @example <img img-show-crop="{model}" img-show-crop-parent-id="{parentid}" />
     */
    app.directive('imgShowCrop', function() {
        return {
            scope: {
                background: '=imgShowCrop'
            },
            restrict: 'A',
            link: function($scope, $element, $attrs) {
                var self = this;
                var parentId = $attrs.imgShowCropParentId;

                var needToCropped = !$scope.background.error && (angular.isDefined($scope.background.act) && $scope.background.act == 'crop');

                console.log('$scope', needToCropped, $scope.background)

                var $cropInstance;

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
                    if( !needToCropped ) {
                        return;
                    }
                    console.log('showCropSelection:selection', $scope.background.crop.selection);
                    // remove imgareaselect
                    $element.imgAreaSelect({remove:true});
                    // get crop selection
                    var selection = getCropSelection();
                    // instance imgareaselect
                    $cropInstance = $element.imgAreaSelect({
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
                    if(newVal == oldVal || !$cropInstance) return;

                    if(newVal == 'crop') {
                        $cropInstance.setOptions({ show: true });
                    } else {
                        $cropInstance.setOptions({ hide: true });
                    }
                    $cropInstance.update();
                });
                $scope.$watch('background.generate', function(newVal, oldVal) {
                    if( !needToCropped && !$cropInstance) return;

                    if(newVal) {
                        $element.imgAreaSelect({ hide:true });
                    } else {
                        $element.imgAreaSelect({ show:true });
                        $element.parent().find('canvas').remove();
                    }
                });
            }
        }
    });

    var IMAGE = {
        extension: '.png',
        directory: 'images/conversation/',
        default  : 'images/default/file.png'
    };

    app.classy.controller({
        name: 'ConversationCtrl',
        inject: [
            '$rootScope',
            '$scope',
            '$log',
            '$timeout',
            '$q',
            '$upload',

            'API',

            'Fabric',
            'FabricConstants',
            'FabricWindow',
            'Keypress'
        ],
        initScope: {
            fabric: {},
            fullEditor: false,
            selected: 0,
            uploadOptions: {
                logo: {
                    data: {
                        id    : 'conversation',
                        name  : 'logo',
                        width : 165,
                        height: 45
                    }
                },
                elements: {
                    1: {
                        data: {
                            id    : 'conversation',
                            name  : 'element-1',
                            width : 70,
                            height: 70
                        }
                    },
                    2: {
                        data: {
                            id    : 'conversation',
                            name  : 'element-2',
                            width : 70,
                            height: 70
                        }
                    }
                }
            },
        },
        init: function() {
            var self = this;

            /* dimensions */
            this.$.dimensions = {
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
            };

            /* colors */
            this.$.colors = [ 
                {
                    name : '',
                    title: 'Light Orange',
                    color: 'orange',
                    selected: true
                }, 
                {
                    name : 'blue',
                    title: 'Blue',
                    color: 'blue',
                    selected: false
                },
                {
                    name : 'dblue',
                    title: 'Dark Blue',
                    color: 'darkblue',
                    selected: false
                },
                {
                    name : 'dorange',
                    title: 'Dark Orange',
                    color: 'darkorange',
                    selected: false
                },
                {
                    name : 'lgreen',
                    title: 'Light Green',
                    color: 'lightgreen',
                    selected: false
                }, 
                {
                    name : 'green',
                    title: 'Green',
                    color: 'green',
                    selected: false
                },
                {
                    name : 'yellow',
                    title: 'Yellow',
                    color: 'yellow',
                    selected: false
                }, 
                {
                    name : 'dyellow',
                    title: 'Dark Yellow',
                    color: '#CCCC00',
                    selected: false
                },
                {
                    name : 'purple',
                    title: 'Purple',
                    color: 'purple',
                    selected: false
                }, 
                {
                    name : 'pink',
                    title: 'Pink',
                    color: 'pink',
                    selected: false
                },
                {
                    name : 'red',
                    title: 'Red',
                    color: 'red',
                    selected: false
                }
            ];

            /* templates */
            this.$.templates = [
                {
                    title: 'Template 1',
                    open: true,
                    colors: false,
                    template: {
                        default  : 'tpl-1-default',
                        landscape: 'tpl-1-landscape',
                        portrait : 'tpl-1-portrait'
                    }
                },
                {
                    title: 'Template 2',
                    open : false,
                    colors: false,
                    template: {
                        default  : 'tpl-2-default',
                        landscape: 'tpl-2-landscape',
                        portrait : 'tpl-2-portrait'
                    }
                },
                {
                    title: 'Template 3',
                    open: false,
                    colors: false,
                    template: {
                        default  : 'tpl-3-default',
                        landscape: 'tpl-3-landscape',
                        portrait : 'tpl-3-portrait'
                    }
                },
                {
                    title: 'Template 4',
                    open: false,
                    colors: true,
                    template: {
                        default  : 'tpl-4-default',
                        landscape: 'tpl-4-landscape',
                        portrait : 'tpl-4-portrait'
                    }
                },
                {
                    title: 'Template 5',
                    open: false,
                    colors: true,
                    template: {
                        default  : 'tpl-5-default',
                        landscape: 'tpl-5-landscape',
                        portrait : 'tpl-5-portrait'
                    }
                },
                {
                    title: 'Template 6',
                    open: false,
                    colors: true,
                    template: {
                        default  : 'tpl-6-default',
                        landscape: 'tpl-6-landscape',
                        portrait : 'tpl-6-portrait'
                    }
                }
            ];

            /* backgrounds */
            this.$.backgrounds = {
                completed: false,
                reading : false,
                editing : true,
                progress: -1,
                size    : 0,
                errors  : [],
                data    : []
            };

            /* conversation */
            this.$.conversation = {
                images: {
                    logo: null,
                    elements: {
                        1: null,
                        2: null
                    }
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

            /* events */
            
            this.$.$on('canvas:created', this._onCanvasCreated);

            this.$.$on('uploadimage:close:selection', this._onCropSelection);
        },
        /**
         * Angular scope $watch
         */
        watch: {
            '{object}templates': '_onChangeTemplate',
            'conversation.images.logo': '_onChangeImageLogo',
            '{object}conversation.images.elements': '_onChangeImageElements',

            '{object}conversation.config.logo': '_onChangeConfigLogo',
            '{object}conversation.config.elements': '_onChangeConfigElements'
        },
        /**
         * Watch Scope Asyncronus
         * @param  {object} $scope The angular $scope
         * @return {void}        
         */
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
            $scope.$watch('fabric.selectedObject.placeholder', function(placeholder) {
                if (!$scope.fabric.selectedObject || _.isUndefined(placeholder)) return;
                $scope.fabric.selectedObject.placeholder = placeholder;
                $scope.fabric.render();
            });
            $scope.$watch('fabric.selectedObject.padding', function(newVal, oldVal) {
                if (!oldVal) return;
                if(newVal > 10) $scope.fabric.selectedObject.padding = 10;
                $scope.fabric.render();
            });
        },

        /**
         * Get title fabric selected object
         * @param  {string} type The object name
         * @return {string}      
         */
        getObjectTitle: function(type) {
            if(!this.$.fabric.selectedObject) return null;
            return _.titleize(this.$.fabric.selectedObject[type]);
        },

        /**
         * Select template color
         * @param  {integer} index The color index
         * @return {void}       
         */
        doSelectColor: function(index) {
            angular.forEach(this.$.colors, function(color) {
                color.selected = false;
            });

            this.$.colors[index].selected = true;

            var imgURL = this._getTemplateImageURL('default', index);
            console.log('imgURL', imgURL);
            this.$.fabric.setOverlayImage(imgURL);
        },

        /**
         * Set action the background
         * - resize
         * - crop
         * @param {integer} index The index background 
         * @param {string} act   The action
         */
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

        /**
         * Event button "select backgrounds"
         * Trigger click input file in the next
         * @param  {event} evt The button events
         * @return {void}
         */
        openFileSelect: function(evt) {
            angular.element(evt.currentTarget).next().trigger('click');
        },
        /**
         * Event background input files (multiple)
         * @param  {Object} $files the input files
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
                    log.info('End read files...');
                    log.log('completed', response, self.$.backgrounds);
                    self.$.backgrounds.reading = false;
                });
            });
        },
        /**
         * Event background input file (single)
         * @param  {File} $files The input files
         * @param  {integer} index  The background index
         * @return {void} 
         */
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
        /**
         * Event button "change"
         * Trigger click input file in the next, to change the background
         * @param  {Event} evt The button events
         * @return {void}     
         */
        doChangeImg: function(evt) {
            angular.element(evt.currentTarget).next().trigger('click');
        },
        /**
         * Remove background selected
         * @param  {integer} index The background index
         * @return {void}       
         */
        doDeleteImg: function(index) {
            var backgrounds = this.$.backgrounds;
            // remove backgrounds errors
            _.remove(backgrounds.errors, function(num) { return num == index; });
            // remove backgrounds data by index
            backgrounds.data.splice(index, 1);
        },
        /**
         * Empty backgrounds
         * @return {void} 
         */
        doEmptyFiles: function() {
            this.$.backgrounds = {
                progress: -1,
                size: 0,
                errors: [],
                data: []
            };
        },

        /**
         * Do generate conversation
         * @return {void} 
         */
        doGenerate: function() {
            var self = this;
            var log = this.$log;
            var requests = this.$.backgrounds.data;

            // set zoom original canvas
            self.$.fabric.setZoom(0.6);

            // set waiting block
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

            // start chaining generate background
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

        /**
         * Toggle edit/settings background
         * @return {void}
         */
        toggleSettings: function() {
            var backgrounds = this.$.backgrounds;

            backgrounds.editing = !backgrounds.editing;

            if(backgrounds.progress != 100) return;

            _.forEach(backgrounds.data, function(background) {
                background.generate = false;
            });
            backgrounds.progress = -1;
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
                    image: { src: IMAGE.default },
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
         * File validation image
         * @private
         * @param  {object} file       The file input
         * @param  {boolean} showAlert is showing alert if get error ?
         * @return {void|object}       The response validation
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
         * Get image attributes
         * - act  : The action for image manipulation, such as: crop or resize
         * - crop : The crop configuration for image manipulation, including the type of crop (center, custom) and crop selection
         * - resize : The resize dimension for image manipulation
         * - template : The types of templates, such as : default (square), landscape, portrait
         * @private
         * @param  {Integer} width  The image width
         * @param  {Integer} height The image height
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
                    return self._generateBackground(el, index, request)
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
        _generateBackground: function(element, index, backgroundData) {
            var self = this,
                log = self.$log,
                timeout = self.$timeout;

            var imageEl = element.find('.image');

            // get overlay images of the selected template 
            var overlayImage = self._getTemplateImageURL(backgroundData.template);
            // canvas images
            var images = { overlay:overlayImage, background: backgroundData.image.src };

            var defer = this.$q.defer();

            timeout(function() { defer.notify('Preparing background...'); });
            // set generate true
            backgroundData.generate = true;

            // get background image
            if( backgroundData.act === 'crop' ) {
                timeout(function() { defer.notify('Cropping background...'); });
                // do crop background image
                images.background = this._getCropImage(backgroundData);
            } else if( backgroundData.act === 'resize' ) {
                timeout(function() { defer.notify('Resizing background...'); });
                // do upload 'resize' background image...
                var uploadURL = self.API.URL + '/upload';
                var data = angular.extend(backgroundData.resize, { id:'conversation', name: 'background-'+ (index + 1) });
                self.$upload.upload({
                    url: uploadURL,
                    method: 'POST',
                    data: data,
                    file: backgroundData.blob,
                    fileFormDataName: 'image'
                }).then(function success(response) {
                    log.info('[upload]', response);

                    images.background = response.data.url;
                    self._generateImage(imageEl, backgroundData, images, function resolve(response) {
                        defer.resolve(response);
                    }, function notify(message) {
                        timeout(function() { defer.notify(message); });
                    }, function reject(error) {
                        defer.reject(error);
                    });

                }, function error(errors) {
                    log.error('[upload]', errors);
                }, function notify(evt) {
                    var progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    log.info('[upload]', progress);
                });
            } 

            log.info('generate image', backgroundData.act, images);
            self._generateImage(imageEl, backgroundData, images, function resolve(response) {
                defer.resolve(response);
            }, function notify(message) {
                timeout(function() { defer.notify(message); });
            }, function reject(error) {
                defer.reject(error);
            });

            return defer.promise;
        },
        _generateImage: function(imageEl, background, images, resolve, notify, reject) {
            var self = this,
                 log = self.$log;

            // define original canvas
            var originalCanvas = self.$.fabric.canvas,
                canvasScale = self.$.fabric.canvasScale;

            //////////////////////////////
            // 1. Create canvas preview //
            //////////////////////////////
            notify('Creating canvas...');

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

            // set rendering
            var rendering = 0;
            // create canvas preview
            var canvasPreview = self._createCanvas(canvasProperties, background, images, canvasScale, null);
            // canvas preview event "after render"
            canvasPreview.on('after:render', function() {
                rendering += 1;
                log.log('preview:after:render', rendering);
                // render is completed
                if(rendering == renderingUntil) {
                    log.log('render completed', canvasPreview);

                    var canvasEl = canvasPreview.getElement();
                    // set relative position
                    canvasEl.style.position = 'relative';
                    // add fabric canvas element
                    imageEl.parent().find('canvas').remove();
                    imageEl.append(canvasEl);

                    /////////////////////////////////
                    // 2. Generate original canvas //
                    /////////////////////////////////
                    notify('Generating...');

                    rendering = 0;
                    // create canvas original
                    var canvasOri = self._createCanvas(canvasProperties, background, images, 1, canvasScale);
                    // canvas original event "after render"
                    canvasOri.on('after:render', function() {
                        rendering += 1;
                        log.log('original:after:render', rendering);
                        if(rendering == renderingUntil) {
                            // resolve image
                            var canvasOriEl = canvasOri.getElement();
                            var image = canvasOri.toDataURL();
                            // call resolve
                            resolve(image);
                        }
                    });
                }
            });
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
                    scaleY: canvasScale,
                    crossOrigin: 'Anonymous'
                });
                // set overlay image
                canvas.setOverlayImage(images.overlay, canvas.renderAll.bind(canvas), {
                    top : 0,
                    left: 0,
                    scaleX: canvasScale,
                    scaleY: canvasScale,
                    crossOrigin: 'Anonymous'
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

            var canvasFabric = args.canvasId;

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
                    image: ''
                },
                {
                    type: 'polaroid',
                    image: 'images/default/165x45.png',
                    options: {
                        name: 'logo',
                        fill: '#fff',
                        top : 90,
                        left: 50
                    }
                },
                {
                    type: 'polaroid',
                    image: 'images/default/70x70.png',
                    options: {
                        name: 'element-1',
                        fill: '#fff',
                        top : 275,
                        left: 50
                    }
                },
                {
                    type: 'polaroid',
                    image: 'images/default/70x70.png',
                    options: {
                        name: 'element-2',
                        fill: '#fff',
                        top : 275,
                        left: 293
                    }
                }
            ];

            fabric.buildObjects(objects);

            self.$.$evalAsync(self._watchAsync);
        },
        _onCropSelection: function(event, args) {
            this.$log.log('_onCropSelection', event, args);
            this.$.backgrounds.data[args.index].crop.selection = args.selection;
        },

        _onChangeTemplate: function(newVal, oldVal) {
            this.$.selected = _.findKey(newVal, { open:true });
            this.$log.log('_onChangeTemplate', this.$.selected);

            var imgURL = this._getTemplateImageURL('default');
            this.$.fabric.setOverlayImage(imgURL);
        },

        _onChangeImageLogo: function(newVal, oldVal) {
            var fabric = this.$.fabric;
            this.$log.log('_onChangeImageLogo', newVal, oldVal);
            if(!newVal || !fabric) return;

            var logo = fabric.getObjectByName('logo');
            logo.getElement().setAttribute('src', newVal);
            fabric.render();

            this.$rootScope.$broadcast('uploadimage:completed');
        },
        _onChangeImageElements: function(newVal, oldVal) {
            var fabric = this.$.fabric;
            this.$log.log('_onChangeImageElements', newVal, oldVal);

            if(_.isEqual(newVal, oldVal) || !fabric) return;

            angular.forEach(newVal, function(image, index){
                if( image && image != oldVal[index] ) {
                    console.log('element', index);
                    var name = 'element-' + index;
                    var obj = fabric.getObjectByName(name);
                    obj.getElement().setAttribute('src', image);
                }
            });
            fabric.render();

            this.$rootScope.$broadcast('uploadimage:completed');
        },

        _onChangeConfigLogo: function(newVal, oldVal) {
            var log = this.$log,
                fabric = this.$.fabric;

            log.log('_onChangeConfigLogo', newVal, oldVal);

            if(_.isEqual(newVal, oldVal) || !fabric) return;

            var logo = fabric.getObjectByName('logo');
            logo.visible = newVal.enable;
            logo.placeholder = newVal.placeholder;
            fabric.render();
        },
        _onChangeConfigElements: function(newVal, oldVal) {
            var log = this.$log,
                fabric = this.$.fabric;

            log.log('_onChangeConfigElements', newVal, oldVal);
            
            if(_.isEqual(newVal, oldVal) || !fabric) return;

            angular.forEach(newVal, function(element, index){
                var name = 'element-' + index;
                var obj = fabric.getObjectByName(name);
                obj.visible = element.enable;
                obj.placeholder = element.placeholder;

                var clip = null
                if( !element.default ) {
                    // clip image circle
                    clip = function(ctx) {
                        ctx.beginPath();
                        ctx.arc(0, 0, this.width / 2 , 0, 2*Math.PI, true);
                        ctx.lineWidth = this.padding;
                        ctx.strokeStyle = this.fill;
                        ctx.stroke();
                        ctx.closePath();   
                    }
                }

                obj.clipTo = clip;
            });

            fabric.render();
        },

        _getTemplateImageURL: function(type, indexColor) {
            var selected = this.$.templates[this.$.selected];

            var imgName = selected.template[type];
            if( selected.colors ) {
                if( angular.isDefined(indexColor) && indexColor > 0 ) {
                    var color = this.$.colors[indexColor];
                    imgName += '-' + color.name;
                } else {
                    var color = _.find(this.$.colors, { selected:true });
                    if( color.name ) imgName += '-' + color.name;
                }
            }
            return IMAGE.directory + imgName + IMAGE.extension;
        }
    });
});