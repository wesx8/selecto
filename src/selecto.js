
/**
 * @description 
 * Vanilla VanillaJS select replacement plugin
 * 
 * @class 
 */
var Selecto = (function () {

    // global reference to button
    this.button = false;
    // reference to original selectbox
    this.oldSelectbox = false;
    // reference to new selectbox tree
    this.newSelectbox = false;
    // reference to user options
    this.options = false;
    // reference to previous selected value
    this.previousSelected = false;

    /**
     * Helper functions
     * 
     * @type type
     */
    var util = {
        isInt: function (value) {
            // can be '20' or 20
            if (value == parseInt(value)) {
                return true;
            }

            return false;
        },
        fadeIn: function (el) {
            el.style.display = 'block';
        },
        addClass: function (el, cssClass) {
            var classes = el.classList;

            classes.add(cssClass);

            return this;
        },
        removeClass: function (el, cssClass) {
            var cssClasses = el.classList;

            if (cssClasses.contains(cssClass)) {
                cssClasses.remove(cssClass);
            }

            return this;
        },
    };
    /**
     * @constructor
     * 
     * @param {string} selector
     * @param {json} options
     */
    function SelectBox(selector, options) {
        /**
         * default options
         * @type (object)
         */
        var defaults = {
            // 
            width: false,
            height: false,
            renderFunction: false,
            renderSelect: false,
            onChange: false
        }
        // if arguments extend defaults
        if (selector && typeof options === 'object') {
            this.options = extendDefaults(defaults, arguments[1]);
        }
        // reference to old selectbox
        this.oldSelectbox = getElement.call(this, arguments[0]);

        // get selected value
        this.defaultSelected = this.oldSelectbox.value;

        hideOld.call(this);

        createNew.call(this);

        initEvents.call(this);
    }

    /**
     * set value in old- and new selectbox
     * @param {string|number} value
     */
    SelectBox.prototype.addValue = function (value) {
        var oldSelectbox, oText, button, btnText, newSelectbox, nItems;

        oldSelectbox = this.oldSelectbox;
        button = this.button;
        newSelectbox = this.newSelectbox;

        // reset old
        resetOld.call(this);

        // update old select box
        for (var i = 0; i < oldSelectbox.length; i++) {
            if (value == oldSelectbox[i].value) {
                oldSelectbox[i].setAttribute('selected', 'selected');
            }
        }
        // get selected object option
        oText = oldSelectbox.options[oldSelectbox.selectedIndex].text;
        // update btn
        btnText = this.button.querySelector('.selecto-txt');
        btnText.innerHTML = oText;
        // reset new items
        resetNew.call(this);

        // update new select box
        nItems = newSelectbox.children;
        for (var i = 0; i < nItems.length; i++) {
            var li = nItems[i];
            if (value == li.getAttribute('data-key')) {
                util.addClass(nItems[i], 'selecto-is-selected')
            }
        }
    }
    /**
     * get selected value 
     */
    SelectBox.prototype.getValue = function () {
        return this.oldSelectbox.value;
    }

    /**
     * set selected value
     * @param {Object} element
     */
    function setSelected(element) {
        var btnText, selectedValue, oldSelect, oItems, nItems, oSelected;

        // get text
        // put text in button
        // update old selectbox / or get selected value option 
        selectedValue = element.getAttribute('data-key');
        // create oSelected
        // if button is already created
        if (this.button.parentNode) {
            var oldSelect = this.button.parentNode.previousSibling;
            oItems = oldSelect.children;
            // reset
            resetOld.call(this);

            for (var i = 0; i < oItems.length; i++) {
                if (oItems[i].value === selectedValue) {
                    // reference to selected element from old selectbox
                    oSelected = oItems[i];
                    oSelected.setAttribute('selected', 'selected');
                }
            }
        } else {
            oItems = this.oldSelectbox;

            for (var i = 0; i < oItems.length; i++) {
                if (oItems[i].value === selectedValue) {
                    // reference to selected element from old selectbox
                    oSelected = oItems[i];
                    oSelected.setAttribute('selected', 'selected');
                }
            }
        }

        // if oSelected same as previousSelected return
        if (oSelected === this.previousSelected)
            return;

        this.previousSelected = oSelected;

        resetNew.call(this);
        // update new select box
        nItems = this.newSelectbox.children;
        for (var i = 0; i < nItems.length; i++) {
            var li = nItems[i];
            if (selectedValue == li.getAttribute('data-key')) {
                nItems[i].className += ' selecto-is-selected';
            }
        }
        btnText = this.button.querySelector('.selecto-txt');
        //btnText.innerHTML = et;
        if (this.options && typeof this.options.renderSelect === 'function') {
            btnText.innerHTML = this.options.renderSelect(oSelected);
        } else {
            btnText.innerHTML = oSelected.textContent;
        }
        //check for event
        if (this.options && typeof this.options.onChange === 'function') {
            this.options.onChange(oSelected);
        }
    }

    /**
     * get element by user selector
     * 
     * @param {string} string
     * @returns {Element}
     */
    function getElement(string) {
        var element;

        if (string.charAt(0) === '#') {
            element = document.getElementById(string.substring(1));
        } else if (string.charAt(0) === '.') {
            element = document.getElementsByClassName(string.substring(1))[0];
        }

        return element;
    }


    /**
     * reset old checkbox / remove selected
     * 
     * @private
     */
    function resetOld() {
        for (var i = 0; i < this.oldSelectbox.length; i++) {
            this.oldSelectbox[i].removeAttribute('selected');
        }
    }
    /**
     * reset new checkbox
     * 
     * @private
     * @return {void} description
     */
    function resetNew() {
        var items = this.newSelectbox.children;

        for (var i = 0; i < items.length; i++) {
            items[i].classList.remove('selecto-is-selected');
        }
    }
    /**
     * open or close list
     * 
     * @returns {void} 
     * 
     */
    function toggle() {
        var arrow,
          tree = this.button.parentNode.querySelector('.selecto-tree');
        // reference to arrow
        arrow = this.button.querySelector('.selecto-arrow');

        if (tree.style.display === 'none') {
            window.setTimeout(function () {
                tree.style.display = 'block';
            }, 200);
            util.removeClass(arrow, 'selecto-arrow-down').addClass(arrow, 'selecto-arrow-up');
        } else {
            tree.scrollTop = 0;
            tree.style.display = 'none';
            util.removeClass(arrow, 'selecto-arrow-up').addClass(arrow, 'selecto-arrow-down');
        }
    }

    /**
     * hide old selectbox
     */
    function hideOld() {
        var element = this.oldSelectbox;

        element.style.display = 'none';
    }

    /**
     * build new checkbox
     * @private
     */
    function createNew() {
        // declare variables
        var fragment, newDiv, btnTxt, _, oldSelectbox, parentDiv, btnwArrowContainer,
          btnArrow, width, height;
        _ = this;

        // check for user options
        if (this.options && util.isInt(this.options.width)) {
            width = this.options.width + 'px';
        }

        if (this.options && util.isInt(this.options.height)) {
            height = this.options.height + 'px';
        }

        // start building
        // create outer parent 
        newDiv = document.createElement('div');
        util.addClass(newDiv, 'selecto');

        fragment = document.createDocumentFragment();
        // create button with default value
        this.button = document.createElement('div');
        this.button.className = 'selecto-selected';
        btnTxt = document.createElement('span');
        btnTxt.className = 'selecto-txt';
        btnTxt.textContent = 'select';

        if (width) {
            this.button.style.width = width;
        }

        if (height) {
            this.button.style.height = height;
        }

        // add arrow
        btnwArrowContainer = document.createElement('span');
        btnArrow = document.createElement('span');
        btnArrow.className = 'selecto-arrow-down selecto-arrow';
        // add button text to button
        this.button.appendChild(btnTxt);
        // add arrow to button
        this.button.appendChild(btnArrow);

        // create ul
        this.newSelectbox = document.createElement('ul');
        this.newSelectbox.className = 'selecto-tree';
        this.newSelectbox.setAttribute('style', 'display:none');
        if (width) {
            this.newSelectbox.style.width = width;
        }

        // create items
        // loop through old selectbox and add to fragment
        for (var i = 0; i < this.oldSelectbox.length; i++) { 
            var el = this.oldSelectbox[i],
              
            li = createItem.call(this, el);
            this.newSelectbox.appendChild(li);
        }

        fragment.appendChild(this.button);
        fragment.appendChild(this.newSelectbox);
        newDiv.appendChild(fragment);

        // add new selectbox after old selectbox
        // get old selectbox node
        oldSelectbox = this.oldSelectbox;

        // get reference to parent node
        parentDiv = oldSelectbox.parentNode;
        // put new selectbox after old selectbox
        parentDiv.insertBefore(newDiv, oldSelectbox.nextSibling);
    }

    /**
     * create item
     * @param {object} el 
     * @returns {object}
     */
    function createItem(el) {
        var li = document.createElement('li');
        
        // create custom 
        if (this.options && typeof this.options.renderFunction === 'function') {
            li.innerHTML = this.options.renderFunction(el);
        } else {
            li.textContent =el.text;
        }

        util.addClass(li, 'selecto-item');
        li.setAttribute('data-key', el.value);
        // make li clickable
        li.addEventListener('click', setSelected.bind(this, li));
        // toggle when click
        li.addEventListener('click', toggle.bind(this));
        
        if (this.height) {
            li.style.height = this.height;
            li.style.lineHeight = this.height;
        }
        
        if (this.defaultSelected === el.value) {
            util.addClass(li, 'selecto-is-selected');
            setSelected.call(this, li);
        }

        return li;
    }
    /**
     * override
     * @param {array} source
     * @param {array} properties
     * @returns {array}
     */
    function extendDefaults(source, properties) {
        var property;

        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }

        return source;
    }
    /**
     * @private
     * close list
     */
    function close() {
        var element = this.button.parentNode.querySelector('.selecto-tree');
        element.scrollTop = 0;
        element.style.display = 'none';
    }
    /**
     * initialize events
     * @private
     */
    function initEvents() {
        var _ = this;
        // toggle button event
        this.button.addEventListener('click', toggle.bind(this));
        // toggle button event
        // this.button.addEventListener('click', toggleArrow.bind(this));
        // click outside selectbox
        document.addEventListener('click', function (e) {
            var arrow = _.button.querySelector('.selecto-arrow');
            if (!_.button.parentNode.contains(e.target)) {
                close.call(_);
                util.removeClass(arrow, 'selecto-arrow-up').addClass(arrow, 'selecto-arrow-down');
            }
        });
    }
    return SelectBox;
})();

