import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { v4 as uuidv4 } from 'uuid';

import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  contactService: ContactService = inject(ContactService);
  router: Router = inject(Router);

  contacts: Contact[] = [];

  contactForm: FormGroup = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    dateofbirth: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required)
  });

  ngOnInit(): void {
    this.contacts = this.contactService.getContacts();
    this.contactService.getContactData().subscribe({
      next: (res: Contact[]) => {
        this.contacts = res;
      }
    });
  }

  addContact() {
    const contact: Contact = {
      id: uuidv4(),
      firstname: this.contactForm.value.firstname,
      lastname: this.contactForm.value.lastname,
      email: this.contactForm.value.email,
      phone: this.contactForm.value.phone,
      dateofbirth: this.contactForm.value.dateofbirth,
      address: this.contactForm.value.address
    };

    this.contactService.addContact(contact);
    this.contactForm.reset();
  }

  viewDetails(id: string) {
    this.router.navigateByUrl(`contact/${id}`);
  }
}
