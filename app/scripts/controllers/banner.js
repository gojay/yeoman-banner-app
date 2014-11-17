define([
    'angular',
    'lodash',
    'underscore.string',
    'jszip',
    'async',
    'angular-elastic',
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

    var app = angular.module('bannerAppApp.controllers.BannerCtrl', [
        'monospaced.elastic',
        'classy',
        'classy-extends',
        'classy-initScope',
        'common.fabric',
        'common.fabric.utilities',
        'common.fabric.constants'
    ]);

    app.classy.controller({
        name: 'BannerCtrl',
        inject: [
            '$rootScope',
            '$scope',
            '$log',
            '$timeout',

            'Fabric',
            'FabricConstants',
            'Keypress',

            'BannerData',
            'Banner',
            'data'
        ],
        initScope: {
            fabric: {},
            fullEditor: false,
            showEditor: true,
            title: 'Template Empty Prize',
            animation: {
                templates: 'bouncy-slide-right',
                settings: 'bouncy-slide-left'
            },
            accordion: {
                closeOthers: true,
                isFirstOpen: true
            },
            uploadOptions: {
                background: {
                    data: {
                        id: 'test',
                        name: 'background',
                        width: null,
                        height: null
                    }
                },
                logo: {
                    data: {
                        id: 'test',
                        name: 'logo',
                        width: null,
                        height: null
                    }
                },
                prize: {
                    1: {
                        data: {
                            id: 'test',
                            name: 'prize-1',
                            width: null,
                            height: null
                        }
                    },
                    2: {
                        data: {
                            id: 'test',
                            name: 'prize-2',
                            width: null,
                            height: null
                        }
                    },
                    3: {
                        data: {
                            id: 'test',
                            name: 'prize-3',
                            width: null,
                            height: null
                        }
                    }
                }
            },
            loadRandomImage: false
        },
        init: function() {
            var self = this;

            $('a[data-toggle="tab"]')
                .click(function(e) {
                    e.preventDefault();
                    $(this).tab('show');
                }).on('shown.bs.tab', function(e) {
                    var type = $(e.target).data('prize');
                    self.$.title = e.target.text;
                    self.$.banner.config.prize.type = type;
                    self.$.$apply();
                });

            this.$.templates = this.data.templates;
            this.$.dimensions = this.BannerData.dimensions;
            this.$.banner = new this.Banner();
            angular.extend(this.$.banner, this.BannerData.model);

            var q = async.queue(function (task, callback) {
                self.$log.log('[queue] ', task);
                self._onCanvasCreated(task, callback);
            });

            // assign a callback
            q.drain = function() {
                self.$log.log('[drain] all canvases have been created');

                self.$.$evalAsync(self._watchAsync);

                self.Keypress.onControls({
                    up: function() {
                        if (self.$.fabric.selectedObject && !self.$.fabric.selectedObject.isEditing) {
                            self.$.fabric.controls.top -= 1;
                            self.$.$apply();
                            self.$log.debug('up', self.$.fabric.controls.top);
                        }
                    },
                    down: function() {
                        if (self.$.fabric.selectedObject && !self.$.fabric.selectedObject.isEditing) {
                            self.$.fabric.controls.top += 1;
                            self.$.$apply();
                            self.$log.debug('down', self.$.fabric.controls.top);
                        }
                    },
                    left: function() {
                        if (self.$.fabric.selectedObject && !self.$.fabric.selectedObject.isEditing) {
                            self.$.fabric.controls.left -= 1;
                            self.$.$apply();
                            self.$log.debug('left', self.$.fabric.controls.left);
                        }
                    },
                    right: function() {
                        if (self.$.fabric.selectedObject && !self.$.fabric.selectedObject.isEditing) {
                            self.$.fabric.controls.left += 1;
                            self.$.$apply();
                            self.$log.debug('right', self.$.fabric.controls.left);
                        }
                    }
                });
            };

            this.$.$on('canvas:created', function(event, args) {

                // add to the queue
                q.push(args, function (err) {
                    self.$log.log('[finished] processing ' + args.canvasId);
                });

            });
        },
        watch: {
            'fullEditor': '_onFullEditor'
        },
        _watchAsync: function($scope) {
        	var self = this,
        		log  = this.$log;

            log.log("$evalAsync", $scope);

            $scope.$watch('fabric.selectedObject', function(obj) {
            	if(!obj) return;

            	self._applyCanvas(null, function(fabric){
            		fabric.setActiveObjectByName(obj.name);
            	});
            });

            $scope.$watch('fabric.canvasScale', function(scale) {
            	if(!scale) return;

            	self._applyCanvas(null, function(fabric){
            		fabric.setZoom(scale);
            	});
            });
            $scope.$watch('fabric.controls.angle', function(angle) {
            	if(!angle) return;

        		$scope.fabric.angleControl();
            	self._applyCanvas(null, function(fabric){
            		fabric.controls.angle = angle;
            		fabric.angleControl();
            	});
            });
            $scope.$watch('fabric.controls.scale', function(scale) {
            	if(!scale) return;

        		$scope.fabric.scaleControl();
            	self._applyCanvas(null, function(fabric){
            		fabric.controls.scale = scale;
            		fabric.scaleControl();
            	});
            });
            $scope.$watch('fabric.controls.left', function(left) {
            	if(!left) return;

        		$scope.fabric.leftControl();
            	self._applyCanvas(null, function(fabric){
            		fabric.controls.left = left;
            		fabric.leftControl();
            	});
            });
            $scope.$watch('fabric.controls.top', function(top) {
            	if(!top) return;

        		$scope.fabric.topControl();
            	self._applyCanvas(null, function(fabric){
            		fabric.controls.top = top;
            		fabric.topControl();
            	});
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
            	self._applyCanvas('logo-polaroid', { shadow:shadow });
            });
            $scope.$watch('fabric.selectedObject.hasPlaceholder', function(hasPlaceholder) {
                if (!$scope.fabric.selectedObject || _.isUndefined(hasPlaceholder)) return;
            	self._applyCanvas('logo', function(object){
            		object.setPlaceholder(hasPlaceholder);
            	});
            });
            $scope.$watch('fabric.selectedObject.H_PADDING', function(newVal, oldVal) {
                if (!oldVal) return;

                self._applyCanvas('logo', function(object){});
            });

            $scope.$watch('banner.config.prize.type', this._onChangePrizeType);
            $scope.$watch('banner.config.background.overlay', this._onChangeBackgroundOverlay);
            $scope.$watch('banner.config.logo.enable', this._onLogoEnable);
            $scope.$watch('banner.config.badge.enable', this._onBadgeEnable);
            $scope.$watch('banner.config.badge.size', this._onBadgeSize);
            $scope.$watch('banner.images.background', this._onChangeBackgroundImage);
            $scope.$watch('banner.images.logo', this._onLogoImage);
            $scope.$watchCollection('banner.images.prize', this._onChangePrizeImages);

            $scope.$watchCollection('banner.text.contest', this._onChangeTextContest);
            $scope.$watchCollection('banner.text.prize.content', this._onChangeTextPrizeContent);
        },

        /** Bind **/

        getObjectTitle: function(type) {
            if(!this.$.fabric.selectedObject) return null;
            return _.titleize(this.$.fabric.selectedObject[type]);
        },

        /**
         * Atur gambar background pada canvas
         * @param {String/Int} type Background
         */
        setBgType: function(type) {
            if( _.isUndefined(type) ) {
                type = this.$.banner.config.background.type;
            } else {
                this.$.banner.config.background.type = type;
            }

            var selected = this._getSelected();

            var prizeTemplate = selected.prize;
            var objBgTemplate = selected.objects[0];
            var objBgOptions  = objBgTemplate.options || { crossOrigin: 'anonymous' } ;
            var defaultImg    = selected.background || objBgTemplate['image'];

            var imageURL = type === 0 ? defaultImg : selected.backgroundTemplates[type];

            // ganti url localhost
            // if(imageURL.indexOf('http') > -1) {
            //     var indexImgname = imageURL.lastIndexOf('/') + 1;
            //     imageURL = 'images/banner/' + imageURL.substr(indexImgname, imageURL.length);
            // }

            this._applyCanvas('*', function(fabric){
            	if(fabric.canvasOriginal.prizeTemplate == prizeTemplate) {
                    console.log(objBgOptions);
            		fabric.setbackgroundImage(imageURL, objBgOptions);
            	}
        	});
        },

        /**
         * Mengatur background canvas dengan gambar acak. Gambar dari http://lorempixel.com, dengan ukuran canvas/background
         */
        setRandomBackground: function() {
            var self = this;
            var backgroundSize = this._getSelected('backgroundSize');

            // var imageURL = 'http://lorempixel.com/';
            var imageURL = 'http://placekitten.com/';
            var type     = ['abstract', 'business', 'cats', 'city', 'fashion', 'nature', 'technics'];

            var tRandom = _.sample(type);
            var nRandom = _.random(1, 10);

            imageURL += backgroundSize.width + '/' + backgroundSize.height;
            imageURL += '?image=' + nRandom;
            // imageURL += tRandom + '/' + nRandom;

            this.$log.log('getRandomImage', imageURL);

            this.$.loadRandomImage = true;

            var img = new Image();
            img.onload = function() {

                // var canvas = document.createElement('canvas'),
                //     ctx = canvas.getContext('2d');

                // canvas.height = img.height;
                // canvas.width = img.width;
                // ctx.drawImage(img, 0, 0);

                // var dataURL = canvas.toDataURL('image/png');
                // console.log(dataURL);

                // self.$.banner.images.background = dataURL;
                self.$.banner.images.background = this.src;
                self.$.loadRandomImage = false;
                self.$.$digest();
            };
            img.src = imageURL;
        },

        /**
         * Atur gambar logo Facebook
         * @param {String} type Facebook logo
         */
        setFbType: function(type) {
            this.$.banner.config.facebook.type = type;
            
            var imageURL = this.$.templates.facebook[type];

            this._applyCanvas('facebook', function(obj) {
                obj.getElement().setAttribute('src', imageURL); 
            });
        },

        /**
         * atur gambar logo Badge
         * @param {String} type Badge logo
         */
        setBadgeType: function(type) {
            this.$.banner.config.badge.type = type;

            var image = this.$.templates.badges[type];
            if(!this.$.banner.images.badge) {
                this.$.banner.images.badge = image;
                this._applyCanvas('*', function(fabric) {
                    fabric.addImage(image, { 
                        name:'badge', 
                        hasControls: true,
                        centeredScaling: true 
                    });
                });
            } else {
                this._applyCanvas('badge', function(obj) {
                    obj.getElement().setAttribute('src', image); 
                });
            }
        },

        doSetting: function() {
            this.$.showEditor = !this.$.showEditor;
        },

        /**
         * Konversikan canvas menjadi image
         * @param  {Boolean} isSaved Simpan konfigurasi
         */
        doGenerate: function(isSaved) {
            var self = this;
            var prizeTemplate = this._getSelected('prize');

            var zip = new JSZip();

            var q = async.queue(function (fabric, callback) {
                self.$log.log('[queue] ', fabric);

                fabric.deselectActiveObject();

                var type = fabric.canvasOriginal.isEnter ? 'enter' : 'like' ;
                var name = 'banner-prize-' + prizeTemplate + '_' + type + '.png';
                var img  = fabric.getCanvasData();
                var data = img.replace('data:image/png;base64,', '');

                zip.file(name, data, { base64:true });

                callback();
            });

            // assign a callback
            q.drain = function() {
                self.$log.log('[drain] all canvases have been created');
                // generate zip link
                var DOMURL = window.URL || window.mozURL;
                var downloadlink = DOMURL.createObjectURL(zip.generate({type:"blob"}));

                var link = document.createElement('a');
                var filename = Date.now() + '.zip';
                link.download = filename;
                link.href = downloadlink;
                link.click();

                // if( isSaved ) {
                //     this.$log.info('Saving the banner...');
                //     this.$.banner.$save(function(response) {
                //         self.$log.debug('[SAVE]', response);
                //     });
                // } 
            };

            self._applyCanvas('*', function (fabric) {
                if(fabric.canvasOriginal.prizeTemplate == prizeTemplate) {
                    // add to the queue
                    q.push(fabric, function (err) {
                        self.$log.log('[finished] processing', fabric, err);
                    });
                }
            });
        },

        /**
         * Ambil data JSON object 
         * @param  {String} index Object yg dipilih
         */
        doGetJSON: function(index) {
            var outputJSON = this.$.fabric.getJSON(true);
            this.$.outputJSONObject = index ? outputJSON.objects[index] : outputJSON;
        },

        /**
         * Lakukan perubahan jika template "prize" baru dipilih.
         * Atur dimensi upload (background, logo, & gambar "prize")
         * Atur dimensi canvas sesuai template "prize"
         * Atur gambar background yg pernah dipilih sebelumnya
         * @param  {Integer} newVal Nilai baru "prize" yg dipilih
         * @param  {Integer} oldVal Nilai lama "prize"
         * @return {Void}      
         */
        _onChangePrizeType: function(newVal, oldVal) {
            this.$log.log('_onChangePrizeType', newVal, oldVal);

            if(!newVal) return;

            var dimensions = this.$.dimensions[newVal],
                canvas = this.$.canvasSize = dimensions.canvas,
                background = dimensions.background;

            _.extend(this.$.uploadOptions.background.data, background);
            _.extend(this.$.uploadOptions.logo.data, dimensions.logo);

            if (dimensions.prize) {
                _.map(this.$.uploadOptions.prize, function(item) {
                    item = _.extend(item.data, dimensions.prize);
                    return item;
                });
            }

            var fabric = this.$.fabric;
            if (fabric.canvasOriginalWidth != canvas.width && 
                fabric.canvasOriginalHeight != canvas.height) {
                fabric.setCanvasSize(canvas.width, canvas.height);
            }

            // set current background image
            this.setBgType();

            this.$log.debug('canvasSize', this.$.canvasSize);
            this.$log.debug('uploadOptions', this.$.uploadOptions);
        },
        
        /**
         * Fungsi saat canvas telah dibuat
         * Init fabricJS
         * Build objects sesuai template "prize", dan konfigurasi untuk canvas "enter"
         * @param  {Object} event canvas event
         * @param  {Object} args  nilai attribut dari canvas
         */
        _onCanvasCreated: function(args, callback) {
            var self = this;

            this.$log.log('initialize canvas:created', args);

            var canvasFabric   = args.canvasId;
            var canvasTemplate = args.canvasTemplate;

            var isEnter = /enter/i.test(canvasFabric);

            var dimensions = this.$.dimensions[canvasTemplate];

            var fabric = self.$scope[canvasFabric] = new self.Fabric(canvasFabric, {
                JSONExportProperties: self.FabricConstants.JSONExportProperties,
                textDefaults        : self.FabricConstants.textDefaults,
                shapeDefaults       : self.FabricConstants.shapeDefaults,
                CustomAttributes    : self.FabricConstants.CustomAttributes,
                canvasOriginalWidth : dimensions.canvas.width,
                canvasOriginalHeight: dimensions.canvas.height,
                canvasOriginal      : {
                    width        : dimensions.canvas.width,
                    height       : dimensions.canvas.height,
                    overlay      : dimensions.overlay,
                    prizeTemplate: canvasTemplate,
                    isEnter      : isEnter
                }
            });

            var objects = self.BannerData.objects[canvasTemplate];
            if( objects ) {
                if( isEnter ) {
                    // remove obj facebook
                    _.remove(objects, function(obj) {
                        return obj.options && /^facebook/.test(obj.options.name);
                    });
                    // change text prize header content
                    var prizeHeader = _.find(objects, function(obj) {
                        return obj.options && /prize-header-content/.test(obj.options.name);
                    });
                    prizeHeader.text = 'This Month\'s Prizes\nEnter to win!';
                    var styles = [];
                    for (var i = 0; i < prizeHeader.text.split('\n')[1].length ; i++) {
                        styles[i] = prizeHeader.options.styles[1][0];
                    };
                    prizeHeader.options.styles[1] = styles;
                } else {
                    var objects = _.cloneDeep(self.BannerData.objects[canvasTemplate]);
                }

                fabric.buildObjects(objects);

                self.$log.debug('objects', fabric.getObjects());
            }

            callback();
        },

        _onFullEditor: function(newVal, oldVal) {
            var fabric = this.$.fabric;
            if (_.isEmpty(fabric)) return;

            fabric.canvasScale = newVal ? 1.2 : 0.8;
            fabric.setZoom();
        },

        _onChangeBackgroundOverlay: function(newVal, oldVal) {
            this.$log.log('_onChangeBackgroundOverlay', newVal, oldVal);
            if( newVal == oldVal ) return;

            var self = this;

            var canvases = _.filter(this.$scope, function(scope, key) {
                return /fabric/.test(key);
            });

            if(canvases) {
                _.forEach(canvases, function(fabric) {
                    self._doBackgroundOverlay(fabric, newVal);
                });
            }
        },
        _doBackgroundOverlay: function(fabric, value) {
            this.$log.log('_doBackgroundOverlay', fabric);

            var self = this;

            var canvasOriginal       = fabric.canvasOriginal;
            var intialScale          = fabric.canvasScale;
            var canvasOriginalHeight = fabric.canvasOriginalHeight;
            var contestObject        = fabric.getObjectByName('contest-placeholder');
            var canvasHeight;

            if( value ) {
                canvasHeight = canvasOriginal.height;
            } else {
                canvasHeight = canvasOriginalHeight + contestObject.height;
                if(fabric.canvasOriginal.prizeTemplate != 3) {
                    canvasHeight += 20;
                }
            }

            fabric.canvasOriginalHeight = canvasHeight;

            _.forEach(fabric.getObjects(), function(obj){

                if(fabric.canvasOriginal.prizeTemplate == 3) 
                {
                    var background = self.$.dimensions[3].background;

                    if(/^contest/.test(obj.name)) {
                        if(obj.type == 'rect') {
                            obj.visible = value;
                        }

                        // overlay
                        if( value ) {
                            if(/text/.test(obj.type)) {
                                obj.fill = '#fff';
                            }
                            obj.originalTop = (obj.originalTop - (background.height + 40)) + canvasOriginal.overlay;
                        } 
                        // non overlay
                        else {
                            if(/text/.test(obj.type)) {
                                obj.fill = 'rgb(51, 51, 51)';
                            }
                            obj.originalTop = obj.originalTop - canvasOriginal.overlay + background.height + 40;
                        }
                    }

                    if(/^prize/.test(obj.name)) {

                        // overlay
                        if( value ) {
                            obj.originalTop -= contestObject.height;
                        } 
                        // non overlay
                        else {
                            obj.originalTop += contestObject.height;
                        }
                    }

                } else {

                    if(/^contest/.test(obj.name)) {
                        if(obj.type == 'rect') {
                            obj.visible = value;
                        }

                        // overlay
                        if( value ) {
                            if(/text/.test(obj.type)) {
                                obj.fill = '#fff';
                            }
                            obj.originalTop = (obj.originalTop - (canvasHeight + 10)) + canvasOriginal.overlay;
                        } 
                        // non overlay
                        else {
                            if(/text/.test(obj.type)) {
                                obj.fill = 'rgb(51, 51, 51)';
                            }
                            obj.originalTop = obj.originalTop - canvasOriginal.overlay + canvasOriginalHeight + 10;
                        }

                    }

                    if(/^prize/.test(obj.name)) {
                        if(obj.name == 'prize-header-placeholder') {
                            obj.visible = value;
                        }

                        // overlay
                        if( value ) {
                            if(/text/.test(obj.type) && !/description/.test(obj.name)) {
                                obj.fill = '#fff';
                            }
                            obj.originalTop = (obj.originalTop - (canvasHeight + 10)) + canvasOriginal.overlay;
                        } 
                        // non overlay
                        else {
                            if(/text/.test(obj.type) && !/description/.test(obj.name)) {
                                obj.fill = 'rgb(51, 51, 51)';
                            }
                            obj.originalTop = obj.originalTop - canvasOriginal.overlay + canvasOriginalHeight + 10;
                        }
                    }
                }
            });

            fabric.setZoom();
        },

        _onChangeBackgroundImage: function(newVal, oldVal) {
            this.$log.log('_onChangeBackgroundImage', newVal, oldVal);
            if(!newVal || newVal == oldVal) return;

        	var selected = this._getSelected();

            var objBgTemplate = selected.objects[0];
            var objBgOptions  = objBgTemplate.options || { crossOrigin: 'anonymous' } ;

            this._applyCanvas('*', function(fabric){
            	if(fabric.canvasOriginal.prizeTemplate == selected.prize) {
            		fabric.setbackgroundImage(newVal, objBgOptions);
            	}
        	});
            this.$rootScope.$broadcast('uploadimage:completed');
        },

        _onLogoEnable: function(newVal, oldVal) {
            this.$log.log('_onLogoEnable', newVal, oldVal);
            if(_.isUndefined(newVal) || newVal == oldVal) return;

            this._applyCanvas('logo', function(obj) {
                obj.setVisible(newVal); 
            });
        },
        _onLogoImage: function(newVal, oldVal) {
            this.$log.log('_onLogoImage', newVal, oldVal);
            if(!newVal) return;

            this._applyCanvas('logo', function(obj) {
                obj.setImage(newVal);
            });

            this.$rootScope.$broadcast('uploadimage:completed');
        },

        _onBadgeEnable: function(newVal, oldVal) {
            this.$log.log('_onBadgeEnable', newVal, oldVal);
            if(_.isUndefined(newVal) || newVal == oldVal) return;

            this._applyCanvas('badge', function(obj) {
                obj.setVisible(newVal); 
            });
        },
        _onBadgeSize: function(newVal, oldVal) {
            this.$log.log('_onBadgeSize', newVal, oldVal);
            if(_.isUndefined(newVal) || newVal == oldVal) return;

            this._applyCanvas('badge', function(obj) {
                var size = obj.getOriginalSize();
                var width = parseInt(size.width * newVal / 100, 10);
                var height = parseInt(size.height * newVal / 100, 10);
                obj.set({
                    width: width,
                    height: height,
                });
                obj.center();
            });
        },

        _onChangePrizeImages: function(newVal, oldVal) {
            var self = this;
            this.$log.log('_onChangePrizeImages', newVal, oldVal);
            if(!newVal || newVal == oldVal) return;

            var prizeTemplate = this._getSelected('prize');

            angular.forEach(newVal, function(value, key) {
                if(value) {
                    var objName = 'prize-image-'+key;
                    self._applyCanvas('*', function(fabric) {
                        if(fabric.canvasOriginal.prizeTemplate == prizeTemplate) {
                            var obj = fabric.getObjectByName(objName);
                            if(obj) {
                                obj.setImage(value);
                                // fabric.setActiveObject(obj);
                            }
                            fabric.render();
                        }
                    })
                }
            });
            this.$rootScope.$broadcast('uploadimage:completed');
        },

        _onChangeTextContest: function(newVal, oldVal) {
            this.$log.log('_onChangeTextContest', newVal, oldVal);

            this._applyCanvas('contest-title', { text:newVal.title });
            this._applyCanvas('contest-description', { text:newVal.description });
        },
        _onChangeTextPrizeContent: function(newVal, oldVal) {
            this.$log.log('_onChangeTextPrizeContent', newVal, oldVal);

            this._applyCanvas('prize-description-1', { text:newVal[1] });
            this._applyCanvas('prize-description-2', { text:newVal[2] });
            this._applyCanvas('prize-description-3', { text:newVal[3] });
        },

        _getSelected: function(key) {
            var prize = this.$.banner.config.prize.type;
            var objects = this.BannerData.objects[prize];
            var backgroundTemplates = this.$.templates.background[prize - 1];
            var backgroundSize = this.$.dimensions[prize].background;
            var canvasSize = this.$.canvasSize;

            var options = {
                prize : prize,
                objects: objects,
                backgroundTemplates: backgroundTemplates,
                backgroundSize: backgroundSize,
                canvasSize: canvasSize
            };

            return key ? options[key] : options ;
        },
        _applyCanvas: function(objectName, args) {
            var self = this;
        	var log = this.$log;
        	var canvases = _.filter(this.$scope, function(scope, key) {
        		return /fabric/.test(key);
        	});

        	if(!objectName && objectName != '*') {
        		canvases.shift();
        	}

        	if(canvases) {
        		_.forEach(canvases, function(fabric) {
        			if( objectName && objectName != '*' ) {
			            var obj = fabric.getObjectByName(objectName);
			            if( obj ) {
				            if(_.isFunction(args)) {
                                args(obj);
                            } else {
                                obj.set(args);
                            }
				            fabric.render();
			            }
        			} else {
        				args.call(self, fabric);
        			}
        		});
        	}
        }
    });

});
