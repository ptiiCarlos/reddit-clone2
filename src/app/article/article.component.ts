import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../article'; 

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  @Input('article') article: Article;

  constructor() { }
   
  upVote() {
    //console.log("Called upVote in the ArticleComponent.");
    this.article.upVote();
  }

  downVote() {
    //console.log("Called downVote in the ArticleComponent.");
    this.article.downVote();
  }

  ngOnInit() {
  }

}
