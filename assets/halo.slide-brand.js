(function ($) {
	var halo = {
	    initBrandsSlider: function() {
	        var brandsSlider = $('[data-brands-slider]');

	        brandsSlider.each(function () {
	            var self = $(this),
	            	dataArrows = self.data('arrows'),
	            	dataDots = self.data('dots'),
					itemsToShow = parseInt(self.data('rows')),
					itemTotal = self.find('.halo-item').length

	            if (self.not('.slick-initialized')) {
	                self.slick({
	                    slidesToShow: itemsToShow,
	                    slidesToScroll: 1,
	                    dots: dataDots && itemTotal > itemsToShow,
	                    infinite: false,
	                    speed: 800,
	                    nextArrow: window.arrows.icon_next,
                        prevArrow: window.arrows.icon_prev,
                        rtl: window.rtl_slick,
	                    responsive: [{
	                            breakpoint: 1200,
	                            settings: {
	                                slidesToShow: 4,
	                                slidesToScroll: 4,
	                                arrows: dataArrows,
									dots: dataDots && itemTotal > 4
	                            }
	                        },
	                        {
	                            breakpoint: 992,
	                            settings: {
	                                slidesToShow: 3,
	                                slidesToScroll: 3,
	                                arrows: dataArrows,
									dots: dataDots && itemTotal > 3
	                            }
	                        },
	                        {
	                            breakpoint: 768,
	                            settings: {
	                                slidesToShow: 2,
	                                slidesToScroll: 2,
	                                arrows: dataArrows,
									dots: dataDots && itemTotal > 2
	                            }
	                        },
	                        {
	                            breakpoint: 480,
	                            settings: {
	                                get slidesToShow() {
	                                	return this.slidesToShow = self.data('rows-mobile'); 
	                                },
	                                get slidesToScroll() {
	                                	return this.slidesToScroll = self.data('rows-mobile'); 
	                                },
	                                arrows: dataArrows,
									dots: dataDots && itemTotal > parseInt(self.data('rows-mobile'))
	                            }
	                        }
	                    ]
	                });
	            }
	        });
	    }
	}
	halo.initBrandsSlider();
})(jQuery);
