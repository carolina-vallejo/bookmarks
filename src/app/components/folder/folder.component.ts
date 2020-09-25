import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { BookmarksService } from 'src/app/services/bookmarks.service';
import { DropService } from 'src/app/services/drop.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit {
  @Input()
  folder: any;

  private subs: Array<Subscription> = [];

  @HostBinding('class.dragging')
  dragging: boolean;

  private allowUrl: boolean = true;

  constructor(private readonly bookmarksService: BookmarksService, private readonly dropService: DropService) {}

  ngOnInit() {
    this.subs.push(
      this.dropService.onDrag.subscribe(obj => {
        if (this.folder.id === obj.node.id) {
          this.dragging = obj.drag;
          if (obj.drag) {
            this.allowUrl = false;
          } else {
            setTimeout(() => {
              this.allowUrl = true;
            }, 0);
          }
        }
      })
    );
  }

  public openFolder() {
    if (this.allowUrl) {
      this.bookmarksService.refreshData.next({ id: this.folder.id });

      setTimeout(() => {
        this.bookmarksService.scrollTo(this.folder.id);
      }, 0);
    }
  }

  public removeFolder(event) {
    event.stopPropagation();
    this.bookmarksService.removedFolder.next(this.folder);
  }
}
