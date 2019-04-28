import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {
  @Input()
  bookmarks: any;

  @Input()
  children: any;

  @Input()
  results: any;

  constructor() {}

  ngOnInit() {
    if (this.children) {
      this.bookmarks = this.children;
    }
  }
}
