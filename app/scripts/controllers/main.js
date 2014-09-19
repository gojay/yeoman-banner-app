define(['angular'], function(angular) {
    'use strict';

    angular.module('bannerAppApp.controllers.MainCtrl', [])
        .controller('MainCtrl', function($scope, $modal) {
            // $scope.$navigate = $navigate;
            $scope.menus = {
                'Facebook': [{
                    title: 'Banner Creator',
                    link: 'facebook/banner'
                }, {
                    title: 'Conversation Templates',
                    link: 'facebook/conversation'
                }, {
                    title: 'Custom Conversation Templates',
                    link: 'http://secure.conversion-hub.com/apps/chm/banner-creator/backup/#/feed'
                }, {
                    title: 'Icons for Facebook Tabs',
                    modal: true
                }],

                'Poster': [{
                    title: 'Mobile',
                    link: 'splash/mobile'
                }, { 
                    title: 'Facebook',
                    link: 'splash/facebook'
                }, {
                    title: 'Custom',
                    link: 'splash/custom'
                }],

                'SVG & Modules': [{
                    title: 'RaphaelJS',
                    link: 'svg/raphael'
                }, {
                    title: 'FabricJS',
                    link: 'svg/fabric'
                }, {
                    title: 'FabricJS 2',
                    link: 'svg/fabric2'
                }, {
                    title: 'ng-file-upload',
                    link: 'module/ng-file-upload'
                }, {
                    title: 'PUSHER',
                    link: 'pusher'
                }]
            };

            var icons = [
                'about-tab.jpg',
                'contact-tab.jpg',
                'location-tab.jpg',
                'listing-tab.jpg',
                'contest-tab.jpg',
                'testimonial-tab.jpg',
                'product-tab.jpg',
                'promotion-tab.jpg',
                'event-icon.png',
                'member-icon.png',
                'about-icon.png',
                'contact-icon.png',
                'location-icon.png',
                'listing-icon.png',
                'testimonial-icon.png',
                'product-icon.png',
                'promotion-icon.png',
                'directory-icon.png',
                'instagram-icon.png',
            ];

            $scope.open = function(size) {

                var modalInstance = $modal.open({
                    templateUrl: 'modalIcons.html',
                    controller: function($scope, $modalInstance, icons) {
                        $scope.icons = icons;

                        /*
			  $scope.selected = {
			    item: $scope.items[0]
			  };

			  $scope.ok = function () {
			    $modalInstance.close($scope.selected.item);
			  };
			*/

                        $scope.close = function() {
                            $modalInstance.dismiss('cancel');
                        };
                    },
                    size: size,
                    resolve: {
                        icons: function() {
                            return icons;
                        }
                    }
                });

                // modalInstance.result.then(function (selectedItem) {
                //   $scope.selected = selectedItem;
                // }, function () {
                //   $log.info('Modal dismissed at: ' + new Date());
                // });
            };

        });
});