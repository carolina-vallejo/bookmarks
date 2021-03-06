import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import * as interact from 'interactjs';

@Injectable({
  providedIn: 'root'
})
export class DropService {
  public dropped: Subject<any> = new Subject<any>();
  public onDrag: Subject<any> = new Subject<any>();
  private dragabble: any;

  constructor() {}

  public drop(dragElm, dropElm) {
    interact(dropElm).dropzone({
      accept: dragElm,
      overlap: 0.3,
      ondragenter: event => {
        event.target.style.background = 'rgba(87, 101, 107, 0.1)';
        this.dragabble.draggable({
          restrict: {
            restriction: 'self'
          }
        });
      },
      ondragleave: event => {
        event.target.style.background = 'white';
        this.dragabble.draggable({
          restrict: {
            restriction: 'parent'
          }
        });
      },
      ondrop: event => {
        event.target.style.background = 'white';

        setTimeout(() => {
          //  ADD TO CANVAS!!!
          const obj = {
            id: event.relatedTarget.id,
            parentId: event.target.id
          };
          this.dropped.next(obj);
          event.relatedTarget.style.opacity = 0;
        }, 0);
      },
      ondropdeactivate: event => {
        event.target.style.background = 'white';

        setTimeout(() => {
          event.relatedTarget.style.opacity = 1;
          this.cleanTranslation(event);
        }, 300);
      }
    });
  }
  public drag(elm) {
    this.dragabble = interact(elm);

    this.dragabble.draggable({
      inertia: true,
      restrict: {
        restriction: 'parent',
        endOnly: true,
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
      },
      autoScroll: true,
      // dragMoveListener from the dragging demo above
      onmove: event => {
        const target = event.target;

        // keep the dragged position in the data-x/data-y attributes
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

        // update the position attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      },
      onstart: event => {
        this.onDrag.next({ node: event.target, drag: true });
      },
      onend: event => {
        this.onDrag.next({ node: event.target, drag: false });
      }
    });
    return this.dragabble;
  }
  private cleanTranslation(event) {
    const target = event.relatedTarget;
    // translate the element
    target.style.webkitTransform = target.style.transform = '';

    // update the posiion attributes
    target.setAttribute('data-x', 0);
    target.setAttribute('data-y', 0);
  }

  public generateUri() {
    var uri = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    for (var i = 0; i < 9; i++) uri += possible.charAt(Math.floor(Math.random() * possible.length));

    return uri;
  }
}
