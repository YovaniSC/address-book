import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsService } from '../../services/contacts.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
})
export class ContactFormComponent implements OnInit {
  id: number | null = null;
  isEdit = false;
  loading = false;

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ContactsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? Number(idParam) : null;
    this.isEdit = this.id !== null;

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      birthday_date: ['', [Validators.required]],

      notes: [''],
      company: [''],
      website: [''],

      emails: this.fb.array([]),
      phones: this.fb.array([]),
      addresses: this.fb.array([]),
    });

    // mínimo 1 email
    this.addEmail();

    if (this.isEdit) {
      this.loadForEdit(this.id!);
    }
  }

  // getters
  get emails(): FormArray { return this.form.get('emails') as FormArray; }
  get phones(): FormArray { return this.form.get('phones') as FormArray; }
  get addresses(): FormArray { return this.form.get('addresses') as FormArray; }

  // builders
  private emailGroup(value = ''): FormGroup {
    return this.fb.group({
      email: [value, [Validators.required, Validators.email, Validators.maxLength(255)]],
    });
  }

  private phoneGroup(value = ''): FormGroup {
    return this.fb.group({
      phone: [value, [Validators.required, Validators.maxLength(50)]],
    });
  }

  private addressGroup(a?: any): FormGroup {
    return this.fb.group({
      street: [a?.street ?? ''],
      city: [a?.city ?? ''],
      state: [a?.state ?? ''],
      zip: [a?.zip ?? ''],
    });
  }

  // actions
  addEmail(value = ''): void { this.emails.push(this.emailGroup(value)); }
  removeEmail(i: number): void {
    if (this.emails.length === 1) return; // siempre 1 mínimo
    this.emails.removeAt(i);
  }

  addPhone(value = ''): void { this.phones.push(this.phoneGroup(value)); }
  removePhone(i: number): void { this.phones.removeAt(i); }

  addAddress(a?: any): void { this.addresses.push(this.addressGroup(a)); }
  removeAddress(i: number): void { this.addresses.removeAt(i); }

  back(): void {
    this.router.navigate(['/contacts']);
  }

  private loadForEdit(id: number): void {
    this.loading = true;
    this.api.get(id).subscribe({
      next: (c) => {
        // set base fields
        this.form.patchValue({
          name: c.name ?? '',
          birthday_date: c.birthday_date ?? '',
          notes: c.notes ?? '',
          company: c.company ?? '',
          website: c.website ?? '',
        });

        // reset arrays
        this.emails.clear();
        this.phones.clear();
        this.addresses.clear();

        // fill arrays
        const emails = c.emails ?? [];
        if (emails.length === 0) this.addEmail();
        else emails.forEach((e: any) => this.addEmail(e.email));

        (c.phones ?? []).forEach((p: any) => this.addPhone(p.phone));
        (c.addresses ?? []).forEach((a: any) => this.addAddress(a));

        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Please fix validation errors.');
      return;
    }

    const payload = this.form.value;

    // Nota: el backend espera arrays:
    // emails: [{email}], phones: [{phone}], addresses: [{street, city, state, zip}]
    this.loading = true;

    if (this.isEdit) {
      this.api.update(this.id!, payload).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/contacts', this.id]);
        },
        error: () => { this.loading = false; }
      });
    } else {
      this.api.create(payload).subscribe({
        next: (created) => {
          this.loading = false;
          this.router.navigate(['/contacts', created.id]);
        },
        error: () => { this.loading = false; }
      });
    }
  }
}
