import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from '../../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  url = 'http://localhost:3000/api/posts';

  posts: Post[] = [];
  postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  addPost(post: Post, image: File) {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('summary', post.summary);
    postData.append('content', post.content);
    postData.append('image', image, post.title);
    this.http.post<{ post: Post }>(this.url, postData).subscribe((response) => {
      console.log(response.post);
      post.id = response.post.id;
      post.imageUrl = response.post.imageUrl;
      this.posts.push(post);
      this.postUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  getPosts() {
    this.http
      .get<any>(this.url)
      .pipe(
        map((postData) => {
          return postData.map(
            (post: {
              _id: string;
              title: string;
              summary: string;
              content: string;
              imageUrl: string;
              author: string;
            }) => {
              return {
                id: post._id,
                title: post.title,
                summary: post.summary,
                content: post.content,
                imageUrl: post.imageUrl,
                author: post.author,
              };
            }
          );
        })
      )
      .subscribe((dataTransformed) => {
        this.posts = dataTransformed;
        this.postUpdated.next([...this.posts]);
      });
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      summary: string;
      content: string;
      imageUrl: string;
      author: string;
    }>(this.url + '/' + id);
  }

  deletePost(id: string) {
    this.http.delete(this.url + '/' + id).subscribe((result) => {
      const updatedPost = this.posts.filter((post) => post.id !== id);
      this.posts = updatedPost;
      this.postUpdated.next([...this.posts]);
    });
  }

  getPostsUpdateListener() {
    return this.postUpdated.asObservable();
  }

  updatePost(post: Post, id: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', post.title);
      postData.append('summary', post.summary);
      postData.append('content', post.content);
      postData.append('image', image, post.title);
    } else {
      postData = post;
    }

    this.http.put(this.url + '/' + id, postData).subscribe((result) => {
      const updatedPost = [...this.posts];
      const oldPostIndex = updatedPost.findIndex((p) => p.id === post.id);
      updatedPost[oldPostIndex] = post;
      this.postUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }
}
