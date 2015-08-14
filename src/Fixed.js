var React = require('react'),
	xtend = require('xtend'),
	blacklist = require('blacklist');

var Fixed = React.createClass({

	displayName: 'Fixed',

	getInitialState: function() {
		return {
			position: 'relative',
			width: 'auto',
			height: 'auto',
			top: 0
		};
	},

	componentDidMount: function() {

		// Bail in IE8 because React doesn't support the onScroll event in that browser
		// Conveniently (!) IE8 doesn't have window.getComputedStyle which we also use here
		if (!window.getComputedStyle) return;

		var fixed = this.refs.fixed.getDOMNode();

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

	componentWillUnmount: function() {
		window.removeEventListener('scroll', this.recalcPosition, false);
		window.removeEventListener('resize', this.recalcPosition, false);
	},

	getWindowSize: function() {
		return {
			x: window.innerWidth,
			y: window.innerHeight
		};
	},

	recalcPosition: function() {
		var wrapper = this.refs.wrapper.getDOMNode();
		var fixed = this.refs.fixed.getDOMNode();

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
		var sizeChanged = (newSize.x !== this.windowSize.x || newSize.y !== this.windowSize.y);
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

	render: function() {
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
		return (
			<div ref="wrapper" style={wrapperStyle}>
				<div ref="fixed" style={fixedStyle} {...fixedProps}>{this.props.children}</div>
			</div>
		);
	}
});

module.exports = Fixed;
