define(['angular', 'jwt'], function (angular) {
  'use strict';

  /**
   * Library to help you work with JWTs on AngularJS
   * https://github.com/auth0/angular-jwt
   */
  angular.module('bannerAppApp.services.Jwthelper', [])
	.service('Jwthelper', function Jwthelper() {
	// AngularJS will instantiate a singleton by calling "new" on this function

		/**
		 * pure JavaScript implementation of JSON Web Signature(JWS) and JSON Web Token(JWT)
		 * https://github.com/kjur/jsjws
		 */
		this.generateSignedJWT = function(API) {
			var url = new URL(API.URL);

			var header  = JSON.stringify({
			  "alg": "RS256",
			  "typ": "JWT"
			});
			var payload = JSON.stringify({
			  	"iss": API.CLIENT.ID,
			  	"sub": API.USER.ID,
			  	"nbf": KJUR.jws.IntDate.get('now'),
			  	"exp": KJUR.jws.IntDate.get('now + 1hour'),
			  	"iat": KJUR.jws.IntDate.get('now'),
			  	"aud": 'http://localhost:8080' 
			});

			// "aud": url.origin
			var key = this.readFile('/assets/keys/1413098344_privkey.pem');
			// var key = this.privateKey;

			return KJUR.jws.JWS.sign(null, header, payload, key);
		}

		this.privateKey = "-----BEGIN RSA PRIVATE KEY-----\n" +
		"MIIEpAIBAAKCAQEAqLvDVccwbsQ38Mpl0CwS+3crPA6im4t1YphRFztxIWV3jvmo\n" +
		"/mjR9b4NZM8j4GR0loybWDd6fwVEqKGZC7BOTmVlKomkdQe5FsI+YkslFc0ri6aP\n" +
		"/zAVicZkr6kKTueMQWfCiQsCrf3knVCd1bFQqXiiFeYSAIWkXayKMFyXDDTPfbfe\n" +
		"0qvg9Uc5n2oqsm8g35P9M6GZKIotp7+ixDgRckxK1RbbXvgKEIuuIoS4y8NIHFw/\n" +
		"condjQFZsMcckMnE6sq3yHgz9o2VS5twhLPZ6OtMO0MsnEh7qZ+Fp89frNkEvceM\n" +
		"MsDTNBdGgamah3wA0pjYvkwb6PJg8M+LCXacOQIDAQABAoIBABibEPgwTPLKMHIv\n" +
		"wbsiwj3jee2PIM1X/+050xF1PKEnH9E8vRUkigGxDlj2EABIBexyYrDxni5pwUJq\n" +
		"FlxrAHBUPvV+Dvp1/tq/xsMkvCq6ua/qwTLweyOVR9eJ6hPplj1veSHs9h4TWURL\n" +
		"nkisS9v62IAjBdsHohl68MfuqKRBzqZNCJyZwNl8Gbf0dypJ+zRSxP289ocCV+qT\n" +
		"Z93WNW+m7T+doFJa144JEifostM01e4NiQn/T8XmXygy67YaBSci7fGim8x2xc7o\n" +
		"mvKy5MotGpTX2Myd0h/qCwzFTXyTv4a1bnedDF0v25sSh5NyR/4+MzN9b4bARJpE\n" +
		"kl5Gp/UCgYEA0IPyvo1lgkCNZVN3oGXa84py6u9X5vfjDNFXbH6fND4nyS2Tsur3\n" +
		"qn3y/EDL/1GQS/x+v3ioB9vTBTMBEz/s6S8U0LsZkjRqR8ClDpP+ZfwbwAJh9kjs\n" +
		"9LM4taJrya89uYLNKKjoGhm9fseMh5wMolrpbK3MNC4Ze7S/BBUAUgMCgYEAzyia\n" +
		"AHwSEgJolHZtFf+CfBO+YYPM3PgVOTBSPC9qb31Cq7+YzaWbH0m4UyNMmAzWnu/M\n" +
		"Kp6cVFxKSzU02uu5Oat5w63A2M2PfKRs6ta0BSIzCjOCzIGFZtNcNL5r9pYmeXqL\n" +
		"Pw3IptQAxhFvNhB8G5E1LsjveJ0leBCO8W+ZghMCgYAOQcdaMg7LviAs2m0mgXBc\n" +
		"EI5U8/J9r1tN6A5jM7EtAEb2IXCk3h37AUuY5dFM7sW//E6qRtSuXOBrzZX4O/m1\n" +
		"4+s3bmOMNJtDtq9SdNoDHR7EnSUXktrozExHVwiprJq60W+3pPzhs/rZ7Uj1iLzw\n" +
		"aOjm7mc09iX16GDbJZh1AwKBgQC6Bki8tK15dKY641m0Dl07VHN6l+OIblKIp2bB\n" +
		"WwbmFQKgvg3WZac14npeVe17ANRdpxKdFw9lBfdFMANFr7YGHoDaghYR2g3GrNSN\n" +
		"0b2YeoyA1Z7YTFrh6lz7lB/ZMB5eqfeO6K7NeMU1GATY9Nat3qh2WcQJeHxkI+Jo\n" +
		"1oFv9wKBgQCtei16glg7OjiyIp5+B0sS00ZptYqRHDJ2v5T6J0jlv9GeLOVNI/Ds\n" +
		"4OHNmgvESJqrUsjuEKVaPWpCrLQOAVQgvQpAtkQgoFNhtNBc2KBB4fpms/0HZxqn\n" +
		"ppaBhgvR30aXoTUXermBHxO4ayFK5zLo/aVNFzRM6YRyx7hLfqsmQA==\n" +
		"-----END RSA PRIVATE KEY-----";
		/** 
		 * https://raw.githubusercontent.com/kvz/phpjs/master/functions/filesystem/file_get_contents.js
		 */
		this.readFile = function (url, flags, context, offset, maxLen) {
		    //  discuss at: http://phpjs.org/functions/file_get_contents/
		    // original by: Legaev Andrey
		    //    input by: Jani Hartikainen
		    //    input by: Raphael (Ao) RUDLER
		    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		    // improved by: Brett Zamir (http://brett-zamir.me)
		    // bugfixed by: Brett Zamir (http://brett-zamir.me)
		    //        note: This function uses XmlHttpRequest and cannot retrieve resource from different domain without modifications.
		    //        note: Synchronous by default (as in PHP) so may lock up browser. Can
		    //        note: get async by setting a custom "phpjs.async" property to true and "notification" for an
		    //        note: optional callback (both as context params, with responseText, and other JS-specific
		    //        note: request properties available via 'this'). Note that file_get_contents() will not return the text
		    //        note: in such a case (use this.responseText within the callback). Or, consider using
		    //        note: jQuery's: $('#divId').load('http://url') instead.
		    //        note: The context argument is only implemented for http, and only partially (see below for
		    //        note: "Presently unimplemented HTTP context options"); also the arguments passed to
		    //        note: notification are incomplete
		    //        test: skip
		    //   example 1: var buf file_get_contents('http://google.com');
		    //   example 1: buf.indexOf('Google') !== -1
		    //   returns 1: true

		    var tmp, headers = [],
		        newTmp = [],
		        k = 0,
		        i = 0,
		        href = '',
		        pathPos = -1,
		        flagNames = 0,
		        content = null,
		        http_stream = false;
		    var func = function(value) {
		        return value.substring(1) !== '';
		    };

		    // BEGIN REDUNDANT
		    this.php_js = this.php_js || {};
		    this.php_js.ini = this.php_js.ini || {};
		    // END REDUNDANT
		    var ini = this.php_js.ini;
		    context = context || this.php_js.default_streams_context || null;

		    if (!flags) {
		        flags = 0;
		    }
		    var OPTS = {
		        FILE_USE_INCLUDE_PATH: 1,
		        FILE_TEXT: 32,
		        FILE_BINARY: 64
		    };
		    if (typeof flags === 'number') {
		        // Allow for a single string or an array of string flags
		        flagNames = flags;
		    } else {
		        flags = [].concat(flags);
		        for (i = 0; i < flags.length; i++) {
		            if (OPTS[flags[i]]) {
		                flagNames = flagNames | OPTS[flags[i]];
		            }
		        }
		    }

		    if (flagNames & OPTS.FILE_BINARY && (flagNames & OPTS.FILE_TEXT)) {
		        // These flags shouldn't be together
		        throw 'You cannot pass both FILE_BINARY and FILE_TEXT to file_get_contents()';
		    }

		    if ((flagNames & OPTS.FILE_USE_INCLUDE_PATH) && ini.include_path && ini.include_path.local_value) {
		        var slash = ini.include_path.local_value.indexOf('/') !== -1 ? '/' : '\\';
		        url = ini.include_path.local_value + slash + url;
		    } else if (!/^(https?|file):/.test(url)) {
		        // Allow references within or below the same directory (should fix to allow other relative references or root reference; could make dependent on parse_url())
		        href = window.location.href;
		        pathPos = url.indexOf('/') === 0 ? href.indexOf('/', 8) - 1 : href.lastIndexOf('/');
		        url = href.slice(0, pathPos + 1) + url;
		    }

		    var http_options;
		    if (context) {
		        http_options = context.stream_options && context.stream_options.http;
		        http_stream = !!http_options;
		    }

		    if (!context || !context.stream_options || http_stream) {
		        var req = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
		        if (!req) {
		            throw new Error('XMLHttpRequest not supported');
		        }

		        var method = http_stream ? http_options.method : 'GET';
		        var async = !!(context && context.stream_params && context.stream_params['phpjs.async']);

		        if (ini['phpjs.ajaxBypassCache'] && ini['phpjs.ajaxBypassCache'].local_value) {
		            url += (url.match(/\?/) == null ? '?' : '&') + (new Date())
		                .getTime(); // Give optional means of forcing bypass of cache
		        }

		        req.open(method, url, async);
		        if (async) {
		            var notification = context.stream_params.notification;
		            if (typeof notification === 'function') {
		                // Fix: make work with req.addEventListener if available: https://developer.mozilla.org/En/Using_XMLHttpRequest
		                if (0 && req.addEventListener) {
		                    // Unimplemented so don't allow to get here
		                    /*
					          req.addEventListener('progress', updateProgress, false);
					          req.addEventListener('load', transferComplete, false);
					          req.addEventListener('error', transferFailed, false);
					          req.addEventListener('abort', transferCanceled, false);
					          */
		                } else {
		                    req.onreadystatechange = function(aEvt) {
		                        // aEvt has stopPropagation(), preventDefault(); see https://developer.mozilla.org/en/NsIDOMEvent
		                        // Other XMLHttpRequest properties: multipart, responseXML, status, statusText, upload, withCredentials
		                        /*
								  PHP Constants:
								  STREAM_NOTIFY_RESOLVE   1       A remote address required for this stream has been resolved, or the resolution failed. See severity  for an indication of which happened.
								  STREAM_NOTIFY_CONNECT   2     A connection with an external resource has been established.
								  STREAM_NOTIFY_AUTH_REQUIRED 3     Additional authorization is required to access the specified resource. Typical issued with severity level of STREAM_NOTIFY_SEVERITY_ERR.
								  STREAM_NOTIFY_MIME_TYPE_IS  4     The mime-type of resource has been identified, refer to message for a description of the discovered type.
								  STREAM_NOTIFY_FILE_SIZE_IS  5     The size of the resource has been discovered.
								  STREAM_NOTIFY_REDIRECTED    6     The external resource has redirected the stream to an alternate location. Refer to message .
								  STREAM_NOTIFY_PROGRESS  7     Indicates current progress of the stream transfer in bytes_transferred and possibly bytes_max as well.
								  STREAM_NOTIFY_COMPLETED 8     There is no more data available on the stream.
								  STREAM_NOTIFY_FAILURE   9     A generic error occurred on the stream, consult message and message_code for details.
								  STREAM_NOTIFY_AUTH_RESULT   10     Authorization has been completed (with or without success).

								  STREAM_NOTIFY_SEVERITY_INFO 0     Normal, non-error related, notification.
								  STREAM_NOTIFY_SEVERITY_WARN 1     Non critical error condition. Processing may continue.
								  STREAM_NOTIFY_SEVERITY_ERR  2     A critical error occurred. Processing cannot continue.
								  */
		                        var objContext = {
		                            responseText: req.responseText,
		                            responseXML: req.responseXML,
		                            status: req.status,
		                            statusText: req.statusText,
		                            readyState: req.readyState,
		                            evt: aEvt
		                        }; // properties are not available in PHP, but offered on notification via 'this' for convenience
		                        // notification args: notification_code, severity, message, message_code, bytes_transferred, bytes_max (all int's except string 'message')
		                        // Need to add message, etc.
		                        var bytes_transferred;
		                        switch (req.readyState) {
		                            case 0:
		                                //     UNINITIALIZED     open() has not been called yet.
		                                notification.call(objContext, 0, 0, '', 0, 0, 0);
		                                break;
		                            case 1:
		                                //     LOADING     send() has not been called yet.
		                                notification.call(objContext, 0, 0, '', 0, 0, 0);
		                                break;
		                            case 2:
		                                //     LOADED     send() has been called, and headers and status are available.
		                                notification.call(objContext, 0, 0, '', 0, 0, 0);
		                                break;
		                            case 3:
		                                //     INTERACTIVE     Downloading; responseText holds partial data.
		                                // One character is two bytes
		                                bytes_transferred = req.responseText.length * 2;
		                                notification.call(objContext, 7, 0, '', 0, bytes_transferred, 0);
		                                break;
		                            case 4:
		                                //     COMPLETED     The operation is complete.
		                                if (req.status >= 200 && req.status < 400) {
		                                    // One character is two bytes
		                                    bytes_transferred = req.responseText.length * 2;
		                                    notification.call(objContext, 8, 0, '', req.status, bytes_transferred, 0);
		                                } else if (req.status === 403) {
		                                    // Fix: These two are finished except for message
		                                    notification.call(objContext, 10, 2, '', req.status, 0, 0);
		                                } else {
		                                    // Errors
		                                    notification.call(objContext, 9, 2, '', req.status, 0, 0);
		                                }
		                                break;
		                            default:
		                                throw 'Unrecognized ready state for file_get_contents()';
		                        }
		                    };
		                }
		            }
		        }

		        if (http_stream) {
		            var sendHeaders = (http_options.header && http_options.header.split(/\r?\n/)) || [];
		            var userAgentSent = false;
		            for (i = 0; i < sendHeaders.length; i++) {
		                var sendHeader = sendHeaders[i];
		                var breakPos = sendHeader.search(/:\s*/);
		                var sendHeaderName = sendHeader.substring(0, breakPos);
		                req.setRequestHeader(sendHeaderName, sendHeader.substring(breakPos + 1));
		                if (sendHeaderName === 'User-Agent') {
		                    userAgentSent = true;
		                }
		            }
		            if (!userAgentSent) {
		                var user_agent = http_options.user_agent || (ini.user_agent && ini.user_agent.local_value);
		                if (user_agent) {
		                    req.setRequestHeader('User-Agent', user_agent);
		                }
		            }
		            content = http_options.content || null;
		            /*
		      // Presently unimplemented HTTP context options
		      // When set to TRUE, the entire URI will be used when constructing the request. (i.e. GET http://www.example.com/path/to/file.html HTTP/1.0). While this is a non-standard request format, some proxy servers require it.
		      var request_fulluri = http_options.request_fulluri || false;
		      // The max number of redirects to follow. Value 1 or less means that no redirects are followed.
		      var max_redirects = http_options.max_redirects || 20;
		      // HTTP protocol version
		      var protocol_version = http_options.protocol_version || 1.0;
		      // Read timeout in seconds, specified by a float
		      var timeout = http_options.timeout || (ini.default_socket_timeout && ini.default_socket_timeout.local_value);
		      // Fetch the content even on failure status codes.
		      var ignore_errors = http_options.ignore_errors || false;
		      */
		        }

		        if (flagNames & OPTS.FILE_TEXT) {
		            // Overrides how encoding is treated (regardless of what is returned from the server)
		            var content_type = 'text/html';
		            if (http_options && http_options['phpjs.override']) {
		                // Fix: Could allow for non-HTTP as well
		                // We use this, e.g., in gettext-related functions if character set
		                content_type = http_options['phpjs.override'];
		                //   overridden earlier by bind_textdomain_codeset()
		            } else {
		                var encoding = (ini['unicode.stream_encoding'] && ini['unicode.stream_encoding'].local_value) || 'UTF-8';
		                if (http_options && http_options.header && (/^content-type:/im)
		                    .test(http_options.header)) {
		                    // We'll assume a content-type expects its own specified encoding if present
		                    // We let any header encoding stand
		                    content_type = http_options.header.match(/^content-type:\s*(.*)$/im)[1];
		                }
		                if (!(/;\s*charset=/)
		                    .test(content_type)) {
		                    // If no encoding
		                    content_type += '; charset=' + encoding;
		                }
		            }
		            req.overrideMimeType(content_type);
		        }
		        // Default is FILE_BINARY, but for binary, we apparently deviate from PHP in requiring the flag, since many if not
		        //     most people will also want a way to have it be auto-converted into native JavaScript text instead
		        else if (flagNames & OPTS.FILE_BINARY) {
		            // Trick at https://developer.mozilla.org/En/Using_XMLHttpRequest to get binary
		            req.overrideMimeType('text/plain; charset=x-user-defined');
		            // Getting an individual byte then requires:
		            // throw away high-order byte (f7) where x is 0 to responseText.length-1 (see notes in our substr())
		            // responseText.charCodeAt(x) & 0xFF;
		        }

		        try {
		            if (http_options && http_options['phpjs.sendAsBinary']) {
		                // For content sent in a POST or PUT request (use with file_put_contents()?)
		                // In Firefox, only available FF3+
		                req.sendAsBinary(content);
		            } else {
		                req.send(content);
		            }
		        } catch (e) {
		            // catches exception reported in issue #66
		            return false;
		        }

		        tmp = req.getAllResponseHeaders();
		        if (tmp) {
		            tmp = tmp.split('\n');
		            for (k = 0; k < tmp.length; k++) {
		                if (func(tmp[k])) {
		                    newTmp.push(tmp[k]);
		                }
		            }
		            tmp = newTmp;
		            for (i = 0; i < tmp.length; i++) {
		                headers[i] = tmp[i];
		            }
		            // see http://php.net/manual/en/reserved.variables.httpresponseheader.php
		            this.$http_response_header = headers;
		        }

		        if (offset || maxLen) {
		            if (maxLen) {
		                return req.responseText.substr(offset || 0, maxLen);
		            }
		            return req.responseText.substr(offset);
		        }
		        return req.responseText;
		    }
		    return false;
		};

		this.urlBase64Decode = function(str) {
      		var output = str.replace('-', '+').replace('_', '/');
			switch (output.length % 4) {
			    case 0:
			        {
			            break;
			        }
			    case 2:
			        {
			            output += '==';
			            break;
			        }
			    case 3:
			        {
			            output += '=';
			            break;
			        }
			    default:
			        {
			            throw 'Illegal base64url string!';
			        }
			}
			return window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
		}

		this.decodeToken = function(token) {
		    var parts = token.split('.');

		    if (parts.length !== 3) {
		        throw new Error('JWT must have 3 parts');
		    }

		    var decoded = this.urlBase64Decode(parts[1]);
		    if (!decoded) {
		        throw new Error('Cannot decode the token');
		    }

		    return JSON.parse(decoded);
		}

		this.getTokenExpirationDate = function(token) {
		    var decoded;
		    decoded = this.decodeToken(token);

		    if (!decoded.expires) {
		        return null;
		    }

		    var d = new Date(0); // The 0 here is the key, which sets the date to the epoch
		    d.setUTCSeconds(decoded.expires);

		    return d;
		};

		this.isTokenExpired = function(token) {
		    var d = this.getTokenExpirationDate(token);

		    if (!d) {
		        return false;
		    }

		    // Token expired?
		    return !(d.valueOf() > new Date().valueOf());
		};

	});
});
