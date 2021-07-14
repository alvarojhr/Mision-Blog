import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  posts: Post[] = [];
  postUpdated = new Subject<Post[]>();

  constructor() { }

  addPost(post: Post){
    this.posts.push(post);
    this.postUpdated.next([...this.posts]);
  }

  getPosts(){
    return [...this.posts];
  }

  getPostsUpdateListener(){
    return this.postUpdated.asObservable();
  }
}
