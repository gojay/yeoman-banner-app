angular.module("slidePushMenu", [])
.factory('slidePush', function() {
    var spmenuHorizontalHeight, spmenuVerticalWidth;
    spmenuVerticalWidth = window.innerWidth * 90 / 100;
    spmenuHorizontalHeight = 330;
    return {
        getWidth: function(){
            return spmenuVerticalWidth;
        },
        getHeight: function(){
            return spmenuHorizontalHeight;
        },
        slide: function(menu, btn) {
            btn.toggleClass("active");
            if (menu.hasClass("spmenu-left")) {
                if (menu.hasClass("spmenu-open")) {
                    menu.css("left", -spmenuVerticalWidth);
                } else {
                    menu.css("left", 0);
                }
            }
            if (menu.hasClass("spmenu-right")) {
                if (menu.hasClass("spmenu-open")) {
                    menu.css("right", -spmenuVerticalWidth);
                } else {
                    menu.css("right", 0);
                }
            }
            if (menu.hasClass("spmenu-top")) {
                if (menu.hasClass("spmenu-open")) {
                    menu.css("top", -spmenuHorizontalHeight);
                } else {
                    menu.css("top", 60);
                }
            }
            if (menu.hasClass("spmenu-bottom")) {
                if (menu.hasClass("spmenu-open")) {
                    menu.css("bottom", -spmenuHorizontalHeight);
                } else {
                    menu.css("bottom", 0);
                }
            }
            return menu.toggleClass("spmenu-open");
        },
        slideForceClose: function(menu, btn) {
            if (menu.hasClass("spmenu-open")) {
                btn.removeClass("active");
                if (menu.hasClass("spmenu-left")) {
                    menu.css("left", parseInt(menu.css("left")) - spmenuVerticalWidth);
                }
                if (menu.hasClass("spmenu-right")) {
                    menu.css("right", parseInt(menu.css("right")) - spmenuVerticalWidth);
                }
                if (menu.hasClass("spmenu-top")) {
                    menu.css("top", parseInt(menu.css("top")) - spmenuHorizontalHeight);
                }
                if (menu.hasClass("spmenu-bottom")) {
                    menu.css("bottom", parseInt(menu.css("bottom")) - spmenuHorizontalHeight);
                }
                return menu.removeClass("spmenu-open");
            }
        },
        push: function(menu, btn) {
            var body, bodyLeft, bodyTop;
            body = angular.element("body");
            btn.toggleClass("active");
            if (menu.hasClass("spmenu-left")) {
                // bodyLeft = parseInt(body.css("left"));
                // bodyLeft = (bodyLeft ? bodyLeft : 0);
                if (menu.hasClass("spmenu-open")) {
                    body.css("left", 0);
                } else {
                    body.css("left", spmenuVerticalWidth);
                }
                if (menu.hasClass("spmenu-open")) {
                    menu.css("left", -spmenuVerticalWidth);
                } else {
                    menu.css("left", 0);
                }
                angular.element('.overlay').toggleClass("show");
            }
            if (menu.hasClass("spmenu-right")) {
                // bodyLeft = parseInt(body.css("left"));
                // bodyLeft = (bodyLeft ? bodyLeft : 0);
                if (menu.hasClass("spmenu-open")) {
                    body.css("left", 0);
                } else {
                    body.css("left", -spmenuVerticalWidth);
                }
                if (menu.hasClass("spmenu-open")) {
                    menu.css("right", -spmenuVerticalWidth);
                } else {
                    menu.css("right", 0);
                }
                angular.element('.overlay').toggleClass("show");
            }
            if (menu.hasClass("spmenu-top")) {
                // bodyTop = parseInt(body.css("top"));
                // bodyTop = (bodyTop ? bodyTop : 0);
                if (menu.hasClass("spmenu-open")) {
                    body.css("top", 0);
                } else {
                    body.css("top", spmenuHorizontalHeight);
                }
                if (menu.hasClass("spmenu-open")) {
                    menu.css("top", -spmenuHorizontalHeight);
                } else {
                    menu.css("top", 60);
                }

                // angular.element('.overlay').toggleClass("top");
                // angular.element('.overlay').toggleClass("show");
            }
            if (menu.hasClass("spmenu-bottom")) {
                // bodyTop = parseInt(body.css("top"));
                // bodyTop = (bodyTop ? bodyTop : 0);
                if (menu.hasClass("spmenu-open")) {
                    body.css("top", 0);
                } else {
                    body.css("top", -spmenuHorizontalHeight);
                }
                if (menu.hasClass("spmenu-open")) {
                    menu.css("bottom", -spmenuHorizontalHeight);
                } else {
                    menu.css("bottom", 0);
                }
            }
            return menu.toggleClass("spmenu-open");
        },
        pushForceClose: function(menu, btn) {
            var body, bodyLeft;
            if (menu.hasClass("spmenu-open")) {
                btn.removeClass("active");
                body = angular.element("body");
                if (menu.hasClass("spmenu-left")) {
                    bodyLeft = parseInt(body.css("left"));
                    bodyLeft = (bodyLeft ? bodyLeft : 0);
                    body.css("left", bodyLeft - spmenuVerticalWidth);
                    menu.css("left", parseInt(menu.css("left")) - spmenuVerticalWidth);
                }
                if (menu.hasClass("spmenu-right")) {
                    bodyLeft = parseInt(body.css("left"));
                    bodyLeft = (bodyLeft ? bodyLeft : 0);
                    body.css("left", bodyLeft + spmenuVerticalWidth);
                    menu.css("right", parseInt(menu.css("right")) - spmenuVerticalWidth);
                }
                if (menu.hasClass("spmenu-top")) {
                    body.css("top", "auto");
                    menu.css("top", parseInt(menu.css("top")) - spmenuHorizontalHeight);
                }
                if (menu.hasClass("spmenu-bottom")) {
                    body.css("top", "auto");
                    menu.css("bottom", parseInt(menu.css("bottom")) - spmenuHorizontalHeight);
                }
                return menu.removeClass("spmenu-open");
            }
        },
        isOpenById: function(id){
            var menu = angular.element("#" + id);

            if (!menu.length) return null;

            return menu.hasClass("spmenu-open");
        },
        pushById: function(id) {
            var body = angular.element("body"),
                menu = angular.element("#" + id);

            if (!menu.length) return;

            if (menu.hasClass("spmenu-left")) {
                body.css("left", spmenuVerticalWidth);
                menu.css("left", 0);
                angular.element('.overlay').addClass("show");
            }
            if (menu.hasClass("spmenu-right")) {
                body.css("left", -spmenuVerticalWidth);
                menu.css("right", 0);
                angular.element('.overlay').addClass("show");
            }
            if (menu.hasClass("spmenu-top")) {
                body.css("top", spmenuHorizontalHeight);
                menu.css("top", 60);
                // angular.element('.overlay').addClass("top");
                // angular.element('.overlay').addClass("show");
            }
            if (menu.hasClass("spmenu-bottom")) {
                body.css("top", -spmenuHorizontalHeight);
                menu.css("bottom", 0);
            }
            return menu.addClass("spmenu-open");
        },
        pushForceCloseById: function(id) {
            var body = angular.element("body"),
                menu = angular.element("#" + id);

            if (!menu.length) return;

            if (menu.hasClass("spmenu-left")) {
                body.css("left", 0);
                menu.css("left", -spmenuVerticalWidth);
                angular.element('.overlay').removeClass("show");
            }
            if (menu.hasClass("spmenu-right")) {
                body.css("left", 0);
                menu.css("right", -spmenuVerticalWidth);
                angular.element('.overlay').removeClass("show");
            }
            if (menu.hasClass("spmenu-top")) {
                body.css("top", 0);
                menu.css("top", -spmenuHorizontalHeight);
                // angular.element('.overlay').removeClass("top");
                // angular.element('.overlay').removeClass("show");
            }
            if (menu.hasClass("spmenu-bottom")) {
                body.css("top", 0);
                menu.css("bottom", -spmenuHorizontalHeight);
            }
            return menu.removeClass("spmenu-open");
        },
        pushForceCloseAll: function() {
            angular.forEach(['menu-top', 'menu-left', 'menu-right'], this.pushForceCloseById)
        }
    };
})
.directive("ngSlideMenu", [
    'slidePush',
    function(slidePush) {
        return {
            restrict: "A",
            link: function(scope, elem, attrs) {
                return elem.click(function() {
                    var menu;
                    menu = angular.element("#" + attrs.ngSlideMenu);
                    return slidePush.slide(menu, elem);
                });
            }
        };
    }
])
.directive("ngPushMenu", [
    'slidePush',
    function(slidePush) {
        return {
            restrict: "A",
            link: function(scope, elem, attrs) {
                var body, menu;
                menu = angular.element("#" + attrs.ngPushMenu);
                body = angular.element("body");
                body.addClass("spmenu-push");
                return elem.click(function() {
                    return slidePush.push(menu, elem);
                });
            }
        };
    }
])
.directive("ngSlidePushMenu", [
    "$document", 'slidePush',
    function($document, slidePush) {
        var compile, link;
        compile = function(elem, attrs, transclude) {
            link.transclude = transclude;
            return link;
        };
        link = function(scope, elem, attrs) {
            return link.transclude(scope, function(clone) {
                var body, btn, buttonClass, buttonText, classes, positionFix;
                classes = (attrs.spmClass ? attrs.spmClass : "");
                classes += " spmenu spmenu-" + (attrs.position === "right" || attrs.position === "left" ? "vertical" : "horizontal") + " spmenu-" + attrs.position;
                elem.addClass(classes);
                // vertical
                var width = slidePush.getWidth();
                if(elem.hasClass('spmenu-vertical')) {
                    elem.width(width)
                }
                if(elem.hasClass('spmenu-left')) {
                    elem.css('left', -width);
                } else if(elem.hasClass('spmenu-right')) {
                    elem.css('right', -width);
                }

                body = angular.element("body");
                if (attrs.button) {
                    btn = elem.find(".spmenu-button").addClass("show");
                    buttonText = attrs.buttonText ? attrs.buttonText : "";
                    buttonClass = attrs.buttonClass ? attrs.buttonClass : "";
                    btn.addClass(buttonClass);
                    btn.append("<span class=\"" + buttonClass + "\">" + buttonText + "</span>");
                    positionFix = (attrs.fixTop ? "top: " + (parseInt(attrs.fixTop) + elem.position().top) + "px; " : "");
                    positionFix += (attrs.fixLeft ? "left: " + (parseInt(attrs.fixLeft) + elem.position().left) + "px; " : "");
                    btn.attr("style", positionFix);
                    if (attrs.button === "slide") {
                        $document.mouseup(function(e) {
                            if (!elem.is(e.target) && elem.has(e.target).length === 0 && !body.hasClass('modal-open')) {
                                return slidePush.slideForceClose(elem, btn);
                            }
                        });
                        btn.click(function() {
                            return slidePush.slide(elem, btn);
                        });
                    }
                    if (attrs.button === "push") {
                        angular.element("body").addClass("spmenu-push");
                        $document.mouseup(function(e) {
                            if (!elem.is(e.target) && elem.has(e.target).length === 0 && !body.hasClass('modal-open')) {
                                return slidePush.pushForceClose(elem, btn);
                            }
                        });
                        btn.click(function() {
                            return slidePush.push(elem, btn);
                        });
                    }
                }
                // elem.append(clone);
                if (attrs.open) {
                    return btn.click();
                }
            });
        };
        return {
            compile: compile,
            restrict: "E",
            replace: true,
            template: "<nav><div ng-transclude></div></nav>",
            transclude: true
        };
    }
]);