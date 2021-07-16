import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from 'rxjs';

import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  url = "http://localhost:3000/api/posts";

  posts: Post[] = [];
  postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  addPost(post: Post){
    this.http.post<{message: string}>(this.url,post).subscribe((response) => {
      console.log(response);
      this.posts.push(post);
      this.postUpdated.next([...this.posts]);
    });
  }

  getPosts(){
    this.http.get<Post[]>(this.url).subscribe(
      (postData) =>{
        this.posts = postData;
        this.postUpdated.next([...this.posts]);
      }
    );
  }

  getPostsUpdateListener(){
    return this.postUpdated.asObservable();
  }
}
