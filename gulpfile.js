var gulp = require('gulp');
var initGulpTasks = require('react-component-gulp-tasks');

var taskConfig = {
	component: {
		name: 'Fixed',
	},
};

initGulpTasks(gulp, taskConfig);
