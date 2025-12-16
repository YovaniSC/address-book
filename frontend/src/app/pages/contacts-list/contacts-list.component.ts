import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { ContactsService } from '../../services/contacts.service';
import { Router } from '@angular/router';

type PageItem = { page: number; active: boolean; url: string | null };

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
})
export class ContactsListComponent implements OnInit {
  search = new FormControl('');
  rows: any[] = [];
  meta: any = null;
  loading = false;

  currentPage = 1;
  lastPage = 1;

  constructor(private api: ContactsService, private router: Router) {}

  ngOnInit(): void {
    // Cuando cambie la búsqueda, reinicia a página 1
    this.search.valueChanges
      .pipe(startWith(''), debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.loadPage(1));
  }

  loadPage(page: number): void {
    if (page < 1) return;
    if (this.lastPage && page > this.lastPage) return;

    this.loading = true;
    const term = (this.search.value ?? '').toString();

    this.api.list(term, page).subscribe({
      next: (res) => {
        this.rows = res.data ?? [];
        this.meta = res;
        this.currentPage = res.current_page ?? page;
        this.lastPage = res.last_page ?? 1;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  // Páginas numéricas desde meta.links (Laravel)
  pages(): PageItem[] {
    const links = this.meta?.links ?? [];
    return links
      .filter((l: any) => /^\d+$/.test((l.label ?? '').toString()))
      .map((l: any) => ({
        page: Number(l.label),
        active: !!l.active,
        url: l.url ?? null,
      }));
  }

  canPrev(): boolean {
    return !!this.meta?.prev_page_url;
  }

  canNext(): boolean {
    return !!this.meta?.next_page_url;
  }

  prev(): void {
    if (!this.canPrev()) return;
    this.loadPage(this.currentPage - 1);
  }

  next(): void {
    if (!this.canNext()) return;
    this.loadPage(this.currentPage + 1);
  }

  emailsText(c: any): string {
    const emails = c?.emails ?? [];
    return emails.map((x: any) => x.email).join(', ');
  }

  phonesText(c: any): string {
    const phones = c?.phones ?? [];
    return phones.map((x: any) => x.phone).join(', ');
  }

  goNew(): void {
    this.router.navigate(['/contacts/new']);
  }

  goDetail(id: number): void {
    this.router.navigate(['/contacts', id]);
  }

  goEdit(id: number): void {
    this.router.navigate(['/contacts', id, 'edit']);
  }

  remove(id: number): void {
    if (!confirm('¿Eliminar contacto?')) return;

    this.api.delete(id).subscribe(() => {
      // refresca página actual (si se queda vacía y no es la 1, regresa una)
      const stillHasRows = this.rows.length > 1;
      const target = stillHasRows ? this.currentPage : Math.max(1, this.currentPage - 1);
      this.loadPage(target);
    });
  }
}
