var express     = require('express')
  , Twitter     = require('ntwitter')
	, sys 				= require('sys')
	, domainr 		= require('Domai.nr')
  , request     = require('request')
  , config      = require('./config')

var app = express.createServer(express.logger()),
    port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Listening on " + port);
});

var twit = new Twitter({
    consumer_key: config.consumer_key
  , consumer_secret: config.consumer_secret
  , access_token_key: config.access_token_key
  , access_token_secret: config.access_token_secret
})


 twit
    .verifyCredentials(function (err, data) {
      if (err) { console.log(err) }
    })
    .stream('statuses/filter', {'track':'@checkthisdomain'}, function(stream) {
      stream.on('data', function (tweet) {
        if (tweet.in_reply_to_screen_name === "checkthisdomain" && !tweet.retweeted) {

          var shortened_url     = tweet.text.split(' ')[1]
            , userToRespondTo   = tweet.user.screen_name
            , expanded_url


          // TODO:
          // 1. follow user that tweets at us
          // 2. include link in response to register_url

          request(shortened_url, function(error, response, body) {
            if (!error && response.statusCode === 200) {
              expanded_url = response.request.host

              domainr.info(expanded_url, function(responseFromDomainer) {
                twit.updateStatus('@' + userToRespondTo + " " + expanded_url + " is: " + responseFromDomainer.availability + ".", function(err, data) {
                  if (err) { console.log(err) }
                })
              })
            }
          })

        }
      });
    });