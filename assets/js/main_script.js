/* ----------------------------------------------------------------------------------------
* Author        : Coderspoint
* Template Name : Pushpo - One Page App Landing Page
* File          : Pushpo main JS file
* Version       : 1.0
* ---------------------------------------------------------------------------------------- */




    
/* INDEX
----------------------------------------------------------------------------------------

01. Preloader js

02. change Menu background on scroll js 

03. Navigation js

04. Smooth scroll to anchor

05. Portfolio js

06. Magnific Popup js

07. Testimonial js

08. client js

09. Ajax Contact Form js

11. Mailchimp js

-------------------------------------------------------------------------------------- */





(function($) {
'use strict';


    /*-------------------------------------------------------------------------*
     *                  01. Preloader js                                       *
     *-------------------------------------------------------------------------*/
      $(window).on( 'load', function(){
        
          $('#preloader').delay(300).fadeOut('slow',function(){
            $(this).remove();
          });    

      }); // $(window).on end



  $(document).ready(function(){



    /*-------------------------------------------------------------------------*
     *             02. change Menu background on scroll js                     *
     *-------------------------------------------------------------------------*/
      // Passive native listeners, coalesced into one rAF: jQuery's handler is
      // non-passive, which mobile browsers may defer until a scroll gesture
      // ends — that left the bar unstyled during the scroll itself. touchmove
      // covers browsers that hold back scroll events mid-gesture.
      var menu_area = $('.menu-area');
      var navbar_logo = $('.navbar-logo'); // logo shown only after scroll
      var was_scrolled = null;

      function update_sticky_menu() {
          var scrolled = (window.pageYOffset || document.documentElement.scrollTop) > 50;
          if (scrolled === was_scrolled) return; // only touch the DOM on a change
          was_scrolled = scrolled;
          menu_area.toggleClass('sticky-menu', scrolled);
          navbar_logo.toggleClass('logo-visible', scrolled);
      }

      // Applied straight from the handler rather than via requestAnimationFrame:
      // rAF is throttled when the page isn't actively rendering, which left the
      // bar unstyled until some later scroll happened to land in a live frame.
      window.addEventListener('scroll', update_sticky_menu, { passive: true });
      window.addEventListener('touchmove', update_sticky_menu, { passive: true });
      window.addEventListener('resize', update_sticky_menu, { passive: true });

      // Initialize navbar logo/menu state on load (in case page loads scrolled)
      update_sticky_menu();




    /*-------------------------------------------------------------------------*
     *                   03. Navigation js                                     *
     *-------------------------------------------------------------------------*/
      $(document).on('click', '.navbar-collapse.in', function (e) {
          if ($(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle') {
              $(this).collapse('hide');
          }
      });

      $('body').scrollspy({
          target: '.navbar-collapse',
          offset: 195
      });



    /*-------------------------------------------------------------------------*
     *                   04. Smooth scroll to anchor                           *
     *-------------------------------------------------------------------------*/
      $('a.smooth_scroll').on("click", function (e) {
          e.preventDefault();
          var anchor = $(this);
          $('html, body').stop().animate({
              scrollTop: $(anchor.attr('href')).offset().top - 50
          }, 1000);
      });



     /*-------------------------------------------------------------------------*
     *                  06. Magnific Popup js                                  *
     *-------------------------------------------------------------------------*/
      $('.screen-popup').magnificPopup({
        type: 'image',
        gallery: {
            enabled: true
        }
      });


    /*-------------------------------------------------------------------------*
     *                  07. Testimonial js                                     *
     *-------------------------------------------------------------------------*/
      $(".screenshots").owlCarousel({
        lazyLoad            : false,
        pagination          : false,
        navigation          : true,
        autoPlay            : true,
        items               : 4,
        itemsDesktop        : [1199, 5],
        itemsDesktopSmall   : [980, 3],
        itemsTablet         : [768, 2],
        itemsMobile         : [479, 1],
        navigationText      : ['<span class="lnr lnr-arrow-left"></span>', '<span class="lnr lnr-arrow-right"></span>'],
      });



      $(".testimonial-list").owlCarousel({
        lazyLoad            : false,
        pagination          : false,
        navigation          : true,
        items               : 1,
        autoPlay            : false,
        itemsDesktop        : [1199, 1],
        itemsDesktopSmall   : [980, 1],
        itemsTablet         : [768, 1],
        itemsMobile         : [479, 1],
        navigationText      : ['<span class="lnr lnr-arrow-left"></span>', '<span class="lnr lnr-arrow-right"></span>'],
            
        
      });
      
      


    /*-------------------------------------------------------------------------*
     *                       08. client js                                     *
     *-------------------------------------------------------------------------*/
      $(".owl-client").owlCarousel({
          items               : 5,
          autoPlay            : true,
          itemsDesktop        : [1199, 5],
          itemsDesktopSmall   : [980, 4],
          itemsTablet         : [768, 3],
          itemsMobile         : [479, 2],
          pagination          : false,
          navigation          : false,
          autoHeight          : true,
      });



  }); // $(document).ready end

})(jQuery);