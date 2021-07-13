import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Post } from '../models/post.model';
@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})

export class CreatePostComponent implements OnInit {
  saludo:string = "Hello everyone. I'm happy";
  postExample:Post = {title: "Primer post",summary:"Este es el primer post",content:"Este es el contenido del post"};
  texto:string = "";
  content:string[] = ["Hola", "a todos","como estan?"];
  posts:Post[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  addPost(form:NgForm):void{
    this.content.push(this.texto);
  }

}
