import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContactsListComponent } from './pages/contacts-list/contacts-list.component';
import { ContactFormComponent } from './pages/contact-form/contact-form.component';
import { ContactDetailComponent } from './pages/contact-detail/contact-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'contacts', pathMatch: 'full' },
  { path: 'contacts', component: ContactsListComponent },
  { path: 'contacts/new', component: ContactFormComponent },
  { path: 'contacts/:id', component: ContactDetailComponent },
  { path: 'contacts/:id/edit', component: ContactFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

