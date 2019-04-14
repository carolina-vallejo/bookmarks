import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BookmarksService } from 'src/app/services/bookmarks.service';
import { DropService } from 'src/app/services/drop.service';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.scss']
})
export class BookmarkComponent implements OnInit, AfterViewInit {
  public bookmarks;
  public results;
  public query: string;

  private rootFolderId = '2';
  private baseFolderId = '3';

  constructor(private readonly bookmarksService: BookmarksService, private readonly dropService: DropService) {}

  ngOnInit() {
    this.refreshData();
  }

  ngAfterViewInit() {
    this.dropService.drag('.bookmark-drag');
    this.dropService.drop('.bookmark-drag', '.folder-drop');

    this.dropService.dropped.subscribe(dropped => {
      this.bookmarksService.moveBookmark(dropped.id, dropped.parentId).then(data => {
        this.refreshData();
      });
    });

    this.bookmarksService.removed.subscribe(id => {
      console.log(id);
      this.bookmarksService.removeBookmark(id).then(() => {
        this.refreshData();
      });
    });
  }

  public search(event) {
    this.bookmarksService.searchBookmarks(event.target.value, this.rootFolderId).then(bookmarks => {
      this.results = bookmarks;
    });
  }

  public cleanBookmarks() {
    this.results = null;
    this.query = null;
  }

  public refreshData() {
    this.bookmarksService.getBookmarks(this.rootFolderId).then(bookmarks => {
      this.bookmarks = bookmarks;
    });
  }

  public addBookmark() {
    this.bookmarksService.getUrlActiveTab().then((tabUrl: any) => {
      console.log(tabUrl.url);
      this.bookmarksService.addBookmark(tabUrl.url, tabUrl.title, this.baseFolderId).then(() => {
        console.log('done');
        this.refreshData();
      });
    });
  }
}
