import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
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

  constructor(private readonly bookmarksService: BookmarksService, private readonly dropService: DropService) {}

  ngOnInit() {
    this.bookmarksService.getBookmarks().then(bookmarks => {
      this.bookmarks = bookmarks;
    });
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
    this.bookmarksService.searchBookmarks(event.target.value).then(bookmarks => {
      this.results = bookmarks;
    });
  }

  public cleanBookmarks() {
    this.results = null;
    this.query = null;
  }

  public refreshData() {
    this.bookmarksService.getBookmarks().then(bookmarks => {
      this.bookmarks = bookmarks;
    });
  }
}
