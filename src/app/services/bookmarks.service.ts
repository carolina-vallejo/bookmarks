import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

declare const chrome;

@Injectable({
  providedIn: 'root'
})
export class BookmarksService {
  public removedBookmark: Subject<any> = new Subject<any>();
  public removedFolder: Subject<any> = new Subject<any>();
  public addedFolder: Subject<any> = new Subject<any>();
  public updated: Subject<any> = new Subject<any>();
  public refreshData: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public refreshList: Subject<any> = new Subject<any>();

  private actualFolder;

  private duplicates: { [url: string]: Array<any> } = {};
  private dupliFlat: Array<any> = [];

  public HEADER_HEIGHT = 72;

  constructor() {}

  public getBookmarks() {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.getTree(bookmarks => {
        // const result = this.recursion(bookmarks[0].children[parseInt(this.rootFolder, 10)]);

        const result = this.recursion(bookmarks[0]);

        resolve(result);
      });
    });
  }

  public getDuplicates() {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.getTree(bookmarks => {
        this.duplicates = {};
        this.dupliFlat = [];

        this.recursion(bookmarks[0], '', false, true);

        Object.keys(this.duplicates).forEach(key => {
          if (this.duplicates[key].length === 1) {
            delete this.duplicates[key];
          } else {
            this.dupliFlat = this.dupliFlat.concat(this.duplicates[key]);
          }
        });

        resolve({ children: this.dupliFlat });
      });
    });
  }

  //  Search busca en todos los bookmarks
  // public searchBookmarks(query: string) {
  //   return new Promise((resolve, reject) => {
  //     chrome.bookmarks.getTree(bookmarks => {
  //       resolve(this.recursion(bookmarks[0].children[parseInt(this.rootFolder, 10)], query));
  //     });
  //   });
  // }

  //  Search busca en todos los bookmarks
  public searchBookmarksflat(query: string) {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.search(query, bookmarks => {
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

  public getNode(id: string) {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.get(id, bookmark => {
        resolve(bookmark);
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

  public removeFolder(folder: any) {
    const parent = folder.parentId;
    return new Promise((resolve, reject) => {
      chrome.bookmarks.removeTree(folder.id, () => {
        resolve(parent);
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

  private recursion(googleTreeNode, query: string = '', forceKeep: boolean = false, collectDuplicates: boolean = false) {
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
          return this.recursion(child, query, childMatchesQuery, collectDuplicates);
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

      if (collectDuplicates) {
        let treeNode = {
          type: 'duplicate',
          ...googleTreeNode
        };

        this.duplicates[googleTreeNode.url] = this.duplicates[googleTreeNode.url] || [];
        this.duplicates[googleTreeNode.url].push(treeNode);
      }

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

  public scrollTo(idFolder) {
    const elm = document.getElementById(idFolder);
    if (elm) {
      const top = elm.getBoundingClientRect().top - this.HEADER_HEIGHT;

      const list = document.getElementById('list-folder');
      const listTop = list.scrollTop;

      list.scrollTo(0, top + listTop);
    }
  }
}
