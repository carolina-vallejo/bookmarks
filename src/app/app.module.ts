import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BookmarksService } from './services/bookmarks.service';
import { ListComponent } from './components/list/list.component';
import { BookmarkComponent } from './components/list/bookmark/bookmark.component';
import { PopupComponent } from './components/popup/popup.component';
import { NodeComponent } from './components/node/node.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [AppComponent, ListComponent, BookmarkComponent, PopupComponent, NodeComponent],
  imports: [BrowserModule, FormsModule, ScrollingModule],
  providers: [BookmarksService],
  bootstrap: [AppComponent]
})
export class AppModule {}
