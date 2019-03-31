import { Component, OnInit, Input } from '@angular/core';
import { BookmarksService } from 'src/app/services/bookmarks.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @Input()
  children: any;

  @Input()
  bookmarks: any;

  public textBookmark: string;

  constructor() {}

  ngOnInit() {
    if (this.children) {
      this.bookmarks = this.children;
      this.textBookmark = this.bookmarks.title;
    }
  }

  public openBookmark(list) {
    console.log('folder', list);
    // window.open(list.url);
  }
}
