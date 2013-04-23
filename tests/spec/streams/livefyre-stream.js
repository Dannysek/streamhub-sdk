define([
    'jquery',
    'jasmine',
    'streamhub-sdk/content/content',
    'streamhub-sdk/streams/livefyre-stream',
    'streamhub-sdk/clients/livefyre-stream-client',
    'streamhub-sdk/clients/livefyre-write-client',
    'jasmine-jquery'],
function ($, jasmine, Content, LivefyreStream, LivefyreStreamClient, LivefyreWriteClient) {
    describe('A LivefyreStream', function () {

        var stream, opts, spy;
        var mockData = {"states":{"tweet-312328006913904641@twitter.com":{"vis":1,"content":{"replaces":"","bodyHtml":"<a vocab=\"http://schema.org\" typeof=\"Person\" rel=\"nofollow\" resource=\"acct:14268796\" data-lf-handle=\"\" data-lf-provider=\"twitter\" property=\"url\" href=\"https://twitter.com/#!/TheRoyalty\" target=\"_blank\" class=\"fyre-mention fyre-mention-twitter\">@<span property=\"name\">TheRoyalty</span></a> hoppin on a green frog after the set at <a vocab=\"http://schema.org\" typeof=\"Person\" rel=\"nofollow\" resource=\"acct:1240466234\" data-lf-handle=\"\" data-lf-provider=\"twitter\" property=\"url\" href=\"https://twitter.com/#!/Horseshoe_SX13\" target=\"_blank\" class=\"fyre-mention fyre-mention-twitter\">@<span property=\"name\">Horseshoe_SX13</span></a> showcase during <a href=\"https://twitter.com/#!/search/realtime/%23sxsw\" class=\"fyre-hashtag\" hashtag=\"sxsw\" rel=\"tag\" target=\"_blank\">#sxsw</a> <a href=\"http://t.co/lUqA5TT7Uy\" target=\"_blank\" rel=\"nofollow\">pic.twitter.com/lUqA5TT7Uy</a>","annotations":{},"authorId":"190737922@twitter.com","parentId":"","updatedAt":1363299774,"id":"tweet-312328006913904641@twitter.com","createdAt":1363299774},"source":1,"lastVis":0,"type":0,"event":1363299777181024},"oem-3-tweet-312328006913904641@twitter.com":{"vis":1,"content":{"targetId":"tweet-312328006913904641@twitter.com","authorId":"-","link":"http://twitter.com/PlanetLA_Music/status/312328006913904641/photo/1","oembed":{"provider_url":"http://twitter.com","title":"Twitter / PlanetLA_Music: @TheRoyalty hoppin on a green ...","url":"","type":"rich","html":"<blockquote class=\"twitter-tweet\"><a href=\"https://twitter.com/PlanetLA_Music/status/312328006913904641\"></a></blockquote><script async src=\"//platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>","author_name":"","height":0,"thumbnail_width":568,"width":0,"version":"1.0","author_url":"","provider_name":"Twitter","thumbnail_url":"https://pbs.twimg.com/media/BFWcquJCUAA7orG.jpg","thumbnail_height":568},"position":3,"id":"oem-3-tweet-312328006913904641@twitter.com"},"source":1,"lastVis":0,"type":3,"event":1363299777193595}},"authors":{"190737922@twitter.com":{"displayName":"PlanetLA_Music","tags":[],"profileUrl":"https://twitter.com/#!/PlanetLA_Music","avatar":"http://a0.twimg.com/profile_images/1123786999/PLAnew-logo_normal.jpg","type":3,"id":"190737922@twitter.com"}},"jsver":"10026","maxEventId":1363299777193595};
        var finished;
        
        beforeEach(function() {
            finished = false;
            opts = {
                "network": "labs-t402.fyre.co",
                "collectionId": "10669131",
                "commentId": "0"
            };
            spy = spyOn(LivefyreStreamClient, "getContent").andCallFake(function(opts, fn) {
                if (!finished) {
                    finished = true;
                    fn(null, mockData);
                } else {
                    fn("error");
                }
            });
            
            stream = new LivefyreStream(opts);
            stream._push = jasmine.createSpy();
            stream._endRead = jasmine.createSpy();
        });
        
        it ("should getContent() from LivefyreStreamClient when _read() is called", function () {
            stream._read();
    
            waitsFor(function() {
                return stream._endRead.callCount > 0;
            });
            runs(function() {
                expect(spy).toHaveBeenCalled();
                expect(stream._endRead).toHaveBeenCalled();
                expect(stream._endRead.callCount).toBe(1);
                expect(stream._push).toHaveBeenCalled();
                expect(stream._push.callCount).toBe(1);
                expect(stream.commentId).toBe(1363299777193595);
            });
        });
        
        it ("should append author data from getContent() LivefyreStreamClient when _read() is called", function () {
            stream._read();
    
            waitsFor(function() {
                return stream._endRead.callCount > 0;
            });
            runs(function() {
                expect(stream._push.callCount).toBe(1);
                expect(stream._push.calls[0].args[0].author).toBeDefined();
            });
        });

        describe(".write()", function () {
            var mockWriteResponse = {"status": "ok", "code": 200, "data": {"messages": [{"content": {"replaces": null, "bodyHtml": "<p>oh hi there 2</p>", "annotations": {"moderator": true}, "source": 0, "authorId": "system@labs-t402.fyre.co", "parentId": null, "mentions": [], "shareLink": "http://t402.livefyre.com/.fyreit/w9lbch.4", "id": "26394571", "createdAt": 1363808885}, "vis": 1, "type": 0, "event": null, "source": 0}], "authors": {"system@labs-t402.fyre.co": {"displayName": "system", "tags": [], "profileUrl": "", "avatar": "http://gravatar.com/avatar/e23293c6dfc25b86762b045336233add/?s=50&d=http://d10g4z0y9q0fip.cloudfront.net/a/anon/50.jpg", "type": 1, "id": "system@labs-t402.fyre.co"}}}};
            beforeEach(function () {
                spyOn(LivefyreStream.prototype, '_write').andCallThrough();
                spyOn(LivefyreWriteClient, 'postContent').andCallFake(function (params, callback) {
                    if (callback) {
                        callback(null, mockWriteResponse);
                    }
                });
            });

            it("throws if not passed an lftoken in opts", function () {
                var content = new Content('Woah!');
                expect(function () {
                    stream.write(content);
                }).toThrow();
                expect(function () {
                    stream.write(content, {});
                }).toThrow();
                expect(function () {
                    stream.write(content, { lftoken: 'token' });
                }).not.toThrow();
            });

            it("can write a String", function () {
                stream.write('unicorns', { lftoken: 'token' });
                expect(stream._write).toHaveBeenCalled();
            });

            it("can write a Content instance", function () {
                var content = new Content('Woah!');
                stream.write(content, { lftoken: 'token' });
                expect(stream._write).toHaveBeenCalled();
            });
        });
    }); 
});
