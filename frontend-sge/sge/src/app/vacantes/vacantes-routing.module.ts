import { Route, RouterModule, Routes } from "@angular/router";
import { VacantesComponent } from "./vacantes.component";
import { NgModule } from "@angular/core";

const routes: Routes = [{ path: '', component: VacantesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VacantesRoutingModule { }
