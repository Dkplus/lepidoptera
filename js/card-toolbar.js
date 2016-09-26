(function($) {
    var applyCss = function (element, css) {
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
        };


    $.cardToolbar = function (selector, options) {
        "use strict";
        var defaults = {
                scrollOffset: 50 // offset - 200 allows elements near bottom of page to scroll
            },
            nonScrolledDimensions,
            scrolledDimension,
            nav,
            toolbar;
        options = $.extend(defaults, options);
        selector = $(selector);
        toolbar = selector.find('.card__toolbar').first();
        nonScrolledDimensions = selector.offset();
        nonScrolledDimensions['width'] = toolbar.innerWidth();
        nav = $('nav');
        scrolledDimension = nav.position();
        scrolledDimension['left'] += parseInt(nav.css('margin-left')) + parseInt(nav.css('padding-left'));
        scrolledDimension['top'] += parseInt(nav.css('margin-top')) + parseInt(nav.css('padding-top'));
        scrolledDimension['width'] = nav.innerWidth() - parseInt(nav.css('padding-left')) - parseInt(nav.css('padding-right'));


        var scrollFunction = function() {
            var levelBefore = selector.hasClass('scrolled--level1') ? 1 : 0,
                levelAfter = 0;
            if (selector.hasClass('scrolled--level2')) {
                ++levelBefore;
            }

            if (window.pageYOffset > options.scrollOffset) {
                levelAfter = 2;
            } else if (window.pageYOffset > 0) {
                levelAfter = 1;
            }

            if (levelAfter === levelBefore) {
                return;
            }

            if (levelBefore < levelAfter) {
                selector.addClass('scrolled--level1');
                applyCss(toolbar, nonScrolledDimensions);

                if (levelAfter > 1) {
                    selector.addClass('scrolled--level2');
                    animateCss(toolbar, scrolledDimension, 0.3);
                }
                return;
            }

            if (levelBefore > 1) {
                animateCss(toolbar, nonScrolledDimensions, 0.3, function () {
                    selector.removeClass('scrolled--level2');
                    if (levelAfter === 0) {
                        toolbar.css('top', '').css('left', '').css('width', '');
                        selector.removeClass('scrolled--level1');
                    }
                });
                return;
            }

            toolbar.css('top', '').css('left', '').css('width', '');
            selector.removeClass('scrolled--level1');
        };
        $(window).scroll(scrollFunction);
        scrollFunction();
    };
    $.fn.cardToolbar = function (offset) {
        "use strict";
        return $.cardToolbar($(this), offset);
    };
})(jQuery);
