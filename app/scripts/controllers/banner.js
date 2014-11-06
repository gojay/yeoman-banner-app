define([
	'angular',
	'lodash',
	'angular-elastic',
	'fabricAngular',
	'fabricCanvas', 
	'fabricConstants', 
	'fabricDirective', 
	'fabricDirtyStatus',
	'fabricUtilities',
	'fabricWindow',
], function (angular, _) {
  'use strict';

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
  			'$scope', 
  			'$log', 
  			'BannerData', 
  			'Banner', 
  			'data'
  		],
  		initScope: {
  			title		: 'Template Empty Prize',
  			showEditor	: false,
  			animation	: {
				templates: 'bouncy-slide-right',
				settings : 'bouncy-slide-left'
			},
			accordion	: {
				closeOthers: true,
				isFirstOpen: true
			},
	        uploadOptions: {
	        	background: {
	        		data: {
	        			id: 'test',
	                	name  : 'background',
	            		width : null,
	            		height: null
	        		}
	        	},
	        	prize: {
		        	1: {
		        		data: {
	        				id: 'test',
		                	name  : 'prize-1',
		            		width : null,
		            		height: null
		        		}
		        	},
		        	2: {
		        		data: {
	        				id: 'test',
		                	name  : 'prize-2',
		            		width : null,
		            		height: null
		        		}
		        	},
		        	3: {
		        		data: {
	        				id: 'test',
		                	name  : 'prize-3',
		            		width : null,
		            		height: null
		        		}
		        	}
	        	}
            }
  		},
  		init: function() {
  			var self = this;

  			this.$.templates  = this.data.templates;
  			this.$.dimensions = this.BannerData.dimensions;
			this.$.banner = new this.Banner();

			angular.extend(this.$.banner, this.BannerData.data);
			this.$log.log('scope', this.$);

			$('a[data-toggle="tab"]')
	      		.click(function (e) {
				    e.preventDefault();
				    $(this).tab('show');
				}).on('shown.bs.tab', function (e) {
					var prize = $(e.target).data('prize');
				  	self.$.title = e.target.text;
				  	self.$.banner.prize.selected = prize;
				  	self.$.$apply();
				});
  		},
  		watch: {
  			'banner.background.overlay'		: '_onBackgroundType',
  			'banner.background.type'		: '_onBackgroundOverlay',
  			'banner.background.image'		: '_onBackgroundImage',

  			'banner.fb.selected'    		: '_onFacebookSelected',
  			'banner.fb.dimension.w' 		: '_onFacebookSize',

  			'banner.logo.hide' 				: '_onLogoHidden',

  			'banner.badge.hide' 			: '_onBadgeHidden',
  			'banner.badge.selected' 		: '_onBadgeSelected',

  			'banner.prize.selected' 		: '_onPrizeSelected',
		    '{object}banner.prize.text' 	: '_onChangePrizeText',
		    '{object}banner.prize.images' 	: '_onChangePrizeImages'
  		},

  		setBgOverlay: function(isOverlay) {
  			this.$.banner.background.overlay = isOverlay;
  		},
  		setBgType: function(type) {
			this.$.banner.background.type = type;
  		},
  		setFbLogo: function(index){
			this.$.banner.fb.selected = index;
		},
		setBadgeHide: function(value){
			this.$.banner.badge.hide = value;
		},
		setBadgeSelected: function(index){
			this.$.banner.badge.selected = index;
		},

		doSetting: function() {
			this.$.showEditor = !this.$.showEditor;
		},
		generate: function() {
			this.$.banner.$save(function(response) {
				this.$log.debug('[SAVE]', response);
			});
		},

  		_onBackgroundOverlay: function(newVal, oldVal) {
  			this.$log.log('_onBackgroundOverlay', newVal, oldVal);
  		},
  		_onBackgroundType: function(newVal, oldVal) {
  			this.$log.log('_onBackgroundType', newVal, oldVal);
  		},
  		_onBackgroundImage: function(newVal, oldVal) {
  			this.$log.log('_onBackgroundImage', newVal, oldVal);
  		},

  		_onFacebookSelected: function(newVal, oldVal) {
  			this.$log.log('_onFacebookSelected', newVal, oldVal);
  		},
  		_onFacebookSize: function(newVal, oldVal) {
  			this.$log.log('_onFacebookSize', newVal, oldVal);
  		},

  		_onLogoHidden: function(newVal, oldVal) {
  			this.$log.log('_onLogoHidden', newVal, oldVal);
  		},

  		_onBadgeHidden: function(newVal, oldVal) {
  			this.$log.log('_onBadgeHidden', newVal, oldVal);
  		},
  		_onBadgeSelected: function(newVal, oldVal) {
  			this.$log.log('_onBadgeSelected', newVal, oldVal);
  		},

  		_onPrizeSelected: function(newVal, oldVal) {
  			this.$log.log('_onPrizeSelected', newVal, oldVal);

  			var dimensions = this.$.dimensions['tpl-' + newVal];
  			_.extend(this.$.uploadOptions.background.data, dimensions.background);

  			if( dimensions.prize ) {
				_.map(this.$.uploadOptions.prize, function(item) {
					item = _.extend(item.data, dimensions.prize);
					return item;
				});
  			}

  			this.$log.log(this.$.uploadOptions);
  		},
  		_onChangePrizeText: function(newVal, oldVal) {
  			this.$log.log('_onChangePrizeText', newVal, oldVal);
  		},
  		_onChangePrizeImages: function(newVal, oldVal) {
  			this.$log.log('_onChangePrizeImages', newVal, oldVal);
  		}
  	});

});
