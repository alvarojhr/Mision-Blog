import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  @Output() postCreated = new EventEmitter<Post>();

  constructor(public postService: PostService) { }

  ngOnInit(): void {
  }

  onAddPost(form:NgForm):void{

    if(form.valid){
      this.postCreated.emit(form.value);
      form.resetForm();
    }
  }
}
