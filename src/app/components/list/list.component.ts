import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BookmarksService } from 'src/app/services/bookmarks.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  @Input()
  children: any;

  @Input()
  folders: any;

  public active: boolean;

  private subs: Array<Subscription> = [];
  public titleModel: string;
  public editTitle: boolean;

  constructor(private readonly bookmarksService: BookmarksService) {}

  ngOnInit() {
    if (this.children) {
      this.folders = this.children;
    }
    //  get the initial active folder
    this.active = !this.folders ? true : false;

    this.subs.push(
      this.bookmarksService.refreshData.subscribe(data => {
        if (data.id === this.folders.id) {
          this.active = true;
        } else {
          this.active = false;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(sub => {
      sub.unsubscribe();
    });
  }

  public openFolder(folder, event) {
    event.stopPropagation();
    this.bookmarksService.refreshData.next({ id: folder.id });
  }

  public addFolder(folderId: string, event) {
    event.stopPropagation();
    this.bookmarksService.addedFolder.next(folderId);
  }

  public addFolderTitle(id: string) {
    // event.stopPropagation();
    this.bookmarksService.updated.next({ id: id, obj: { title: this.titleModel } });
  }

  public editFolderTitle() {
    this.titleModel = this.folders.title;
    this.editTitle = true;
  }
}
