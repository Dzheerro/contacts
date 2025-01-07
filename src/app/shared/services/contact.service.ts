import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { v4 as uuidv4 } from 'uuid';

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

  public initializeContacts() {
    const existingContacts = localStorage.getItem(this.Contacts);
    if (!existingContacts) {
      const initialContacts: Contact[] = [
        {
          id: uuidv4(),
          firstname: 'John',
          lastname: 'Doe',
          email: 'john.doe@example.com',
          phone: '123-456-7890',
          dateofbirth: new Date('1990-01-01'),
          address: '123 Main St'
        },
        {
          id: uuidv4(),
          firstname: 'Jane',
          lastname: 'Smith',
          email: 'jane.smith@example.com',
          phone: '098-765-4321',
          dateofbirth: new Date('1985-05-15'),
          address: '456 Elm St'
        },
        {
          id: uuidv4(),
          firstname: 'Alice',
          lastname: 'Johnson',
          email: 'alice.johnson@example.com',
          phone: '555-555-5555',
          dateofbirth: new Date('1992-07-20'),
          address: '789 Oak St'
        }
      ];
      this.setContacts(initialContacts);
      this.contactSubject.next(initialContacts);
    }
  }

  searchContacts(query: string): Contact[] {
    const contacts = this.getContacts();
    const lowerCaseQuery = query.toLowerCase();
    return contacts.filter(contact => 
      contact.firstname.toLowerCase().includes(lowerCaseQuery) ||
      contact.lastname.toLowerCase().includes(lowerCaseQuery) ||
      contact.phone.includes(query)
    );
  }

  updateContact(updatedContact: Contact) {
    const contacts = this.getContacts();
    const contact = this.getContactById(updatedContact.id);
    const index = contacts.findIndex(c => c.id === contact.id);
    
    if (index !== -1) {
      contacts[index] = updatedContact;
      this.setContacts(contacts);
    }
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
