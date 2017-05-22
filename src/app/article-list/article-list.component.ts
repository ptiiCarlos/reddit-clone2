import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { ArticleService } from '../article.service';
import { Article } from '../article';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {
  /** private articles: Article[]; ==> this was for promises
  * next is for observables
  */
  public articles: Observable<Article[]>;

  constructor(
    private articleService: ArticleService,
    private activatedRoute: ActivatedRoute    
  ) { 
    this.articles = 
    articleService.orderedArticles;
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const sourceKey = params['sourceKey'];
      this.articleService.updateArticles(sourceKey);
    });
  }
}
