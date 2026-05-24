import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MOCK_POSTS } from '@fe/domain/social';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'fe-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  posts = MOCK_POSTS;

  ngOnInit(): void {}
}
