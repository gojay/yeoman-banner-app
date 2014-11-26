angular.module('common.fabric', [
        'common.fabric.window',
        'common.fabric.directive',
        'common.fabric.canvas',
        'common.fabric.dirtyStatus'
    ])
    .factory('Fabric', [
        'FabricWindow', '$timeout', '$window', 'FabricCanvas', 'FabricDirtyStatus',
        function(FabricWindow, $timeout, $window, FabricCanvas, FabricDirtyStatus) {
            var canvases = [];

            return function(canvasID, options) {

                var canvas;
                var JSONObject;
                var self = angular.extend({
                    canvasBackgroundColor: '#ffffff',
                    canvasWidth: 300,
                    canvasHeight: 300,
                    canvasOriginalHeight: 300,
                    canvasOriginalWidth: 300,
                    canvasScale: 1,
                    maxContinuousRenderLoops: 25,
                    continuousRenderTimeDelay: 500,
                    editable: true,
                    JSONExportProperties: [],
                    loading: false,
                    dirty: false,
                    initialized: false,
                    userHasClickedCanvas: false,
                    downloadMultipler: 1,
                    imageDefaults: {},
                    textDefaults: {},
                    shapeDefaults: {},
                    windowDefaults: {
                        transparentCorners: false,
                        rotatingPointOffset: 25,
                        padding: 0
                    },
                    canvasDefaults: {
                        selection: false
                    },

                    presetSize: null,
                    maxBounding: {
                        left: 0,
                        top: 0
                    },
                    controls: {
                        angle: 0,
                        left: 0,
                        top: 0,
                        scale: 0
                    }
                }, options);

                function capitalize(string) {
                    if (typeof string !== 'string') {
                        return '';
                    }

                    return string.charAt(0).toUpperCase() + string.slice(1);
                }

                function getActiveStyle(styleName, object) {
                    object = object || canvas.getActiveObject();

                    if (typeof object !== 'object' || object === null) {
                        return '';
                    }

                    return (object.getSelectionStyles && object.isEditing) ? (object.getSelectionStyles()[styleName] || '') : (object[styleName] || '');
                }

                function setActiveStyle(styleName, value, object) {
                    object = object || canvas.getActiveObject();

                    if (object.setSelectionStyles && object.isEditing) {
                        var style = {};
                        style[styleName] = value;
                        object.setSelectionStyles(style);
                    } else {
                        object[styleName] = value;
                    }

                    self.render();
                }

                function getActiveProp(name) {
                    var object = canvas.getActiveObject();
                    return typeof object === 'object' && object !== null ? object[name] : '';
                }

                function setActiveProp(name, value) {
                    var object = canvas.getActiveObject();
                    object.set(name, value);
                    self.render();
                }

                function b64toBlob(b64Data, contentType, sliceSize) {
                    contentType = contentType || '';
                    sliceSize = sliceSize || 512;

                    var byteCharacters = atob(b64Data);
                    var byteArrays = [];

                    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                        var slice = byteCharacters.slice(offset, offset + sliceSize);

                        var byteNumbers = new Array(slice.length);
                        for (var i = 0; i < slice.length; i++) {
                            byteNumbers[i] = slice.charCodeAt(i);
                        }

                        var byteArray = new Uint8Array(byteNumbers);

                        byteArrays.push(byteArray);
                    }

                    var blob = new Blob(byteArrays, {
                        type: contentType
                    });
                    return blob;
                }

                function isHex(str) {
                    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/gi.test(str);
                }

                self.getActiveStyle = getActiveStyle;
                self.setActiveStyle = setActiveStyle;

                //
                // Canvas
                // ==============================================================
                self.renderCount = 0;
                self.render = function() {
                    var objects = canvas.getObjects();
                    for (var i in objects) {
                        objects[i].setCoords();
                    }

                    canvas.calcOffset();
                    canvas.renderAll();
                    self.renderCount++;
                };

                self.setCanvas = function(newCanvas) {
                    canvas = newCanvas;
                    canvas.selection = self.canvasDefaults.selection;
                };

                self.getCanvas = function() {
                    return canvas;
                };

                self.setTextDefaults = function(textDefaults) {
                    self.textDefaults = textDefaults;
                };

                self.setJSONExportProperties = function(JSONExportProperties) {
                    self.JSONExportProperties = JSONExportProperties;
                };

                self.setCanvasBackgroundColor = function(color) {
                    self.canvasBackgroundColor = color;
                    canvas.setBackgroundColor(color);
                    self.render();
                };

                self.setCanvasWidth = function(width) {
                    self.canvasWidth = width;
                    canvas.setWidth(width);
                    self.render();
                };

                self.setCanvasHeight = function(height) {
                    self.canvasHeight = height;
                    canvas.setHeight(height);
                    self.render();
                };

                self.setCanvasSize = function(width, height) {
                    self.stopContinuousRendering();
                    var initialCanvasScale = self.canvasScale;
                    // self.resetZoom();
                    self.setZoom();

                    self.canvasWidth = width;
                    self.canvasOriginalWidth = width;
                    canvas.originalWidth = width;
                    canvas.setWidth(width);

                    self.canvasHeight = height;
                    self.canvasOriginalHeight = height;
                    canvas.originalHeight = height;
                    canvas.setHeight(height);

                    if (self.onChangeCanvasSize) self.onChangeCanvasSize(self);

                    self.render();
                    self.setZoom();
                };

                self.deactivateAll = function() {
                    canvas.deactivateAll();
                    self.deselectActiveObject();
                    self.render();
                };

                self.clearCanvas = function() {
                    canvas.clear();
                    canvas.setBackgroundColor('#ffffff');
                    self.render();
                };

                //
                // Canvas Zoom
                // ==============================================================
                self.resetZoom = function() {
                    self.canvasScale = 1;
                    self.setZoom();
                };

                self.setZoom = function(scale) {
                    if(scale) self.canvasScale = scale;
                    var objects = canvas.getObjects();
                    for (var i in objects) {
                        objects[i].originalScaleX = objects[i].originalScaleX ? objects[i].originalScaleX : objects[i].scaleX;
                        objects[i].originalScaleY = objects[i].originalScaleY ? objects[i].originalScaleY : objects[i].scaleY;
                        objects[i].originalLeft = objects[i].originalLeft ? objects[i].originalLeft : objects[i].left;
                        objects[i].originalTop = objects[i].originalTop ? objects[i].originalTop : objects[i].top;
                        self.setObjectZoom(objects[i]);
                    }

                    self.setCanvasZoom();
                    self.render();
                };

                self.setObjectZoom = function(object) {
                    var scaleX = object.originalScaleX;
                    var scaleY = object.originalScaleY;
                    var left = object.originalLeft;
                    var top = object.originalTop;

                    var tempScaleX = scaleX * self.canvasScale;
                    var tempScaleY = scaleY * self.canvasScale;
                    var tempLeft = left * self.canvasScale;
                    var tempTop = top * self.canvasScale;

                    object.scaleX = tempScaleX;
                    object.scaleY = tempScaleY;
                    object.left = tempLeft;
                    object.top = tempTop;

                    object.setCoords();
                };

                self.setCanvasZoom = function() {
                    var width = self.canvasOriginalWidth;
                    var height = self.canvasOriginalHeight;

                    var tempWidth = width * self.canvasScale;
                    var tempHeight = height * self.canvasScale;

                    canvas.setWidth(tempWidth);
                    canvas.setHeight(tempHeight);

                    if (canvas.backgroundImage) {
                        canvas.backgroundImage.set({
                            scaleX: self.canvasScale,
                            scaleY: self.canvasScale
                        });
                    }
                    if (canvas.overlayImage) {
                        canvas.overlayImage.set({
                            scaleX: self.canvasScale,
                            scaleY: self.canvasScale
                        });
                    }
                    self.updateControls();
                };

                self.updateActiveObjectOriginals = function() {
                    var object = canvas.getActiveObject();
                    if (object) {
                        object.originalScaleX = object.scaleX / self.canvasScale;
                        object.originalScaleY = object.scaleY / self.canvasScale;
                        object.originalLeft = object.left / self.canvasScale;
                        object.originalTop = object.top / self.canvasScale;
                    }
                };

                //
                // Creating Objects
                // ==============================================================
                self.addObjectToCanvas = function(object, notCenter) {
                    object.originalScaleX = object.scaleX;
                    object.originalScaleY = object.scaleY;
                    object.originalLeft = object.left;
                    object.originalTop = object.top;

                    self.setObjectZoom(object);

                    canvas.add(object);
                    canvas.setActiveObject(object);
                    object.bringToFront();

                    if (notCenter === null || !notCenter) self.center();

                    self.render();
                };

                self.getObjects = function() {
                    return canvas.getObjects();
                };
                self.setActiveObject = function(object) {
                    canvas.setActiveObject(object);
                };
                self.setActiveObjectByName = function(name) {
                    self.deactivateAll();

                    var object = self.getObjectByName(name);
                    if (!object) return;

                    self.setActiveObject(object);
                };
                self.getTextObjectByName = function(name) {
                    var object = self.getObjectByName(name);
                    if (!object) return;
                    return object.text;
                };

                // Get Object By Name
                self.getObjectByName = function(name, items) {
                    var object = null,
                        objects = items ? items.getObjects() : canvas.getObjects();

                    for (var i = 0, len = items ? items.size() : canvas.size(); i < len; i++) {
                        if (objects[i].name && objects[i].name === name) {
                            object = objects[i];
                            break;
                        }
                    }
                    return object;
                };

                self.getSize = function() {
                    return self.presetSize;
                };

                self.buildObjects = function (options) {
                    angular.forEach(options, function(data, key){
                        switch(data.type) {
                            case 'background':
                                var options = data.options ? data.options : {} ;
                                canvas.setBackgroundImage(data.image, null, options);
                                break;
                            case 'overlay':
                                var options = data.options ? data.options : {} ;
                                canvas.setOverlayImage(data.image, canvas.renderAll.bind(canvas), options);
                                break;
                            case 'text':
                                var options = angular.extend(self.textDefaults, data.options);
                                var text = new fabric.Text(data.text, options);
                                canvas.add(text);
                                break;
                            case 'itext':
                                var options = angular.extend(self.textDefaults, data.options);
                                var itext = new fabric.IText(data.text, options);
                                canvas.add(itext);
                                break;
                            case 'textbox':
                                var textBox = new fabric.Textbox(data.text, data.options);
                                canvas.add(textBox);
                                break;
                            case 'rect':
                                var rect = new fabric.Rect(data.options);
                                canvas.add(rect);
                                break;
                            case 'image':
                                var options = angular.extend({
                                    crossOrigin: 'anonymous'
                                }, data.options);
                                
                                fabric.Image.fromURL(data.image, function(object) {
                                    canvas.add(object);
                                }, options);
                                break;
                            case 'polaroid':
                                var options = angular.extend({
                                    crossOrigin: 'anonymous'
                                }, data.options);
                                
                                fabric.PolaroidPhoto.fromURL(data.image, function(object) {
                                    canvas.add(object);
                                }, options);

                                // fabric.util.loadImage(data.image, function(img) {
                                //     var object = new fabric.PolaroidPhoto(img, data.options);
                                //     canvas.add(object);
                                // }, null, {crossOrigin: 'Anonymous'});
                                break;
                            case 'group':
                                var objects = [];
                                angular.forEach(data.objects, function(_data, key){
                                    switch(_data.type) {
                                        case 'text':
                                            var textDefaults = angular.extend(self.textDefaults, _data.options);
                                            var text = new fabric.Text(_data.text, textDefaults);
                                            objects.push(text);
                                            break;
                                        case 'itext':
                                            var options = angular.extend(self.textDefaults, _data.options);
                                            var itext = new fabric.IText(_data.text, options);
                                            objects.push(itext);
                                            break;
                                        case 'textbox':
                                            var textBox = new fabric.Textbox(_data.text, _data.options);
                                            objects.push(textBox);
                                            break;
                                        case 'rect':
                                            var rect = new fabric.Rect(_data.options);
                                            objects.push(rect);
                                            break;
                                    }
                                });
                                var group = new fabric.Group(objects, { name: data.name });
                                canvas.add(group);
                                break;
                        }
                    });
                    
                    self.setZoom();
                }

                //
                // Image
                // ==============================================================
                self.addImage = function(imageURL, options) {
                    var options = angular.extend({
                        id: self.createId(),
                        crossOrigin: 'anonymous'
                    }, options);
                    var image = fabric.Image.fromURL(imageURL, function(object) {
                        self.addObjectToCanvas(object);
                    }, options);
                };

                self.addImageCircle = function(imageURL, options) {
                    var options = angular.extend({
                        id: self.createId(),
                        crossOrigin: 'anonymous'
                    }, options);
                    fabric.ImageCircle.fromURL(imageURL, function(object) {
                        self.addObjectToCanvas(object, true);
                    }, options);
                };

                self.addImagePolaroid = function(imageURL, options) {
                    angular.extend({
                        id: self.createId()
                    }, options);
                    var polaroid = new fabric.PolaroidPhoto(imageURL, options);
                    self.addObjectToCanvas(polaroid, true);
                };

                self.setImageObject = function (objectName, imageURL) {
                    var object = self.getObjectByName(objectName);
                    if ( !object ) return;

                    object.getElement().setAttribute('src', imageURL);
                    canvas.calcOffset();
                    canvas.renderAll();
                };

                //
                // Shape
                // ==============================================================
                self.addShape = function(svgURL) {
                    fabric.loadSVGFromURL(svgURL, function(objects, options) {
                        // var object = fabric.util.groupSVGElements(objects, self.shapeDefaults);
                        var object = fabric.util.groupSVGElements(objects, options);
                        object.id = self.createId();

                        for (var p in self.shapeDefaults) {
                            object[p] = self.shapeDefaults[p];
                        }

                        if (object.isSameColor && object.isSameColor() || !object.paths) {
                            object.setFill('#0088cc');
                        } else if (object.paths) {
                            for (var i = 0; i < object.paths.length; i++) {
                                object.paths[i].setFill('#0088cc');
                            }
                        }

                        self.addObjectToCanvas(object);
                    });
                };

                //
                // Text
                // ==============================================================
                
                self.wrapCanvasText = function(t, canvas, maxW, maxH, justify) {

                    if (typeof maxH === "undefined") {
                        maxH = 0;
                    }
                    var words = t.text.split(" ");
                    var formatted = '';

                    // This works only with monospace fonts
                    justify = justify || 'left';

                    // clear newlines
                    var sansBreaks = t.text.replace(/(\r\n|\n|\r)/gm, "");
                    // calc line height
                    var lineHeight = new fabric.Text(sansBreaks, {
                        fontFamily: t.fontFamily,
                        fontSize: t.fontSize
                    }).height;

                    // adjust for vertical offset
                    var maxHAdjusted = maxH > 0 ? maxH - lineHeight : 0;
                    var context = canvas.getContext("2d");


                    context.font = t.fontSize + "px " + t.fontFamily;
                    var currentLine = '';
                    var breakLineCount = 0;

                    n = 0;
                    while (n < words.length) {
                        var isNewLine = currentLine == "";
                        var testOverlap = currentLine + ' ' + words[n];

                        // are we over width?
                        var w = context.measureText(testOverlap).width;

                        if (w < maxW) { // if not, keep adding words
                            if (currentLine != '') currentLine += ' ';
                            currentLine += words[n];
                            // formatted += words[n] + ' ';
                        } else {

                            // if this hits, we got a word that need to be hypenated
                            if (isNewLine) {
                                var wordOverlap = "";

                                // test word length until its over maxW
                                for (var i = 0; i < words[n].length; ++i) {

                                    wordOverlap += words[n].charAt(i);
                                    var withHypeh = wordOverlap + "-";

                                    if (context.measureText(withHypeh).width >= maxW) {
                                        // add hyphen when splitting a word
                                        withHypeh = wordOverlap.substr(0, wordOverlap.length - 2) + "-";
                                        // update current word with remainder
                                        words[n] = words[n].substr(wordOverlap.length - 1, words[n].length);
                                        formatted += withHypeh; // add hypenated word
                                        break;
                                    }
                                }
                            }
                            while (justify == 'right' && context.measureText(' ' + currentLine).width < maxW)
                            currentLine = ' ' + currentLine;

                            while (justify == 'center' && context.measureText(' ' + currentLine + ' ').width < maxW)
                            currentLine = ' ' + currentLine + ' ';

                            formatted += currentLine + '\n';
                            breakLineCount++;
                            currentLine = "";

                            continue; // restart cycle
                        }
                        if (maxHAdjusted > 0 && (breakLineCount * lineHeight) > maxHAdjusted) {
                            // add ... at the end indicating text was cutoff
                            formatted = formatted.substr(0, formatted.length - 3) + "...\n";
                            currentLine = "";
                            break;
                        }
                        n++;
                    }

                    if (currentLine != '') {
                        while (justify == 'right' && context.measureText(' ' + currentLine).width < maxW)
                        currentLine = ' ' + currentLine;

                        while (justify == 'center' && context.measureText(' ' + currentLine + ' ').width < maxW)
                        currentLine = ' ' + currentLine + ' ';

                        formatted += currentLine + '\n';
                        breakLineCount++;
                        currentLine = "";
                    }

                    // get rid of empy newline at the end
                    formatted = formatted.substr(0, formatted.length - 1);

                    var ret = new fabric.Text(formatted, { // return new text-wrapped text obj
                        left: t.left,
                        top: t.top,
                        fill: t.fill,
                        fontFamily: t.fontFamily,
                        fontSize: t.fontSize,
                        originX: t.originX,
                        originY: t.originY,
                        angle: t.angle,
                    });
                    return ret;
                }

                self.isText = function() {
                    var object = canvas.getActiveObject();
                    if (!object) return false;
                    return object.type == 'text' || object.type == 'i-text';
                };

                self.addText = function(str, options) {
                    str = str || 'New Text';

                    var textDefaults = angular.extend(self.textDefaults, options);
                    var object = new fabric.Text(str, textDefaults);
                    object.id = self.createId();

                    self.addObjectToCanvas(object, true);
                };

                self.addTextBox = function(str, options) {
                    var textBox = new fabric.Textbox(str, options);
                    self.addObjectToCanvas(textBox, true);
                };

                self.addIText = function(str, options) {
                    str = str || 'New Text';

                    var textDefaults = angular.extend(self.textDefaults, options);
                    var object = new fabric.NamedIText(str, textDefaults);
                    object.id = self.createId();
                    self.addObjectToCanvas(object, true);
                    self.render();
                };

                self.getStyle = function(styleName) {
                    var object = canvas.getActiveObject();
                    return (object.getSelectionStyles && object.isEditing) ? object.getSelectionStyles()[styleName] : object[styleName];
                }
                self.getSelectionStyle = function() {
                    var object = canvas.getActiveObject();
                    if (!object && !object.getSelectionStyles) return;
                    return object.getSelectionStyles();
                }
                self.setSelectionStyle = function(styleName, value) {
                    var object = canvas.getActiveObject();
                    if (!object && !object.getSelectionStyles()) return;

                    if (object.setSelectionStyles && object.isEditing) {
                        var styleValue = self.getStyle(styleName);
                        var style = {};
                        if (styleName == 'fill' && value == 'random') {
                            style['fill'] = "#" + ((1 << 24) * Math.random() | 0).toString(16)
                        } else {
                            style[styleName] = styleValue === value ? '' : value;
                        }
                        object.setSelectionStyles(style);
                    }
                    canvas.renderAll();
                }

                self.getText = function() {
                    return getActiveProp('text');
                };

                self.setText = function(value) {
                    setActiveProp('text', value);
                    if (self.textDefaults.keepCenterH) self.centerH();
                };

                self.getStroke = function() {
                    return getActiveProp('stroke');
                };
                self.setStroke = function(value) {
                    setActiveProp('stroke', value);
                };
                self.getStrokeWidth = function() {
                    return getActiveProp('strokeWidth');
                };
                self.setStrokeWidth = function(value) {
                    setActiveProp('strokeWidth', value);
                };

                //
                // Group
                // ==============================================================
                self.addGroup = function(name, child) {
                    var objects = [];
                    angular.forEach(child, function(data, key){
                        switch(data.type) {
                            case 'text':
                                var textDefaults = angular.extend(self.textDefaults, data.options);
                                var text = new fabric.Text(data.text, textDefaults);
                                objects.push(text);
                                break;
                            case 'rect':
                                var rect = new fabric.Rect(data.options);
                                objects.push(rect);
                                break;
                        }
                    });
                    var group = new fabric.Group(objects, {
                        name: name
                    });
                    self.addObjectToCanvas(group, true);
                };
                //
                // Circle
                // ==============================================================
                self.addCircle = function() {
                    self.radius = 210;
                    var circle = new fabric.Circle({
                        name: 'circle',
                        radius: self.radius,
                        fill: 'green',
                    });
                    self.addObjectToCanvas(circle);
                }
                self.updateRadiusCircle = function() {
                    if (!self.radius) return;
                    // console.log('radius', self.radius);
                    var circle = canvas.getActiveObject();
                    circle.setRadius(self.radius);
                    self.render();
                };
                //
                // Rect
                // ==============================================================
                self.addRect = function(options) {
                    var fill = "#" + ((1 << 24) * Math.random() | 0).toString(16);

                    var options = angular.extend({
                        width: 100,
                        height: 200,
                        fill: fill
                    }, options);

                    var rect = new fabric.Rect(options);
                    self.addObjectToCanvas(rect, true);
                };

                //
                // Group all objects
                // ==============================================================
                self.groupAll = function(index) {
                    var objs = canvas.getObjects().map(function(o) {
                        // console.log('object:', o.type, o);
                        return o.set('active', true);
                    });

                    var group = new fabric.Group(objs, {
                        originX: 'center',
                        originY: 'center'
                    });
                    canvas._activeObject = null;
                    canvas.setActiveGroup(group.setCoords()).renderAll();
                };

                //
                // Font Size
                // ==============================================================
                self.getFontSize = function() {
                    return getActiveStyle('fontSize');
                };

                self.setFontSize = function(value) {
                    setActiveStyle('fontSize', parseInt(value, 10));
                    self.render();
                };

                //
                // Text Align
                // ==============================================================
                self.getTextAlign = function() {
                    return capitalize(getActiveProp('textAlign'));
                };

                self.setTextAlign = function(value) {
                    setActiveProp('textAlign', value.toLowerCase());
                };

                //
                // Font Family
                // ==============================================================
                self.getFontFamily = function() {
                    var fontFamily = getActiveProp('fontFamily');
                    return fontFamily ? fontFamily.toLowerCase() : '';
                };

                self.setFontFamily = function(value) {
                    setActiveProp('fontFamily', value.toLowerCase());
                };

                //
                // Lineheight
                // ==============================================================
                self.getLineHeight = function() {
                    return getActiveStyle('lineHeight');
                };

                self.setLineHeight = function(value) {
                    setActiveStyle('lineHeight', parseFloat(value, 10));
                    self.render();
                };

                //
                // Bold
                // ==============================================================
                self.isBold = function() {
                    return getActiveStyle('fontWeight') === 'bold';
                };

                self.toggleBold = function() {
                    setActiveStyle('fontWeight',
                        getActiveStyle('fontWeight') === 'bold' ? '' : 'bold');
                    self.render();
                };

                //
                // Italic
                // ==============================================================
                self.isItalic = function() {
                    return getActiveStyle('fontStyle') === 'italic';
                };

                self.toggleItalic = function() {
                    setActiveStyle('fontStyle',
                        getActiveStyle('fontStyle') === 'italic' ? '' : 'italic');
                    self.render();
                };

                //
                // Underline
                // ==============================================================
                self.isUnderline = function() {
                    return getActiveStyle('textDecoration').indexOf('underline') > -1;
                };

                self.toggleUnderline = function() {
                    var value = self.isUnderline() ? getActiveStyle('textDecoration').replace('underline', '') : (getActiveStyle('textDecoration') + ' underline');

                    setActiveStyle('textDecoration', value);
                    self.render();
                };

                //
                // Linethrough
                // ==============================================================
                self.isLinethrough = function() {
                    return getActiveStyle('textDecoration').indexOf('line-through') > -1;
                };

                self.toggleLinethrough = function() {
                    var value = self.isLinethrough() ? getActiveStyle('textDecoration').replace('line-through', '') : (getActiveStyle('textDecoration') + ' line-through');

                    setActiveStyle('textDecoration', value);
                    self.render();
                };

                //
                // Text Align
                // ==============================================================
                self.getTextAlign = function() {
                    return getActiveProp('textAlign');
                };

                self.setTextAlign = function(value) {
                    setActiveProp('textAlign', value);
                };

                //
                // Opacity
                // ==============================================================
                self.getOpacity = function() {
                    return getActiveStyle('opacity');
                };

                self.setOpacity = function(value) {
                    setActiveStyle('opacity', value);
                };

                //
                // FlipX
                // ==============================================================
                self.getFlipX = function() {
                    return getActiveProp('flipX');
                };

                self.setFlipX = function(value) {
                    setActiveProp('flipX', value);
                };

                self.toggleFlipX = function() {
                    var value = self.getFlipX() ? false : true;
                    self.setFlipX(value);
                    self.render();
                };

                //
                // Align Active Object
                // ==============================================================
                self.center = function() {
                    var activeObject = canvas.getActiveObject();
                    if (activeObject) {
                        activeObject.center();
                        self.updateActiveObjectOriginals();
                        self.render();
                    }
                };

                self.centerH = function() {
                    var activeObject = canvas.getActiveObject();
                    if (activeObject) {
                        activeObject.centerH();
                        self.updateActiveObjectOriginals();
                        self.render();
                    }
                };

                self.centerV = function() {
                    var activeObject = canvas.getActiveObject();
                    if (activeObject) {
                        activeObject.centerV();
                        self.updateActiveObjectOriginals();
                        self.render();
                    }
                };

                //
                // Active Object Layer Position
                // ==============================================================
                self.sendBackwards = function() {
                    var activeObject = canvas.getActiveObject();
                    if (activeObject) {
                        canvas.sendBackwards(activeObject);
                        self.render();
                    }
                };

                self.sendToBack = function() {
                    var activeObject = canvas.getActiveObject();
                    if (activeObject) {
                        canvas.sendToBack(activeObject);
                        self.render();
                    }
                };

                self.bringForward = function() {
                    var activeObject = canvas.getActiveObject();
                    if (activeObject) {
                        canvas.bringForward(activeObject);
                        self.render();
                    }
                };

                self.bringToFront = function() {
                    var activeObject = canvas.getActiveObject();
                    if (activeObject) {
                        canvas.bringToFront(activeObject);
                        self.render();
                    }
                };

                //
                // Active Object Tint Color
                // ==============================================================
                self.isTinted = function() {
                    return getActiveProp('isTinted');
                };

                self.toggleTint = function() {
                    var activeObject = canvas.getActiveObject();
                    activeObject.isTinted = !activeObject.isTinted;
                    activeObject.filters[0].opacity = activeObject.isTinted ? 1 : 0;
                    activeObject.applyFilters(canvas.renderAll.bind(canvas));
                };

                self.getTint = function() {
                    var object = canvas.getActiveObject();

                    if (typeof object !== 'object' || object === null) {
                        return '';
                    }

                    if (object.filters !== undefined) {
                        if (object.filters[0] !== undefined) {
                            return object.filters[0].color;
                        }
                    }
                };

                self.setTint = function(tint) {
                    if (!isHex(tint)) {
                        return;
                    }

                    var activeObject = canvas.getActiveObject();
                    if (activeObject.filters !== undefined) {
                        if (activeObject.filters[0] !== undefined) {
                            activeObject.filters[0].color = tint;
                            activeObject.applyFilters(canvas.renderAll.bind(canvas));
                        }
                    }
                };

                //
                // Active Object Fill Color
                // ==============================================================
                self.getFill = function() {
                    return getActiveStyle('fill');
                };

                self.setFill = function(value) {
                    var object = canvas.getActiveObject();
                    if (object && object.type !== 'group') {
                        if (object.type === 'text' || object.type === 'i-text') {
                            setActiveStyle('fill', value);
                        } else {
                            self.setFillPath(object, value);
                        }
                    }
                };

                self.setFillPath = function(object, value) {
                    if (object.isSameColor && object.isSameColor() || !object.paths) {
                        object.setFill(value);
                    } else if (object.paths) {
                        for (var i = 0; i < object.paths.length; i++) {
                            object.paths[i].setFill(value);
                        }
                    }
                };

                //
                // Active Object Lock
                // ==============================================================
                self.toggleLockActiveObject = function() {
                    var activeObject = canvas.getActiveObject();
                    if (activeObject) {
                        activeObject.lockMovementX = !activeObject.lockMovementX;
                        activeObject.lockMovementY = !activeObject.lockMovementY;
                        activeObject.lockScalingX = !activeObject.lockScalingX;
                        activeObject.lockScalingY = !activeObject.lockScalingY;
                        activeObject.lockUniScaling = !activeObject.lockUniScaling;
                        activeObject.lockRotation = !activeObject.lockRotation;
                        activeObject.lockObject = !activeObject.lockObject;
                        self.render();
                    }
                };
                self.toggleLockMovementXActiveObject = function() {
                    var activeObject = canvas.getActiveObject();
                    if (activeObject) {
                        activeObject.lockMovementX = !activeObject.lockMovementX;
                        self.render();
                    }
                };
                self.toggleLockMovementYActiveObject = function() {
                    var activeObject = canvas.getActiveObject();
                    if (activeObject) {
                        activeObject.lockMovementY = !activeObject.lockMovementY;
                        self.render();
                    }
                };
                self.toggleControlObject = function(value) {
                    var activeObject = canvas.getActiveObject();
                    if (activeObject) {
                        activeObject.hasControls = (value !== null) ? value : !activeObject.hasControls;
                        self.render();
                    }
                };

                //
                // Active Object
                // ==============================================================
                self.selectActiveObject = function() {
                    var activeObject = canvas.getActiveObject();
                    if (!activeObject) {
                        return;
                    }

                    console.log('selectActiveObject', activeObject);

                    self.selectedObject = activeObject;
                    // self.selectedObject.text = self.getText();
                    // self.selectedObject.fontSize = self.getFontSize();
                    // self.selectedObject.lineHeight = self.getLineHeight();
                    // self.selectedObject.textAlign = self.getTextAlign();
                    // self.selectedObject.opacity = self.getOpacity();
                    // self.selectedObject.fontFamily = self.getFontFamily();
                    // self.selectedObject.fill = self.getFill();
                    // self.selectedObject.tint = self.getTint();
                    // self.selectedObject.stroke = self.getStroke();
                };

                self.deselectActiveObject = function() {
                    console.log('deselectActiveObject', self.selectedObject);
                    self.selectedObject = null;
                };

                self.deleteActiveObject = function() {
                    var activeObject = canvas.getActiveObject();
                    canvas.remove(activeObject);
                    self.render();
                };

                //
                // State Managers
                // ==============================================================
                self.isLoading = function() {
                    return self.loading;
                };

                self.setLoading = function(value) {
                    self.loading = value;
                };

                self.setDirty = function(value) {
                    FabricDirtyStatus.setDirty(value);
                };

                self.isDirty = function() {
                    return FabricDirtyStatus.isDirty();
                };

                self.setInitalized = function(value) {
                    self.initialized = value;
                };

                self.isInitalized = function() {
                    return self.initialized;
                };

                //
                // JSON
                // ==============================================================
                self.getJSON = function(isObject) {
                    // var initialCanvasScale = self.canvasScale;
                    // self.canvasScale = 1;
                    // self.resetZoom();

                    var json = JSON.stringify(canvas.toJSON(self.JSONExportProperties));

                    // self.canvasScale = initialCanvasScale;
                    // self.setZoom();

                    return angular.isDefined(isObject) && isObject ? JSON.parse(json) : json;
                };

                self.loadJSON = function(json, callback) {
                    self.setLoading(true);
                    canvas.loadFromJSON(json, function() {
                        $timeout(function() {
                            self.setLoading(false);

                            if (!self.editable) {
                                self.disableEditing();
                            }

                            self.render();

                            if (callback) {
                                callback()
                            }
                        });
                    });
                };

                self.cloneJSON = function() {
                    canvas.clone(function(clone) {
                        var objects = clone.getObjects();
                        for (var i in objects) {
                            objects[i].lockMovementX = true;
                            objects[i].lockMovementY = true;
                            objects[i].lockScalingX = true;
                            objects[i].lockScalingY = true;
                            objects[i].lockUniScaling = true;
                            objects[i].lockRotation = true;
                            objects[i].lockObject = true;
                            objects[i].hasControls = false;
                        }
                        console.log('clone', clone);
                    });
                };

                //
                // Download Canvas
                // ==============================================================
                self.getCanvasData = function() {
                    var data = canvas.toDataURL({
                        width: canvas.getWidth(),
                        height: canvas.getHeight(),
                        multiplier: self.downloadMultipler
                    });

                    return data;
                };

                self.getCanvasBlob = function() {
                    var base64Data = self.getCanvasData();
                    var data = base64Data.replace('data:image/png;base64,', '');
                    var blob = b64toBlob(data, 'image/png');
                    var blobUrl = URL.createObjectURL(blob);

                    return blobUrl;
                };

                self.dataURItoBlob = function(dataURI, type) {
                    var binary = atob(dataURI.split(',')[1]);
                    var array = [];
                    for (var i = 0; i < binary.length; i++) {
                        array.push(binary.charCodeAt(i));
                    }
                    return new Blob([new Uint8Array(array)], {
                        type: type
                    });
                }
                self.getCanvasBlobFile = function(type) {
                    var base64Data = canvas.toDataURL(type);
                    return self.dataURItoBlob(base64Data, type);
                };

                self.download = function(name) {
                    // Stops active object outline from showing in image
                    self.deactivateAll();

                    var initialCanvasScale = self.canvasScale;
                    self.resetZoom();

                    // Click an artifical anchor to 'force' download.
                    var link = document.createElement('a');
                    var filename = name + '.png';
                    link.download = filename;
                    link.href = self.getCanvasBlob();
                    link.click();

                    self.canvasScale = initialCanvasScale;
                    self.setZoom();
                };

                //
                // Continuous Rendering
                // ==============================================================
                // Upon initialization re render the canvas
                // to account for fonts loaded from CDN's
                // or other lazy loaded items.

                // Prevent infinite rendering loop
                self.continuousRenderCounter = 0;
                self.continuousRenderHandle;

                self.stopContinuousRendering = function() {
                    $timeout.cancel(self.continuousRenderHandle);
                    self.continuousRenderCounter = self.maxContinuousRenderLoops;
                };

                self.startContinuousRendering = function() {
                    self.continuousRenderCounter = 0;
                    self.continuousRender();
                };

                // Prevents the "not fully rendered up upon init for a few seconds" bug.
                self.continuousRender = function() {
                    if (self.userHasClickedCanvas || self.continuousRenderCounter > self.maxContinuousRenderLoops) {
                        return;
                    }

                    self.continuousRenderHandle = $timeout(function() {
                        self.setZoom();
                        self.render();
                        self.continuousRenderCounter++;
                        self.continuousRender();
                    }, self.continuousRenderTimeDelay);
                };

                //
                // Utility
                // ==============================================================
                self.setUserHasClickedCanvas = function(value) {
                    self.userHasClickedCanvas = value;
                };

                self.createId = function() {
                    return Math.floor(Math.random() * 10000);
                };

                //
                // Toggle Object Selectability
                // ==============================================================
                self.disableEditing = function() {
                    canvas.selection = false;
                    canvas.forEachObject(function(object) {
                        object.selectable = false;
                    });
                };

                self.enableEditing = function() {
                    canvas.selection = true;
                    canvas.forEachObject(function(object) {
                        object.selectable = true;
                    });
                };


                //
                // Set Global Defaults
                // ==============================================================
                self.setCanvasDefaults = function() {
                    canvas.selection = self.canvasDefaults.selection;
                };

                self.setWindowDefaults = function() {
                    // FabricWindow.Object.prototype.transparentCorners = self.windowDefaults.transparentCorners;
                    // FabricWindow.Object.prototype.rotatingPointOffset = self.windowDefaults.rotatingPointOffset;
                    // FabricWindow.Object.prototype.padding = self.windowDefaults.padding;
                    // FabricWindow.Object.prototype.hasControls = self.windowDefaults.hasControls;
                };

                self.updateBounding = function() {
                    var activeObject = canvas.getActiveObject();
                    if (!activeObject) return;

                    self.maxBounding.left = self.canvasWidth - activeObject.getWidth();
                    self.maxBounding.top = self.canvasHeight - activeObject.getHeight();
                };

                self.updateControls = function() {
                    var activeObject = canvas.getActiveObject();
                    if (!activeObject) return;

                    self.controls.angle = activeObject.getAngle();
                    self.controls.left = activeObject.getLeft();
                    self.controls.top = activeObject.getTop();
                    self.controls.scale = activeObject.getScaleX();
                };

                self.angleControl = function() {
                    var activeObject = canvas.getActiveObject();
                    if (!activeObject) return;

                    var value = self.controls.angle = parseInt(self.controls.angle, 10);
                    activeObject.setAngle(value);
                    self.render();
                };
                self.leftControl = function() {
                    var activeObject = canvas.getActiveObject();
                    if (!activeObject) return;

                    var value = self.controls.left = parseInt(self.controls.left, 10);
                    // if( value < 0) value = self.controls.left = 0;
                    activeObject.setLeft(value);
                    self.render();
                };
                self.topControl = function() {
                    var activeObject = canvas.getActiveObject();
                    if (!activeObject) return;

                    var value = self.controls.top = parseInt(self.controls.top, 10);
                    // if( value < 0) value = self.controls.top = 0;
                    activeObject.setTop(value);
                    self.render();
                };
                self.scaleControl = function() {
                    var activeObject = canvas.getActiveObject();
                    if (!activeObject) return;

                    activeObject.scale(parseFloat(self.controls.scale));
                    self.render();
                };

                //
                // Canvas Listeners
                // ============================================================
                self.startCanvasListeners = function() {
                    canvas.on('object:selected', function() {
                        // console.info('object:selected');
                        self.stopContinuousRendering();
                        $timeout(function() {
                            self.selectActiveObject();
                            self.updateBounding();
                            self.updateControls();
                            self.setDirty(true);
                        });
                    });

                    canvas.on('selection:created', function() {
                        // console.info('selection:created');
                        self.stopContinuousRendering();
                    });

                    canvas.on('selection:cleared', function() {
                        // console.info('selection:cleared');
                        $timeout(function() {
                            self.deselectActiveObject();
                        });
                    });

                    canvas.on('after:render', function() {
                        // console.info('after:render');
                        canvas.calcOffset();
                    });

                    canvas.on('object:modified', function() {
                        // console.info('object:modified');
                        self.stopContinuousRendering();
                        $timeout(function() {
                            self.updateActiveObjectOriginals();
                            self.updateControls();
                            self.setDirty(true);
                        });
                    });

                    canvas.on({
                        'object:moving'  : self.updateControls,
                        'object:scaling' : self.updateControls,
                        'object:resizing': self.updateControls,
                        'object:rotating': self.updateControls
                    });
                };

                self.setbackgroundImage = function(imageURL, options) {
                    canvas.setBackgroundImage(imageURL, canvas.renderAll.bind(canvas), options);
                },
                self.setOverlayImage = function(imageURL) {
                    canvas.setOverlayImage(imageURL, canvas.renderAll.bind(canvas));
                },

                //
                // Constructor
                // ==============================================================
                self.init = function() {
                    self.canvas = canvas = FabricCanvas.getCanvas(canvasID);
                    canvases.push(canvas);
                    canvas.clear();
                    canvas.hoverCursor = 'pointer';

                    self.setCanvasSize(self.canvasOriginalWidth, self.canvasOriginalHeight);

                    self.render();
                    self.setDirty(false);
                    self.setInitalized(true);

                    self.setCanvasDefaults();
                    self.setWindowDefaults();
                    self.startCanvasListeners();
                    self.startContinuousRendering();
                    FabricDirtyStatus.startListening();
                };

                self.init();

                return self;

            };

        }
    ]);
