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
      this.bookmarks = this.recursion(bookmarks[0].children[0]);

      console.log(bookmarks);
    });
  }

  public search(event) {
    this.bookmarksService.searchBookmarks(event.target.value).then(bookmarks => {
      this.results = bookmarks;
    });
  }

  private recursion(data) {
    if (data.children) {
      let returnValue = {
        type: 'folder',
        count: 0,
        ...data
      };
      returnValue.children = [];
      data.children.forEach(d => {
        const child = this.recursion(d);
        returnValue.children.push(child);
        returnValue.count += child.count;
      });
      returnValue.children = returnValue.children.sort((childA, childB) => childA.type.localeCompare(childB.type));
      return returnValue;
    } else {
      return {
        ...data,
        type: 'bookmark',
        count: 1
      };
    }
  }
}
