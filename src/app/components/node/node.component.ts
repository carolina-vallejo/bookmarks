import { Component, OnInit, Input, OnDestroy, HostBinding } from '@angular/core';
import { BookmarksService } from 'src/app/services/bookmarks.service';
import { DropService } from 'src/app/services/drop.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit, OnDestroy {
  @Input()
  node: any;

  @HostBinding('class.dragging')
  dragging: boolean;

  @Input()
  idNode: string;

  public favicon: string;
  // public idNode: string;
  private subs: Array<Subscription> = [];

  constructor(private readonly bookmarksService: BookmarksService, private readonly dropService: DropService) {}

  ngOnInit() {
    this.favicon = `-webkit-image-set(url("chrome://favicon/size/16@1x/${this.node.url}") 1x, url("chrome://favicon/size/16@2x/${
      this.node.url
    }") 2x)`;

    // this.idNode = this.dropService.generateUri();

    this.subs.push(
      this.dropService.onDrag.subscribe(obj => {
        if (this.idNode === obj.node.id) {
          this.dragging = obj.drag;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  public openBookmark(url) {
    window.open(url);
  }

  public removeBookmark(id: string, event) {
    event.stopPropagation();
    this.bookmarksService.removed.next(id);
  }
}
