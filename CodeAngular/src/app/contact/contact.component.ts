import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ContactService } from '../shared/contact.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private contactService: ContactService,
    private toastr: ToastrService) 
  {
  }

  formModel = this.formBuilder.group({
    FullName: ['', Validators.required],
    Email: ['', [Validators.required, Validators.email]],
    Message: ['', Validators.required]
  });

  ngOnInit() 
  {
  }

  sendMessage()
  {
    this.contactService.sendMessage(this.formModel.value).subscribe(
      res => {
        this.toastr.info("Poruka je uspješno poslana.", "Info");
      },
      err => {
        this.toastr.error("Došlo je do greške kod slanja poruke.", "Greška");
      }
    );
  }
}
