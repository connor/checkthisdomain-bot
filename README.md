# Welcome to @checkthisdomain!

Checkthisdomain is a twitter bot that tells you whether a specific domain is available or taken. It was mostly written as an excuse for [@connor](http://twitter.com/connor) to make a twitter bot, and hack more on the Domai.nr API (if the [chrome extensnion](https://chrome.google.com/webstore/detail/ckimnhkhhfcedianojdljjgpgachccpf) and [NPM Package](http://search.npmjs.org/#/Domai.nr) weren't enough).

Anyways, it's super simple - send a tweet like this (note that it detects the first string that follows `@checkthisdomain` with a space):

	@checkthisdomain connormontgomery.com

Go ahead, <a href="https://twitter.com/intent/tweet?text=%40checkthisdomain%20cnnr.me">give it a try!</a>

and it will respond to you whether or not it's taken. Why would you want to use this instead of Domai.nr, the chrome extension, or manually going to a site? I don't know, but it sounded fun to build.

## Credits

This app utilizes the following:

- [Domai.nr](http://domai.nr/)
- [Domai.nr NPM Package](http://search.npmjs.org/#/Domai.nr)
- [Expand URL](http://expandurl.appspot.com/) by [@AechPee](http://twitter.com/AechPee)
- [nTwitter](https://github.com/AvianFlu/ntwitter/issues/40)
- [express](https://github.com/mikeal/request)


## A few notes...

- The Twitter API doesn't allow apps to send duplicated tweets. So, if you happen to tweet at `@checkthisdomain` a specific domain, and try again some time later, the second request won't send a tweet back to you (unless the status of the domain has changed). That's due to Twitter trying to minimize spam bots.

- If you request a specific domain and it forwards to another domain (i.e. `connormontgomery.com` -> `cnnr.me`), it will process the final domain.

- This supports up to 10 redirects (re: the note above)