import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsService } from '../../services/contacts.service';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
})
export class ContactDetailComponent implements OnInit {
  id!: number;
  contact: any = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private api: ContactsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.get(this.id).subscribe({
      next: (res) => {
        this.contact = res;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  back(): void {
    this.router.navigate(['/contacts']);
  }

  edit(): void {
    this.router.navigate(['/contacts', this.id, 'edit']);
  }

  remove(): void {
    if (!confirm('Delete contact?')) return;
    this.api.delete(this.id).subscribe(() => {
      this.router.navigate(['/contacts']);
    });
  }
}
