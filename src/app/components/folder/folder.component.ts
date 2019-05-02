import { Component, OnInit, Input } from '@angular/core';
import { BookmarksService } from 'src/app/services/bookmarks.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit {
  @Input()
  folder: any;

  constructor(private readonly bookmarksService: BookmarksService) {}

  ngOnInit() {}

  public openFolder() {
    this.bookmarksService.refreshData.next({ id: this.folder.id });

    setTimeout(() => {
      this.bookmarksService.scrollTo(this.folder.id);
    }, 0);
  }

  public removeFolder(event) {
    event.stopPropagation();
    this.bookmarksService.removedFolder.next(this.folder);
  }
}
