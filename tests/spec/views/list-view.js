define([
    'streamhub-sdk/jquery',
    'jasmine',
    'streamhub-sdk/views/list-view',
    'streamhub-sdk/content',
    'streamhub-sdk/content/views/content-view',
    'jasmine-jquery'],
function ($, jasmine, ListView, Content, ContentView) {
    'use strict';

    describe('List-View', function () {
        
        describe('when containing rendered content', function () {
            var list,
                content,
                contentView;
            beforeEach(function () {
                content = new Content('Body Text', 'id');
                contentView = new ContentView({'content': content});
                list = new ListView();
                list.add(contentView);
                
                expect(list.views.length).toBe(1);
                expect(list.$listEl[0].children.length).toBe(1);
            });
            
            it("removes content on 'removeContentView.hub'", function () {
                contentView.remove();
                
                expect(list.views.length).toBe(0);
                expect(list.$listEl[0].children.length).toBe(0);
            });
        });
    });
});
