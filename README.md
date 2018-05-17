# Selecto Dropdown: Select replacement with only pure Javascript

## Description 

This lightweight plugin replaces original html select tag with Selecto dropdown. 

## Features

* Replaces original html select tag with Selecto dropdown
* Supports images
* Supports multiple selectboxes
* No jQuery or other dependencies
* Easy to use
* Css is easy to customize
* Tested in IE9 and above, Firefox 3-4, recent WebKit browsers, and Opera

## Demo

[Link](https://westag.github.io/selecto/)

## Usage

Download/clone the files

Link to JS file ex.:
```html
<script src="js/selecto.js" type="text/javascript"></script>
```

Link to css file ex.:
```html
<link href="css/selecto.css" rel="stylesheet"> 
```

Original dropdown you want to replace with Selecto's.
```html
<select id="select">
    <option value="">Choose color</option>
    <option value="purple">Purple</option>
    <option value="blue">Blue</option>
    <option value="yellow">Yellow</option>
    <option value="green">Green</option>
</select>

// support for images
<select class="countries" name="countries">
    <option value="">Choose country</option>
    <option data-class="au" value="australie">Australie</option>
    <option data-class="cn" value="engeland">China</option>
    <option data-class="at" value="austria" selected="selected">Austria</option>
    <option data-class="jp" value="japan">Japan</option>
    <option data-class="de" value="germany">Germany</option>
</select>
```

To initialize Selecto:
```html
// simple basic dropdown
var dropdown1 = new Selecto('#select');

// with custom width and height
var dropdown2 = new Selecto('#select', {
    height: 50,
    width: 30
});

// dropdown with images
 var dropdown3 = new Selecto('.countries', {
    width: 250,
    height: '40',
    renderFunction: myRender,
    renderSelect: mySelect
});

// add images to items
function myRender(country) {
    var template, cssClass;

    cssClass = country.getAttribute('data-class');
    template = cssClass ? '<span class="color ' + cssClass + '"></span>' + country.textContent : country.textContent;

    return template;
}

// add selected item image to button
function mySelect(country) {
    var template,
      cssClass = country.getAttribute('data-class');

    template = cssClass ? '<span class="color ' + cssClass + '"></span>' + country.textContent : country.textContent;

    return template;
}
```

## Methods

Method | Description
------ | -----------
.addValue() | change value
.getValue() | get the selected value

### Usage

```html
var dropdown = new Selecto('#select');

// set value
dropdown.addValue('blue');

// get the selected value
dropdown.getValue();
```

## Events

Method | Description
------ | -----------
change | change value

### Usage

```html
var dropdown = new Selecto('#select',
  {
      onChange: changing
  });

function changing(option) {
    alert('testing');
}
```


