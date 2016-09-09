(function($) {
    $.waterfallNav = function (selector, options) {
        "use strict";
        var didScroll = false,
            defaults = {
                scrollOffset: 50 // offset - 200 allows elements near bottom of page to scroll
            };
        options = $.extend(defaults, options);
        selector = $(selector);

        window.addEventListener("scroll", function() {
            didScroll = true;
        });

        // Rate limit to 100ms
        setInterval(function() {
            if (! didScroll) {
                return;
            }
            didScroll = false;

            if (window.pageYOffset > options.scrollOffset) {
                selector.addClass('navbar--waterfall-shrunk');
            } else {
                selector.removeClass('navbar--waterfall-shrunk');
            }
        }, 100);
    };
    $.fn.waterfallNav = function (offset) {
        "use strict";
        return $.waterfallNav($(this), offset);
    };
})(jQuery);
