import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.scss'
})
export class ContactDetailComponent implements OnInit {
  contactService: ContactService = inject(ContactService);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  contact: Contact | null = null;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.contact = this.contactService.getContactById(params['id']);
    });
  }

  deleteContact(id: string) {
    this.contactService.deleteContact(id);
    this.router.navigate(['/contacts']);
  }

  goBack() {
    this.router.navigate(['/contacts']);
  }
}
