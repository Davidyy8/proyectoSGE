import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CiclosService } from 'src/app/services/ciclos.service';
import { EntidadesService } from 'src/app/services/entidades.service';
import { VacantesService } from 'src/app/services/vacantes.service';
import { Ciclo } from 'src/app/shared/interfaces/ciclo';
import { Entidad } from 'src/app/shared/interfaces/entidad';
import { Vacante } from 'src/app/shared/interfaces/vacante';
import { Alumno } from '../../shared/interfaces/alumno';

@Component({
  selector: 'app-edit-vacante',
  templateUrl: './edit-vacante.component.html',
  styleUrls: ['./edit-vacante.component.scss']
})
export class EditVacanteComponent implements OnInit {
  vacanteForm: FormGroup;
  entidades: Entidad[];
  ciclos: Ciclo[];

  VACANTE: String;

  constructor(
    public dialogRef: MatDialogRef<EditVacanteComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public vacante: Vacante,
    public servicioEntidades: EntidadesService,
    public servicioCiclos: CiclosService,
    public vacanteService: VacantesService
  ) { }

  ngOnInit(): void {
    this.vacanteForm = new FormGroup({
      id_vacante: new FormControl(this.vacante.id_vacante, Validators.required),
      Entidad: new FormControl(this.vacante.Entidad ?? ''),
      Ciclo: new FormControl(this.vacante.Ciclo ?? ''),
      Curso: new FormControl(this.vacante.Curso),
      Num_vacantes: new FormControl(this.vacante.Num_vacantes),
      Num_alumnos: new FormControl(this.vacante.Num_alumnos),
      alumnos: new FormControl(this.vacante.alumnos),
    });
  }

}
