import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';

import { PostService } from 'src/app/services/post/post.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  postsSub: Subscription;
  isAuth = false;
  userId!: string;
  private authListenerSub!: Subscription;

  constructor(
    public postService: PostService,
    public authService: AuthService
  ) {
    this.postsSub = this.postService
      .getPostsUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  ngOnInit(): void {
    this.postService.getPosts();
    this.userId = this.authService.getUserId();
    this.postsSub = this.postService
      .getPostsUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
    this.isAuth = this.authService.getIsAuthenticated();
    this.authListenerSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.isAuth = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authListenerSub.unsubscribe();
  }

  onDelete(id: string): void {
    this.postService.deletePost(id);
  }
}
