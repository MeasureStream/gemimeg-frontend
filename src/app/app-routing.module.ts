import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DccComponent } from './components/dcc/dcc.component';
import { PageNotFoundComponent } from './components/common/not-found/page-not-found.component';
import { MathmlComponent } from './mathml/mathml.component';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'dcc/create', pathMatch: 'full' },
  { path: 'dcc/create', component: DccComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
