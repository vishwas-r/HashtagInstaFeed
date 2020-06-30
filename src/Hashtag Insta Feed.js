(function($) {
    var constructUrlSettings = function(searchString) {
        var type = 'hashtag';
        var keyword = '';
        var url = '';

		if(searchString.indexOf("#") > -1) {
            keyword = searchString.substring(searchString.indexOf('#') + 1);
        } else {
            keyword = searchString;
        }

		url = "https://www.instagram.com/explore/tags/" + keyword + "/?__a=1";
        return {
            url: url,
            type: type
        };
    }

    $.fn.hashtaginstafeed = function(userSettings) {
        var $container = this;
        var defaultOptions = $.extend({
            get         : "#shanvi",
            type        : "",
            imageSize   : 320,
            limit       : 100,
            link        : true,
            template    : "",
            after       : function(){$('#loader').hide();}
        }, userSettings);
        
        if(typeof userSettings == "string") {
            defaultOptions.get = userSettings;
        }

        var urlSettings = constructUrlSettings(defaultOptions.get);
        defaultOptions.type = urlSettings.type;

        var getImageSrcOfSize = function(post) {
            var requiredImageSize = defaultOptions.imageSize;

            if(typeof requiredImageSize == "number") {
                switch(requiredImageSize) {
                    case 150:
                        return post.thumbnail_resources[0].src;
                    case 240:
                        return post.thumbnail_resources[1].src;
                    case 320:
                        return post.thumbnail_resources[2].src;
                    case 480:
                        return post.thumbnail_resources[3].src;
                    case 640:
                        return post.thumbnail_resources[4].src;
                    default:
                        return post.thumbnail_resources[0].src;
                }
            } else if(requiredImageSize == "raw") {
                return post.display_url;
            } else {
                return post.thumbnail_resources[0].src;
            }
            
        };

        var buildTemplate = function(post) {
            String.prototype.allReplace = function(obj) {
                var retStr = this;
                for (var x in obj) {
                    retStr = retStr.replace(new RegExp(x, "g"), obj[x]);
                }
                return retStr;
            };

            var templateCodes = {
                "{{accessibility_caption}}" : post.accessibility_caption,
                "{{caption}}": ((post.edge_media_to_caption.edges.length > 0) ? post.edge_media_to_caption.edges[0].node.text : ""),
                "{{comments}}": post.edge_media_to_comment.count,
                "{{image}}": getImageSrcOfSize(post),
                "{{likes}}": post.edge_liked_by.count,
                "{{link}}": "https://www.instagram.com/p/"+ post.shortcode,
            }

            var template = defaultOptions.template.allReplace(templateCodes);
            return template;
        }

        var generateHtml = function(ajaxResult) {
            var html = "";
            var postsObjObject = ajaxResult.edge_hashtag_to_media;

            var postsObj = postsObjObject.edges;

            for(var i = 0; i < defaultOptions.limit; i++) {
                if(postsObj[i] !== undefined) {
                    var post = postsObj[i].node;
                    var tempHtml = "";

                    if(defaultOptions.template != "") {
                        tempHtml = buildTemplate(post);
                    } else {
                        tempHtml = "<div class='col-sm-4'><img src='" + getImageSrcOfSize(post) + "' alt='" + post.accessibility_caption + "' style='margin: 5px 10px; border: 1px solid black; border-radius: 5px;'></div>";
                    
                        if(defaultOptions.link) {
                            tempHtml = "<a href='https://www.instagram.com/p/"+ post.shortcode +"'>" + tempHtml + "</a>";
                        }
                    }
                    html += tempHtml;
                }   
            }
            return html;
        };

        $.ajax({
            url: urlSettings.url,
        }).done(function(data) {
            $container.html(generateHtml(data.graphql[defaultOptions.type]));
            defaultOptions.after();
        }).fail(function(data) {
			console.warn('An unknow error occured! Pls Try Again');
        });
    }

    $.hashtaginstafeed = function(keyword) {
        var urlSettings = constructUrlSettings(keyword);
        var result = '';

        $.ajax({
            url: urlSettings.url,
            async: false
        }).done(function(data) {
            result = data.graphql[urlSettings.type];
        }).fail(function(data) {
			console.warn('An unknow error occured! Pls Try Again');
        });
        return result;
    }
})(jQuery);
