import { Component, OnInit } from '@angular/core';
import { NgForm,  } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';

import { Post } from '../../models/post.model';
@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})

export class CreatePostComponent implements OnInit {

  postExample:Post = {title: "Primer post",summary:"Este es el primer post",content:"Este es el contenido del post"};

  constructor(public postService: PostService) { }

  ngOnInit(): void {
  }

  onAddPost(form:NgForm):void{
    if(form.valid){
      this.postService.addPost(form.value)
      form.resetForm();
    }
  }
}
