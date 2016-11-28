import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Figure } from './classfile.js';
import { Rect } from './classfile.js';
import { Ellipse } from './classfile.js';
import { Circle } from './classfile.js';
import { Triangle } from './classfile.js';
import { DrawingManager } from './classfile.js';

import './main.html';

Template.Content.onCreated(function onContentCreated(event)
{
	Session.set('step', 0);
});

Template.Content.helpers({
	SelectedContent: function () 
	{
		var step = Session.get('step');
		switch (step) 
		{
			case 0 :
				return Template.ContentMain;
				break;
			case 1 :
				return Template.NewCourse;
				break;
			case 2 :
				return Template.AllCourses;
				break;
		}
	}
});

Template.Navigation.events = 
{
	'click #HomeLink' : function (event) 
	{
        Session.set('step', 0);
	},
	'click #NewCourseLink' : function (event) 
	{
        Session.set('step', 1);
		setTimeout(function() 
		{ 
			var canvas = new fabric.Canvas('canvas');
			DrawingManager.setupDrawingOnCanvas(canvas);
		}, 0);
	},
	'click #AllCoursesLink' : function (event) 
	{
        Session.set('step', 2);
	}
};

Template.NewCourse.onCreated(function onContentCreated(event)
{
	DrawingManager.initializeDrawing();
});


Template.NewCourse.events = 
{
	'click #clearSelection' : function (event) 
	{
        Session.set('DrawingMode', 0);
	},
	'click #rectSelected' : function (event) 
	{
        Session.set('DrawingMode', 1);
	},
	'click #circleSelected' : function (event) 
	{
        Session.set('DrawingMode', 2);
	},
	'click #triangleSelected' : function (event) 
	{
        Session.set('DrawingMode', 3);
	},
	'click #lineSelected' : function (event) 
	{
        Session.set('DrawingMode', 4);
	},
	'click #ellipseSelected' : function (event) 
	{
        Session.set('DrawingMode', 5);
	},
	'change #colorPickerStroke' : function (event) 
	{
		var selectedStrokeColor = $(event.target).val().replace("#","");
		DrawingManager.setStrokeColor(selectedStrokeColor);
	},
	'change #strokeAlpha' : function (event) 
	{
		var selectedStrokeAlpha = $(event.target).val()*0.01;
		DrawingManager.setStrokeAlpha(selectedStrokeAlpha);
	},
	'change #colorPickerFill' : function (event) 
	{
		var selectedFillColor = $(event.target).val().replace("#","");
		DrawingManager.setFillColor(selectedFillColor);
	},
	'change #fillAlpha' : function (event) 
	{
		var selectedFillAlpha = $(event.target).val()*0.01;
		DrawingManager.setFillAlpha(selectedFillAlpha);
	},
	'change #strokeWidth': function(event) {
		var selectedStrokeWidth = $(event.target).val();
		DrawingManager.setStrokeWidth(selectedStrokeWidth);
	}
};
