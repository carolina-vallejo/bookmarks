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

  public duplicateMode: boolean = false;
  public parentsMap: any = {};

  constructor(private readonly bookmarksService: BookmarksService, private readonly dropService: DropService) {}

  ngOnInit() {
    this.subs.push(
      this.bookmarksService.refreshData.subscribe(data => {
        if (data) {
          if (this.results) {
            this.results = null;
            this.query = null;
          }
          this.getFolderContent(data.id);
          this.duplicateMode = false;
          console.log('refresh data');
        }
      })
    );

    //  Initial bookmars
    this.bookmarksService.getBookmarks().then(bookmarks => {
      this.foldersTree = bookmarks;
      this.bookmarks = bookmarks;

      //  If there is a folder in cache
      if (this.lastFolder && this.lastFolder !== 'undefined') {
        this.bookmarksService.setActualFolder(this.lastFolder);
        this.bookmarksService.refreshData.next({ id: this.lastFolder });

        setTimeout(() => {
          this.bookmarksService.scrollTo(this.lastFolder);
        }, 0);
      }
    });

    this.idRootList = this.bookmarksService.getActualFolder();
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
      this.bookmarksService.removedBookmark.subscribe(id => {
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
        this.bookmarksService.removeFolder(id).then((parentId: string) => {
          //  get folder content
          this.bookmarksService.setActualFolder(parentId);
          window.localStorage.setItem('lastFolderBookmarkExtension', parentId);
          // console.log(parentId);
          this.getFolderContent(parentId);
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

  public search() {
    this.bookmarksService.searchBookmarksflat(this.query).then(bookmarks => {
      this.results = bookmarks;
    });
  }

  public cleanSearch() {
    this.results = null;
    this.query = null;
    // this.refreshData();
    this.bookmarksService.refreshData.next({ id: this.bookmarksService.getActualFolder() });
  }

  public refreshData() {
    this.bookmarksService.getBookmarks().then(bookmarks => {
      this.bookmarks = bookmarks;
    });
  }

  public refreshList() {
    if (this.duplicateMode) {
      this.refreshDuplicates();
    } else if (this.results) {
      this.bookmarksService.searchBookmarksflat(this.query).then(bookmarks => {
        this.results = bookmarks;
      });

      this.bookmarksService.getBookmarks().then(bookmarks => {
        this.foldersTree = bookmarks;
      });
    } else {
      this.bookmarksService.getBookmarks().then(bookmarks => {
        this.foldersTree = bookmarks;
      });
    }
  }

  public getFolderContent(folderId) {
    this.bookmarksService.setActualFolder(folderId);
    window.localStorage.setItem('lastFolderBookmarkExtension', folderId);

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

  private refreshDuplicates() {
    this.bookmarksService.getDuplicates().then(bookmarks => {
      this.bookmarks = bookmarks;

      const duplicates = this.bookmarks.children.map(bookmark => {
        return bookmark.parentId;
      });
      //  Get name of the parent
      this.bookmarksService.getNode(duplicates).then((nodes: Array<any>) => {
        nodes.forEach(node => {
          this.parentsMap[node.id] = node;
        });
      });
    });
  }

  public get lastFolder(): string {
    return window.localStorage.getItem('lastFolderBookmarkExtension');
  }
}
