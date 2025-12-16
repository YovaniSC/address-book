import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsService } from '../../services/contacts.service';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
})
export class ContactDetailComponent implements OnInit {
  id!: number;
  loading = false;

  contact: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ContactsService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  load(): void {
    this.loading = true;

    this.api.getById(this.id).subscribe({
      next: (res: any) => {
        this.contact = res;
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
        alert('❌ No se pudo cargar el contacto.');
        this.back();
      },
    });
  }

  back(): void {
    this.router.navigate(['/contacts']);
  }

  edit(): void {
    this.router.navigate(['/contacts', this.id, 'edit']);
  }

  remove(): void {
    if (!confirm('¿Eliminar contacto?')) return;

    this.api.delete(this.id).subscribe({
      next: () => {
        alert('✅ Contacto eliminado.');
        this.back();
      },
      error: (err: any) => {
        console.error(err);
        alert('❌ No se pudo eliminar el contacto.');
      },
    });
  }
}
