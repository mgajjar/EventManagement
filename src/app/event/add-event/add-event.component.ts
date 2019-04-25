import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {

  eventDetailForm: FormGroup;
  guests = [];
  locations = [];
  index: number;
  minEventStartDate: string;
  minEventStartTime: string;
  minEventEndDate: string;
  minEventEndTime: string;
  buttonText = 'Add';

  constructor(private http: HttpClient, public commonService: CommonService,
    private activeRoute: ActivatedRoute, private router: Router, public toastr: ToastrManager) {
    this.eventDetailForm = new FormGroup({
      title: new FormControl('', Validators.required),
      fromDate: new FormControl('', Validators.required),
      toDate: new FormControl('', Validators.required),
      fromTime: new FormControl(''),
      toTime: new FormControl(''),
      allDay: new FormControl(''),
      location: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      guestName: new FormControl(''),
      guestList: new FormControl('', Validators.required)
    });

  }

  ngOnInit() {

    this.activeRoute.queryParams.subscribe(params => {
      if (params['eventData']) {
        this.commonService.setEditTriggerEventFlag(true);
        this.eventDetailForm.setValue(JSON.parse(params['eventData']));
        this.guests = this.eventDetailForm.controls.guestList.value;
        this.index = JSON.parse(params['index']);
        this.buttonText = 'Update';
      } else {
        this.commonService.setEditTriggerEventFlag(false);
      }
    });
  }

  addGuest() {
    if (this.eventDetailForm.controls.guestName.value) {
      this.guests.push(this.eventDetailForm.controls.guestName.value);
      this.eventDetailForm.patchValue({ guestName: '' });
      this.eventDetailForm.patchValue({ guestList: this.guests });
    }
  }

  onAllDayClick() {
    if (!this.eventDetailForm.controls.allDay.value) {
      this.eventDetailForm.controls.fromTime.setValidators([Validators.required]);
      this.eventDetailForm.controls.toTime.setValidators([Validators.required]);
    } else {
      this.eventDetailForm.controls.fromTime.setValidators(null);
      this.eventDetailForm.controls.toTime.setValidators(null);
    }
    this.eventDetailForm.controls.fromTime.updateValueAndValidity();
    this.eventDetailForm.controls.toTime.updateValueAndValidity();
  }

  resetForm() {
    this.eventDetailForm.reset();
    this.guests = [];
  }

  searchLocations() {
    if (!this.eventDetailForm.controls.location.value.trim().length) {
      this.locations = [];
      return;
    }

    this.commonService.getLocations(this.eventDetailForm.controls.location.value).then(data => {
      this.locations = data['predictions'];
    });
  }

  addLocation(location) {
    this.eventDetailForm.patchValue({ 'location': location.description });
    this.locations = [];
  }
  
  onSubmit() {
    if (this.eventDetailForm.valid) {
      if (this.commonService.getEditTriggerEventFlag()) {
        this.commonService.updateEventDetail(this.index, this.eventDetailForm.value);
        this.toastr.successToastr('Event Successfully Updated', 'Success!');
      } else {
        this.commonService.setEventDetail(this.eventDetailForm.value);
        this.toastr.successToastr('Event Successfully Added', 'Success!');
      }
      this.router.navigate(['view']);
    } else {
      this.toastr.warningToastr('Invalid Form Please Fill All Details Corectly', 'Alert!');
    }
  }

}
