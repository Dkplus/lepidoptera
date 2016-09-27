(function($) {
    var cssPx = function ($element, property) {
            "use strict";
            return parseInt($element.css(property));
        },
        applyCss = function (element, css) {
            "use strict";
            for (var prop in css) {
                if (css.hasOwnProperty(prop)) {
                    element.css(prop, css[prop]);
                }
            }
        },
        animateCss = function (element, css, duration, completion) {
            "use strict";
            element.animate(css, duration, 'swing', function () {
                applyCss(css);
                if (completion) {
                    completion();
                }
            });
        },
        detectMinimalScrolledToolbarDimension = function (selector, toolbar) {
            "use strict";
            var result = selector.offset();
            result['width'] = toolbar.innerWidth();
            return result;
        },
        detectFurtherScrolledToolbarDimension = function () {
            "use strict";
            var menuButton = $('.button-collapse:visible:first').parent(),
                nav = $('nav'),
                result;

            if (menuButton.length > 0 && menuButton.position().left < 50) {
                result = menuButton.position();
                result['left'] += menuButton.width();
                result['width'] = nav.innerWidth()
                    - cssPx(nav, 'padding-left')
                    - cssPx(nav, 'padding-right')
                    - menuButton.width()
                    - 16;
                return result;
            }

            result = nav.position();
            result['left'] += cssPx(nav, 'margin-left') + cssPx(nav, 'padding-left');
            result['top'] += cssPx(nav, 'margin-top') + cssPx(nav, 'padding-top');
            result['width'] = nav.innerWidth() - cssPx(nav, 'padding-left') - cssPx(nav, 'padding-right');

            return result;
        },
        detectCurrentScrollingLevel = function (options) {
            "use strict";
            if (window.pageYOffset > options.scrollOffset) {
                return 2;
            } else if (window.pageYOffset > 0) {
                return 1;
            }
            return 0;
        };


    $.cardToolbar = function (selector, options) {
        "use strict";
        selector = $(selector);
        var defaults = {scrollOffset: 50},
            toolbar = selector.find('.card__toolbar').first(),
            minimalScrolledToolbarDimension = detectMinimalScrolledToolbarDimension(selector, toolbar),
            furtherScrolledToolbarDimension = detectFurtherScrolledToolbarDimension(),
            nonScrolledToolbarDimension = {top: '', left: '', width: ''};
        options = $.extend(defaults, options);
        console.log(nonScrolledToolbarDimension, minimalScrolledToolbarDimension, furtherScrolledToolbarDimension);

        var lastPosition = window.pageYOffset,
            transformations,
            lastStatus = 'notscrolled';

        transformations = {
            notscrolled : {
                notscrolled: function () { /* nothing to do */ },
                upscrolled: function () {
                    selector.removeClass('upscrolled');
                    applyCss(toolbar, nonScrolledToolbarDimension);
                },
                minimalscrolled: function () {
                    selector.removeClass('scrolled');
                    applyCss(toolbar, nonScrolledToolbarDimension);
                },
                furtherscrolled: function () {
                    selector.removeClass('scrolled');
                    applyCss(toolbar, nonScrolledToolbarDimension);
                }
            },
            upscrolled: {
                notscrolled: function () {
                    selector.addClass('upscrolled');
                    applyCss(toolbar, minimalScrolledToolbarDimension);
                },
                upscrolled: function () { /* nothing to do */ },
                minimalscrolled: function () {
                    throw new Error("Should not be possible");
                },
                furtherscrolled: function () {
                    animateCss(toolbar, minimalScrolledToolbarDimension, 0.3, function () {
                        selector.removeClass('scrolled').addClass('upscrolled');
                    });
                }
            },
            minimalscrolled: {
                notscrolled: function () {
                    selector.addClass('scrolled');
                    applyCss(toolbar, minimalScrolledToolbarDimension);
                },
                upscrolled: function () {
                    selector.removeClass('upscrolled');
                    selector.addClass('scrolled');
                    applyCss(toolbar, minimalScrolledToolbarDimension);
                },
                minimalscrolled: function () { /* nothing to do */ },
                furtherscrolled: function () {
                    animateCss(toolbar, minimalScrolledToolbarDimension);
                }
            },
            furtherscrolled: {
                notscrolled: function () {
                    selector.addClass('scrolled');
                    animateCss(toolbar, furtherScrolledToolbarDimension);
                },
                upscrolled: function () {
                    selector.removeClass('upscrolled');
                    selector.addClass('scrolled');
                    applyCss(toolbar, furtherScrolledToolbarDimension);
                },
                minimalscrolled: function () {
                    animateCss(toolbar, furtherScrolledToolbarDimension);
                },
                furtherscrolled: function () { /* nothing to do */ }
            }
        };

        $(window).scroll(function () {
            var isScrollUp = lastPosition - 5 > window.pageYOffset || (lastPosition > window.pageYOffset && window.pageYOffset < options.scrollOffset),
                isScrollDown = lastPosition + 5 < window.pageYOffset || (lastPosition < window.pageYOffset && window.pageYOffset < options.scrollOffset),
                nextStatus;
            lastPosition = window.pageYOffset;

            if (! isScrollUp && ! isScrollDown) {
                return;
            }
            if (isScrollUp) {
                if (window.pageYOffset > options.scrollOffset) {
                    nextStatus = 'upscrolled';
                } else {
                    nextStatus = window.pageYOffset === 0 ? 'notscrolled' : 'upscrolled';
                }
            } else if (isScrollDown) {
                nextStatus = window.pageYOffset > options.scrollOffset ? 'furtherscrolled' : 'minimalscrolled';
            }

            if (lastStatus !== nextStatus) {
                console.log(lastStatus, nextStatus);
                toolbar.stop();
            }
            transformations[nextStatus][lastStatus]();
            lastStatus = nextStatus;
        });
    };
    $.fn.cardToolbar = function (offset) {
        "use strict";
        return $.cardToolbar($(this), offset);
    };
})(jQuery);
