import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

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
			canvas.selection = false;
			drawOnCanvas(canvas);
		}, 0);
	},
	'click #AllCoursesLink' : function (event) 
	{
        Session.set('step', 2);
	}
};

//FIXME: Pozeljno je da se iskljuci autopublis, i da se rad sa bazom prebaci na server. Ako je iskljucen autopublish, a rad sa bazom je na klijentu, onda ne radi ucitavanje iz baze i sl.
//TODO: Obavezno koristi Publish i Subscribe
function drawFromDatabase(canvas)
{
	Tracker.autorun(function(){
			var figuresCursors = Figures.find({}, {sort: {time: -1}});
			//var figures = figuresCursors.fetch();
			figuresCursors.forEach(function(singleFigure)
			{
				var circlefromDB = new fabric.Circle({
							left: singleFigure.Left,
							top: singleFigure.Top,
							radius: singleFigure.Radius,
							strokeWidth: 5,
							stroke: 'red',
							selectable: false,
							fill: 'rgba(0,0,0,0)',
							originX: 'center', originY: 'center'
						});
						canvas.add(circlefromDB);
			});
        });
	 
}

function drawOnCanvas(canvas)
{	
	drawFromDatabase(canvas);

	var circle, rect, line, point1, isDown, origX, origY;
	var objectsList = [];

	canvas.on('mouse:down', function(o)
	{
		var drawingMode = Session.get('DrawingMode');
		if(drawingMode != 0)
		{
			isDown = true;
			var pointer = canvas.getPointer(o.e);
			origX = pointer.x;
			origY = pointer.y;
		}
		switch(drawingMode)
		{
			case 3:		//line, spaja 2 tacke
			{
				if (point1 === undefined) 
				{
					point1 = new fabric.Point(origX, origY)
				} 
				else 
				{
					canvas.add(new fabric.Line([point1.x, point1.y, origX, origY], {
						stroke: 'red',
						hasControls: false,
						strokeWidth: 5,
						hasBorders: false,
						lockMovementX: true,
						lockMovementY: true,
						hoverCursor: 'default'
					}))
					point1 = undefined;
				}
				break;
			}
			case 2:		//circle
			{
				circle = new fabric.Circle({
					left: pointer.x,
					top: pointer.y,
					radius: 1,
					strokeWidth: 5,
					stroke: 'red',
					selectable: false,
					fill: 'rgba(0,0,0,0)',
					originX: 'center', originY: 'center'
				});
				objectsList.push(circle);
				canvas.add(circle);
				break;
			}
			case 1:		//rect
			{
				rect = new fabric.Rect({
					left: pointer.x,
					top: pointer.y,
					width:0,
					height:0,
					radius: 1,
					strokeWidth: 5,
					stroke: 'red',
					selectable: false,
					fill: 'rgba(0,0,0,0)',
					originX: 'left', originY: 'top'
				});
				canvas.add(rect);
				break;
			}
		}
	});

	canvas.on('mouse:move', function(o)
	{
		var drawingMode = Session.get('DrawingMode');
		switch(drawingMode)
		{
			case 2:		//circle
			{
				if (!isDown) return;
				var pointer = canvas.getPointer(o.e);
				circle.set({ radius: Math.sqrt(Math.pow(origX - pointer.x, 2) + Math.pow(origY - pointer.y, 2)) });
				canvas.renderAll();
				break;
			}
			case 1:		//rect
			{
				if (!isDown) return;
				var pointer = canvas.getPointer(o.e);
				rect.set({ left: Math.min(origX,pointer.x), top: Math.min(origY,pointer.y), width: Math.abs(origX - pointer.x), height: Math.abs(origY - pointer.y) });
				canvas.renderAll();
				break;
			}
			case 0:		//No mode;
			{
				if (!isDown) return;
			}
		}
	});

	canvas.on('mouse:up', function(o)
	{
		isDown = false;
		var pointer = canvas.getPointer(o.e);
		var drawingMode = Session.get('DrawingMode');
		switch(drawingMode)
		{
			case 2:		//circle
			{
				Figures.insert({
					Type: 2,
					Top: origY,
					Left: origX,
					Radius: Math.sqrt(Math.pow(origX - pointer.x, 2) + Math.pow(origY - pointer.y, 2)),
					time: Date.now()
				},function(err,docsInserted)
				{
					if(!err)
					{
						curentObjectId = docsInserted;
					}
				});
				break;
			}
			case 1:		//rect
			{
				
				break;
			}
			case 0:		//No mode;
			{
				if (!isDown) return;
			}
		}
	});
}

Template.NewCourse.onCreated(function onContentCreated(event)
{
	Session.set('DrawingMode', 0);
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
	'click #lineSelected' : function (event) 
	{
        Session.set('DrawingMode', 3);
	}
};
