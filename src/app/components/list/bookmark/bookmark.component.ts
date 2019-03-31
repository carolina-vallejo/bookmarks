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

  constructor(private readonly bookmarksService: BookmarksService) {}

  ngOnInit() {
    this.bookmarksService.getBookmarks().then(bookmarks => {
      this.bookmarks = bookmarks;
      console.log('GETALL', bookmarks);
    });
  }

  public search(event) {
    this.bookmarksService.searchBookmarks(event.target.value).then(bookmarks => {
      this.results = bookmarks;
      console.log('CUSTOM SEARCH', bookmarks);
    });
  }
}
