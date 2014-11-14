define([
    'angular',
    'lodash',
    'underscore.string',
    'angular-elastic',
    'fabricAngular',
    'fabricCanvas',
    'fabricConstants',
    'fabricDirective',
    'fabricDirtyStatus',
    'fabricUtilities',
    'fabricWindow',
], function (angular, _, _s) {
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

            this.$.FabricConstants = this.FabricConstants;

            this.$.$on('canvas:created', this._onCanvasCreated);

            this.Keypress.onControls({
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

            this.$log.debug('this', this);
        },
        watch: {
            'fullEditor': '_onFullEditor',

            'banner.config.background.overlay'  : '_onChangeBackgroundOverlay',
            'banner.images.background'          : '_onChangeBackgroundImage',

            'banner.config.logo.enable'         : '_onLogoEnable',
            'banner.images.logo'                : '_onLogoImage',

            'banner.config.badge.enable'        : '_onBadgeEnable',
            'banner.config.badge.type'          : '_onBadgeType',

            '{object}banner.images.prize'       : '_onChangePrizeImages',
        },
        _watchAsync: function($scope) {
        	var self = this,
        		log  = this.$log;

            log.log("$evalAsync", $scope);

            $scope.$watch('fabric.selectedObject', function(obj) {
            	log.log("[selectedObject]", obj);
            	if(!obj) return;

            	self._applyCanvas(null, function(fabric){
            		fabric.setActiveObjectByName(obj.name);
            	});
            });

            $scope.$watch('fabric.canvasScale', function(scale) {
            	log.log("fabric.canvasScale", scale);
            	if(!scale) return;

            	self._applyCanvas(null, function(fabric){
            		fabric.setZoom(scale);
            	});
            });
            $scope.$watch('fabric.controls.angle', function(angle) {
            	log.log("fabric.controls.angle", angle);
            	if(!angle) return;
        		$scope.fabric.angleControl();

            	self._applyCanvas(null, function(fabric){
            		fabric.controls.angle = angle;
            		fabric.angleControl();
            	});
            });
            $scope.$watch('fabric.controls.scale', function(scale) {
            	log.log("fabric.controls.scale", scale);
            	if(!scale) return;
        		$scope.fabric.scaleControl();

            	self._applyCanvas(null, function(fabric){
            		fabric.controls.scale = scale;
            		fabric.scaleControl();
            	});
            });
            $scope.$watch('fabric.controls.left', function(left) {
            	log.log("fabric.controls.left", left);
            	if(!left) return;
        		$scope.fabric.leftControl();

            	self._applyCanvas(null, function(fabric){
            		fabric.controls.left = left;
            		fabric.leftControl();
            	});
            });
            $scope.$watch('fabric.controls.top', function(top) {
            	log.log("fabric.controls.top", top);
            	if(!top) return;
        		$scope.fabric.topControl();

            	self._applyCanvas(null, function(fabric){
            		fabric.controls.top = top;
            		fabric.topControl();
            	});
            });

            $scope.$watch('fabric.selectedObject.hasShadow', function(hasShadow) {
                if (!$scope.fabric.selectedObject || _.isUndefined(hasShadow)) return;
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
                log.log("fabric.controls.hasPlaceholder", hasPlaceholder);
                if (!$scope.fabric.selectedObject || _.isUndefined(hasPlaceholder)) return;
            	self._applyCanvas('logo-polaroid', function(object){
            		object.setPlaceholder(hasPlaceholder);
            	});
            });
            $scope.$watch('fabric.selectedObject.H_PADDING', function(newVal, oldVal) {
                if (!oldVal && !$scope.fabric.selectedObject) return;
                // $scope.fabric.selectedObject.left += newVal - oldVal;
                // $scope.fabric.render();
            });
            $scope.$watch('fabric.selectedObject.V_PADDING', function(newVal, oldVal) {
                if (!oldVal && !$scope.fabric.selectedObject) return;
                // $scope.fabric.selectedObject.top += newVal - oldVal;
                // $scope.fabric.render();
            });

            $scope.$watch('banner.config.prize.type', this._onChangePrizeType);

            $scope.$watchCollection('banner.text.contest', this._onChangeTextContest);
            $scope.$watchCollection('banner.text.prize.content', this._onChangeTextPrizeContent);
        },

        /** Bind **/

        getObjectTitle: function(type) {
            if(!this.$.fabric.selectedObject) return null;
            return _.titleize(this.$.fabric.selectedObject[type]);
        },
        getFill: function() {
            return this.$.fabric.getActiveStyle('fill');
        },
        getFontSize: function() {
            return this.$.fabric.getActiveStyle('fontSize');
        },

        setRandomImage: function(e) {
        	var self = this;

        	var backgroundSize = this._getSelected('backgroundSize');
        	var imageURL = 'http://lorempixel.com/';
            var type = ['abstract', 'business', 'cats', 'city', 'fashion', 'nature', 'technics'];

        	var tRandom = _.sample(type);
        	var nRandom = _.random(1, 10);

            imageURL += backgroundSize.width + '/' + backgroundSize.height + '/';
        	imageURL += tRandom + '/' + nRandom;

            this.$log.log('getRandomImage', imageURL);

        	this.$.loadRandomImage = true;

        	var img = new Image();
        	img.src = imageURL;
        	img.onload = function() {
        		self.$.banner.images.background = this.src;
                self.$.loadRandomImage = false;
                self.$.$digest();
        	};
        },

        setBgOverlay: function(overlay) {
            this.$.banner.config.background.overlay = overlay;
        },
        setBgType: function(type) {
            this.$.banner.config.background.type = type;

            var selected = this._getSelected();

            var prizeTemplate = selected.prize;
            var objBgTemplate = selected.objects[0];
            var objBgOptions  = objBgTemplate.options || {} ;
            var defaultImg    = selected.background || objBgTemplate['image'];

            var imageURL = type === 0 ? defaultImg : selected.backgroundTemplates[type];

            this.$log.log('setBgType', imageURL, defaultImg, objBgOptions);

            this._applyCanvas('*', function(fabric){
            	if(fabric.canvasOriginal.prizeTemplate == prizeTemplate) {
            		fabric.setbackgroundImage(imageURL, objBgOptions);
            	}
        	});
        },
        setFbType: function(type) {
            this.$.banner.config.facebook.type = type;
            var imageURL = this.$.templates.facebook[type];

            this._applyCanvas('facebook', function(obj) {
                obj.getElement().setAttribute('src', imageURL); 
            });
        },
        setLogoEnable: function(enable) {
            this.$.banner.config.logo.enable = enable;
        },
        setBadgeEnable: function(enable) {
            this.$.banner.config.badge.enable = enable;
        },
        setBadgeType: function(type) {
            this.$.banner.config.badge.type = type;

            var image = this.$.templates.badges[type];
            var fabric = this.$.fabric;
            var obj = fabric.getObjectByName('badge');
            if(!obj) {
                fabric.addImage(image, { 
                    name:'badge', 
                    hasControls: true 
                });
            } else {
                fabric.setImageObject('badge', image);
            }
        },

        doSetting: function() {
            this.$.showEditor = !this.$.showEditor;
        },
        doGenerate: function() {
            this.$.banner.$save(function(response) {
                this.$log.debug('[SAVE]', response);
            });
        },
        doGetJSON: function(index) {
            var outputJSON = this.$.fabric.getJSON(true);
            this.$.outputJSONObject = index ? outputJSON.objects[index] : outputJSON.objects;
        },

        /** private **/

        _onChangePrizeType: function(newVal, oldVal) {
            this.$log.log('_onChangePrizeType', newVal, oldVal);
            this.$log.log('dimensions', this.$.dimensions);
            this.$log.log('uploadOptions', this.$.uploadOptions.background.data);

            var dimensions = this.$.dimensions[newVal],
                canvas = this.$.canvasSize = dimensions.canvas,
                background = dimensions.background;

            _.extend(this.$.uploadOptions.background.data, background);
            _.extend(this.$.uploadOptions.logo.data, dimensions.logo.image);

            if (dimensions.prize) {
                _.map(this.$.uploadOptions.prize, function(item) {
                    item = _.extend(item.data, dimensions.prize);
                    return item;
                });
            }

            this.$log.debug('canvasSize', this.$.canvasSize);
            this.$log.debug('uploadOptions', this.$.uploadOptions);

            var fabric = this.$.fabric;
            if (fabric && fabric.canvasOriginalWidth != canvas.width && fabric.canvasOriginalHeight != canvas.height) {
                // this.$log.info('change canvas size...');
                fabric.setCanvasSize(canvas.width, canvas.height);
            }

        },
        
        _onCanvasCreated: function(event, args) {
            var self = this;

            this.$log.log('initialize canvas:created', args);

            var canvasFabric   = args.canvasId;
            var canvasTemplate = args.canvasTemplate;

            var dimensions = this.$.dimensions[canvasTemplate];

            var fabric = this.$scope[canvasFabric] = new this.Fabric(canvasFabric, {
                JSONExportProperties: this.FabricConstants.JSONExportProperties,
                textDefaults        : this.FabricConstants.textDefaults,
                shapeDefaults       : this.FabricConstants.shapeDefaults,
                CustomAttributes    : this.FabricConstants.CustomAttributes,
                canvasOriginalWidth : dimensions.canvas.width,
                canvasOriginalHeight: dimensions.canvas.height,
                // canvasScale         : 0.8,
                canvasOriginal      : {
                    width        : dimensions.canvas.width,
                    height       : dimensions.canvas.height,
                    overlay      : dimensions.overlay,
                    prizeTemplate: canvasTemplate
                }
            });

            var objects = this.BannerData.objects[canvasTemplate];
            if( objects ) {
	            if(/enter/i.test(canvasFabric)) {
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
	                var objects = _.cloneDeep(this.BannerData.objects[canvasTemplate]);
	            }

	            fabric.buildObjects(objects);

	            this.$log.debug('objects', fabric.getObjects());
            }

            // Watchers
            // Executes the expression on the current scope at a later point in time.
            // ================================================================
            this.$.$evalAsync(this._watchAsync);
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
            var objBgOptions  = objBgTemplate.options || {} ;

            this._applyCanvas('*', function(fabric){
            	if(fabric.canvasOriginal.prizeTemplate == selected.prize) {
            		fabric.setbackgroundImage(newVal, objBgOptions);
            	}
        	});
            this.$rootScope.$broadcast('uploadimage:completed');
        },

        _onLogoEnable: function(newVal, oldVal) {
            // this.$log.log('_onLogoEnable', newVal, oldVal);
        },
        _onLogoImage: function(newVal, oldVal) {
            this.$log.log('_onLogoImage', newVal, oldVal);
            this.$rootScope.$broadcast('uploadimage:completed');
        },

        _onBadgeEnable: function(newVal, oldVal) {
            // this.$log.log('_onBadgeEnable', newVal, oldVal);
        },
        _onBadgeType: function(newVal, oldVal) {
            // this.$log.log('_onBadgeType', newVal, oldVal);
        },

        _onChangePrizeImages: function(newVal, oldVal) {
            this.$log.log('_onChangePrizeImages', newVal, oldVal);
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
