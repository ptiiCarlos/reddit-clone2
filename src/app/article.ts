interface ArticleJSON {
    title: string;
    url:string;
    votes:number   
    publishedAt: string;
    description: string;
    urlToImage:string;
    author: string;
}

export class Article {
    public publishedAt: Date;
   
    /** Something like this: Article.fromJSON()
     * This allows us to create an object from a JSON object than
     * using the constructor every time...
     */
    static fromJSON(json: ArticleJSON): Article {
        let article = 
            Object.create(Article.prototype);
        return Object.assign(article, json, {
            votes: json.votes ? json.votes : 0,
            imageUrl: json.urlToImage,
            publishedAt: json.publishedAt ?
                new Date(json.publishedAt) :
                new Date()
        });
    }

    constructor(
        public title: string,
        public description: string,
        public imageUrl:string,
        public votes?: number
    ) {
        this.votes = votes || 0;
        this.publishedAt = new Date();
    }

    

    public upVote(): void {
        this.votes = this.votes + 1;
    }

    public downVote(): void {
        this.votes = this.votes - 1;
    }
}
