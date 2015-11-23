(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Fixed = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null),
    xtend = require('xtend'),
    blacklist = require('blacklist');

var Fixed = React.createClass({

	displayName: 'Fixed',

	propTypes: {
		children: React.PropTypes.node,
		style: React.PropTypes.object
	},

	getInitialState: function getInitialState() {
		return {
			position: 'relative',
			width: 'auto',
			height: 'auto',
			top: 0
		};
	},

	componentDidMount: function componentDidMount() {

		// Bail in IE8 because React doesn't support the onScroll event in that browser
		// Conveniently (!) IE8 doesn't have window.getComputedStyle which we also use here
		if (!window.getComputedStyle) return;

		var fixed = this.refs.fixed;

		this.windowSize = this.getWindowSize();

		var fixedStyle = window.getComputedStyle(fixed);

		this.fixedSize = {
			x: fixed.offsetWidth,
			y: fixed.offsetHeight + parseInt(fixedStyle.marginTop || '0')
		};

		window.addEventListener('scroll', this.recalcPosition, false);
		window.addEventListener('resize', this.recalcPosition, false);

		this.recalcPosition();
	},

	componentWillUnmount: function componentWillUnmount() {
		window.removeEventListener('scroll', this.recalcPosition, false);
		window.removeEventListener('resize', this.recalcPosition, false);
	},

	getWindowSize: function getWindowSize() {
		return {
			x: window.innerWidth,
			y: window.innerHeight
		};
	},

	recalcPosition: function recalcPosition() {
		var wrapper = this.refs.wrapper;
		var fixed = this.refs.fixed;

		this.fixedSize.x = wrapper.offsetWidth;

		var offsetTop = 0;
		var offsetEl = wrapper;

		while (offsetEl) {
			offsetTop += offsetEl.offsetTop;
			offsetEl = offsetEl.offsetParent;
		}

		var maxY = offsetTop + this.fixedSize.y;
		var viewY = window.scrollY + window.innerHeight;

		var newSize = this.getWindowSize();
		var sizeChanged = newSize.x !== this.windowSize.x || newSize.y !== this.windowSize.y;
		this.windowSize = newSize;

		var newState = {
			width: this.fixedSize.x,
			height: this.fixedSize.y
		};

		if (viewY > maxY && (sizeChanged || this.mode !== 'inline')) {
			this.mode = 'inline';
			newState.top = 0;
			newState.position = 'absolute';
			this.setState(newState);
		} else if (viewY <= maxY && (sizeChanged || this.mode !== 'fixed')) {
			this.mode = 'fixed';
			newState.top = window.innerHeight - this.fixedSize.y;
			newState.position = 'fixed';
			this.setState(newState);
		}
	},

	render: function render() {
		var wrapperStyle = {
			position: 'relative',
			height: this.state.height
		};
		var fixedProps = blacklist(this.props, 'children', 'style');
		var fixedStyle = xtend(this.props.style || {}, {
			position: this.state.position,
			top: this.state.top,
			width: this.state.width,
			height: this.state.height
		});
		return React.createElement(
			'div',
			{ ref: 'wrapper', style: wrapperStyle },
			React.createElement(
				'div',
				_extends({ ref: 'fixed', style: fixedStyle }, fixedProps),
				this.props.children
			)
		);
	}
});

module.exports = Fixed;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"blacklist":undefined,"xtend":undefined}]},{},[1])(1)
});