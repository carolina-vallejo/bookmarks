import { Component, OnInit } from '@angular/core';
import { BookmarksService } from 'src/app/services/bookmarks.service';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.scss']
})
export class BookmarkComponent implements OnInit {
  public bookmarks;

  public results;
  public query: string;

  constructor(private readonly bookmarksService: BookmarksService) {}

  ngOnInit() {
    this.bookmarksService.getBookmarks().then(bookmarks => {
      this.bookmarks = bookmarks;
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
}
