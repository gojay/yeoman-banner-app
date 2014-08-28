angular.module('common.fabric.constants', [])

.service('FabricConstants', [function() {

	var objectDefaults = {
		rotatingPointOffset: 20,
		padding: 0,
		borderColor: 'EEF6FC',
		cornerColor: 'rgba(64, 159, 221, 1)',
		cornerSize: 10,
		transparentCorners: false,
		hasRotatingPoint: true,
		centerTransform: true,
		hasControls: false
	};

	return {

		presetSizes: [
			{
				name: 'Portrait (8.5 x 11)',
				height: 1947,
				width: 1510
			},
			{
				name: 'Landscape (11 x 8.5)',
				width: 1947,
				height: 1510
			},
			{
				name: 'Business Card (3.5 x 2)',
				height: 368,
				width: 630
			},
			{
				name: 'Postcard (6 x 4)',
				height: 718,
				width: 1068
			},
			{
				name: 'Content/Builder Product Thumbnail',
				height: 400,
				width: 760
			},
			{
				name: 'Badge',
				height: 400,
				width: 400
			},
			{
				name: 'Facebook Profile Picture',
				height: 300,
				width: 300
			},
			{
				name: 'Facebook Cover Picture',
				height: 315,
				width: 851
			},
			{
				name: 'Facebook Photo Post (Landscape)',
				height: 504,
				width: 403
			},
			{
				name: 'Facebook Photo Post (Horizontal)',
				height: 1008,
				width: 806
			},
			{
				name: 'Facebook Full-Width Photo Post',
				height: 504,
				width: 843
			},
			{
				name: 'A4 - 200 PPI (1654x2339)',
				type  : 'a4',
				ppi   : 200,
				height: 2339,
				width: 1654
			},
			{
				name: 'A4 - 300 PPI (2480x3508)',
				type  : 'a4',
				ppi   : 300,
				height: 3508,
				width : 2480
			}
		],

		fonts: [
			{ name: 'Arial' },
			{ name: 'Myriad Pro' },
			{ name: 'Croissant One' },
			{ name: 'Architects Daughter' },
			{ name: 'Emblema One' },
			{ name: 'Graduate' },
			{ name: 'Hammersmith One' },
			{ name: 'Oswald' },
			{ name: 'Oxygen' },
			{ name: 'Krona One' },
			{ name: 'Indie Flower' },
			{ name: 'Courgette' },
			{ name: 'Gruppo' },
			{ name: 'Ranchers' }
		],

		shapeCategories: [
			{
				name: 'Popular Shapes',
				shapes: [
					'arrow6',
					'bubble4',
					'circle1',
					'rectangle1',
					'star1',
					'triangle1'
				]
			},
			{
				name: 'Simple Shapes',
				shapes: [
					'circle1',
					'heart1',
					'rectangle1',
					'triangle1',
					'star1',
					'star2',
					'star3',
					'square1'
				]
			},
			{
				name: 'Arrows & Pointers',
				shapes: [
					'arrow1',
					'arrow9',
					'arrow3',
					'arrow6',
				]
			},
			{
				name: 'Bubbles & Balloons',
				shapes: [
					'bubble5',
					'bubble4'
				]
			},
			{
				name: 'Check Marks',
				shapes: [

				]
			},
			{
				name: 'Badges',
				shapes: [
					'badge1',
					'badge2',
					'badge4',
					'badge5',
					'badge6'
				]
			}
		],

		JSONExportProperties: [
			'height',
			'width',
			'background',
			'objects',

			'originalHeight',
			'originalWidth',
			'originalScaleX',
			'originalScaleY',
			'originalLeft',
			'originalTop',

			'lineHeight',
			'lockMovementX',
			'lockMovementY',
			'lockScalingX',
			'lockScalingY',
			'lockUniScaling',
			'lockRotation',
			'lockObject',
			'id',
			'isTinted',
			'filters'
		],

		shapeDefaults: angular.extend({
			fill: '#0088cc'
		}, objectDefaults),

		textDefaults: angular.extend({
			originX: 'left',
			scaleX: 1,
			scaleY: 1,
			fontFamily: 'Georgia',
			fontSize: 40,
			fill: '#434343',
			textAlign: 'left',
			strokeWidth: 1,
			stroke: '#454545',
			keepCenterH: true
		}, objectDefaults),

		CustomAttributes: {
			'a4': {
				200 : {
					'ss': {
						width: 640, // 644
						height: 1136,
						left: 324,
						top : 842
					},
					'qr': {
						'iphone': {
							width: 280,
							height: 280,
							top : 1836, // 1836
							left: 1306 // 1306
						},
						'android': {
							width: 280,
							height: 280,
							top : 1836, // 1836
							left: 1906 // 1906
						}
					},
					'people': {
						left: {
							width : 380, // 380 
							height: 380, // 380
							top : 2506, // 2506
							left: 176 // 176 52
						},
						right: {
							width : 380, // 380
							height: 380, // 380
							top : 2506, // 2506 751
							left: 1316 // 1316 394
						}
					}
				},
				// ss
				//---------------
				// w: 644 842
				// h: 1138
				// left: 97 324
				// top: 254 842
				//---------------
				// 300 : [{
				// 	width: 90,
				// 	height: 90,
				// 	left: 234,
				// 	top: 754
				// }, {
				// 	width: 90,
				// 	height: 90,
				// 	top: 551,
				// 	left: 572
				// }] 

				300: {
					'text':{
						app : {
							size: 195, // 65 * 3
							left: 964, // 314 * 3
							top: 360 // 120 * 3
						}
					},
					'ss': {
						width: 640, // 644
						height: 1136,
						left: 324,
						top : 842
					},
					'qr': {
						'iphone': {
							width: 280,
							height: 280,
							top : 1836, // 1836
							left: 1306 // 1306
						},
						'android': {
							width: 280,
							height: 280,
							top : 1836, // 1836
							left: 1906 // 1906
						}
					},
					'people': {
						left: {
							width : 380, // 380 
							height: 380, // 380
							top : 2506, // 2506
							left: 176 // 176 52
						},
						right: {
							width : 380, // 380
							height: 380, // 380
							top : 2506, // 2506 751
							left: 1316 // 1316 394
						}
					}
				}
			}
		}

	};

}]);
