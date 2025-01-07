import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Contact } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  Contacts = 'CONTACTS';

  public contactSubject = new Subject<Contact[]>();

  addContact(contact: Contact) {
    const contacts = this.getContacts();
    contacts.push(contact);
    this.setContacts(contacts);
  }

  getContacts(): Contact[] {
    const contacts = JSON.parse(localStorage.getItem(this.Contacts) || '[]') as Contact[];
    return contacts;
  }

  setContacts(contacts: Contact[]) {
    localStorage.setItem(this.Contacts, JSON.stringify(contacts));
    this.contactSubject.next(contacts);
  }

  getContactById(id: string): Contact {
    const contacts = this.getContacts();
    const index = contacts.findIndex((contact) => contact.id === id);
    if (index > -1) {
      return contacts[index];
    }

    throw new Error('Contact not found');
  }

  getContactData(): Observable<Contact[]> {
    return this.contactSubject;
  }

  deleteContact(id: string) {
    const contacts = this.getContacts();
    const filtered = contacts.filter((contact) => contact.id !== id);
    this.setContacts(filtered);
  }
}
