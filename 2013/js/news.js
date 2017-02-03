var NEWS = (function($){
    return {
        //        TUMBLR_HOST: 'blog.cleverplugs.com',        
        //        TWITTER_ID: 'cleverplugs',
        TUMBLR_HOST: 'stream.red56.co.uk',
        TWITTER_ID: 'red56',
        DELICIOUS_ID: 'red56',
        
        addDeliciousLoader: function(){
            //console.log('addDeliciousLoader...');
            var url = 'http://feeds.delicious.com/v2/json/' + NEWS.DELICIOUS_ID + '?callback=NEWS.deliciousWrite&count=5';
            var script = document.createElement('script');
            $(script).attr('src', url);
            $('body').append(script);
        },
        
        addTwitterLoader: function(){
            var url = 'http://twitter.com/statuses/user_timeline/' + NEWS.TWITTER_ID + '.json?callback=NEWS.twitterWrite';//&count=5';
            //console.log('twitterLoader: '+url);
            var script = document.createElement('script');
            $(script).attr('src', url);
            $('body').append(script);
        },
        
        addTumblrLoader: function(){
            var url = 'http://' + NEWS.TUMBLR_HOST + '/api/read/json?callback=NEWS.tumblrWrite&num=5';
            var script = document.createElement('script');
            $(script).attr('src', url);
            $('body').append(script);
        },
        
        tumblrWrite: function(tumblrs){
            var $target = $('#tumblr-preview');
            $target.empty();
            var liTemplate = new Template('<li> \
        <h3><a href="#{url}">#{title}</a></h3> \
        <span class="excerpt">#{body}... </span> \
        <a class="blog-permalink" href="#{url}">read full post</a> \
        </li>');
            
            $.each(tumblrs["posts"], function(){
                var post = this;
                var title = '';
                var body = '';
                if (post['type'] == 'regular') {
                    title = post['regular-title'];
                    body = post['regular-body'];
                }
                else 
                    if (post['type'] == 'link') {
                        title = post['link-text'];
                        body = post['link-description'];
                    }
                    else 
                        if (post['type'] == 'quote') {
                            title = 'Quote';
                            body = post['quote-text'];
                        }
                        else 
                            if (post['type'] == 'photo') {
                                title = '(Photo)';
                                body = post['photo-caption'];
                            }
                            else 
                                if (post['type'] == 'video') {
                                    title = '(Video)';
                                    body = post['video-caption'];
                                }
                                else {
                                    /*console.log("========================");
                                    console.log("type:" + post['type']);
                                    $.each(post, function(ind, obj){
                                        console.log("----------\nattr-ind=" + ind);
                                        console.log("attr-obj=" + obj + " : " + this);
                                    });
                                    */
                                }
                var li = liTemplate.evaluate({
                    url: post['url'],
                    body: body.stripTags().substr(0, 110),
                    title: title
                });
                $target.append(li);
            });
        },
        twitterWrite: function(tweets){
            //console.log('twitterWrite: '+tweets.length);
						var $target = $('#twitter-preview');
            $target.empty();
            
            var liTemplate = new Template('<li> \
        <span class="tweet">#{body}</span> \
        <a class="blog-permalink" href="http://twitter.com/' + NEWS.TWITTER_ID + '/statuses/#{id}">#{created_at}</a> \
        </li>');
            
            $.each(tweets, function(index){
                if (index > 5) 
                    return;
                var tweet = this;
                if (tweet['text'] != undefined) {
                    $target.append(liTemplate.evaluate({
                        id: tweet['id'],
                        created_at: tweet['created_at'],
                        body: tweet['text'].linkify()
                    }));
                }
            });
        },
        deliciousWrite: function(links){
            //console.log('deliciousWrite...' + $('#delicious-preview').length);
            var $target = $('#delicious-preview');
            $target.empty();
            var liTemplate = new Template('<li> \
        <a class="delicious-link" href="#{url}">#{text}</a> \
				#{tags}\
        </li>');
            $.each(links, function(){
                var link = this;
                $target.append(liTemplate.evaluate({
                        url: link['u'],
                        text: link['d'],
												tags: $(link['t']).map(function() {
													return  '<a class="link-tag" href="http://delicious.com/'+NEWS.DELICIOUS_ID+'/'+this+'">'+this+'</a>';
          }).get().join(' ')
                    }));
                
            });
            
        },
				wordpressWriter: function(result) {
            if (!result.error) {
              var $target = $('#wordpress-preview');
              $target.empty();
            var liTemplate = new Template(
               '<li><h3><a href="#{url}">#{title}</a></h3>\
                    <span class="excerpt">#{body}</span> \
                    <a class="blog-permalink" href="#{url}">read full post</a></li>');
              for (var i = 0; i < result.feed.entries.length; i++) {
                var entry = result.feed.entries[i];
                var div = document.createElement("div");
								var li = liTemplate.evaluate({
                    url: entry.link,
                    title: entry.title,
                    publishedDate: entry.publishedDate,
                    body: entry.contentSnippet
                  });
                $target.append(li);
              }
            }
          }

    };
})(jQuery.noConflict());


String.prototype.linkify = function(){
    return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:% \?\/.=]+[^\.,\)\s*$]/g, function(m){
        return m.link(m);
    });
};

jQuery(function(){
    NEWS.addTumblrLoader();
    NEWS.addTwitterLoader();
    NEWS.addDeliciousLoader();
});
