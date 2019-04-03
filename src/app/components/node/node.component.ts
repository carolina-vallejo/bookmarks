import { Component, OnInit, Input } from '@angular/core';
import { BookmarksService } from 'src/app/services/bookmarks.service';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit {
  @Input()
  node: any;

  public letter: string;
  public favicon: string;

  constructor(private readonly bookmarksService: BookmarksService) {}

  ngOnInit() {
    this.letter = this.node.title.slice(0, 1);
    this.favicon = `-webkit-image-set(url("chrome://favicon/size/16@1x/${this.node.url}") 1x, url("chrome://favicon/size/16@2x/${
      this.node.url
    }") 2x)`;
  }

  public openBookmark(url) {
    // window.open(url);
    console.log(this.node);
  }

  public removeBookmark(id: string, event) {
    event.stopPropagation();
    this.bookmarksService.removed.next(id);
  }
}
