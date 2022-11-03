export default class Slide {
  constructor(slide, wrapper){
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
  }
  onStart(evento){
    evento.preventDefault();
    this.wrapper.addEventListener('mousemove', this.onMove);
  }
  onMove(evento){
    
  }
  onEnd(evento){
    this.wrapper.removeEventListener('mousemove', this.onMove)
  }
  addSlideEvents(){
    this.wrapper.addEventListener('mousedown', this.onStart);
    this.wrapper.addEventListener('mouseup', this.onEnd);
  }
  bindEvents(){
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }
  init(){
    this.bindEvents();
    this.addSlideEvents();
    return this;
  }
}
