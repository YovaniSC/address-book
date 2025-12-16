import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsService } from '../../services/contacts.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
})
export class ContactFormComponent implements OnInit {
  form!: FormGroup;

  loading = false;
  statusText = '';

  isEdit = false;
  id?: number;

  constructor(
    private api: ContactsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();

    const idParam = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!idParam;
    this.id = idParam ? Number(idParam) : undefined;

    if (this.isEdit && this.id) {
      this.loading = true;
      this.statusText = 'Cargando contacto...';

      this.api.getById(this.id).subscribe({
        next: (contact: any) => {
          this.patchContact(contact);
          this.loading = false;
          this.statusText = '';
        },
        error: (err: any) => {
          console.error(err);
          this.loading = false;
          this.statusText = '';
          alert('❌ No se pudo cargar el contacto.');
          this.back();
        },
      });
    }
  }

  private buildForm(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      birthday_date: new FormControl('', [Validators.required]),
      company: new FormControl(''),
      website: new FormControl(''),
      notes: new FormControl(''),
      emails: new FormArray([]),
      phones: new FormArray([]),
      addresses: new FormArray([]),
    });

    // ✅ 1 correo mínimo requerido
    this.addEmail('');
  }

  // ---------- Arrays ----------
  get emails(): FormArray {
    return this.form.get('emails') as FormArray;
  }
  get phones(): FormArray {
    return this.form.get('phones') as FormArray;
  }
  get addresses(): FormArray {
    return this.form.get('addresses') as FormArray;
  }

  addEmail(value = ''): void {
    this.emails.push(
      new FormGroup({
        email: new FormControl(value, [Validators.required, Validators.email]),
      })
    );
  }
  removeEmail(i: number): void {
    if (this.emails.length === 1) return;
    this.emails.removeAt(i);
  }

  addPhone(value = ''): void {
    this.phones.push(
      new FormGroup({
        phone: new FormControl(value),
      })
    );
  }
  removePhone(i: number): void {
    this.phones.removeAt(i);
  }

  addAddress(a: any = {}): void {
    this.addresses.push(
      new FormGroup({
        street: new FormControl(a.street ?? ''),
        city: new FormControl(a.city ?? ''),
        state: new FormControl(a.state ?? ''),
        zip: new FormControl(a.zip ?? ''),
      })
    );
  }
  removeAddress(i: number): void {
    this.addresses.removeAt(i);
  }

  // ---------- UI validation helpers ----------
  isInvalid(path: string): boolean {
    const c = this.form.get(path);
    return !!(c && c.invalid && (c.touched || c.dirty));
  }

  inputClass(path: string): string {
    const base =
      'mt-1 w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-4';
    return this.isInvalid(path)
      ? `${base} border-rose-400 focus:border-rose-500 focus:ring-rose-100`
      : `${base} border-gray-200 focus:border-indigo-400 focus:ring-indigo-100`;
  }

  // ---------- Submit ----------
  submit(): void {
    // DEBUG (puedes quitarlo luego)
    console.log('CLICK submit()', this.form.value);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Faltan campos obligatorios. Revisa los marcados en rojo.');
      return;
    }

    this.loading = true;
    this.statusText = this.isEdit
      ? 'Guardando cambios y enviando correo...'
      : 'Creando contacto y enviando correo...';

    const payload = this.form.value;

    const req$ =
      this.isEdit && this.id
        ? this.api.update(this.id, payload)
        : this.api.create(payload);

    req$.subscribe({
      next: () => {
        this.loading = false;
        this.statusText = '';
        alert('✅ Guardado correctamente.');
        this.back();
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
        this.statusText = '';
        alert('❌ Ocurrió un error al guardar. Revisa la consola del navegador.');
      },
    });
  }

  back(): void {
    this.router.navigate(['/contacts']);
  }

  private patchContact(contact: any): void {
    this.form.patchValue({
      name: contact?.name ?? '',
      birthday_date: contact?.birthday_date ?? '',
      company: contact?.company ?? '',
      website: contact?.website ?? '',
      notes: contact?.notes ?? '',
    });

    while (this.emails.length) this.emails.removeAt(0);
    while (this.phones.length) this.phones.removeAt(0);
    while (this.addresses.length) this.addresses.removeAt(0);

    const emails = contact?.emails ?? [];
    if (emails.length === 0) this.addEmail('');
    else emails.forEach((e: any) => this.addEmail(e.email));

    const phones = contact?.phones ?? [];
    phones.forEach((p: any) => this.addPhone(p.phone));

    const addresses = contact?.addresses ?? [];
    addresses.forEach((a: any) => this.addAddress(a));
  }
}
