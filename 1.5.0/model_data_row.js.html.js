tui.util.defineNamespace("fedoc.content", {});
fedoc.content["model_data_row.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview Grid 의 Data Source 에 해당하는 Model 정의\n * @author NHN Ent. FE Development Team\n */\n'use strict';\n\nvar _ = require('underscore');\n\nvar Model = require('../../base/model');\nvar ExtraDataManager = require('./extraDataManager');\nvar util = require('../../common/util');\nvar classNameConst = require('../../common/classNameConst');\n\n// Propertie names that indicate meta data\nvar PRIVATE_PROPERTIES = [\n    '_button',\n    '_number',\n    '_extraData'\n];\n\n// Error code for validtaion\nvar VALID_ERR_REQUIRED = 'REQUIRED';\n\n/**\n * Data 중 각 행의 데이터 모델 (DataSource)\n * @module model/data/row\n * @extends module:base/model\n */\nvar Row = Model.extend(/**@lends module:model/data/row.prototype */{\n    /**\n     * @constructs\n     */\n    initialize: function() {\n        Model.prototype.initialize.apply(this, arguments);\n        this.extraDataManager = new ExtraDataManager(this.get('_extraData'));\n\n        this.columnModel = this.collection.columnModel;\n        this.validateMap = {};\n        this.on('change', this._onChange, this);\n    },\n\n    idAttribute: 'rowKey',\n\n    /**\n     * Overrides Backbone's parse method for extraData not to be null.\n     * @override\n     * @param  {object} data - initial data\n     * @returns {object} - parsed data\n     */\n    parse: function(data) {\n        if (!data._extraData) {\n            data._extraData = {};\n        }\n        return data;\n    },\n\n    /**\n     * Event handler for change event in _extraData.\n     * Reset _extraData value with cloned object to trigger 'change:_extraData' event.\n     * @private\n     */\n    _triggerExtraDataChangeEvent: function() {\n        this.trigger('extraDataChanged', this.get('_extraData'));\n    },\n\n    /**\n     * Event handler for 'change' event.\n     * Executes callback functions, sync rowspan data, and validate data.\n     * @private\n     */\n    _onChange: function() {\n        var publicChanged = _.omit(this.changed, PRIVATE_PROPERTIES);\n\n        if (this.isDuplicatedPublicChanged(publicChanged)) {\n            return;\n        }\n        _.each(publicChanged, function(value, columnName) {\n            var columnModel = this.columnModel.getColumnModel(columnName);\n            if (!columnModel) {\n                return;\n            }\n            if (!this._executeChangeBeforeCallback(columnName)) {\n                return;\n            }\n            this.collection.syncRowSpannedData(this, columnName, value);\n            this._executeChangeAfterCallback(columnName);\n            this.validateCell(columnName, true);\n        }, this);\n    },\n\n    /**\n     * Validate the cell data of given columnName and returns the error code.\n     * @param  {Object} columnName - Column name\n     * @returns {String} Error code\n     * @private\n     */\n    _validateCellData: function(columnName) {\n        var columnModel = this.columnModel.getColumnModel(columnName),\n            value = this.get(columnName),\n            errorCode = '';\n\n        if (columnModel.isRequired &amp;&amp; util.isBlank(value)) {\n            errorCode = VALID_ERR_REQUIRED;\n        }\n        return errorCode;\n    },\n\n    /**\n     * Validate a cell of given columnName.\n     * If the data is invalid, add 'invalid' class name to the cell.\n     * @param {String} columnName - Target column name\n     * @param {Boolean} isDataChanged - True if data is changed (called by onChange handler)\n     * @returns {String} - Error code\n     */\n    validateCell: function(columnName, isDataChanged) {\n        var errorCode;\n\n        if (!isDataChanged &amp;&amp; (columnName in this.validateMap)) {\n            return this.validateMap[columnName];\n        }\n\n        errorCode = this._validateCellData(columnName);\n        if (errorCode) {\n            this.addCellClassName(columnName, classNameConst.CELL_INVALID);\n        } else {\n            this.removeCellClassName(columnName, classNameConst.CELL_INVALID);\n        }\n        this.validateMap[columnName] = errorCode;\n\n        return errorCode;\n    },\n\n    /**\n     * columnModel 에 정의된 changeCallback 을 수행할 때 전달핼 이벤트 객체를 생성한다.\n     * @param {String} columnName 컬럼명\n     * @returns {{rowKey: (number|string), columnName: string, columnData: *, instance: {object}}}\n     *          changeCallback 에 전달될 이벤트 객체\n     * @private\n     */\n    _createChangeCallbackEvent: function(columnName) {\n        return {\n            rowKey: this.get('rowKey'),\n            columnName: columnName,\n            value: this.get(columnName),\n            instance: tui.Grid.getInstanceById(this.collection.gridId)\n        };\n    },\n\n    /**\n     * columnModel 에 정의된 changeBeforeCallback 을 수행한다.\n     * changeBeforeCallback 의 결과가 false 일 때, 데이터를 복원후 false 를 반환한다.\n     * @param {String} columnName   컬럼명\n     * @returns {boolean} changeBeforeCallback 수행 결과값\n     * @private\n     */\n    _executeChangeBeforeCallback: function(columnName) {\n        var columnModel = this.columnModel.getColumnModel(columnName),\n            changeEvent, obj;\n\n        if (columnModel.editOption &amp;&amp; columnModel.editOption.changeBeforeCallback) {\n            changeEvent = this._createChangeCallbackEvent(columnName);\n\n            if (columnModel.editOption.changeBeforeCallback(changeEvent) === false) {\n                obj = {};\n                obj[columnName] = this.previous(columnName);\n                this.set(obj);\n                this.trigger('restore', columnName);\n                return false;\n            }\n        }\n        return true;\n    },\n\n    /**\n     * columnModel 에 정의된 changeAfterCallback 을 수행한다.\n     * @param {String} columnName - 컬럼명\n     * @returns {boolean} changeAfterCallback 수행 결과값\n     * @private\n     */\n    _executeChangeAfterCallback: function(columnName) {\n        var columnModel = this.columnModel.getColumnModel(columnName),\n            changeEvent;\n\n        if (columnModel.editOption &amp;&amp; columnModel.editOption.changeAfterCallback) {\n            changeEvent = this._createChangeCallbackEvent(columnName);\n            return !!(columnModel.editOption.changeAfterCallback(changeEvent));\n        }\n        return true;\n    },\n\n    /**\n     * Returns the Array of private property names\n     * @returns {array} An array of private property names\n     */\n    getPrivateProperties: function() {\n        return PRIVATE_PROPERTIES;\n    },\n\n    /**\n     * Returns the object that contains rowState info.\n     * @returns {{isDisabled: boolean, isDisabledCheck: boolean, isChecked: boolean}} rowState 정보\n     */\n    getRowState: function() {\n        return this.extraDataManager.getRowState();\n    },\n\n    /**\n     * Returns an array of all className, related with given columnName.\n     * @param {String} columnName - Column name\n     * @returns {Array.&lt;String>} - An array of classNames\n     */\n    getClassNameList: function(columnName) {\n        var columnModel = this.columnModel.getColumnModel(columnName),\n            isMetaColumn = util.isMetaColumn(columnName),\n            classNameList = this.extraDataManager.getClassNameList(columnName),\n            cellState = this.getCellState(columnName);\n\n        if (columnModel.className) {\n            classNameList.push(columnModel.className);\n        }\n        if (columnModel.isEllipsis) {\n            classNameList.push(classNameConst.CELL_ELLIPSIS);\n        }\n        if (columnModel.isRequired) {\n            classNameList.push(classNameConst.CELL_REQUIRED);\n        }\n        if (isMetaColumn) {\n            classNameList.push(classNameConst.CELL_HEAD);\n        } else if (cellState.isEditable) {\n            classNameList.push(classNameConst.CELL_EDITABLE);\n        }\n        if (cellState.isDisabled) {\n            classNameList.push(classNameConst.CELL_DISABLED);\n        }\n\n        return this._makeUniqueStringArray(classNameList);\n    },\n\n    /**\n     * Returns a new array, which splits all comma-separated strings in the targetList and removes duplicated item.\n     * @param  {Array} targetArray - Target array\n     * @returns {Array} - New array\n     */\n    _makeUniqueStringArray: function(targetArray) {\n        var singleStringArray = _.uniq(targetArray.join(' ').split(' '));\n        return _.without(singleStringArray, '');\n    },\n\n    /**\n     * Returns the state of the cell identified by a given column name.\n     * @param {String} columnName - column name\n     * @returns {{isEditable: boolean, isDisabled: boolean}}\n     */\n    getCellState: function(columnName) {\n        var notEditableTypeList = ['_number', 'normal'],\n            columnModel = this.columnModel,\n            isDisabled = this.collection.isDisabled,\n            isEditable = true,\n            editType = columnModel.getEditType(columnName),\n            rowState, relationResult;\n\n        relationResult = this.executeRelationCallbacksAll(['isDisabled', 'isEditable'])[columnName];\n        rowState = this.getRowState();\n\n        if (!isDisabled) {\n            if (columnName === '_button') {\n                isDisabled = rowState.isDisabledCheck;\n            } else {\n                isDisabled = rowState.isDisabled;\n            }\n            isDisabled = isDisabled || !!(relationResult &amp;&amp; relationResult.isDisabled);\n        }\n\n        if (_.contains(notEditableTypeList, editType)) {\n            isEditable = false;\n        } else {\n            isEditable = !(relationResult &amp;&amp; relationResult.isEditable === false);\n        }\n\n        return {\n            isEditable: isEditable,\n            isDisabled: isDisabled\n        };\n    },\n\n    /**\n     * Returns whether the cell identified by a given column name is editable.\n     * @param {String} columnName - column name\n     * @returns {Boolean}\n     */\n    isEditable: function(columnName) {\n        var cellState = this.getCellState(columnName);\n\n        return !cellState.isDisabled &amp;&amp; cellState.isEditable;\n    },\n\n    /**\n     * Returns whether the cell identified by a given column name is disabled.\n     * @param {String} columnName - column name\n     * @returns {Boolean}\n     */\n    isDisabled: function(columnName) {\n        var cellState = this.getCellState(columnName);\n\n        return cellState.isDisabled;\n    },\n\n    /**\n     * getRowSpanData\n     * rowSpan 설정값을 반환한다.\n     * @param {String} [columnName] 인자가 존재하지 않을 경우, 행 전체의 rowSpanData 를 맵 형태로 반환한다.\n     * @returns {*|{count: number, isMainRow: boolean, mainRowKey: *}}   rowSpan 설정값\n     */\n    getRowSpanData: function(columnName) {\n        var isRowSpanEnable = this.collection.isRowSpanEnable(),\n            rowKey = this.get('rowKey');\n\n        return this.extraDataManager.getRowSpanData(columnName, rowKey, isRowSpanEnable);\n    },\n\n    /**\n     * rowSpanData를 설정한다.\n     * @param {string} columnName - 컬럼명\n     * @param {object} data - rowSpan 정보를 가진 객체\n     */\n    setRowSpanData: function(columnName, data) {\n        this.extraDataManager.setRowSpanData(columnName, data);\n        this._triggerExtraDataChangeEvent();\n    },\n\n    /**\n     * rowState 를 설정한다.\n     * @param {string} rowState 해당 행의 상태값. 'DISABLED|DISABLED_CHECK|CHECKED' 중 하나를 설정한다.\n     * @param {boolean} silent 내부 change 이벤트 발생 여부\n     */\n    setRowState: function(rowState, silent) {\n        this.extraDataManager.setRowState(rowState);\n        if (!silent) {\n            this._triggerExtraDataChangeEvent();\n        }\n    },\n\n    /**\n     * rowKey 와 columnName 에 해당하는 Cell 에 CSS className 을 설정한다.\n     * @param {String} columnName 컬럼 이름\n     * @param {String} className 지정할 디자인 클래스명\n     */\n    addCellClassName: function(columnName, className) {\n        this.extraDataManager.addCellClassName(columnName, className);\n        this._triggerExtraDataChangeEvent();\n    },\n\n    /**\n     * rowKey에 해당하는 행 전체에 CSS className 을 설정한다.\n     * @param {String} className 지정할 디자인 클래스명\n     */\n    addClassName: function(className) {\n        this.extraDataManager.addClassName(className);\n        this._triggerExtraDataChangeEvent();\n    },\n\n    /**\n     * rowKey 와 columnName 에 해당하는 Cell 에 CSS className 을 제거한다.\n     * @param {String} columnName 컬럼 이름\n     * @param {String} className 지정할 디자인 클래스명\n     */\n    removeCellClassName: function(columnName, className) {\n        this.extraDataManager.removeCellClassName(columnName, className);\n        this._triggerExtraDataChangeEvent();\n    },\n\n    /**\n     * rowKey 에 해당하는 행 전체에 CSS className 을 제거한다.\n     * @param {String} className 지정할 디자인 클래스명\n     */\n    removeClassName: function(className) {\n        this.extraDataManager.removeClassName(className);\n        this._triggerExtraDataChangeEvent();\n    },\n\n    /**\n     * ctrl + c 로 복사 기능을 사용할 때 list 형태(select, button, checkbox)의 cell 의 경우, 해당 value 에 부합하는 text로 가공한다.\n     * List type 의 경우 데이터 값과 editOption.list 의 text 값이 다르기 때문에\n     * text 로 전환해서 반환할 때 처리를 하여 변환한다.\n     *\n     * @param {String} columnName   컬럼명\n     * @returns {String} text 형태로 가공된 문자열\n     * @private\n     */\n    _getListTypeVisibleText: function(columnName) {\n        var value = this.get(columnName);\n        var columnModel = this.columnModel.getColumnModel(columnName);\n        var resultOptionList, editOptionList, typeExpected, valueList;\n\n        if (tui.util.isExisty(tui.util.pick(columnModel, 'editOption', 'list'))) {\n            resultOptionList = this.executeRelationCallbacksAll(['optionListChange'])[columnName];\n            editOptionList = resultOptionList &amp;&amp; resultOptionList.optionList ?\n                    resultOptionList.optionList : columnModel.editOption.list;\n\n            typeExpected = typeof editOptionList[0].value;\n            valueList = util.toString(value).split(',');\n            if (typeExpected !== typeof valueList[0]) {\n                valueList = _.map(valueList, function(val) {\n                    return util.convertValueType(val, typeExpected);\n                });\n            }\n            _.each(valueList, function(val, index) {\n                var item = _.findWhere(editOptionList, {value: val});\n                valueList[index] = item &amp;&amp; item.value || '';\n            }, this);\n\n            return valueList.join(',');\n        }\n        return '';\n    },\n\n    /**\n     * Returns whether the given edit type is list type.\n     * @param {String} editType - edit type\n     * @returns {Boolean}\n     * @private\n     */\n    _isListType: function(editType) {\n        return _.contains(['select', 'radio', 'checkbox'], editType);\n    },\n\n    /**\n     * change 이벤트 발생시 동일한 changed 객체의 public 프라퍼티가 동일한 경우 중복 처리를 막기 위해 사용한다.\n     * 10ms 내에 같은 객체로 함수 호출이 일어나면 true를 반환한다.\n     * @param {object} publicChanged 비교할 객체\n     * @returns {boolean} 중복이면 true, 아니면 false\n     */\n    isDuplicatedPublicChanged: function(publicChanged) {\n        if (this._timeoutIdForChanged &amp;&amp; _.isEqual(this._lastPublicChanged, publicChanged)) {\n            return true;\n        }\n        clearTimeout(this._timeoutIdForChanged);\n        this._timeoutIdForChanged = setTimeout(_.bind(function() {\n            this._timeoutIdForChanged = null;\n        }, this), 10); // eslint-disable-line no-magic-numbers\n        this._lastPublicChanged = publicChanged;\n\n        return false;\n    },\n\n    /**\n     * Returns the text string to be used when copying the cell value to clipboard.\n     * @param {String} columnName - column name\n     * @returns {String}\n     */\n    getValueString: function(columnName) {\n        var editType = this.columnModel.getEditType(columnName);\n        var column = this.columnModel.getColumnModel(columnName);\n        var value = this.get(columnName);\n\n        if (this._isListType(editType)) {\n            if (tui.util.isExisty(tui.util.pick(column, 'editOption', 'list', 0, 'value'))) {\n                value = this._getListTypeVisibleText(columnName);\n            } else {\n                throw this.error('Check \"' + columnName + '\"\\'s editOption.list property out in your ColumnModel.');\n            }\n        } else if (editType === 'password') {\n            value = '';\n        }\n\n        return util.toString(value);\n    },\n\n    /**\n     * 컬럼모델에 정의된 relation 들을 수행한 결과를 반환한다. (기존 affectOption)\n     * @param {Array} callbackNameList 반환값의 결과를 확인할 대상 callbackList.\n     *        (default : ['optionListChange', 'isDisabled', 'isEditable'])\n     * @returns {{}|{columnName: {attribute: *}}} row 의 columnName 에 적용될 속성값.\n     */\n    executeRelationCallbacksAll: function(callbackNameList) {\n        var rowData = this.attributes,\n            relationListMap = this.columnModel.get('relationListMap'),\n            result = {};\n\n        if (_.isEmpty(callbackNameList)) {\n            callbackNameList = ['optionListChange', 'isDisabled', 'isEditable'];\n        }\n\n        _.each(relationListMap, function(relationList, columnName) {\n            var value = rowData[columnName];\n\n            _.each(relationList, function(relation) {\n                this._executeRelationCallback(relation, callbackNameList, value, rowData, result);\n            }, this);\n        }, this);\n\n        return result;\n    },\n\n    /**\n     * Returns a name of attribute matching given callbackName.\n     * @param {string} callbackName - callback name\n     * @private\n     * @returns {string}\n     */\n    _getRelationResultAttrName: function(callbackName) {\n        switch (callbackName) {\n            case 'optionListChange':\n                return 'optionList';\n            case 'isDisabled':\n                return 'isDisabled';\n            case 'isEditable':\n                return 'isEditable';\n            default:\n                return '';\n        }\n    },\n\n    /**\n     * Executes relation callback\n     * @param {object} relation - relation object\n     *   @param {array} relation.columnList - target column list\n     *   @param {function} [relation.isDisabled] - callback function for isDisabled attribute\n     *   @param {function} [relation.isEditable] - callback function for isDisabled attribute\n     *   @param {function} [relation.optionListChange] - callback function for changing option list\n     * @param {array} callbackNameList - an array of callback names\n     * @param {(string|number)} value - cell value\n     * @param {object} rowData - all value of the row\n     * @param {object} result - object to store the result of callback functions\n     * @private\n     */\n    _executeRelationCallback: function(relation, callbackNameList, value, rowData, result) {\n        var rowState = this.getRowState(),\n            targetColumnNames = relation.columnList;\n\n        _.each(callbackNameList, function(callbackName) {\n            var attrName, callback;\n\n            if (!rowState.isDisabled || callbackName !== 'isDisabled') {\n                callback = relation[callbackName];\n                if (typeof callback === 'function') {\n                    attrName = this._getRelationResultAttrName(callbackName);\n                    if (attrName) {\n                        _.each(targetColumnNames, function(targetColumnName) {\n                            result[targetColumnName] = result[targetColumnName] || {};\n                            result[targetColumnName][attrName] = callback(value, rowData);\n                        }, this);\n                    }\n                }\n            }\n        }, this);\n    }\n}, {\n    privateProperties: PRIVATE_PROPERTIES\n});\n\nmodule.exports = Row;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"