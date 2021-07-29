import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PostService } from 'src/app/services/post/post.service';

import { Post } from '../../models/post.model';
import { mimeType } from './mime-type.validator';
@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit {
  private isEditing = false;
  private postId!: string;
  post: Post;
  form!: FormGroup;
  imagePreview!: string;

  constructor(public postService: PostService, public route: ActivatedRoute) {
    this.post = {
      id: '',
      title: '',
      summary: '',
      content: '',
      imageUrl: '',
      author: '',
    };
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required] }),
      summary: new FormControl(),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      //Form en modo de edicion
      if (paramMap.has('postId')) {
        this.isEditing = true;
        this.postId = paramMap.get('postId')!;
        this.postService.getPost(this.postId).subscribe((postData) => {
          this.post = {
            id: postData._id,
            title: postData.title,
            summary: postData.summary,
            content: postData.content,
            imageUrl: postData.imageUrl,
            author: postData.author,
          };
          this.form.setValue({
            title: this.post.title,
            summary: this.post.summary,
            content: this.post.content,
            image: this.post.imageUrl,
          });
          this.imagePreview = this.post.imageUrl;
        });
      }
      //Form en modo creacion
      else {
        this.isEditing = false;
        this.postId = null!;
      }
    });
  }

  onSavePost(): void {
    console.log(this.form.value.image);
    if (this.form.invalid) {
      return;
    }
    //Guardando en modo editar
    if (this.isEditing) {
      this.postService.updatePost(
        this.form.value,
        this.postId,
        this.form.value.image
      );
    }
    //Guardando en modo creacion
    else {
      const postInfo: Post = {
        id: this.form.value.id,
        title: this.form.value.title,
        summary: this.form.value.summary,
        content: this.form.value.content,
        imageUrl: '',
        author: '',
      };
      this.postService.addPost(postInfo, this.form.value.image);
    }
    this.form.reset();
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  contentIsValid(): boolean {
    return this.form.get('content')!.invalid;
  }
}
