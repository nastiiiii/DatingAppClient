import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {MembersService} from "../../_services/members.service";
import {ActivatedRoute} from "@angular/router";
import {Member} from "../../_models/member";
import {TabDirective, TabsetComponent, TabsModule} from "ngx-bootstrap/tabs";
import {GalleryComponent, GalleryItem, ImageItem} from "ng-gallery";
import {TimeagoModule} from "ngx-timeago";
import {DatePipe} from "@angular/common";
import {MemberMessagesComponent} from "../member-messages/member-messages.component";
import {Message} from "../../_models/message";
import {MessageService} from "../../_services/message.service";

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [
    TabsModule,
    GalleryComponent,
    TimeagoModule,
    DatePipe,
    MemberMessagesComponent
  ],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', {static: true}) memberTabs?: TabsetComponent;
  member: Member = {} as Member;
  images: GalleryItem[] = [];
  activeTabs?: TabDirective;
  messages: Message[] = [];
  private memberService = inject(MembersService);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {this.member = data['member'];
        this.member && this.member.photos.map(p => {
          this.images.push(new ImageItem({src: p.url, thumb: p.url}))})
    }})

    this.route.queryParams.subscribe({
      next: params => {params['tab'] && this.selectTab(params['tab'])}
    })
  }

  onUpdateMessages(event: Message) {
    this.messages.push(event);
  }

  selectTab(heading: string) {
    if (this.memberTabs) {
      const messageTab = this.memberTabs.tabs.find(t => t.heading === heading);
      if (messageTab) messageTab.active = true;
    }
  }

  onTabActivated(data: TabDirective) {
    this.activeTabs = data;
    if (this.activeTabs.heading === 'Messages' && this.messages.length === 0 && this.member) {
      this.messageService.getMessageThread(this.member.username).subscribe({
        next: messages => {
          this.messages = messages;
        },
      })
    }
  }

}
