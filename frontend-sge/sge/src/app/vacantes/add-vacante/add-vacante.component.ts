import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { CiclosService } from 'src/app/services/ciclos.service';
import { EntidadesService } from 'src/app/services/entidades.service';
import { VacantesService } from 'src/app/services/vacantes.service';
import { Alumno } from 'src/app/shared/interfaces/alumno';
import { Ciclo } from 'src/app/shared/interfaces/ciclo';
import { Entidad } from 'src/app/shared/interfaces/entidad';
import { Vacante } from 'src/app/shared/interfaces/vacante';
import { CLOSE, INVALID_FORM } from 'src/app/shared/messages';

@Component({
  selector: 'app-add-vacante',
  templateUrl: './add-vacante.component.html',
  styleUrls: ['./add-vacante.component.scss']
})
export class AddVacanteComponent implements OnInit {
  vacanteForm: FormGroup;
  alumnos: Alumno[];
  entidades: Entidad[];
  ciclos: Ciclo[];


  VACANTE: string;

  constructor(public dialogRef: MatDialogRef<AddVacanteComponent>,
    private snackbar: MatSnackBar,
    private servicioVacante: VacantesService,
    private servicioAlumno: AlumnosService,
    private servicioEntidad: EntidadesService,
    private servicioCiclo: CiclosService,
   ) { }

  ngOnInit(): void {
    this.vacanteForm = new FormGroup({
      Entidad: new FormControl(null),
      Ciclo: new FormControl(null),
      Curso: new FormControl(null),
      Num_vacantes: new FormControl(null),
      Num_alumnos: new FormControl(null),
    });
    this.getEntidades();
    this.getCiclos();
  }


  async confirmAdd() {

    if( this.vacanteForm.valid ) {
      const vacante_creada = this.vacanteForm.value as Vacante;
      const vacante_actualizada = this.vacanteForm.value;
      const curso = Number(vacante_actualizada.Curso);
      if(curso != 1 && curso != 2) {
        this.snackbar.open("Curso invalido", CLOSE, { duration: 5000 })
        return;
      }
      const RESPONSE = await this.servicioVacante.addVacante(vacante_creada).toPromise();

      if(!RESPONSE) {
        this.snackbar.open(INVALID_FORM, CLOSE, { duration: 5000 });
        return;
      }else {
        this.snackbar.open("Formulario correcto", CLOSE, { duration: 5000});
        this.dialogRef.close({ ok: true });
      }
    }
  }

  async getEntidades() {
    const RESPONSE = await this.servicioEntidad.getAllEntidades().toPromise();
    if (RESPONSE) {
      this.entidades = RESPONSE.data as Entidad[];
    }
  }




  async getCiclos() {
    const RESPONSE = await this.servicioCiclo.getAllCiclos().toPromise();
    if (RESPONSE) {
      this.ciclos = RESPONSE.data as Ciclo[];
    }
  }



  onNoclick() {
    this.dialogRef.close({ ok: false });
  }
}
