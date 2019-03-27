import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BookmarksService } from './services/bookmarks.service';
import { ListComponent } from './components/list/list.component';

@NgModule({
  declarations: [AppComponent, ListComponent],
  imports: [BrowserModule],
  providers: [BookmarksService],
  bootstrap: [AppComponent]
})
export class AppModule {}
