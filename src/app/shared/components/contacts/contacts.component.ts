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
  selectedContactId: string | null = null;
  isEditing: boolean = false;

  searchForm: FormGroup = new FormGroup({
    searchControl: new FormControl('')
  });

  contactForm: FormGroup = new FormGroup({
    firstname: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastname: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\+380\d{9}$/) 
    ]),
    dateofbirth: new FormControl('', [Validators.required, this.dateValidator.bind(this)]),
    address: new FormControl('', [Validators.required, Validators.minLength(3)])
  });

  ngOnInit(): void {
    this.setupSearchSubscription();
    this.contactService.initializeContacts();
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

  editContact(id: string) {
    const contact = this.contactService.getContactById(id);
    this.selectedContactId = contact.id;
    this.isEditing = true;
    this.contactForm.setValue({
      firstname: contact.firstname,
      lastname: contact.lastname,
      email: contact.email,
      phone: contact.phone,
      dateofbirth: this.formatDate(contact.dateofbirth),
      address: contact.address
    });
  }

  updateContact() {
    if (this.selectedContactId) {
      const updatedContact: Contact = {
        id: this.selectedContactId,
        firstname: this.contactForm.value.firstname,
        lastname: this.contactForm.value.lastname,
        email: this.contactForm.value.email,
        phone: this.contactForm.value.phone,
        dateofbirth: this.contactForm.value.dateofbirth,
        address: this.contactForm.value.address
      };
      this.contactService.updateContact(updatedContact);
      this.selectedContactId = null;
      this.isEditing = false;
      this.contactForm.reset();
      this.contacts = this.contactService.getContacts();
    }
  }

  cancelEdit() {
    this.selectedContactId = null;
    this.isEditing = false;
    this.contactForm.reset();
  }

  viewDetails(id: string) {
    this.router.navigateByUrl(`contact/${id}`);
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  }

  private setupSearchSubscription(): void {
    const searchControl = this.searchForm.get('searchControl');
    searchControl?.valueChanges.subscribe(query => this.updateContactList(query));
  }
  
  private updateContactList(query: string): void {
    this.contacts = query ? this.contactService.searchContacts(query) : this.contactService.getContacts();
  }

  private dateValidator(control: FormControl): { [key: string]: boolean } | null {
    const date = new Date(control.value);
    const today = new Date();
    if (date >= today) {
      return { 'invalidDate': true };
    }
    return null;
  }
}
