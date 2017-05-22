import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Article } from './article';
import { environment } from '../environments/environment';

interface ArticleSortFn {
  /**
   * [].sort(compare(a, b))
   * return value
   *  0 == they are equal in sort
   *  1 == a comes before b
   *  -1 == b comes before a
   */
  (a: Article, b: Article): number;
}

interface ArticleSortOrderFn {
  (direction: number): ArticleSortFn;
}

const sortByTime: ArticleSortOrderFn =
  (direction: number) => (a: Article, b: Article) => {
    return direction *
      (b.publishedAt.getTime() -
        a.publishedAt.getTime());
  };

const sortByVotes: ArticleSortOrderFn =
  (direction: number) => (a: Article, b: Article) => {
    return direction *
      (b.votes - a.votes);
  };

const sortFns = {
  'Time': sortByTime,
  'Votes': sortByVotes
};

@Injectable()
export class ArticleService {
  /** note we do have to initialize the BehaviorSubject! */
  private _articles:
  BehaviorSubject<Article[]> = new
    BehaviorSubject<Article[]>([]);

  private _sources: BehaviorSubject<any> =
  new BehaviorSubject<any>([]);

  private _refreshSubject:
  BehaviorSubject<string> = new
    BehaviorSubject<string>('reddit-r-all');

  private _sortByDirectionSubject:
  BehaviorSubject<number> = new
    BehaviorSubject<number>(1);

  private _sortByFilterSubject:
  BehaviorSubject<ArticleSortOrderFn> = new
    BehaviorSubject<ArticleSortOrderFn>(sortByTime);
  private _filterbySubject:
  BehaviorSubject<string> = new
    BehaviorSubject<string>('');

  /** sources we are using on the sidebar */
  public sources: Observable<any> = this._sources.asObservable();

  public articles: Observable<Article[]> = this._articles.asObservable();

  public orderedArticles: Observable<Article[]>;

  constructor(
    private http: Http
  ) {
    this._refreshSubject
      .subscribe(this.getArticles.bind(this)); /** this is the articleSubject */

    this.orderedArticles =
      Observable.combineLatest(
        this._articles,
        this._sortByFilterSubject,
        this._sortByDirectionSubject,
        this._filterbySubject
      )
        .map(([
          articles, sorter, direction, filterStr
        ]) => {
          const re = new RegExp(filterStr, 'gi'); /** Globally and case insensitivity */
          return articles
            .filter(a => re.exec(a.title)) /** if string is in title we keep it */
            .sort(sorter(direction));
        });
  }

  public sortBy(
    filter: string,
    direction: number
  ): void {
    this._sortByDirectionSubject.next(direction);
    this._sortByFilterSubject.next(sortFns[filter]);
  }

  public filterBy(filter: string) {
    this._filterbySubject.next(filter);
  }

  /** returning a Promise 
  public getArticles(): Promise<Article[]> {
    let params = new URLSearchParams();
    params.set('apiKey', environment.newsApiKey);
    params.set('source', 'reddit-r-all');
    //`${baseUrl}/v1/articles?apiKey=${newsApiKey}`
    return this.http
            .get(`${environment.baseUrl}/v1/articles`, {
              search: params
            })
            .toPromise()
            .then(resp => resp.json())
            .then(json => json.articles)
            .then(articles => {
              console.log('json ->', articles);
              return articles
                      .map(article => 
                      Article.fromJSON(article));
            })
            .catch(err => {
              console.log('We got an error', err);
            });
  }
  */
  public updateArticles(sourceKey): void {
    this._refreshSubject.next(sourceKey);
  }

  /** new approach to get the articles via an observable.
   * We are not returning anything here... we are just updating the values
   * of our variables (BehaviorSubject)
   */
  public getArticles(sourceKey = 'reddit-r-all'): void {
    //make http reqiest -> Observable
    //convert response into article class
    //update the subject
    this._makeHttpRequest('/v1/articles', sourceKey)
      //this._makeHttpRequest('/v1/articles', 'reddit-all')
      .map(json => json.articles) /* we are only interested on the articles of the response */
      .subscribe(articleJSON => {
        const articles = articleJSON
          .map(articlejson => Article.fromJSON(articlejson));
        this._articles.next(articles); /** update the behaviour subject with our new copy of data */

      });
  }

  public getSources(): void {
    this._makeHttpRequest('/v1/sources')
      .map(json => json.sources)
      .filter(list => list.length > 0)
      .subscribe(this._sources);
  }

  /** returning an observable to be reuse (<any>) 
   * Note we are passing the path and the sourceKey
  */
  private _makeHttpRequest(
    path: string,
    sourceKey?: string
  ): Observable<any> {
    let params = new URLSearchParams();
    params.set('apiKey', environment.newsApiKey);
    if (sourceKey && environment.newsApiKey !== '') {
      params.set('source', sourceKey);
    }
    //`${baseUrl}/v1/articles?apiKey=${newsApiKey}`
    return this.http
      .get(`${environment.baseUrl}${path}`, {
        search: params
      })
      .map(resp => resp.json());
  }
}
