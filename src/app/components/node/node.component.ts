import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit {
  @Input()
  node: any;

  public letter: string;

  constructor() {}

  ngOnInit() {
    this.letter = this.node.title.slice(0, 1);
  }

  public openBookmark(url) {
    // window.open(url);
    console.log(this.node);
  }
}
