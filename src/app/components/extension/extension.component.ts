import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { BookmarksService } from 'src/app/services/bookmarks.service';
import { DropService } from 'src/app/services/drop.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-extension',
  templateUrl: './extension.component.html',
  styleUrls: ['./extension.component.scss']
})
export class ExtensionComponent implements OnInit, AfterViewInit, OnDestroy {
  public bookmarks;
  public results;
  public query: string;
  public foldersTree;
  public idRootList: string;
  private subs: Array<Subscription> = [];

  constructor(private readonly bookmarksService: BookmarksService, private readonly dropService: DropService) {}

  ngOnInit() {
    this.idRootList = this.bookmarksService.getActualFolder();
    //  Initial bookmars
    this.bookmarksService.getBookmarks().then(bookmarks => {
      this.foldersTree = bookmarks;
      this.bookmarks = bookmarks;
    });

    this.subs.push(
      this.bookmarksService.refreshData.subscribe(data => {
        this.getFolderContent(data.id);
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  ngAfterViewInit() {
    //  Activate drag and drop interactions
    this.dropService.drag('.bookmark-drag');
    this.dropService.drop('.bookmark-drag', '.folder-drop');

    this.subs.push(
      this.dropService.dropped.subscribe(dropped => {
        this.bookmarksService.moveBookmark(dropped.id, dropped.parentId).then(data => {
          //  get folder content
          this.getFolderContent(this.bookmarksService.getActualFolder());
          //  get list
          this.refreshList();
        });
      })
    );

    this.subs.push(
      this.bookmarksService.removed.subscribe(id => {
        this.bookmarksService.removeBookmark(id).then(() => {
          //  get folder content
          this.getFolderContent(this.bookmarksService.getActualFolder());
          //  get list
          this.refreshList();
        });
      })
    );

    this.subs.push(
      this.bookmarksService.addedFolder.subscribe(id => {
        this.bookmarksService.addFolder(id).then(() => {
          //  get folder content
          this.getFolderContent(this.bookmarksService.getActualFolder());
          //  get list
          this.refreshList();
        });
      })
    );

    this.subs.push(
      this.bookmarksService.removedFolder.subscribe(id => {
        this.bookmarksService.removeFolder(id).then(() => {
          //  get folder content
          this.getFolderContent(this.bookmarksService.getActualFolder());
          //  get list
          this.refreshList();
        });
      })
    );

    this.subs.push(
      this.bookmarksService.updated.subscribe(data => {
        this.bookmarksService.update(data.id, data.obj).then(() => {
          //  get folder content
          this.getFolderContent(this.bookmarksService.getActualFolder());
          //  get list
          this.refreshList();
        });
      })
    );
  }

  public search(event) {
    this.bookmarksService.searchBookmarks(event.target.value).then(bookmarks => {
      this.results = bookmarks;
    });
  }

  public cleanSearch() {
    this.results = null;
    this.query = null;
    this.refreshData();
  }

  public refreshData() {
    this.bookmarksService.getBookmarks().then(bookmarks => {
      this.bookmarks = bookmarks;
    });
  }

  public refreshList() {
    this.bookmarksService.getBookmarks().then(bookmarks => {
      this.foldersTree = bookmarks;
    });
  }

  public getFolderContent(folderId) {
    this.bookmarksService.setActualFolder(folderId);
    this.bookmarksService.getSubtree(folderId).then(bookmarks => {
      this.bookmarks = bookmarks;
    });
  }

  public addBookmark() {
    this.bookmarksService.getUrlActiveTab().then((tabUrl: any) => {
      this.bookmarksService.addBookmark(tabUrl.url, tabUrl.title).then(() => {
        //  get folder content
        this.getFolderContent(this.bookmarksService.getActualFolder());
        //  get list
        this.refreshList();
      });
    });
  }
}
