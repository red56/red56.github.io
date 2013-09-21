var NEWS = (function($){
    return {
        TUMBLR_HOST: 'blog.cleverplugs.com',
				
				TWITTER_ID: 'cleverplugs',
				    
        addTwitterLoader: function(){
            var url = 'http://twitter.com/statuses/user_timeline/'+NEWS.TWITTER_ID+'.json?callback=NEWS.twitterWrite';//&count=5';
            var script = document.createElement('script');
            script.setAttribute('src', url);
            document.body.appendChild(script);
        },
        
        addTumblrLoader: function(){
            var url = 'http://'+NEWS.TUMBLR_HOST+'/api/read/json?callback=NEWS.tumblrWrite';
            var script = document.createElement('script');
            script.setAttribute('src', url);
            document.body.appendChild(script);
        },
        
        tumblrWrite: function(tumblrs){
            var previewList = $('tumblr-preview');
            var liTemplate = new Template('<li> \
        <h3><a href="#{url}">#{title}</a></h3> \
        <span class="excerpt">#{body}... </span> \
        <a class="blog-permalink" href="#{url}">read full post</a> \
        </li>');
            
            for (i in tumblrs["posts"]) {
                var post = tumblrs["posts"][i]
                if (post['type'] == 'regular') {
                    previewList.insert(liTemplate.evaluate({
                        url: post['url'],
                        body: post['regular-body'].stripTags().substr(0, 150),
                        title: post['regular-title']
                    }));
                }
            }
        },
        twitterWrite: function(tweets){
            var previewList = $('twitter-preview');
            var liTemplate = new Template('<li> \
        <span class="tweet">#{body}</span> \
        <a class="blog-permalink" href="http://twitter.com/cleverplugs/statuses/#{id}">#{created_at}</a> \
        </li>');
            
            for (i in tweets) {
                var tweet = tweets[i];
                if (tweet['text'] != undefined) {
                    previewList.insert(liTemplate.evaluate({
                        id: tweet['id'],
                        created_at: tweet['created_at'],
                        body: tweet['text'].linkify()
                    }));
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
    addTumblrLoader();
    addTwitterLoader();
});
