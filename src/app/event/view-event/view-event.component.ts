import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.scss']
})
export class ViewEventComponent implements OnInit {

  eventsData = [];
  constructor(public commonService: CommonService, private router: Router) { }

  ngOnInit() {
    this.commonService.setEditTriggerEventFlag(false);
    this.eventsData = this.commonService.getEventDetail();
    console.log(this.eventsData);
  }

  editEventDetail(index, event) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        'eventData': JSON.stringify(event),
        'index': JSON.stringify(index)
      }
    };
    this.router.navigate(['add'], navigationExtras);
    this.commonService.setEditTriggerEventFlag(true);
  }

  deleteEventDetail(index) {
    this.eventsData.splice(index, 1);
    this.commonService.deleteEventDetail(index);
  }

}
