(function($) {
    $.waterfallNav = function (selector, options) {
        "use strict";
        var defaults = {
                scrollOffset: 50, // offset - 200 allows elements near bottom of page to scroll
                enlargeOnScrollUp: false
            },
            listener,
            lastPosition,
            waterfallShouldBeEnlarged,
            waterfallShouldBeShrunk;
        options = $.extend(defaults, options);
        lastPosition = 0;

        waterfallShouldBeShrunk = function () {
            return lastPosition + 5 < window.pageYOffset && window.pageYOffset > options.scrollOffset;
        };
        waterfallShouldBeEnlarged = function () {
            return lastPosition - 5 > window.pageYOffset && window.pageYOffset < options.scrollOffset;
        };
        if (options.enlargeOnScrollUp) {
            waterfallShouldBeEnlarged = function () {
                return lastPosition - 5 > window.pageYOffset
                    || (lastPosition > window.pageYOffset && window.pageYOffset < options.scrollOffset);
            };
        }

        listener = function() {
            var $selector = $(selector);
            if (waterfallShouldBeShrunk()) {
                $selector.addClass('navbar--waterfall-shrunk');
            } else if(waterfallShouldBeEnlarged()) {
                $selector.removeClass('navbar--waterfall-shrunk');
            }
            lastPosition = window.pageYOffset;
        };

        listener();
        window.addEventListener("scroll", listener);
    };
    $.fn.waterfallNav = function (offset) {
        "use strict";
        return $.waterfallNav($(this), offset);
    };
})(jQuery);
