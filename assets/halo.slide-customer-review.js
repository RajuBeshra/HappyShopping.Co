(function ($) {
    var halo = {
        initReviewSlider: function () {
            var policyBlock = $('[data-review-slider]');

            policyBlock.each(function () {
                var self = $(this),
                    rows = parseInt(self.data('row')),
                    row_tablet = (rows > 1 ? parseInt(rows - 1) : 1);

                if (self.not('.slick-initialized')) {
                    self.slick({
                        slidesToShow: rows,
                        slidesToScroll: 1,
                        autoplay: false,
                        dots: true,
                        speed: 800,
                        infinite: false,
                        nextArrow: window.arrows.icon_next,
                        prevArrow: window.arrows.icon_prev,
                        rtl: window.rtl_slick,
                        responsive: [{
                                breakpoint: 1200,
                                settings: {
                                    arrows: false,
                                    dots: true,
                                    slidesToShow: row_tablet
                                }
                            },
                            {
                                breakpoint: 992,
                                settings: {
                                    arrows: false,
                                    dots: true,
                                    slidesToShow: 1
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    arrows: false,
                                    dots: true,
                                    slidesToShow: 1
                                }
                            }
                        ]
                    });
                }
            });
        }
    }
    halo.initReviewSlider();
})(jQuery);
