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

  public searchBookmarks(query: any) {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.search(query, bookmarks => {
        resolve(bookmarks);
      });
    });
  }
}
