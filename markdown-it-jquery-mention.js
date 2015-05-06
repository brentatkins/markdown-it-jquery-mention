/*! markdown-it-jquery-mention 0.0.1 */(function (f) { if (typeof exports === "object" && typeof module !== "undefined") { module.exports = f() } else if (typeof define === "function" && define.amd) { define([], f) } else { var g; if (typeof window !== "undefined") { g = window } else if (typeof global !== "undefined") { g = global } else if (typeof self !== "undefined") { g = self } else { g = this } g.markdownitjQueryMention = f() } })(function () {
    var define, module, exports; return (function e(t, n, r) { function s(o, u) { if (!n[o]) { if (!t[o]) { var a = typeof require == "function" && require; if (!u && a) return a(o, !0); if (i) return i(o, !0); var f = new Error("Cannot find module '" + o + "'"); throw f.code = "MODULE_NOT_FOUND", f } var l = n[o] = { exports: {} }; t[o][0].call(l.exports, function (e) { var n = t[o][1][e]; return s(n ? n : e) }, l, l.exports, e, t, n, r) } return n[o].exports } var i = typeof require == "function" && require; for (var o = 0; o < r.length; o++) s(r[o]); return s })({
        1: [function (require, module, exports) {
            'use strict';

            var mentionOptions = undefined;

            function mention(state, silent, options) {
                var token,
                    attrs,
                    max = state.posMax,
                    start = state.pos,
                    marker = state.src.charCodeAt(start);

                if (marker !== 0x40/* @ */) { return false; }
                if (silent) { return false; } // don't run anything in validation mode
                
                //using regular expressions
                var mentionRegex = /@\[([^\]]+)\]\(([^ \)]+)\)/g;
                var searchableContent = state.src.substring(start, max);
                var name, uid, last, type, typeUid;

                //only need to look at first match as we searching from the start of the string
                //so no need to loop through multiple matches
                var match = mentionRegex.exec(searchableContent);
                
                if (match && match.index === 0) {
                    //we have a winner! DING DING DING DING
                    name = match[1];
                    typeUid = match[2].split(':');
                    uid = typeUid[1];
                    type = typeUid[0];
                    last = match[0].length + start;
                    
                    if (mentionOptions.linkify) {
                        //conver to URL
                        token = state.push('link_open', 'a', 1);
                        token.attrs = attrs = [['href', mentionOptions.linkify.generateMentionUrl(type, uid, name)]];
                        attrs.push(['class', mentionOptions.linkify.cssClass]);

                        token = state.push('text', '', 0);
                        token.content = name;

                        token = state.push('link_close', 'a', -1);
                    } else {
                        //do not conver to link
                        //render as mark
                        token = state.push('mark_open', 'mark', 1);
                        token.markup = String.fromCharCode(0x40) + String.fromCharCode(0x40);
                        
                        token = state.push('text', '', 0);
                        token.content = name;

                        token = state.push('mark_close', 'mark', -1);
                        token.markup = String.fromCharCode(0x40) + String.fromCharCode(0x40);
                    }

                    state.pos = last;
                    //state.posMax = max;
                    return true;
                }

                return false;
            };


            module.exports = function mention_plugin(md, options) {
                mentionOptions = options;
                md.inline.ruler.before('link', 'mention', mention);
            };

        }, {}]
    }, {}, [1])(1)
});