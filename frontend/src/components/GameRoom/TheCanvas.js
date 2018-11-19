import React, { Component } from 'react';
import RealTimeService from '../../services/RealTimeService';

class TheCanvas extends Component {
    constructor(props) {
        super(props);
        this.mainCanvas = null; this.mainCtx = null;
        this.penDown = false;

        this.strokeCanvas = document.createElement('canvas');
        this.strokeCanvas.width = props.width;
        this.strokeCanvas.height = props.height;

        if(!this.strokeCanvas.getContext) {
            throw new Error("Your browser doesn't support HTML5, please update your browser.");
        }
        this.strokeCtx = this.strokeCanvas.getContext('2d');
        this.rtService = new RealTimeService();  
    }


    draw = () => {
        let ctx = this.mainCtx;
        ctx.clearRect(0,0, this.props.width, this.props.height);
        ctx.drawImage(this.strokeCanvas, 0,0);
    }

    _draw = () => {
        this.draw();
        window.requestAnimationFrame(this._draw);
    }

    componentDidMount() {
        this.mainCtx = this.mainCanvas.getContext('2d');
        window.requestAnimationFrame(this._draw);
    
        this.rtService.onCanvasAction((action, pos) => {


            if(action == 'clear') {
                
            } else if(action == 'pendown') {
                this.mouseDown(pos.x, pos.y);
            } else if(action == 'penup') {
                this.mouseUp(pos.x, pos.y);
            } else if(action == 'stroke') {
                this.mouseMove(pos.x, pos.y);
            }
        });
    }

    componentWillUnmount() {

    }

    myTurn() {
        return true;
    }

    handleMouseUp = (evt) => {
        let pos = this.getMousePos(evt);
        if(this.myTurn()) {
            this.rtService.mouseUp(pos);
            this.mouseUp(pos.x, pos.y)
        }
    }

    mouseUp = (x,y) => {
        let ctx = this.strokeCtx;

        if(!this.penDown) return;
        ctx.lineTo(x,y);
        ctx.stroke();
        this.penDown = false;
    }

    handleMouseDown = (evt) => {
        let pos = this.getMousePos(evt);
        if(this.myTurn()) {
            this.rtService.mouseDown(pos);
            this.mouseDown(pos.x, pos.y);
        }
    }

    mouseDown(x, y) {

        let ctx = this.strokeCtx;
        this.penDown = true;

        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.lineTo(x,y);
        ctx.stroke();
        ctx.beginPath();
    }

    handleMouseMove = (evt) => {
        let pos = this.getMousePos(evt);
        if(this.myTurn()) {
            if(this.penDown) this.rtService.stroke(pos);
            this.mouseMove(pos.x, pos.y);
        }
    }

    mouseMove(x, y) {
        let ctx = this.strokeCtx;

        if(this.penDown)  {
            ctx.lineTo(x,y);
            ctx.stroke();
        }
    }

    handleMouseLeave = (evt) => {
       let pos = this.getMousePos(evt);
       // let ctx = this.strokeCtx;

        //ctx.lineTo(x,y); ctx.stroke();
        if(this.myTurn())  {
            this.rtService.mouseUp(pos);
            this.mouseUp(pos.x, pos.y);
            this.penDown = false;
        }
    }

    getMousePos = (evt) => {
        let rect = this.mainCanvas.getBoundingClientRect();
        return {
            x: Math.round(evt.clientX - rect.left),
            y: Math.round(evt.clientY - rect.top)
        }
    }

    render() {
        return <canvas ref={e => this.mainCanvas = e}
            onMouseMove={this.handleMouseMove}
            onMouseUp={this.handleMouseUp}
            onMouseDown={this.handleMouseDown}
            onMouseLeave={this.handleMouseLeave}
            width={this.props.width} height={this.props.height} />
    }
}

export default TheCanvas;