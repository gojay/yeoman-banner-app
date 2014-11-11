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
            }
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

            this.$log.debug('this', this);
        },
        watch: {
            'fullEditor': '_onFullEditor',

            'banner.config.background.overlay': '_onBackgroundOverlay',
            'banner.config.background.type': '_onBackgroundType',
            'banner.images.background': '_onBackgroundImage',

            'banner.config.facebook.type': '_onFacebookType',

            'banner.config.logo.enable': '_onLogoEnable',
            'banner.images.logo': '_onLogoImage',

            'banner.config.badge.enable': '_onBadgeEnable',
            'banner.config.badge.type': '_onBadgeType',

            '{object}banner.text.prize.header': '_onChangePrizeHeader',
            '{object}banner.text.prize.content': '_onChangePrizeContent',
            '{object}banner.images.prize': '_onChangePrizeImages',

        },
        _watchAsync: function($scope) {
            this.$log.log("$evalAsync", $scope);

            $scope.$watch('fabric.canvasScale', function(length) {
                $scope.fabric.setZoom();
            });
            $scope.$watch('fabric.controls.angle', function(value) {
                $scope.fabric.angleControl();
            });
            $scope.$watch('fabric.controls.left', function(value) {
                $scope.fabric.leftControl();
            });
            $scope.$watch('fabric.controls.top', function(value) {
                $scope.fabric.topControl();
            });
            $scope.$watch('fabric.controls.scale', function(value) {
                $scope.fabric.scaleControl();
            });

            $scope.$watch('fabric.selectedObject.placeholder', function(newVal) {
                $scope.fabric.render();
            });
            $scope.$watch('fabric.selectedObject.H_PADDING', function(newVal, oldVal) {
                if (!oldVal) return;
                $scope.fabric.selectedObject.left += newVal - oldVal;
                $scope.fabric.render();
            });
            $scope.$watch('fabric.selectedObject.V_PADDING', function(newVal, oldVal) {
                if (!oldVal) return;
                $scope.fabric.selectedObject.top += newVal - oldVal;
                $scope.fabric.render();
            });
            $scope.$watch('fabric.selectedObject.shadow', function(newVal) {
                var obj = $scope.fabric.selectedObject;
                if (!obj) return;

                if (!newVal) {
                    obj.shadow = null;
                } else {
                    obj.setShadow({
                        color: 'rgba(0,0,0,0.3)',
                        blur: 10,
                        offsetX: 10,
                        offsetY: 10
                    });
                }
                $scope.fabric.render();
            });

            $scope.$watch('banner.config.prize.type', this._onPrizeType);

            $scope.$watchCollection('banner.text.contest', this._onChangeTextContest);
            $scope.$watch('banner.text.prize.header.content', this._onChangeTextPrizeHeader);
        },
        _onCanvasCreated: function() {
            var self = this;

            this.$log.info('initialize canvas:created');

            this.$.fabric = new this.Fabric({
                JSONExportProperties: this.FabricConstants.JSONExportProperties,
                textDefaults: this.FabricConstants.textDefaults,
                shapeDefaults: this.FabricConstants.shapeDefaults,
                CustomAttributes: this.FabricConstants.CustomAttributes,
                onChangeCanvasSize: this._onChangeCanvasSize,
                canvasOriginalWidth: 810,
                canvasOriginalHeight: 380,
                canvasScale: 0.8
            });
/*
            this.Keypress.onControls({
                up: function() {
                    if (self.$.fabric.selectedObject) {
                        self.$.fabric.controls.top -= 1;
                        self.$.$apply();
                        self.$log.debug('up', self.$.fabric.controls.top);
                    }
                },
                down: function() {
                    if (self.$.fabric.selectedObject) {
                        self.$.fabric.controls.top += 1;
                        self.$.$apply();
                        self.$log.debug('down', self.$.fabric.controls.top);
                    }
                },
                left: function() {
                    if (self.$.fabric.selectedObject) {
                        self.$.fabric.controls.left -= 1;
                        self.$.$apply();
                        self.$log.debug('left', self.$.fabric.controls.left);
                    }
                },
                right: function() {
                    if (self.$.fabric.selectedObject) {
                        self.$.fabric.controls.left += 1;
                        self.$.$apply();
                        self.$log.debug('right', self.$.fabric.controls.left);
                    }
                }
            });
*/
            var fabric = this.$.fabric;
            fabric.setbackgroundImage('images/810x380.jpeg');
            fabric.addImagePolaroid('http://placehold.it/122x80', {
                top: 10,
                left: 10,
                name: 'logo-polaroid'
            });
            fabric.addImagePolaroid('http://placehold.it/340x163', {
                name: 'prize-polaroid',
                top: 185,
                left: 440
            });
            fabric.addImage('images/facebook/fb-like1.png', {
                name: 'facebook-logo',
                top: 10,
                left: 593
            });
            /*
            fabric.addRect({
                name: 'contest-placeholder',
                top: 138,
                left: 10,
                width: 404,
                height: 232,
                fill: 'rgba(0,0,0,0.75)'
            });
            fabric.addText('Company Name\nCompany Contest\nContest', {
                name: 'contest-title',
                top: 150,
                left: 30,
                fill: '#fff',
                fontSize: 27,
                fontFamily: 'Rockwell',
                fontWeight: 'normal',
                strokeWidth: 0,
                textAlign: 'left',
            });
            fabric.addText('Lorem ipsum dolor sit amet, consectetur adipisicing elit.\nSit, fugit hic tempora dolorem non sunt incidunt velit quam\ndistinctio cum', {
                name: 'contest-description',
                top: 278,
                left: 30,
                fill: '#fff',
                fontSize: 13,
                fontFamily: 'Rockwell',
                fontWeight: 'normal',
                lineHeight: 1.5,
                strokeWidth: 0,
                textAlign: 'left',
            });
			*/
            fabric.addGroups('contest-group', this.BannerData.attributes.contest.group);

            fabric.addRect({
                name: 'prize-header-placeholder',
                top : 138,
                left: 504,
                width: 232,
                height: 38,
                fill: 'rgba(0,0,0,0.75)'
            });
            fabric.addTextBox('This Month\'s Prizes\nLike our page to win!', {
                name: 'prize-header-content',
                top: 145,
                left: 504,
                width: 232,
                height: 38,
                fill: '#fff',
                fontSize: 18,
                lineHeight: 0.8,
                fontFamily: 'Rockwell',
                strokeWidth: 0,
                textAlign: 'center',
                minWidth: 1,
                styles: {
                    "1": {
                        "0": {
                            "fontSize": 12
                        },
                        "1": {
                            "fontSize": 12
                        },
                        "2": {
                            "fontSize": 12
                        },
                        "3": {
                            "fontSize": 12
                        },
                        "4": {
                            "fontSize": 12
                        },
                        "5": {
                            "fontSize": 12
                        },
                        "6": {
                            "fontSize": 12
                        },
                        "7": {
                            "fontSize": 12
                        },
                        "8": {
                            "fontSize": 12
                        },
                        "9": {
                            "fontSize": 12
                        },
                        "10": {
                            "fontSize": 12
                        },
                        "11": {
                            "fontSize": 12
                        },
                        "12": {
                            "fontSize": 12
                        },
                        "13": {
                            "fontSize": 12
                        },
                        "14": {
                            "fontSize": 12
                        },
                        "15": {
                            "fontSize": 12
                        },
                        "16": {
                            "fontSize": 12
                        },
                        "17": {
                            "fontSize": 12
                        },
                        "18": {
                            "fontSize": 12
                        },
                        "19": {
                            "fontSize": 12
                        },
                        "20": {
                            "fontSize": 12
                        }
                    }
                }
            });

            fabric.addRect({
                name: 'prize-description-placeholder-1',
                top: 308,
                left: 450,
                width: 340,
                height: 50,
                fill: 'rgba(0,0,0,0.75)'
            });
            fabric.addTextBox('Enter description prize 1', {
                name: 'prize-description-1',
                top: 320,
                left: 450,
                width: 340,
                height: 50,
                fill: '#fff',
                fontSize: 13,
                fontFamily: 'Rockwell',
                textAlign: 'center'
            });

            var objects = fabric.getObjects();
            this.$log.debug('objects', objects);

            // Watchers
            // Executes the expression on the current scope at a later point in time.
            // ================================================================
            this.$.$evalAsync(this._watchAsync);
        },

        getObjectTitle: function(type) {
            return _.titleize(this.$.fabric.selectedObject[type]);
        },

        getFill: function() {
            return this.$.fabric.getActiveStyle('fill');
        },
        setFill: function(value) {
            this.$.fabric.setActiveStyle('fill', value);
        },

        getFontSize: function() {
            return this.$.fabric.getActiveStyle('fontSize');
        },
        setFontSize: function(value) {
            this.$.fabric.setActiveStyle('fontSize', parseInt(value, 10));
        },

        setBgOverlay: function(overlay) {
            this.$.banner.config.background.overlay = overlay;
        },
        setBgType: function(type) {
            this.$.banner.config.background.type = type;
        },
        setFbType: function(type) {
            this.$.banner.config.facebook.type = type;
        },
        setLogoEnable: function(enable) {
            this.$.banner.config.logo.enable = enable;
        },
        setBadgeEnable: function(enable) {
            this.$.banner.config.badge.enable = enable;
        },
        setBadgeType: function(type) {
            this.$.banner.config.badge.type = type;
        },

        setPrizeFigure: function(figure) {
            this.$.banner.config.prize.figure = figure;
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

        _onFullEditor: function(newVal, oldVal) {
            var fabric = this.$.fabric;
            if (_.isEmpty(fabric)) return;

            fabric.canvasScale = newVal ? 1.2 : 0.8;
            fabric.setZoom();
        },

        _onBackgroundOverlay: function(newVal, oldVal) {
            this.$log.log('_onBackgroundOverlay', newVal, oldVal);
            if( newVal == oldVal ) return;

            var dimension = this.$.dimensions[this.$.banner.config.background.type].background;
            this.$log.log('dimension', dimension);

            var fabric = this.$.fabric;
            var intialScale = fabric.canvasScale;
            var canvasOriginalHeight = fabric.canvasOriginalHeight;
            var contestObject = fabric.getObjectByName('contest-group');
            var pHeaderRectObject = fabric.getObjectByName('prize-header-placeholder');
            var pHeaderContentObject = fabric.getObjectByName('prize-header-content');
            var pImageObject = fabric.getObjectByName('prize-polaroid');
            var pImageDescRectObject = fabric.getObjectByName('prize-description-placeholder-1');
            var pImageDescContentObject = fabric.getObjectByName('prize-description-1');
            var canvasHeight, contestTop, pHeaderTop, pImageTop, pImageRectTop, pImageDescTop;

            // reset scale
            fabric.resetZoom();

            // overlay
            if( newVal ) {
            	canvasHeight = dimension.height;
            	contestTop = 138;
            	pHeaderTop = 145;
            	pImageTop  = 195;
            	pImageRectTop = 308;
            	pImageDescTop = 320;
	            contestObject.item(0).visible = true;
	            contestObject.item(1).fill = '#fff';
	            contestObject.item(2).fill = '#fff';
	            pHeaderRectObject.visible = true;
	            pHeaderRectObject.visible = true;
	            pHeaderContentObject.fill = '#fff';
            // non overlay
            } else {
	            // canvasOriginalHeight + contestObject.height + padding top + padding bottom
	            // example: 380+232+10+10 = 632
	            canvasHeight = canvasOriginalHeight + contestObject.height + 20;
            	contestTop = canvasOriginalHeight + 10;
            	pHeaderTop = canvasOriginalHeight + 20;
            	pImageTop     = contestTop + 57;
            	pImageRectTop = pImageTop + 113;
            	pImageDescTop = pImageRectTop + 12;
	            contestObject.item(0).visible = false;
	            contestObject.item(1).fill = 'rgb(51, 51, 51)';
	            contestObject.item(2).fill = 'rgb(51, 51, 51)';
	            pHeaderRectObject.visible = false;
	            pHeaderContentObject.fill = 'rgb(51, 51, 51)';
            }
            // set top contestgroup
            contestObject.originalTop = contestTop;
            pHeaderContentObject.originalTop = pHeaderTop;
            pImageObject.originalTop = pImageTop;
            pImageDescRectObject.originalTop = pImageRectTop;
            pImageDescContentObject.originalTop = pImageDescTop;
            // set canvas height
            fabric.canvasOriginalHeight = canvasHeight;
            // set previous scale
            fabric.canvasScale = intialScale;
            fabric.setZoom();
        },
        _onBackgroundType: function(newVal, oldVal) {
            this.$log.log('_onBackgroundType', newVal, oldVal);
        },
        _onBackgroundImage: function(newVal, oldVal) {
            this.$log.log('_onBackgroundImage', newVal, oldVal);
            this.$rootScope.$broadcast('uploadimage:completed');
        },

        _onFacebookType: function(newVal, oldVal) {
            this.$log.log('_onFacebookType', newVal, oldVal);
        },
        _onFacebookSize: function(newVal, oldVal) {
            this.$log.log('_onFacebookSize', newVal, oldVal);
        },

        _onLogoEnable: function(newVal, oldVal) {
            this.$log.log('_onLogoEnable', newVal, oldVal);
        },
        _onLogoImage: function(newVal, oldVal) {
            this.$log.log('_onLogoImage', newVal, oldVal);
            this.$rootScope.$broadcast('uploadimage:completed');
        },

        _onBadgeEnable: function(newVal, oldVal) {
            this.$log.log('_onBadgeEnable', newVal, oldVal);
        },
        _onBadgeType: function(newVal, oldVal) {
            this.$log.log('_onBadgeType', newVal, oldVal);
        },

        _onPrizeType: function(newVal, oldVal) {
            this.$log.log('_onPrizeType', newVal, oldVal);

            var dimensions = this.$.dimensions[newVal],
                background = dimensions.background;
            _.extend(this.$.uploadOptions.background.data, background);
            _.extend(this.$.uploadOptions.logo.data, dimensions.logo.image);

            if (dimensions.prize) {
                _.map(this.$.uploadOptions.prize, function(item) {
                    item = _.extend(item.data, dimensions.prize);
                    return item;
                });
            }

            this.$log.debug(this.$.uploadOptions);

            var fabric = this.$.fabric;
            if (fabric && fabric.canvasOriginalWidth != background.width && fabric.canvasOriginalHeight != background.height) {
                this.$log.info('change canvas size...');
                this.$.fabric.setCanvasSize(background.width, background.height);
            }

        },
        _onChangePrizeHeader: function(newVal, oldVal) {
            this.$log.log('_onChangePrizeHeader', newVal, oldVal);
        },
        _onChangePrizeContent: function(newVal, oldVal) {
            this.$log.log('_onChangePrizeContent', newVal, oldVal);
        },
        _onChangePrizeImages: function(newVal, oldVal) {
            this.$log.log('_onChangePrizeImages', newVal, oldVal);
            this.$rootScope.$broadcast('uploadimage:completed');
        },

        _onChangeTextContest: function(newVal, oldVal) {
            this.$log.log('_onChangeTextContest', newVal, oldVal);

            var fabric = this.$.fabric;
            var constestObj = fabric.getObjectByName('contest-group');

            constestObj.item(1).text = newVal.title;
            constestObj.item(2).text = newVal.description;

            fabric.render();
        },
        _onChangeTextPrizeHeader: function(newVal, oldVal) {
        },

        _onChangeCanvasSize: function(_fabric) {
            this.$log.log('_onChangeCanvasSize', _fabric);
        }
    });

});
