(function($) {
    $.fn.hashtaginstafeed = function(options) {		
        var $container = this;
				
        var defaultOptions = $.extend({
            hashtag     : "",
            imageSize   : 320,
            limit       : 999999,
            link        : true
        }, options);

        if($.type(options) == "string")
            defaultOptions.hashtag = options;        

        if(defaultOptions.hashtag == "")
            return false;        

        var getImageSize = function(wantedImageSize) {
            switch(wantedImageSize) {
                case 150:
                    return 0;
                case 240:
                    return 1;
                case 320:
                    return 2;
                case 480:
                    return 3;
                case 640:
                    return 4;
                default:
                    return 2;
            }
        };

        var generateHtml = function(postsObj) {
            var html = "";			
            for(var i = 0; i < defaultOptions.limit; i++) {				
                if(postsObj[i] !== undefined) {					
                    var post = postsObj[i].node;					
                    var img = "<img src='" + post.thumbnail_resources[getImageSize(defaultOptions.imageSize)].src + "' alt='" + post.accessibility_caption + "' style='margin: 5px 10px'>"
                    
                    if(defaultOptions.link)
						img = "<a href='https://www.instagram.com/p/"+ post.shortcode +"' target='_blank'>" + img + "</a>";
                    
                    html += img;
                }   
            }
			
			html = "<center><figure>" + html + "</figure></center>";
            return html;
        };

        $.ajax({
			beforeSend: function(){
			   $('#loader').show();
			},
            url: "https://www.instagram.com/explore/tags/" + defaultOptions.hashtag + "/?__a=1",
            success: function(data) {
				
                var posts = data.graphql.hashtag.edge_hashtag_to_media.edges;				
                $container.html(generateHtml(posts));
            },
			error: function() {
				$("#message").html("Nothing Found in Instagram for this Hashtag");
			},
			complete: function(data) {
				$('#loader').hide();
			}
        });
    }
})(jQuery);
