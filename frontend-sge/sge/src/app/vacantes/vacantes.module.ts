import { NgModule } from "@angular/core";
import { VacantesComponent } from "./vacantes.component";
import { AddVacanteComponent } from "./add-vacante/add-vacante.component";
import { EditVacanteComponent } from "./edit-vacante/edit-vacante.component";
import { DeleteVacanteComponent } from "./delete-vacante/delete-vacante.component";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { VacantesRoutingModule } from "./vacantes-routing.module";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";

@NgModule({
  declarations: [VacantesComponent,
    AddVacanteComponent,
    EditVacanteComponent,
    DeleteVacanteComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    VacantesRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ]
})
export class VacantesModule {}
