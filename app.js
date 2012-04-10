var express     = require('express')
  , Twitter     = require('ntwitter')
	, sys 				= require('sys')
	, domainr 		= require('Domai.nr')
  , request     = require('request')
  

if (process.env.USER === "cnnr") {
  config      = require('./config')
}



var app = express.createServer(express.logger()),
    port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Listening on " + port);
});

var twit = new Twitter({
    consumer_key: process.env['CONSUMER_KEY'] || config.CONSUMER_KEY
  , consumer_secret: process.env['CONSUMER_SECRET'] || config.CONSUMER_SECRET
  , access_token_key: process.env['TOKEN_KEY'] || config.TOKEN_KEY
  , access_token_secret: process.env['TOKEN_SECRET'] || config.TOKEN_SECRET
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

          request(shortened_url, function(error, response, body) {
            if (!error && response.statusCode === 200) {
              expanded_url = response.request.host

              domainr.info(expanded_url, function(responseFromDomainer) {

                condole.log(responseFromDomainer)

                /*switch (responseFromDomainer.availability) {
                  case "available":
                    twit.updateStatus('@' + userToRespondTo + " " + expanded_url + " is available! You can register it here: " + responseFromDomainer.registrars.register_url + " <3", function(err, data) {
                      if (err) { console.log(err) }
                    })
                    break;
                  case "taken":
                    twit.updateStatus('@' + userToRespondTo + " " + expanded_url + " is taken =(", function(err, data) {
                      if (err) { console.log(err) }
                    })
                    break;
                  case "unknown":
                    twit.updateStatus('@' + userToRespondTo + " hmmm. Domai.nr says it's 'unknown'. Why don't you check on their site? http://domai.nr", function(err, data) {
                      if (err) { console.log(err) }
                    })
                    break;
                }*/



              })
            }
          })

        }
      });
    });