import { Injectable } from '@angular/core';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  posts: Post[] = [];

  addPost(post: Post){
    this.posts.push(post);
  }

  constructor() { }
}
