import { RouterModule, Routes } from "@angular/router";
import { AlumnosComponent } from "./alumnos.component";
import { NgModule } from "@angular/core";


const routes: Routes = [{ path: '', component: AlumnosComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlumnosRoutingModule { }
