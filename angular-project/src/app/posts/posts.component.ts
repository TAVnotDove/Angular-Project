import { Component, OnInit } from '@angular/core';
import { PostsService } from '../services/posts.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts: any = null
  
  constructor(private postsService: PostsService,){}
  
  ngOnInit(): void {
    this.postsService.getPosts().subscribe({
      next: (v) => {
        this.posts = v
      },
      error: (e) => {
        console.error(e)
      }
    })
  }
}
