define(['angular'], function (angular) {
  'use strict';

  angular.module('bannerAppApp.controllers.BootstrapCtrl', [])
    .controller('BootstrapCtrl', function ($scope, $modal, $log) {

      /* Accordion */

      $scope.oneAtATime = true;

	  $scope.groups = [
	    {
	      title: 'Dynamic Group Header - 1',
	      content: 'Dynamic Group Body - 1'
	    },
	    {
	      title: 'Dynamic Group Header - 2',
	      content: 'Dynamic Group Body - 2'
	    }
	  ];

	  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

	  $scope.addItem = function() {
	    var newItemNo = $scope.items.length + 1;
	    $scope.items.push('Item ' + newItemNo);
	  };

	  $scope.status = {
	    isFirstOpen: true,
	    isFirstDisabled: false
	  };

	  /* Alert */

	  $scope.alerts = [
	    { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
	    { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
	  ];

	  $scope.addAlert = function() {
	    $scope.alerts.push({msg: 'Another alert!'});
	  };

	  $scope.closeAlert = function(index) {
	    $scope.alerts.splice(index, 1);
	  };

	  /* Buttons */

	  $scope.singleModel = 1;

	  $scope.radioModel = 'Middle';

	  $scope.checkModel = {
	    left: false,
	    middle: true,
	    right: false
	  };

	  /* Carousel */

	  $scope.myInterval = 5000;
	  var slides = $scope.slides = [];
	  $scope.addSlide = function() {
	    var newWidth = 600 + slides.length;
	    slides.push({
	      image: 'http://placekitten.com/' + newWidth + '/300',
	      text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
	        ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
	    });
	  };
	  for (var i=0; i<4; i++) {
	    $scope.addSlide();
	  }

	  /* Collapse */

	  $scope.isCollapsed = false;

	  /* DatePicker */

	  $scope.today = function() {
	    $scope.dt = new Date();
	  };
	  $scope.today();

	  $scope.clear = function () {
	    $scope.dt = null;
	  };

	  // Disable weekend selection
	  $scope.disabled = function(date, mode) {
	    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
	  };

	  $scope.toggleMin = function() {
	    $scope.minDate = $scope.minDate ? null : new Date();
	  };
	  $scope.toggleMin();

	  $scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.opened = true;
	  };

	  $scope.dateOptions = {
	    formatYear: 'yy',
	    startingDay: 1
	  };

	  $scope.initDate = new Date('2016-15-20');
	  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	  $scope.format = $scope.formats[0];

	  /* Dropdown */

	  $scope.items = [
	    'The first choice!',
	    'And another choice for you.',
	    'but wait! A third!'
	  ];

	  $scope.status = {
	    isopen: false
	  };

	  $scope.toggled = function(open) {
	    console.log('Dropdown is now: ', open);
	  };

	  $scope.toggleDropdown = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();
	    $scope.status.isopen = !$scope.status.isopen;
	  };

	  /* Modal */

	  $scope.items = ['item1', 'item2', 'item3'];

	  $scope.open = function (size) {

	    var modalInstance = $modal.open({
	    	backdrop: 'static',
	      	templateUrl: 'myModalContent.html',
	      	controller: function ($scope, $modalInstance, items) {

			  $scope.items = items;
			  $scope.selected = {
			    item: $scope.items[0]
			  };

			  $scope.ok = function () {
			    $modalInstance.close($scope.selected.item);
			  };

			  $scope.cancel = function () {
			    $modalInstance.dismiss('cancel');
			  };
			},
	      	size: size,
	     	 	resolve: {
	        items: function () {
	          	return $scope.items;
	        }
	      }
	    });

	    modalInstance.result.then(function (selectedItem) {
	      $scope.selected = selectedItem;
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };
	  
	  /* Pagination */

	  $scope.totalItems = 64;
	  $scope.currentPage = 4;

	  $scope.setPage = function (pageNo) {
	    $scope.currentPage = pageNo;
	  };

	  $scope.pageChanged = function() {
	    console.log('Page changed to: ' + $scope.currentPage);
	  };

	  $scope.maxSize = 5;
	  $scope.bigTotalItems = 175;
	  $scope.bigCurrentPage = 1;

	  /* Popover */

	  	$scope.dynamicPopover = 'Hello, World!';
  		$scope.dynamicPopoverTitle = 'Title';

    });
});
