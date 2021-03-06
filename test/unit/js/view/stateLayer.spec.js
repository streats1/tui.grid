'use strict';

var ModelManager = require('model/manager');
var DomState = require('domState');
var StateLayer = require('view/stateLayer');

var stateConst = require('common/constMap').renderState;
var classNameConst = require('common/classNameConst');
var message = require('common/message');

describe('view/stateLayer', function() {
    var $wrapper, stateLayer;

    beforeEach(function() {
        var modelManager = new ModelManager({
            domState: new DomState($('<div>'))
        });
        stateLayer = new StateLayer({
            dimensionModel: modelManager.dimensionModel,
            renderModel: modelManager.renderModel
        });
        message.setLanguage('ko');
        $wrapper = jasmine.getFixtures().set('<div>').css('position', 'relative');
    });

    it('should have LAYER_STATE class', function() {
        expect(stateLayer.$el).toHaveClass(classNameConst.LAYER_STATE);
    });

    describe('render()', function() {
        it('should not render if the renderState is DONE', function() {
            stateLayer.renderModel.set('state', stateConst.DONE);
            $wrapper.append(stateLayer.render().el);

            expect(stateLayer.$el).toBeHidden();
            expect(stateLayer.$el).toBeEmpty();
        });

        it('should render empty message if the renderState is EMPTY', function() {
            stateLayer.renderModel.set('state', stateConst.EMPTY);
            $wrapper.append(stateLayer.render().el);

            expect(stateLayer.$el).toContainElement('.' + classNameConst.LAYER_STATE_CONTENT);
            expect(stateLayer.$el.find('p').text()).toBe(message.get('noData'));
            expect(stateLayer.$el).toBeVisible();
        });

        it('should render loading message and image if the renderState is LOADING', function() {
            stateLayer.renderModel.set('state', stateConst.LOADING);
            $wrapper.append(stateLayer.render().el);

            expect(stateLayer.$el).toContainElement('.' + classNameConst.LAYER_STATE_CONTENT);
            expect(stateLayer.$el).toContainElement('.' + classNameConst.LAYER_STATE_LOADING);
            expect(stateLayer.$el.find('p').text()).toBe(message.get('onLoading'));
            expect(stateLayer.$el).toBeVisible();
        });
    });
});
