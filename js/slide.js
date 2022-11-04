import debounce from './debounce.js';

export class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.dist = { finalPosition: 0, startX: 0, movement:0 };
    this.activeClass = 'active'
  }

  transition(ativo) {
    this.slide.style.transition = ativo ? 'transform .3s' : '';
  }

  moveSlide(distX) {
    this.dist.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }
  
  updatePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.6;
    return this.dist.finalPosition - this.dist.movement;
  }

  onStart(evento) {
    let movetype;
    if(evento.type === 'mousedown') {
      evento.preventDefault();
      this.dist.startX = evento.clientX;
      movetype = 'mousemove'
    } else {
      this.dist.startX = evento.changedTouches[0].clientX;
      movetype = 'touchmove'
    }
    this.wrapper.addEventListener(movetype, this.onMove);
    this.transition(false)
  }

  onMove(evento) {
    const pointerPosition = (evento.type === 'mousemove') ? evento.clientX : evento.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }

  onEnd(evento) {
    const movetype = (evento.type === 'mouseup') ? 'mousemove' : 'touchmove';
    this.wrapper.removeEventListener(movetype, this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
    this.transition(true);
    this.changeSlideOnEnd();
  }

  changeSlideOnEnd() {
    if (this.dist.movement > 120 && this.index.next !== undefined) {
      this.activateNextSlide();
    } else if(this.dist.movement < -120 && this.index.prev !== undefined) {
      this.activatePrevSlide();
    } else {
      this.changeSlide(this.index.active);
    }
  }

  addSlideEvents() {
    this.wrapper.addEventListener('mousedown', this.onStart);
    this.wrapper.addEventListener('touchstart', this.onStart);
    this.wrapper.addEventListener('mouseup', this.onEnd);
    this.wrapper.addEventListener('touchend', this.onEnd);
  }
  
  // Slides config
  slideCenter(image) {
    const margin = (this.wrapper.offsetWidth - image.offsetWidth) / 2;
    return -(image.offsetLeft - margin);
  }

  slidesConfig() {
    this.slideArray = [...this.slide.children].map((element) => {
      const position = this.slideCenter(element);
      return {
        position, 
        element
      };
    })
  }

  slidesIndexNav(index) {
    const last = this.slideArray.length - 1;
    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    }
  }

  changeSlide(index) {
    const activeSlide = this.slideArray[index]
    this.moveSlide(activeSlide.position);
    this.slidesIndexNav(index);
    this.dist.finalPosition = activeSlide.position;
    this.changeActiveClass();
  }

  changeActiveClass() {
    this.slideArray.forEach((item) => {
      item.element.classList.remove(this.activeClass)
    })
    this.slideArray[this.index.active].element.classList.add(this.activeClass);
  }

  activatePrevSlide() {
    if(this.index.prev !== undefined) {
      this.changeSlide(this.index.prev);
    }
  }

  activateNextSlide() {
    if(this.index.next !== undefined) {
      this.changeSlide(this.index.next);
    }
  }

  onResize() {
    setTimeout(() => {
      this.slidesConfig();
      this.changeSlide(this.index.active);
    }, 1000);
  }

  addResizeEvent() {
    window.addEventListener('resize', this.onResize)
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);

    this.activatePrevSlide = this.activatePrevSlide.bind(this);
    this.activateNextSlide = this.activateNextSlide.bind(this); 

    this.onResize = debounce(this.onResize.bind(this), 200);
  }
  
  init() {
    this.bindEvents();
    this.transition(true);
    this.addSlideEvents();
    this.slidesConfig();
    this.addResizeEvent();

    // inicia pelo primeiro slide
    this.changeSlide(0);
    return this;
  }
}

export class SlideNav extends Slide {
  addArrow(prev, next) {
    this.prevElement = document.querySelector(prev);
    this.nextElement = document.querySelector(next);
    this.addArrowEvent();
  }
  
  addArrowEvent() {
    this.prevElement.addEventListener('click', this.activatePrevSlide);
    this.nextElement.addEventListener('click', this.activateNextSlide);
  }
}
