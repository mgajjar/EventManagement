import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  isEditEventTrigger = false;
  eventsDetails = [];
  constructor(private http: HttpClient) { }

  setEventDetail(eventDetail) {
    this.eventsDetails = this.getEventDetail() ? this.getEventDetail() : [];
    console.log('event', this.eventsDetails);
    this.eventsDetails.push(eventDetail);
    localStorage.setItem('eventData', JSON.stringify(this.eventsDetails));
  }

  getEventDetail() {
    return JSON.parse(localStorage.getItem('eventData'));
  }

  deleteEventDetail(index) {
    const eventData = this.getEventDetail();
    if (eventData) {
      eventData.splice(index, 1);
      localStorage.setItem('eventData', JSON.stringify(eventData));
    }
  }

  updateEventDetail(index, updatedData) {
    const eventData = JSON.parse(localStorage.getItem('eventData'));
    if (eventData) {
      eventData[index] = updatedData;
      localStorage.setItem('eventData', JSON.stringify(eventData));
    }
  }

  getEditTriggerEventFlag() {
    return this.isEditEventTrigger;
  }

  setEditTriggerEventFlag(value) {
    this.isEditEventTrigger = value;
  }

  getLocations(key) {

    const promise = new Promise((resolve, reject) => {
      this.http.get('/api/maps/api/place/autocomplete/json?key=AIzaSyCMdl2byZOgAEJwJXO3LeTHwHT4JQWQ7Zo&input=' + key
      ).subscribe((res) => {
        console.log('res', res);
        resolve(res);
      });
    });
    return promise;

  }
}
