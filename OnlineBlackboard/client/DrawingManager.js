import { Figure } from './Figures.js';
import { Rect } from './Figures.js';
import { Ellipse } from './Figures.js';
import { Circle } from './Figures.js';
import { Triangle } from './Figures.js';
import { Square } from './Figures.js';
import { Polygon } from './Figures.js';
import { Text } from './Figures.js';
import { FiguresEnum } from './Figures.js';

var canvas;
var selectedFigureForEditing;
var selectedFigureId;
var figureToEdit;

export class DrawingManager
{
	static drawFromDB()
	{
		Meteor.subscribe('figures');
		Tracker.autorun(function(){
			
			canvas.clear();
			var figuresCursors = Figures.find({});
			figuresCursors.forEach(function(singleFigure)
			{
				DrawingManager.drawFigure(singleFigure);
			});
			DrawingManager.setAllFiguresInCanvasSelectable();
		});
	}
	
	static clearTable()
	{
		Meteor.call('deleteAllFiguresInDB', function (error) 
		{
			if (error) 
			{
				console.log(error);
			}
			else 
			{
				console.log('success');
			}
		});
	}
	
	static deleteSelected()
	{
		if(selectedFigureForEditing != null)
		{
			Meteor.call('deleteFigureInDB', selectedFigureForEditing.target._id, function (error) 
			{
				if (error) 
				{
					console.log(error);
				}
				else 
				{
					console.log('success');
				}
			});
		}
		
	}
	
	static setAllFiguresInCanvasSelectable()
	{
		var objs = canvas.getObjects().map(function(o) 
			{
				return o.set('selectable', true) && o.set('hoverCursor', 'move');
			});
	}
	
	static setAllFiguresInCanvasNonSelectable()
	{
		var objs = canvas.getObjects().map(function(o) 
			{
				return o.set('selectable', false) && o.set('hoverCursor', 'default');
			});
	}
	
	static setAllFiguresSelectable(selectable)
	{
		if(selectable)
		{
			Session.set('DrawingMode', FiguresEnum.EnableAll);
			DrawingManager.setAllFiguresInCanvasSelectable();
		}
		else
		{
			Session.set('DrawingMode', FiguresEnum.DisableAll);
			DrawingManager.setAllFiguresInCanvasNonSelectable();
		}
		selectedFigureForEditing = null;
		selectedFigureId = null;
	}
	
	static initializeDrawing()
	{
		Session.set('DrawingMode', FiguresEnum.EnableAll);
		Session.set('SelectedStrokeWidth', 1);
		Session.set('SelectedColor', 'ffffff');
		Session.set('SelectedFillColor', '3c78b4');
		Session.set('SelectedStrokeColorWithAlpha', 'rgba(255,255,255,1)');
		Session.set('SelectedFillColorWithAlpha', 'rgba(60,120,180,1)');
		Session.set('SelectedStrokeAlpha', 1);
		Session.set('SelectedFillAlpha', 1);
	}
	
	static setStrokeWidth(selectedStrokeWidth)
	{
		Session.set('SelectedStrokeWidth', parseInt(selectedStrokeWidth));
	}
	
	static setStrokeColor(selectedStrokeColor)
	{
		var selectedStrokeAlpha = Session.get('SelectedStrokeAlpha');
		var bigint = parseInt(selectedStrokeColor, 16);
		var r = (bigint >> 16) & 255;
		var g = (bigint >> 8) & 255;
		var b = bigint & 255;
		var selectedStrokeColorWithAlpha = 'rgba('+r+','+g+','+b+','+selectedStrokeAlpha+')';
		Session.set('SelectedStrokeColorWithAlpha', selectedStrokeColorWithAlpha);
		document.getElementById("strokePreview").style.backgroundColor=selectedStrokeColorWithAlpha;
		Session.set('SelectedColor', selectedStrokeColor);
		if(selectedFigureForEditing != null)
		{
			selectedFigureForEditing.target.set('stroke', selectedStrokeColorWithAlpha);
			Meteor.call('updateFigureInDB', selectedFigureForEditing.target._id, {'strokeColor': selectedStrokeColorWithAlpha}, function (error) 
			{
				if (error) 
				{
					console.log(error);
				}
				else 
				{
					console.log('success');
				}
			});
		}
	}
	
	static setStrokeAlpha(selectedStrokeAlpha)
	{
		var selectedStrokeColor = Session.get('SelectedColor');;
		var bigint = parseInt(selectedStrokeColor, 16);
		var r = (bigint >> 16) & 255;
		var g = (bigint >> 8) & 255;
		var b = bigint & 255;
		var selectedStrokeColorWithAlpha = 'rgba('+r+','+g+','+b+','+selectedStrokeAlpha+')';
		Session.set('SelectedStrokeAlpha', selectedStrokeAlpha);
		document.getElementById("strokePreview").style.backgroundColor=selectedStrokeColorWithAlpha;
		Session.set('SelectedStrokeColorWithAlpha',selectedStrokeColorWithAlpha);
		if(selectedFigureForEditing != null)
		{
			selectedFigureForEditing.target.set('stroke', selectedStrokeColorWithAlpha);
			Meteor.call('updateFigureInDB', selectedFigureForEditing.target._id, {'strokeColor': selectedStrokeColorWithAlpha}, function (error) 
			{
				if (error) 
				{
					console.log(error);
				}
				else 
				{
					console.log('success');
				}
			});
		}
	}
	
	static setFillAlpha(selectedFillAlpha)
	{
		var selectedFillColor = Session.get('SelectedFillColor');;
		var bigint = parseInt(selectedFillColor, 16);
		var r = (bigint >> 16) & 255;
		var g = (bigint >> 8) & 255;
		var b = bigint & 255;
		var selectedFillColorWithAlpha = 'rgba('+r+','+g+','+b+','+selectedFillAlpha+')';
		Session.set('SelectedFillAlpha', selectedFillAlpha);
		document.getElementById("fillPreview").style.backgroundColor=selectedFillColorWithAlpha;
		Session.set('SelectedFillColorWithAlpha',selectedFillColorWithAlpha);
		if(selectedFigureForEditing != null)
		{
			selectedFigureForEditing.target.set('fillColor', selectedFillColorWithAlpha);
			Meteor.call('updateFigureInDB', selectedFigureForEditing.target._id, {'fillColor': selectedFillColorWithAlpha}, function (error) 
			{
				if (error) 
				{
					console.log(error);
				}
				else 
				{
					console.log('success');
				}
			});
		}
	}
	
	static selectFigure(selectedFigure)
	{
		selectedFigureForEditing = null;
		selectedFigureId = null;
		Session.set('DrawingMode', selectedFigure);
		DrawingManager.setAllFiguresInCanvasNonSelectable();
	}
	
	static setFillColor(selectedFillColor)
	{
		var selectedFillAlpha = Session.get('SelectedFillAlpha');
		var bigint = parseInt(selectedFillColor, 16);
		var r = (bigint >> 16) & 255;
		var g = (bigint >> 8) & 255;
		var b = bigint & 255;
		var selectedFillColorWithAlpha = 'rgba('+r+','+g+','+b+','+selectedFillAlpha+')';
		document.getElementById("fillPreview").style.backgroundColor=selectedFillColorWithAlpha;
		Session.set('SelectedFillColor', selectedFillColor);
		Session.set('SelectedFillColorWithAlpha',selectedFillColorWithAlpha);
		if(selectedFigureForEditing != null)
		{
			selectedFigureForEditing.target.set('fill', selectedFillColorWithAlpha);
			Meteor.call('updateFigureInDB', selectedFigureForEditing.target._id, {'fillColor': selectedFillColorWithAlpha}, function (error) 
			{
				if (error) 
				{
					console.log(error);
				}
				else 
				{
					console.log('success');
				}
			});
		}
	}
	
	static onObjectSelected(e) 
	{
		selectedFigureForEditing = e;
		selectedFigureId = e.target._id;
	}

	
	static setupDrawingOnCanvas(mainCanvas)
	{
		canvas = mainCanvas;
		canvas.selection = false;
		
		canvas.on('object:selected', DrawingManager.onObjectSelected);
		
		DrawingManager.drawFromDB();
		
		var drawingFigure, point1, isDown, origX, origY;
		var objectsList = [];

		canvas.on('mouse:down', function(o)
		{
			var drawingMode = Session.get('DrawingMode');
			var selectedStrokeWidth = Session.get('SelectedStrokeWidth');
			var selectedStrokeColorWithAlpha = Session.get('SelectedStrokeColorWithAlpha');
			var selectedFillColorWithAlpha = Session.get('SelectedFillColorWithAlpha');
			if(drawingMode != FiguresEnum.EnableAll && drawingMode != FiguresEnum.DisableAll)
			{
				isDown = true;
				var pointer = canvas.getPointer(o.e);
				origX = pointer.x;
				origY = pointer.y;
			}
			switch(drawingMode)
			{
				case FiguresEnum.RectFigure:	
				{
					drawingFigure = new fabric.Rect({
						left: pointer.x,
						top: pointer.y,
						width:1,
						height:1,
						strokeWidth: selectedStrokeWidth,
						stroke: selectedStrokeColorWithAlpha,
						selectable: false,
						fill: selectedFillColorWithAlpha,
						originX: 'left', originY: 'top'
					});
					//objectsList.push(rect);
					canvas.add(drawingFigure);
					break;
				}
				case FiguresEnum.CircleFigure:	
				{
					drawingFigure = new fabric.Circle({
						left: pointer.x,
						top: pointer.y,
						radius: 1,
						strokeWidth: selectedStrokeWidth,
						stroke: selectedStrokeColorWithAlpha,
						selectable: false,
						fill: selectedFillColorWithAlpha,
						originX: 'center', originY: 'center'
					});
					//objectsList.push(circle);
					canvas.add(drawingFigure);
					break;
				}
				case FiguresEnum.TriangleFigure:
				{
					drawingFigure = new fabric.Triangle({
						left: pointer.x,
						top: pointer.y,
						width:1,
						height:1,
						strokeWidth: selectedStrokeWidth,
						stroke: selectedStrokeColorWithAlpha,
						selectable: false,
						fill: selectedFillColorWithAlpha,
						originX: 'left', originY: 'top'
					});
					//objectsList.push(triangle);
					canvas.add(drawingFigure);
					break;
				}
				case FiguresEnum.LineFigure:			//line, spaja 2 tacke
				{
					if (point1 === undefined) 
					{
						point1 = new fabric.Point(origX, origY)
					} 
					else 
					{
						canvas.add(new fabric.Line([point1.x, point1.y, origX, origY], {
							stroke: selectedStrokeColorWithAlpha,
							hasControls: false,
							strokeWidth: selectedStrokeWidth,
							hasBorders: false,
							lockMovementX: true,
							lockMovementY: true,
							hoverCursor: 'default'
						}))
						point1 = undefined;
					}
					break;
				}
				case FiguresEnum.EllipseFigure:
				{
					drawingFigure = new fabric.Ellipse({
						left: pointer.x,
						top: pointer.y,
						rx: 1,
						ry: 1,
						strokeWidth: selectedStrokeWidth,
						stroke: selectedStrokeColorWithAlpha,
						selectable: false,
						fill: selectedFillColorWithAlpha,
						originX: 'center', originY: 'center'
					});
					//objectsList.push(ellipse);
					canvas.add(drawingFigure);
					break;
				}
				case FiguresEnum.SquareFigure:
				{
					drawingFigure = new fabric.Rect({
						left: pointer.x,
						top: pointer.y,
						width:1,
						height:1,
						strokeWidth: selectedStrokeWidth,
						stroke: selectedStrokeColorWithAlpha,
						selectable: false,
						fill: selectedFillColorWithAlpha,
						originX: 'left', originY: 'top'
					});
					canvas.add(drawingFigure);
					//objectsList.push(square);
					break;
				}
				case FiguresEnum.PolygonFigure:	
				{
					var points = DrawingManager.regularPolygonPoints(8,1);	
					drawingFigure = new fabric.Polygon(
						points, {
							left: pointer.x,
							top: pointer.y,
							angle: 0,
							fill: selectedFillColorWithAlpha,
							stroke: selectedStrokeColorWithAlpha,
							selectable: false,
							originX: 'left', originY: 'top'
						  }
						);
					canvas.add(drawingFigure);											
					break;
				}
				case FiguresEnum.TextFigure:
				{
					drawingFigure = new fabric.IText('Hello world', {
						left: pointer.x,
						top: pointer.y,
						width:400,
						height:400,
						strokeWidth: selectedStrokeWidth,
						stroke: selectedStrokeColorWithAlpha,
						selectable: false,
						fill: selectedFillColorWithAlpha,
						originX: 'left', originY: 'top'
					});
					canvas.add(drawingFigure);
					//objectsList.push(square);
					break;
				}
			}
		});

		canvas.on('mouse:move', function(o)
		{
			if (!isDown) return;
			var drawingMode = Session.get('DrawingMode');
			switch(drawingMode)
			{
				case FiguresEnum.EnableAll:
				{
					break;
				}
				case FiguresEnum.DisableAll:
				{
					break;
				}
				case FiguresEnum.RectFigure:
				{
					if (!isDown) return;
					var pointer = canvas.getPointer(o.e);
					var leftRect = Math.min(origX,pointer.x);
					var topRect = Math.min(origY,pointer.y);
					var widthRect = Math.abs(origX - pointer.x);
					var heightRect = Math.abs(origY - pointer.y);
					drawingFigure.set({ left: leftRect, top: topRect, width: widthRect, height: heightRect });
					canvas.renderAll();
					break;
				}
				case FiguresEnum.CircleFigure:
				{
					if (!isDown) return;
					var pointer = canvas.getPointer(o.e);
					drawingFigure.set({ radius: Math.sqrt(Math.pow(origX - pointer.x, 2) + Math.pow(origY - pointer.y, 2)) });
					canvas.renderAll();
					break;
				}
				case FiguresEnum.TriangleFigure:
				{
					if (!isDown) return;
					var pointer = canvas.getPointer(o.e);
					var leftTriangle = Math.min(origX,pointer.x);
					var topTriangle = Math.min(origY,pointer.y);
					var widthTriangle = Math.abs(origX - pointer.x);
					var heightTriangle = Math.abs(origY - pointer.y);
					drawingFigure.set({ left: leftTriangle, top: topTriangle, width: widthTriangle, height: heightTriangle });
					canvas.renderAll();
					break;
				}
				case FiguresEnum.EllipseFigure:
				{
					if (!isDown) return;
					var pointer = canvas.getPointer(o.e);
					drawingFigure.set({ rx: Math.abs(origX - pointer.x), ry: Math.abs(origY - pointer.y)});
					canvas.renderAll();
					break;
				}
				case FiguresEnum.SquareFigure:
				{
					if (!isDown) return;
					var pointer = canvas.getPointer(o.e);
					var widthSquare = Math.min(Math.abs(origX - pointer.x), Math.abs(origY - pointer.y));
					var leftSquare = pointer.x > origX ? origX : Math.max(pointer.x,origX-widthSquare);
					var topSquare = pointer.y > origY ? origY : Math.max(pointer.y,origY-widthSquare);
					drawingFigure.set({ left: leftSquare, top: topSquare, width: widthSquare, height: widthSquare });
					canvas.renderAll();
					break;
				}
				case FiguresEnum.PolygonFigure:	
				{
					if (!isDown) return;
					var pointer = canvas.getPointer(o.e);
					var polygonRadius = Math.sqrt(Math.pow(origX - pointer.x, 2) + Math.pow(origY - pointer.y, 2));
					var points = DrawingManager.regularPolygonPoints(8,polygonRadius);	
					drawingFigure.set('points',points);
					drawingFigure.set({ left: origX-polygonRadius, top: origY-polygonRadius});
					canvas.renderAll();											
					break;
				}
				case FiguresEnum.TextFigure:
				{
					if (!isDown) return;
					var pointer = canvas.getPointer(o.e);
					drawingFigure.set({ left: pointer.x, top: pointer.y});
					canvas.renderAll();											
					break;
				}
			}
		});

		canvas.on('mouse:up', function(o)
		{
			var figureToSave;
			isDown = false;
			var drawingMode = Session.get('DrawingMode');
			if(selectedFigureForEditing == null)
			{
				var pointer = canvas.getPointer(o.e);
				var strokeColor = Session.get('SelectedStrokeColorWithAlpha');
				var fillColor = Session.get('SelectedFillColorWithAlpha');
				var selectedStrokeWidth = Session.get('SelectedStrokeWidth');
				switch(drawingMode)
				{
					case FiguresEnum.RectFigure:
					{
						var leftRect = Math.min(origX,pointer.x);
						var topRect = Math.min(origY,pointer.y);
						var widthRect = Math.abs(origX - pointer.x);
						var heightRect = Math.abs(origY - pointer.y);
						figureToSave = new Rect(0, 1, 1, selectedStrokeWidth, strokeColor, fillColor, topRect, leftRect, widthRect, heightRect);
						break;
					}
					case FiguresEnum.CircleFigure:
					{
						var circleRadius = Math.sqrt(Math.pow(origX - pointer.x, 2) + Math.pow(origY - pointer.y, 2));
						figureToSave = new Circle(0, 1, 1, selectedStrokeWidth, strokeColor, fillColor, origY, origX, circleRadius);
						break;
					}
					case FiguresEnum.TriangleFigure:
					{
						var leftTriangle = Math.min(origX,pointer.x);
						var topTriangle = Math.min(origY,pointer.y);
						var widthTriangle = Math.abs(origX - pointer.x);
						var heightTriangle = Math.abs(origY - pointer.y);
						figureToSave = new Triangle(0, 1, 1, selectedStrokeWidth, strokeColor, fillColor, topTriangle, leftTriangle, widthTriangle, heightTriangle);
						break;
					}
					case FiguresEnum.EllipseFigure:	
					{
						var xRadius = Math.abs(origX - pointer.x);
						var yRadius = Math.abs(origY - pointer.y);
						figureToSave = new Ellipse(0, 1, 1, selectedStrokeWidth, strokeColor, fillColor, origY, origX, xRadius, yRadius);
						break;
					}
					case FiguresEnum.SquareFigure:
					{
						var leftSquare= Math.min(origX,pointer.x);
						var topSquare = Math.min(origY,pointer.y);
						var widthSquare = Math.min(Math.abs(origX - pointer.x), Math.abs(origY - pointer.y));
						figureToSave = new Square(0, 1, 1, selectedStrokeWidth, strokeColor, fillColor, topSquare, leftSquare, widthSquare);
						break;
					}
					case FiguresEnum.PolygonFigure:	
					{
						var polygonRadius = Math.sqrt(Math.pow(origX - pointer.x, 2) + Math.pow(origY - pointer.y, 2));
						var leftPolygon = origX-polygonRadius;
						var	topPolygon = origY-polygonRadius;
						figureToSave = new Polygon(0, 1, 1, selectedStrokeWidth, strokeColor, fillColor, topPolygon, leftPolygon, 8, polygonRadius);										
						break;
					}
					case FiguresEnum.TextFigure:
					{
						var pointer = canvas.getPointer(o.e);
						figureToSave = new Text(0, 1, 1, selectedStrokeWidth, strokeColor, fillColor, pointer.y, pointer.x, 400, 400, 'Hello world');										
						break;
					}
				}
			}
			else
			{
				switch(selectedFigureForEditing.target.figureType)
				{
					case FiguresEnum.RectFigure:
					{
						figureToEdit = new Rect(selectedFigureForEditing.target.angle, selectedFigureForEditing.target.scaleX, selectedFigureForEditing.target.scaleY, selectedFigureForEditing.target.strokeWidth, selectedFigureForEditing.target.stroke, selectedFigureForEditing.target.fill, selectedFigureForEditing.target.top, selectedFigureForEditing.target.left, selectedFigureForEditing.target.width, selectedFigureForEditing.target.height);
						break;
					}
					case FiguresEnum.CircleFigure:
					{
						figureToEdit = new Circle(selectedFigureForEditing.target.angle, selectedFigureForEditing.target.scaleX, selectedFigureForEditing.target.scaleY, selectedFigureForEditing.target.strokeWidth, selectedFigureForEditing.target.stroke, selectedFigureForEditing.target.fill, selectedFigureForEditing.target.top, selectedFigureForEditing.target.left, selectedFigureForEditing.target.width * 0.5);
						break;
					}
					case FiguresEnum.TriangleFigure:
					{
						figureToEdit = new Triangle(selectedFigureForEditing.target.angle, selectedFigureForEditing.target.scaleX, selectedFigureForEditing.target.scaleY, selectedFigureForEditing.target.strokeWidth, selectedFigureForEditing.target.stroke, selectedFigureForEditing.target.fill, selectedFigureForEditing.target.top, selectedFigureForEditing.target.left, selectedFigureForEditing.target.width, selectedFigureForEditing.target.height);
						break;
					}
					case FiguresEnum.EllipseFigure:	
					{
						figureToEdit = new Ellipse(selectedFigureForEditing.target.angle, selectedFigureForEditing.target.scaleX, selectedFigureForEditing.target.scaleY, selectedFigureForEditing.target.strokeWidth, selectedFigureForEditing.target.stroke, selectedFigureForEditing.target.fill, selectedFigureForEditing.target.top, selectedFigureForEditing.target.left, selectedFigureForEditing.target.rx, selectedFigureForEditing.target.ry);
						break;
					}
					case FiguresEnum.SquareFigure:
					{
						figureToEdit = new Square(selectedFigureForEditing.target.angle, selectedFigureForEditing.target.scaleX, selectedFigureForEditing.target.scaleY, selectedFigureForEditing.target.strokeWidth, selectedFigureForEditing.target.stroke, selectedFigureForEditing.target.fill, selectedFigureForEditing.target.top, selectedFigureForEditing.target.left, selectedFigureForEditing.target.width);
						break;
					}
					case FiguresEnum.PolygonFigure:	
					{
						var polygonRadius = Math.sqrt(Math.pow(origX - pointer.x, 2) + Math.pow(origY - pointer.y, 2));
						var leftPolygon = origX-polygonRadius;
						var	topPolygon = origY-polygonRadius;
						figureToEdit = new Polygon(selectedFigureForEditing.target.angle, selectedFigureForEditing.target.scaleX, selectedFigureForEditing.target.scaleY, selectedStrokeWidth, strokeColor, fillColor, topPolygon, leftPolygon, 8, polygonRadius);										
						break;
					}
					case FiguresEnum.TextFigure:
					{
						var pointer = canvas.getPointer(o.e);
						figureToEdit = new Text(selectedFigureForEditing.target.angle, selectedFigureForEditing.target.scaleX, selectedFigureForEditing.target.scaleY, selectedStrokeWidth, strokeColor, fillColor, pointer.y, pointer.x, 400, 400, 'Hello world');										
						break;
					}
				}
			}
			if(drawingMode != FiguresEnum.EnableAll && drawingMode != FiguresEnum.DisableAll)
			{
				Meteor.call('saveFigureInDB', figureToSave, function (error, result) 
					{
						if (error) 
						{
							console.log(error);
						}
						else 
						{
							console.log('success');
						}
					});
			}
			else if(drawingMode == FiguresEnum.EnableAll && selectedFigureForEditing != null)
			{
				Meteor.call('updateFigureInDB', selectedFigureForEditing.target._id, figureToEdit, function (error) 
				{
					if (error) 
					{
						console.log(error);
					}
					else 
					{
						console.log('success');
					}
				});
			}
		});
	}
	
	static regularPolygonPoints(sideCount,radius)
	{
		var sweep=Math.PI*2/sideCount;
		var cx=radius;
		var cy=radius;
		var points=[];
		for(var i=0;i<sideCount;i++){
			var x=cx+radius*Math.cos(i*sweep);
			var y=cy+radius*Math.sin(i*sweep);
			points.push({x:x,y:y});
		}
		return(points);
}
	
	
	static drawFigure(singleFigure)
	{
		var figureToDraw;
		switch(singleFigure.type)
		{
			case FiguresEnum.RectFigure:	
			{
				figureToDraw = new fabric.Rect({
						left: singleFigure.left,
						top: singleFigure.top,
						width:singleFigure.width,
						height:singleFigure.height,
						strokeWidth: singleFigure.strokeWidth,
						stroke: singleFigure.strokeColor,
						fill:singleFigure.fillColor,
						selectable: false,
						originX: singleFigure.originX, 
						originY: singleFigure.originY,
						angle: singleFigure.angle,
						scaleX: singleFigure.scaleX,
						scaleY: singleFigure.scaleY
					});
				canvas.add(figureToDraw);
				break;
			}
			case FiguresEnum.CircleFigure:	
			{
				figureToDraw = new fabric.Circle({
					left: singleFigure.left,
					top: singleFigure.top,
					radius: singleFigure.radius,
					strokeWidth: singleFigure.strokeWidth,
					stroke: singleFigure.strokeColor,
					fill:singleFigure.fillColor,
					selectable: false,
					originX: singleFigure.originX, 
					originY: singleFigure.originY,
					angle: singleFigure.angle,
					scaleX: singleFigure.scaleX,
					scaleY: singleFigure.scaleY
				});
				canvas.add(figureToDraw);
				break;
			}
			case FiguresEnum.TriangleFigure:	
			{
				figureToDraw = new fabric.Triangle({
					left: singleFigure.left,
					top: singleFigure.top,
					width:singleFigure.width,
					height:singleFigure.height,
					strokeWidth: singleFigure.strokeWidth,
					stroke: singleFigure.strokeColor,
					fill:singleFigure.fillColor,
					selectable: false,
					originX: singleFigure.originX, 
					originY: singleFigure.originY,
					angle: singleFigure.angle,
					scaleX: singleFigure.scaleX,
					scaleY: singleFigure.scaleY
				});
				canvas.add(figureToDraw);
				break;
			}
			case FiguresEnum.EllipseFigure:	
			{
				figureToDraw = new fabric.Ellipse({
					left: singleFigure.left,
					top: singleFigure.top,
					rx:singleFigure.radiusX,
					ry:singleFigure.radiusY,
					strokeWidth: singleFigure.strokeWidth,
					stroke: singleFigure.strokeColor,
					fill:singleFigure.fillColor,
					selectable: false,
					originX: singleFigure.originX, 
					originY: singleFigure.originY,
					angle: singleFigure.angle,
					scaleX: singleFigure.scaleX,
					scaleY: singleFigure.scaleY
				});
				canvas.add(figureToDraw);
				break;
			}
			case FiguresEnum.SquareFigure:	
			{
				figureToDraw = new fabric.Rect({
						left: singleFigure.left,
						top: singleFigure.top,
						width:singleFigure.width,
						height:singleFigure.width,
						strokeWidth: singleFigure.strokeWidth,
						stroke: singleFigure.strokeColor,
						fill:singleFigure.fillColor,
						selectable: false,
						originX: singleFigure.originX, 
						originY: singleFigure.originY,
						angle: singleFigure.angle,
						scaleX: singleFigure.scaleX,
						scaleY: singleFigure.scaleY
					});
				canvas.add(figureToDraw);
				break;
			}
			case FiguresEnum.PolygonFigure:	
			{
				var points = DrawingManager.regularPolygonPoints(singleFigure.numberOfSides,singleFigure.polygonRadius);	
				figureToDraw = new fabric.Polygon(
						points, {
						left: singleFigure.left,
						top: singleFigure.top,
						angle: 0,
						fill: singleFigure.fillColor,
						stroke: singleFigure.strokeColor,
						strokeWidth: singleFigure.strokeWidth,
						selectable: false,
						originX: singleFigure.originX, 
						originY: singleFigure.originY,
						angle: singleFigure.angle,
						scaleX: singleFigure.scaleX,
						scaleY: singleFigure.scaleY
					  });
				canvas.add(figureToDraw);
				break;
			}
			case FiguresEnum.TextFigure:	
			{
				figureToDraw = new fabric.IText(singleFigure.text, {
						left: singleFigure.left,
						top: singleFigure.top,
						width:singleFigure.width,
						height:singleFigure.height,
						fill: singleFigure.fillColor,
						stroke: singleFigure.strokeColor,
						strokeWidth: singleFigure.strokeWidth,
						selectable: false,
						originX: singleFigure.originX, 
						originY: singleFigure.originY,
						angle: singleFigure.angle,
						scaleX: singleFigure.scaleX,
						scaleY: singleFigure.scaleY
					});
				canvas.add(figureToDraw);
				break;
			}
		}
		figureToDraw._id = singleFigure._id;
		if(figureToDraw._id == selectedFigureId)
		{
			canvas.setActiveObject(figureToDraw);
		}
		figureToDraw.figureType = singleFigure.type;
	}
}

//test