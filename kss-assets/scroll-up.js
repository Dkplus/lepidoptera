(function($) {
    $.scrollUp = function (selector, options) {
        "use strict";
        var defaults = {scrollOffset: 5},
            lastPosition = window.pageYOffset,
            didScroll = false;
        selector = $(selector);
        options = $.extend(defaults, options);

        window.addEventListener('scroll', function () {
            didScroll = true;
        });
        window.setInterval(function () {
            if (! didScroll) {
                return;
            }
            if (lastPosition > window.pageYOffset + options.scrollOffset) {
                selector.trigger('scroll-up');
            }
            if (lastPosition < window.pageYOffset - options.scrollOffset) {
                selector.trigger('scroll-down');
            }
            lastPosition = window.pageYOffset;
        }, 100);
    };
    $.fn.scrollUp = function (offset) {
        "use strict";
        return $.scrollUp($(this), offset);
    };
})(jQuery);
