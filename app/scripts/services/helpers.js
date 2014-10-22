define(['angular'], function(angular) {
    'use strict';

    angular.module('bannerAppApp.services.Helpers', [])
        .factory('Helpers', function() {
            var linkexp = /<[^>]*>\s*(\s*;\s*[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*")))*(,|$)/g;
            var paramexp = /[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*"))/g;
            // Public API here
            return {
                parseLinkHeader: function(value) {

                    if (!value) return;

                    var unquote = function(value) {
                        if (value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
                            return value.substring(1, value.length - 1);
                        }
                        return value;
                    }

                    var matches = value.match(linkexp);
                    var rels = {},
                        titles = {};
                    for (var i = 0; i < matches.length; i++) {
                        var split = matches[i].split('>');
                        var href = split[0].substring(1);
                        var ps = split[1];

                        var link = {};
                        link.href = href;
                        var s = ps.match(paramexp);
                        for (var j = 0; j < s.length; j++) {
                            var p = s[j];
                            var paramsplit = p.split('=');
                            var name = paramsplit[0];
                            link[name] = unquote(paramsplit[1]);
                        }

                        if (link.rel !== undefined) {
                            rels[link.rel] = link;
                        }
                        if (link.title !== undefined) {
                            titles[link.title] = link;
                        }
                    }

                    var linkheader = {};
                    linkheader.rels = rels;
                    linkheader.titles = titles;
                    return linkheader;
                },
                slugify: function(Text) {
                    return Text
                            .toLowerCase()
                            .replace(/[^\w ]+/g,'')
                            .replace(/ +/g,'-');
                }
            };
        });
});
