import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BookmarksService } from './services/bookmarks.service';
import { ListComponent } from './components/list/list.component';
import { PopupComponent } from './components/popup/popup.component';
import { NodeComponent } from './components/node/node.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DropService } from './services/drop.service';
import { MomentModule } from 'ngx-moment';
import { BookmarksComponent } from './components/bookmarks/bookmarks.component';
import { FolderComponent } from './components/folder/folder.component';
import { ExtensionComponent } from './components/extension/extension.component';
@NgModule({
  declarations: [AppComponent, ListComponent, PopupComponent, NodeComponent, BookmarksComponent, FolderComponent, ExtensionComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ScrollingModule,
    MomentModule.forRoot({
      relativeTimeThresholdOptions: {
        m: 59
      }
    })
  ],
  providers: [BookmarksService, DropService],
  bootstrap: [AppComponent]
})
export class AppModule {}
