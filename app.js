if (process.env.NODE_ENV != "production") {
  var config    = require('./config')  
}

var express     = require('express')
  , Twitter     = require('ntwitter')
	, sys 				= require('sys')
	, domainr 		= require('Domai.nr')
  , request     = require('request')


var app   = express.createServer(express.logger())
  , port  = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Listening on " + port);
});

console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV === "production") {
  var twit = new Twitter({
      consumer_key: process.env.CONSUMER_KEY
    , consumer_secret: process.env.CONSUMER_SECRET
    , access_token_key: process.env.TOKEN_KEY
    , access_token_secret: process.env.TOKEN_SECRET
  })
} else {
  var twit = new Twitter({
      consumer_key: config.CONSUMER_KEY
    , consumer_secret: config.CONSUMER_SECRET
    , access_token_key: config.TOKEN_KEY
    , access_token_secret:  config.TOKEN_SECRET
  })
}


twit
  .verifyCredentials(function (err, data) {
    if (err) { console.log("ERROR!\n" + err) }
  })
  .stream('statuses/filter', {'track':'@checkthisdomain'}, function(stream) {
    stream.on('data', function (tweet) {

      if (tweet.in_reply_to_screen_name === "checkthisdomain" && !tweet.retweeted) {

        var shortened_url       = encodeURIComponent( tweet.text.split(' ')[1] )
          , userToRespondTo     = tweet.user.screen_name
          , reply_to_status_id  = tweet.id_str
          , expanded_url;


        request("http://expandurl.appspot.com/expand?url=" + shortened_url, function(error, response, body) {
          if (response.statusCode === 200) {
            var json_body = JSON.parse( body )
            
            expanded_url = decodeURIComponent( json_body.end_url ) // like: http://example.com
            expanded_url = expanded_url.substr(expanded_url.indexOf('://')+3) // like: example.com

            if (expanded_url.length >= 60) {

              twit.updateStatus('@' + userToRespondTo + " sorry, " + shortened_url + " is a bit too long for me to test. Check out domainr.com, though!", {in_reply_to_status_id: reply_to_status_id}, function(err, data) {
                  if (err) { console.log("ERROR!\n" + err) }
              })
            } 

            else {

              domainr.info(expanded_url, function(responseFromDomainr) {

                switch (responseFromDomainr.availability) {
                  case "available":
                    twit.updateStatus('@' + userToRespondTo + " " + expanded_url + " is available! You can register it here: " + responseFromDomainr.register_url + " <3", {in_reply_to_status_id: reply_to_status_id}, function(err, data) {
                      if (err) { console.log("ERROR!\n" + err) }
                    })
                  break;

                  case "taken":
                    twit.updateStatus('@' + userToRespondTo + " " + expanded_url + " is taken =(", function(err, data) {
                      if (err) { console.log("ERROR!\n" + err) }
                    })
                    break;

                  case "unknown":
                    twit.updateStatus('@' + userToRespondTo + " hmmm. Domainr says it's 'unknown'. Why don't you check on their site? https://domainr.com", function(err, data) {
                      if (err) { console.log("ERROR!\n" + err) }
                    })
                    break;

                  case "default":
                    twit.updateStatus('@' + userToRespondTo + " hmmm. not sure what's wrong, but something is. Please use domainr.com.", function(err, data) {
                      if (err) { console.log("ERROR!\n" + err) }
                    })
                    break;
                }

              })
            }

          } else {
            twit.updateStatus('@' + userToRespondTo + " that is an invalid search. Make sure it's a valid domain, or use https://domainr.com. Thx!", {in_reply_to_status_id: reply_to_status_id}, function(err, data) {
                if (err) { console.log("ERROR!\n" + err) }
              }
            )
          }
        })

      }
    });
  });
