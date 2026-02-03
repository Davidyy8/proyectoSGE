import { Ciclo } from 'src/app/shared/interfaces/ciclo';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { ProvinciasService } from 'src/app/services/provincias.service';
import { Provincia } from 'src/app/shared/interfaces/provincia';
import { Alumno } from 'src/app/shared/interfaces/alumno';
import { CiclosComponent } from '../../ciclos/ciclos.component';
import { CLOSE, INVALID_FORM } from 'src/app/shared/messages';
import { Entidad } from 'src/app/shared/interfaces/entidad';
import { EntidadesService } from 'src/app/services/entidades.service';
import { CiclosService } from 'src/app/services/ciclos.service';



@Component({
  selector: 'app-add-alumno',
  templateUrl: './add-alumno.component.html',
  styleUrls: ['./add-alumno.component.scss']
})
export class AddAlumnoComponent implements OnInit {
  alumnoForm: FormGroup;
  provincias: Provincia[];
  ciclos: Ciclo[];
  entidades: Entidad[];



  ALUMNO: String;

  constructor( public dialogRef: MatDialogRef<AddAlumnoComponent>,
    private snackbar: MatSnackBar,
    private servicioAlumno: AlumnosService,
    private servicioProvincia: ProvinciasService,
    private servicioCiclos: CiclosService,
    private servicioEntidades: EntidadesService

  ) { }

  ngOnInit(): void {
    this.alumnoForm = new FormGroup({
      nif_nie: new FormControl(null),
      Nombre: new FormControl(null),
      Apellidos: new FormControl(null),
      Fecha_nacimiento: new FormControl(null),
      Entidad: new FormControl(null),
      Ciclo: new FormControl(null),
      Curso: new FormControl(null),
      Telefono: new FormControl(null),
      Direccion: new FormControl(null),
      CP: new FormControl(null),
      Localidad: new FormControl(null),
      Provincia: new FormControl(null),
      Observaciones: new FormControl(null),
    });

    this.getProvincias();
    this.getEntidades();
    this.getCiclos();


  }

  async confirmAdd() {
    if ( this.alumnoForm.valid) {
      const alumno_creado = this.alumnoForm.value as Alumno;
      const alumno_actualizado = this.alumnoForm.value;
      if (alumno_actualizado.Fecha_nacimiento) {
        alumno_actualizado.Fecha_nacimiento = new Date(alumno_actualizado.Fecha_nacimiento)
        .toISOString()
        .split('T')[0];
      }
      if(alumno_actualizado.Curso != 1 && alumno_actualizado.Curso != 2) {
        this.snackbar.open("Curso invalido", CLOSE, { duration: 5000 })
        return;
      }
      const RESPONSE = await this.servicioAlumno.addAlumno(alumno_actualizado).toPromise();

      if(!RESPONSE) {
        this.snackbar.open(INVALID_FORM, CLOSE, { duration: 5000 });
        return;
      }else {
        this.snackbar.open("Formulario correcto", CLOSE, { duration: 5000 });
        this.dialogRef.close({ ok: true }); // Cerramos el diálogo
      }
    }
  }

  async getProvincias() {
    const RESPONSE = await this.servicioProvincia.getAllProvincias().toPromise();
    if (RESPONSE) {
      this.provincias = RESPONSE.data as Provincia[];
    }
  }

  async getEntidades() {
    const RESPONSE = await this.servicioEntidades.getAllEntidades().toPromise();
    if (RESPONSE) {
      this.entidades = RESPONSE.data as Entidad[];
    }
  }

  async getCiclos() {
    const RESPONSE = await this.servicioCiclos.getAllCiclos().toPromise();
    if (RESPONSE) {
      this.ciclos = RESPONSE.data as Ciclo[];
    }
  }



  onNoClick() {
    this.dialogRef.close({ ok: false });
  }
}
