import { Injectable } from '@angular/core';

declare const chrome;

@Injectable({
  providedIn: 'root'
})
export class BookmarksService {
  constructor() {}

  public getBookmarks() {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.getTree(bookmarks => {
        resolve(bookmarks);
      });
    });
  }
}
