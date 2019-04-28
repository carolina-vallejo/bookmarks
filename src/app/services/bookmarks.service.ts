import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

declare const chrome;

@Injectable({
  providedIn: 'root'
})
export class BookmarksService {
  public removedBookmark: Subject<any> = new Subject<any>();
  public removedFolder: Subject<any> = new Subject<any>();
  public addedFolder: Subject<any> = new Subject<any>();
  public updated: Subject<any> = new Subject<any>();
  public refreshData: Subject<any> = new Subject<any>();
  public refreshList: Subject<any> = new Subject<any>();

  private rootFolder = '0';
  private actualFolder = '3';

  constructor() {}

  public getBookmarks() {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.getTree(bookmarks => {
        resolve(this.recursion(bookmarks[0].children[parseInt(this.rootFolder, 10)]));
        // resolve(this.recursion(bookmarks[0]));
      });
    });
  }

  //  Search busca en todos los bookmarks
  public searchBookmarks(query: string) {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.getTree(bookmarks => {
        resolve(this.recursion(bookmarks[0].children[parseInt(this.rootFolder, 10)], query));
      });
    });
  }

  //  Search busca en todos los bookmarks
  public searchBookmarksflat(query: string) {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.search(query, bookmarks => {
        console.log(bookmarks);
        resolve(this.recursion({ children: bookmarks }));
      });
    });
  }

  public getSubtree(id: string) {
    this.actualFolder = id;
    return new Promise((resolve, reject) => {
      chrome.bookmarks.getSubTree(id, bookmarks => {
        resolve(this.recursion(bookmarks[0]));
      });
    });
  }

  public moveBookmark(id: number, parentId: string) {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.move(id, { parentId }, bookmark => {
        resolve(bookmark);
      });
    });
  }

  public removeBookmark(id: number) {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.remove(id, () => {
        resolve();
      });
    });
  }

  public removeFolder(id: string) {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.removeTree(id, () => {
        resolve();
      });
    });
  }

  public getUrlActiveTab() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true
        },
        tabs => {
          const tabURL = tabs[0];
          resolve(tabURL);
        }
      );
    });
  }

  public addBookmark(url, title?) {
    return new Promise((resolve, reject) => {
      const obj = {
        url,
        parentId: this.actualFolder
      };
      if (title) {
        obj['title'] = title;
      }
      chrome.bookmarks.create(obj, () => {
        resolve();
      });
    });
  }

  public addFolder(folderId, title?) {
    return new Promise((resolve, reject) => {
      const obj = {
        url: null
      };
      if (folderId) {
        obj['parentId'] = folderId;
      }
      if (title) {
        obj['title'] = title;
      }

      chrome.bookmarks.create(obj, () => {
        resolve();
      });
    });
  }

  public update(id, obj) {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.update(id, obj, () => {
        resolve();
      });
    });
  }

  private recursion(googleTreeNode, query: string = '', forceKeep: boolean = false) {
    if (googleTreeNode.children) {
      // if this is a folder

      // return a "folder"
      let treeNode = {
        type: 'folder',
        count: 0,
        ...googleTreeNode
      };

      // the folder will have children
      treeNode.children = googleTreeNode.children
        .map(child => {
          // go through all the tree
          const childMatchesQuery = this.checkTitle(child, query);
          return this.recursion(child, query, childMatchesQuery);
        })
        // now we have lots of OUR treeNode (all the children and children children and .... are MAPPED!)
        .filter(child => {
          // if the folder title matches the query, keep it
          // if the folder contains children, keep it
          return this.checkTitle(child, query) || child.count > 0 || forceKeep;
        })
        .sort((childA, childB) => {
          // sort by count
          return childB.dateAdded - childA.dateAdded;
        })
        .sort((childA, childB) => {
          // sort by type
          return childA.type.localeCompare(childB.type);
        });

      // now that all the children are filtered, we can calculate the COUNT for the parent (current treeNode);
      treeNode.count = treeNode.children.reduce((sum, child) => sum + child.count, 0);

      // now that we mapped everything to treeNodes, filtered and counted bookmarks recursively, return the current treeNode
      return treeNode;
    } else {
      // if  this is a bookmark

      // return our own version of the bookmark with type and COUNT
      // bookmark COUNT is 1
      // IF that bookmark needs to be filtered OUT, we set the COUNT to 0 and the parent FOLDER will filter out this child
      return {
        ...googleTreeNode,
        type: 'bookmark',
        count: this.checkTitle(googleTreeNode, query) || this.checkUrl(googleTreeNode, query) ? 1 : 0
      };
    }
  }

  private checkUrl(data, query) {
    return data.url && data.url.toLowerCase().indexOf(query.toLowerCase()) > -1;
  }

  private checkTitle(data, query) {
    return data.title.toLowerCase().indexOf(query.toLowerCase()) > -1;
  }

  public setActualFolder(folderId: string) {
    this.actualFolder = folderId;
  }

  public getActualFolder(): string {
    return this.actualFolder;
  }
}
