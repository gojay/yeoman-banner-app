define([
	'angular',
	'fabricAngular',
	'fabricCanvas', 
	'fabricConstants', 
	'fabricDirective', 
	'fabricDirtyStatus',
	'fabricUtilities',
	'fabricWindow'
], function (angular) {
  'use strict';

  	var app = angular.module('bannerAppApp.controllers.BannerCtrl', [
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
	                	name  : 'background',
	            		width : null,
	            		height: null,
	            		unique: true
	        		}
	        	},
	        	prizes: {
		        	one: {
		        		data: {
		                	name  : 'prize-1',
		            		width : null,
		            		height: null,
		            		unique: true
		        		}
		        	},
		        	two: {
		        		data: {
		                	name  : 'prize-2',
		            		width : null,
		            		height: null,
		            		unique: true
		        		}
		        	},
		        	three: {
		        		data: {
		                	name  : 'prize-3',
		            		width : null,
		            		height: null,
		            		unique: true
		        		}
		        	}
	        	}
            }
  		},
  		init: function() {
  			var self = this;

  			this.$.templates = this.data.templates;
			this.$.banner = new this.Banner();

			angular.extend(this.$.banner, this.BannerData.data);
			this.$log.log('scope', this.$);

			$('a[data-toggle="tab"]')
	      		.click(function (e) {
				    e.preventDefault();
				    $(this).tab('show');
				  	self.$.banner.selected = prize;
				}).on('shown.bs.tab', function (e) {
					var prize = $(e.target).data('prize');
				  	self.$.title = e.target.text;
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

		    '{object}banner.prizes.images' 	: '_onChangePrizeImages'
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

		generate: function() {
			this.$.banner.$save(function(response) {
				this.$log.debug('[SAVE]', response);
			});
		},

  		_onBackgroundOverlay: function(oldVal, newVal) {
  			this.$log.log('_onBackgroundOverlay', oldVal, newVal);
  		},
  		_onBackgroundType: function(oldVal, newVal) {
  			this.$log.log('_onBackgroundType', oldVal, newVal);
  		},
  		_onBackgroundImage: function(oldVal, newVal) {
  			this.$log.log('_onBackgroundImage', oldVal, newVal);
  		},

  		_onFacebookSelected: function(oldVal, newVal) {
  			this.$log.log('_onFacebookSelected', oldVal, newVal);
  		},
  		_onFacebookSize: function(oldVal, newVal) {
  			this.$log.log('_onFacebookSize', oldVal, newVal);
  		},

  		_onLogoHidden: function(oldVal, newVal) {
  			this.$log.log('_onLogoHidden', oldVal, newVal);
  		},

  		_onBadgeHidden: function(oldVal, newVal) {
  			this.$log.log('_onBadgeHidden', oldVal, newVal);
  		},
  		_onBadgeSelected: function(oldVal, newVal) {
  			this.$log.log('_onBadgeSelected', oldVal, newVal);
  		},

  		_onChangePrizeImages: function(oldVal, newVal) {
  			this.$log.log('_onChangePrizeImages', oldVal, newVal);
  		}
  	});

});
