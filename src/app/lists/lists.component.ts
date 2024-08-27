import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {LikesService} from "../_services/likes.service";
import {ButtonsModule} from "ngx-bootstrap/buttons";
import {FormsModule} from "@angular/forms";
import {MemberCardComponent} from "../members/member-card/member-card.component";
import {PaginationModule} from "ngx-bootstrap/pagination";

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [
    ButtonsModule,
    FormsModule,
    MemberCardComponent,
    PaginationModule
  ],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent implements OnInit, OnDestroy {
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 5;
  likeService = inject(LikesService);
  protected readonly LikesService = LikesService;

  ngOnDestroy(): void {
    this.likeService.paginatedResult.set(null);
  }

  ngOnInit(): void {
    this.loadLikes();
  }

  getTitle() {
    switch (this.predicate) {
      case 'liked':
        return 'Members you like';
      case 'likedBy':
        return 'Members liked you';
      default:
        return 'Mutual likes';
    }
  }

  loadLikes() {
    this.likeService.getLikes(this.predicate, this.pageNumber, this.pageSize);
  }

  pageChanged(event: any): void {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadLikes();
    }
  }
}
