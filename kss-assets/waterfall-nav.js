(function($) {
    $.waterfallNav = function (selector, options) {
        "use strict";
        var defaults = {
                scrollOffset: 50 // offset - 200 allows elements near bottom of page to scroll
            },
            listener,
            lastPosition;
        options = $.extend(defaults, options);
        selector = $(selector);
        lastPosition = 0;
        listener = function() {
            var isScrollUp = lastPosition - 5 > window.pageYOffset || (lastPosition > window.pageYOffset && window.pageYOffset < options.scrollOffset),
                isScrollDown = lastPosition + 5 < window.pageYOffset || (lastPosition < window.pageYOffset && window.pageYOffset < options.scrollOffset);
            if (isScrollDown) {
                selector.addClass('navbar--waterfall-shrunk');
            } else if(isScrollUp) {
                selector.removeClass('navbar--waterfall-shrunk');
            }
            lastPosition = window.pageYOffset;
        };

        listener();
        window.addEventListener("scroll", listener);
        /*$(window).on('scroll-up', function () {
            selector.removeClass('navbar--waterfall-shrunk');
        });*/
    };
    $.fn.waterfallNav = function (offset) {
        "use strict";
        return $.waterfallNav($(this), offset);
    };
})(jQuery);
