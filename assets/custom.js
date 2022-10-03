$(document).ready(function(){
  // product description read more by height
  $('.fs-readmore-btn').click(function (event) {
    event.preventDefault();
    var description = document.querySelector('.fs-product-description');
    console.log(description.style.height)
    if (description.style.height === ''){
      description.style.height = 'auto';
    } else if (description.style.height === 'auto'){
      description.style.height = '';
    } else{
      description.style.height = '92px';
    }

    $(this).text($(this).text() == 'READ LESS' ? 'READ MORE' : 'READ LESS');
  });
});

(function($) {
    'use strict';
       $(".product-detail__detail .readmore").click(function(e) {  
         event.preventDefault();
         $('.product-detail__detail .truncated-description').hide();
         $('.product-detail__detail .original-description').show();       
       });
       $(".product-detail__detail .readless").click(function(e) {  
         event.preventDefault();
         $('.product-detail__detail .truncated-description').show();
         $('.product-detail__detail .original-description').hide();       
       });
  
  	   // product description read more by height
  	   $('.product-collapes .readmore').click(function (event) {
          event.preventDefault();
          var description = document.querySelector('.product-description');
          console.log(description.style.height)
          if (description.style.height === ''){
            description.style.height = 'auto';
          } else if (description.style.height === 'auto'){
            description.style.height = '';
          } else{
            description.style.height = '92px';
          }

          $(this).text($(this).text() == 'READ LESS' ? 'READ MORE' : 'READ LESS');
        });
  
    var trekell = {
        init: function() {
            this.stickyCart();
          	this.stickyQuantityUpdate();
            this.inputOnblurfunction();
            this.featuredCollection();
            this.readMoredescription();
        },
        settings: {
            windowWidth: $(window).width(),
            windowheight: $(window).height(),
            scrollClassTrigger: $(window).height(),
            scrollBarWidth: 0
        },

        onLoad: function() {
            $(document).ready(function() {});
        },
      	
      	stickyCart: function() {
          if($('.sticky-add-cart').length){
          	var $stickyCart = $('.sticky-add-cart');
          	var waypoint = new Waypoint({
              element: $('#shopify-section-footer'),
              handler: function(direction) {
                if (direction == 'up') {
                  $stickyCart.removeClass('unSticky');
                  //Waypoint.refreshAll() 
                } else {
                  $stickyCart.addClass('unSticky');
                  //Waypoint.refreshAll() ;
                }
              },
              offset: '100%'
            });
          
          	var waypoint2 = new Waypoint({
              element: $('.variant-table'),
              handler: function(direction) {
                if (direction == 'up') {
                  $stickyCart.removeClass('show')
                } else {
                  $stickyCart.addClass('show')
                }
              },
              offset: '90%'
            });
          	$('#shopifyProductreviewsWrapper').bind('DOMNodeInserted DOMNodeRemoved', function() {
              	if(window.refreshTimeout)
                  window.clearTimeout(window.refreshTimeout);
              	  window.refreshTimeout = setTimeout(function(){
                	Waypoint.refreshAll();
              	},500);
			});
          }
        },
      
        updateCartElement: function(){  
        trekell.getCartData().then(function(data) {
            var cartCost = data.total_price / 100;
            cartCost = cartCost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        
        });  
        },
        quickAddProduct: function(productId){  
        return $.ajax({
            url: "/cart/add.js",
            type: "POST",
            data: { id: productId, quantity: 1 },
            dataType: "json"
        });   
        },
        getCartData: function(){
        return $.getJSON("/cart.json");  
        }
       ,
       stickyQuantityUpdate:function(){ 
         
          $('.qtyplus').click(function(e){
              e.preventDefault();
            
              var fieldName = $(this).attr('field');
              var maxInventoryCount = $('input[id='+fieldName+']').attr('data-max');
              var currentVal = parseInt($('input[id='+fieldName+']').val());
              
              
              //Check inventory max count
              if(maxInventoryCount == currentVal){
              	return false;            
              }
            
              if (!isNaN(currentVal)) {
                  $('input[id='+fieldName+']').val(currentVal + 1);
              } else {
                  $('input[id='+fieldName+']').val(0);
              }
              
          
              if(currentVal+1 > 0){
				$(this).closest('tr').addClass('green');	
                $(this).parents('.mob-variant-contents').addClass('green');
              }else{
               $(this).closest('tr').removeClass('green');	 
                $(this).parents('.mob-variant-contents').removeClass('green');
              }
              trekell.stickyCartupdate();
           
              
          });
          $(".qtyminus").click(function(e) { 
              e.preventDefault();         
              var fieldName = $(this).attr('field');
              var currentVal = parseInt($('input[id='+fieldName+']').val());
              if (!isNaN(currentVal) && currentVal == 0) {
                return false;
              }
                    
              if (!isNaN(currentVal) && currentVal > 0) {
                  $('input[id='+fieldName+']').val(currentVal - 1);
              } else {
                
                  $('input[id='+fieldName+']').val(1);
              }            
              
               if(currentVal-1 > 0){
				$(this).closest('tr').addClass('green');
                 $(this).parents('.mob-variant-contents').addClass('green');
              }else{
               $(this).closest('tr').removeClass('green');	
                $(this).parents('.mob-variant-contents').removeClass('green');
              }
            trekell.stickyCartupdate();
            
          });
         
       },
      
     inputOnblurfunction:function(){      
        $('.stickyquantity').on('keyup keydown', function(e){ 
            var maxInventoryCount = $(this).attr('data-max');
          	//alert(maxInventoryCount);
            if ($(this).val() > maxInventoryCount 
                && e.keyCode != 46
                && e.keyCode != 8
               ) {
               e.preventDefault();     
               $(this).val(maxInventoryCount);
            }
          
          if($(this).val()>0){
            $(this).closest('tr').addClass('green');	
            $(this).parents('.mob-variant-contents').addClass('green');
          }else{
            $(this).closest('tr').removeClass('green');	
            $(this).parents('.mob-variant-contents').removeClass('green');
          }
          
          trekell.stickyCartupdate();
        });
     },
      
      stickyCartupdate:function(){ 
         var sum = 0;       
         var total = 0;
         $('.green .qty-wrapper .stickyquantity').each(function() {
                sum += Number($(this).val());
                var price = Number($(this).attr('data-price').replace('$', ''));
           		total += Number($(this).val()) * price;
                
         });
         
         total = "$" + total.toFixed(2); 
         sum += " items";
         $("#stickyTotalPrice").text(total);
         $("#stickyQuantity").val(sum);
        
      },
      
      featuredCollection: function(){
         /* $('.js-featured-collection-slider-slick').slick({
            slidesToShow: 4,
            slidesToScroll: 1,
            infinite: true,
            dots: true,
            arrows: true,
            prevArrow: $('.full-width-slideshow-controls.featured-nav .prev'),
            nextArrow: $('.full-width-slideshow-controls.featured-nav .next'),
            responsive: [
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1
                }
              },
              {
                breakpoint: 640,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1
                }
              },
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1
                }
              }
            ]
          }); */  
      },
      
     readMoredescription: function(){ 
       $(".product-detail__detail .readmore").click(function(e) {  
         event.preventDefault();
         $('.product-detail__detail .truncated-description').hide();
         $('.product-detail__detail .original-description').show();       
       });
     }
      
    };
    trekell.init();
}(jQuery));


$(document).ready(function () {
    
	$("#stickyAddtoCart").click(function(e) {   
		//e.preventDefault();
		var toAdd = new Array();
        var qty ;
                                             
      $('.green .qty-wrapper .stickyquantity').each(function() {
         var qtyVal = parseInt($(this).val()); 
         if(qtyVal > 0 )
          {
           var variantID = $(this).attr('field');
            toAdd.push({
				variant_id: variantID,        
				quantity_id: $(this).val() || 0
			});
          }
        });
		function moveAlong(){
			if (toAdd.length) {
				var request = toAdd.shift();
				var tempId= request.variant_id;
				var tempQty = request.quantity_id;
				var params = {
					type: 'POST',
					url: '/cart/add.js',
					data: 'quantity='+tempQty+'&id='+tempId,
					dataType: 'json',
					success: function(line_item) { 
						//console.log("success!");
						moveAlong();

					},
					error: function() {
						//console.log("fail");
						//moveAlong();
						
					}
				};
				$.ajax(params);
			}
			else {
                if(typeof window.HSSLIDECART !== 'undefined') {
                  HsCartDrawer.getSlideCart();
                }
				//document.location.href = '/cart';
			}  
		};
		moveAlong();
	});
});


$('.brush-quicklinks').slick({
  slidesToShow: 6,
  slidesToScroll: 1,
  autoplay: false,
  prevArrow: $('.full-width-slideshow-controls.featured-nav .prev'),
  nextArrow: $('.full-width-slideshow-controls.featured-nav .next'),
  responsive: [
  {
    breakpoint: 1024,
    settings: {
      slidesToShow: 5,
    }
  },
  {
    breakpoint: 640,
    settings: {
      slidesToShow: 4,
    }
  },
  {
    breakpoint: 480,
    settings: {
      slidesToShow: 3,
    }
  }
  ]
});

$(document).ready(function(){
  $(".product-quick-links  a").click(function( event ) { 
    event.preventDefault();
    //$("html, body").animate({ scrollTop: $($(this).attr("href")).offset().top-100 }, 500);
  });
  
  // product description read more by height
  if($('.product-description-inner').height() < 180) {
    $('.product-collapes .readmore').hide();
  } else {
    $('.product-collapes .readmore').show();
  }
  
  

    if($('.product-detail__detail iframe').length > 0)  {
      console.log('abc');
      $('<div></div>').appendTo('.product-detail__images');
      $('.product-detail__detail iframe').css('max-width', '100%');
      $('.product-detail__detail iframe').parent().css('display', 'none');
      $('.product-detail__detail iframe').appendTo('.product-detail__images>div:last-child');
      $('.video_thumb').css('display', 'block');
      $('.video_thumb').append($('.video_thumb_icon'));
      $('.video_thumb .video_thumb_icon').css('display', 'block');
     /* $('.video_thumb').slick({
          slidesToShow: 5,
          slidesToScroll: 1,
          asNavFor: '.product-detail__images',
          dots: false,
          centerMode: false,
          focusOnSelect: true
        });*/
    }
  $(".product-quick-links a").click(function( event ) {
    event.preventDefault();
  	var selection_id = $(this).attr('href');
    $(".product-item.grid__item").removeClass("active");
    $(".product-item.grid__item").addClass("block");
    $(selection_id).removeClass("block");
    $(selection_id).addClass("active");
    
    $(".product-quick-links a").find("span").css({'color':'black', 'font-weight': 'normal'});
    $(this).find("span").css({'color':'#052F86', 'font-weight': 'bold'});
    $("html").animate(
      {
        scrollTop: $(selection_id).position().top
      },
      1000
    );
  })
  
  


  // Quantity controls                                                    
  var changeQuantity = {
    //         console.log('in init');
    init: function() {
      $('body').on('click', '.change-quantity', function(e) {
        e.preventDefault();
        console.log('Clicked');
        var $this = $(this),
            $quantity = $this.parent('.quantity-wrapper').find('input.quantity'),
            val = parseInt($quantity.val());

        if($this.data('change') == 'plus') {
//           $quantity.val(val + 1);
//           $quantity.trigger('change');
        } else {
//           if(val > 1) $quantity.val(val - 1);
//           $quantity.trigger('change');
        }
      });
    }
  }
  changeQuantity.init();
});



