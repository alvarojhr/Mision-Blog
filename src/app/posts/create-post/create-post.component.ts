import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PostService } from 'src/app/services/post/post.service';

import { Post } from '../../models/post.model';
@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit {
  private isEditing = false;
  private postId!: string;
  post: Post;

  constructor(public postService: PostService, public route: ActivatedRoute) {
    this.post = { id: '', title: '', summary: '', content: '', author: '' };
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.isEditing = true;
        this.postId = paramMap.get('postId')!;
        this.postService.getPost(this.postId).subscribe((postData) => {
          this.post = {
            id: postData._id,
            title: postData.title,
            summary: postData.summary,
            content: postData.content,
            author: postData.author,
          };
        });
      } else {
        this.isEditing = false;
        this.postId = null!;
      }
    });
  }

  onSavePost(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    if (this.isEditing) {
      this.postService.updatePost(form.value, this.postId);
    } else {
      this.postService.addPost(form.value);
    }
    form.resetForm();
  }
}
