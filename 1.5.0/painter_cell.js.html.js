tui.util.defineNamespace("fedoc.content", {});
fedoc.content["painter_cell.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview Painter class for cell(TD) views\n * @author NHN Ent. FE Development Team\n */\n'use strict';\n\nvar _ = require('underscore');\n\nvar Painter = require('../base/painter');\nvar util = require('../common/util');\nvar attrNameConst = require('../common/constMap').attrName;\nvar classNameConst = require('../common/classNameConst');\n\n/**\n * Painter class for cell(TD) views\n * @module painter/cell\n * @extends module:base/painter\n */\nvar Cell = tui.util.defineClass(Painter, /**@lends module:painter/cell.prototype */{\n    /**\n     * @constructs\n     * @param {Object} options - options\n     */\n    init: function(options) {\n        Painter.apply(this, arguments);\n\n        this.editType = options.editType;\n        this.inputPainter = options.inputPainter;\n        this.selector = 'td[' + attrNameConst.EDIT_TYPE + '=\"' + this.editType + '\"]';\n    },\n\n    /**\n     * key-value object contains event names as keys and handler names as values\n     * @type {Object}\n     */\n    events: {\n        dblclick: '_onDblClick'\n    },\n\n    /**\n     * Markup template\n     * @returns {string} template\n     */\n    template: _.template(\n        '&lt;td &lt;%=attributeString%>>&lt;%=contentHtml%>&lt;/td>'\n    ),\n\n    /**\n     * Event handler for 'dblclick' DOM event.\n     * @param {MouseEvent} event - mouse event object\n     */\n    _onDblClick: function(event) {\n        var address;\n\n        if (this._isEditableType()) {\n            address = this._getCellAddress($(event.target));\n            this.controller.startEditing(address, true);\n        }\n    },\n\n    /**\n     * Returns whether the instance is editable type.\n     * @returns {Boolean}\n     */\n    _isEditableType: function() {\n        return !_.contains(['normal', 'mainButton'], this.editType);\n    },\n\n    /**\n     * Returns the HTML string of the contents containg the value of the 'beforeContent' and 'afterContent'.\n     * @param {Object} cellData - cell data\n     * @returns {String}\n     * @private\n     */\n    _getContentHtml: function(cellData) {\n        var content = cellData.formattedValue,\n            beforeContent = cellData.beforeContent,\n            afterContent = cellData.afterContent;\n\n        if (this.inputPainter) {\n            content = this.inputPainter.generateHtml(cellData);\n\n            if (this._shouldContentBeWrapped() &amp;&amp; !this._isUsingViewMode(cellData)) {\n                beforeContent = this._getSpanWrapContent(beforeContent, classNameConst.CELL_CONTENT_BEFORE);\n                afterContent = this._getSpanWrapContent(afterContent, classNameConst.CELL_CONTENT_AFTER);\n                content = this._getSpanWrapContent(content, classNameConst.CELL_CONTENT_INPUT);\n\n                return beforeContent + afterContent + content;\n            }\n        }\n\n        return beforeContent + content + afterContent;\n    },\n\n    /**\n     * Returns whether the cell has view mode.\n     * @param {Object} cellData - cell data\n     * @returns {Boolean}\n     * @private\n     */\n    _isUsingViewMode: function(cellData) {\n        return tui.util.pick(cellData, 'columnModel', 'editOption', 'useViewMode') !== false;\n    },\n\n    /**\n     * Returns whether the contents should be wrapped with span tags to display them correctly.\n     * @returns {Boolean}\n     * @private\n     */\n    _shouldContentBeWrapped: function() {\n        return _.contains(['text', 'password', 'select'], this.editType);\n    },\n\n    /**\n     * 주어진 문자열을 span 태그로 감싼 HTML 코드를 반환한다.\n     * @param {string} content - 감싸질 문자열\n     * @param {string} className - span 태그의 클래스명\n     * @returns {string} span 태그로 감싼 HTML 코드\n     * @private\n     */\n    _getSpanWrapContent: function(content, className) {\n        if (tui.util.isFalsy(content)) {\n            content = '';\n        }\n\n        return '&lt;span class=\"' + className + '\">' + content + '&lt;/span>';\n    },\n\n    /**\n     * Returns the object contains attributes of a TD element.\n     * @param {Object} cellData - cell data\n     * @returns {Object}\n     * @private\n     */\n    _getAttributes: function(cellData) {\n        var classNames = [\n            cellData.className,\n            classNameConst.CELL,\n            classNameConst.CELL_CONTENT,\n            (cellData.rowNum % 2) ? classNameConst.CELL_ROW_ODD : classNameConst.CELL_ROW_EVEN\n        ];\n        var attrs = {\n            'align': cellData.columnModel.align || 'left'\n        };\n        attrs['class'] = classNames.join(' ');\n\n        attrs[attrNameConst.EDIT_TYPE] = this.editType;\n        attrs[attrNameConst.ROW_KEY] = cellData.rowKey;\n        attrs[attrNameConst.COLUMN_NAME] = cellData.columnName;\n        if (cellData.rowSpan) {\n            attrs.rowspan = cellData.rowSpan;\n        }\n\n        return attrs;\n    },\n\n    /**\n     * Attaches all event handlers to the $target element.\n     * @param {jquery} $target - target element\n     * @param {String} parentSelector - selector of a parent element\n     * @override\n     */\n    attachEventHandlers: function($target, parentSelector) {\n        Painter.prototype.attachEventHandlers.call(this, $target, parentSelector);\n\n        if (this.inputPainter) {\n            this.inputPainter.attachEventHandlers($target, parentSelector + ' ' + this.selector);\n        }\n    },\n\n    /**\n     * Generates a HTML string from given data, and returns it.\n     * @param {object} cellData - cell data\n     * @returns {string} HTML string of the cell (TD)\n     * @implements {module:base/painter}\n     */\n    generateHtml: function(cellData) {\n        var attributeString = util.getAttributesString(this._getAttributes(cellData)),\n            contentHtml = this._getContentHtml(cellData);\n\n        return this.template({\n            attributeString: attributeString,\n            contentHtml: contentHtml || '&amp;#8203;' // '&amp;#8203;' for height issue with empty cell in IE7\n        });\n    },\n\n    /**\n     * Refreshes the cell(td) element.\n     * @param {object} cellData - cell data\n     * @param {jQuery} $td - cell element\n     */\n    refresh: function(cellData, $td) {\n        var contentProps = ['value', 'isEditing', 'isDisabled', 'optionList'];\n        var editingChangedToTrue = _.contains(cellData.changed, 'isEditing') &amp;&amp; cellData.isEditing;\n        var shouldUpdateContent = _.intersection(contentProps, cellData.changed).length > 0;\n        var attrs = this._getAttributes(cellData);\n\n        delete attrs.rowspan; // prevent error in IE7 (cannot update rowspan attribute)\n        $td.attr(attrs);\n\n        if (editingChangedToTrue &amp;&amp; !this._isUsingViewMode(cellData)) {\n            this.inputPainter.focus($td);\n        } else if (shouldUpdateContent) {\n            $td.html(this._getContentHtml(cellData));\n            $td.scrollLeft(0);\n        }\n    }\n});\n\nmodule.exports = Cell;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"