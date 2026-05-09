import { Component,OnInit  } from '@angular/core';
import { FormBuilder, FormGroup,ReactiveFormsModule } from '@angular/forms';
import { FacultyService } from '../../../services/faculty.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-event.component.html',
 // styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {

  eventForm!: FormGroup;   // <-- declare only

  constructor(
    private fb: FormBuilder,
    private facultyService: FacultyService
  ) {}

  ngOnInit() {
    this.eventForm = this.fb.group({
      title: [''],
      description: [''],
      date: [''],
      venue: ['']
    });
  }

  createEvent() {
    this.facultyService.createEvent(this.eventForm.value)
      .subscribe(() => {
        alert('Event submitted for approval');
        this.eventForm.reset();
      });
  }
}
