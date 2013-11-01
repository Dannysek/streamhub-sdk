define([
    'streamhub-sdk/jquery',
    'jasmine',
    'streamhub-sdk/content',
    'streamhub-sdk/content/enums',
    'jasmine-jquery'],
function ($, jasmine, Content, ENUMS) {
    'use strict';

    describe('Content', function () {
        it("can be constructed with just a string", function () {
            var body = 'what';
            var content = new Content(body);
            expect(content.body).toBe(body);
        });
        
        it("can be constructed with opts and opts.body and opts.id", function () {
            var body = 'what';
            var content = new Content({
                body: body,
                id: '123456'
            });
            expect(content.body).toBe(body);
        });
        
        it("has the specified id", function () {
            var content = new Content('body', '123456');
            expect(content.id).toBe('123456');
        });
        
        it("has an id even when none is specified", function () {
            var content = new Content('body');
            expect(content.id).toBe('0');
        });
        
        describe(".set", function () {
            var oldBody,
                newBody,
                content,
                onChange;
            beforeEach(function () {
                oldBody = "Body text";
                newBody = "New body text";
                content = new Content(oldBody);
                onChange = jasmine.createSpy('change listener');
            });
            
            it("only emits 'change' when something is changed", function () {
                content.on('change', onChange);
                
                content.set({body: newBody});//Change
                content.set({body: newBody});//Not changed
                
                expect(onChange).toHaveBeenCalledWith({body: newBody}, {body: oldBody});
                expect(onChange).not.toHaveBeenCalledWith({body: newBody}, {body: newBody});
            });
            
            it("emits 'change:setting' for each setting change", function () {
                content.on('change:body', onChange);
                content.on('change:visibility', onChange);
                
                content.set({body: newBody, visibility: ENUMS.VISIBILITY.OWNER});
                
                expect(onChange).toHaveBeenCalledWith(newBody, oldBody);
                expect(onChange).toHaveBeenCalledWith(ENUMS.VISIBILITY.OWNER, ENUMS.VISIBILITY.EVERYONE);
            });
            
            it("emits 'removed' event when its visibility is set to NONE", function () {
                content.on('removed', onChange);
                
                content.set({visibility: ENUMS.VISIBILITY.NONE});
                
                expect(onChange).toHaveBeenCalled();
            });
        });
    });
});
