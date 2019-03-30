import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BookmarksService } from './services/bookmarks.service';
import { ListComponent } from './components/list/list.component';
import { BookmarkComponent } from './components/list/bookmark/bookmark.component';
import { PopupComponent } from './components/popup/popup.component';
import { NodeComponent } from './components/node/node.component';

@NgModule({
  declarations: [AppComponent, ListComponent, BookmarkComponent, PopupComponent, NodeComponent],
  imports: [BrowserModule],
  providers: [BookmarksService],
  bootstrap: [AppComponent]
})
export class AppModule {}
