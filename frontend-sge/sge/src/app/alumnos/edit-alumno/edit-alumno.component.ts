import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Provincia } from 'src/app/shared/interfaces/provincia';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProvinciasService } from 'src/app/services/provincias.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { Alumno } from 'src/app/shared/interfaces/alumno';
import { CLOSE, INVALID_FORM } from 'src/app/shared/messages';
import { Entidad } from 'src/app/shared/interfaces/entidad';
import { Ciclo } from 'src/app/shared/interfaces/ciclo';
import { EntidadesService } from 'src/app/services/entidades.service';
import { CiclosService } from 'src/app/services/ciclos.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'app-edit-alumno',
  templateUrl: './edit-alumno.component.html',
  styleUrls: ['./edit-alumno.component.scss']
})
export class EditAlumnoComponent implements OnInit {
  alumnoForm: FormGroup;
  provincias: Provincia[];
  alumnos: Alumno[];
  entidades: Entidad[];
  ciclos: Ciclo[];

  ALUMNO: String;

  constructor(
    public dialogRef: MatDialogRef<EditAlumnoComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public alumno: Alumno,
    public servicioProvincias: ProvinciasService,
    public servicioAlumnos: AlumnosService,
    public servicioEntidades: EntidadesService,
    public servicioCiclos: CiclosService,
  ) { }

ngOnInit(): void {
  this.alumnoForm = new FormGroup({
    id_alumno: new FormControl(this.alumno.id_alumno, Validators.required),
    nif_nie: new FormControl(this.alumno.nif_nie, Validators.required),
    Nombre: new FormControl(this.alumno.Nombre, Validators.required),
    Apellidos: new FormControl(this.alumno.Apellidos, Validators.required),
    Fecha_nacimiento: new FormControl(this.alumno.Fecha_nacimiento),
    Entidad: new FormControl(this.alumno.Entidad ?? ''),
    Ciclo: new FormControl(this.alumno.Ciclo ?? '', Validators.required),
    Curso: new FormControl(this.alumno.Curso, [Validators.required, Validators.pattern(/^[1-2]$/)]),
    Telefono: new FormControl(this.alumno.Telefono),
    Direccion: new FormControl(this.alumno.Direccion),
    CP: new FormControl(this.alumno.CP),
    Localidad: new FormControl(this.alumno.Localidad),
    Provincia: new FormControl(this.alumno.Provincia ?? ''),
    Observaciones: new FormControl(this.alumno.observaciones),
  });

  this.getProvincias();
  this.getEntidades();
  this.getCiclos();
}

  async confirmEdit() {
    if (!this.alumnoForm.valid) {
      this.snackbar.open(INVALID_FORM, CLOSE, { duration: 5000 });
      return;
    }

    const alumno_actualizado = this.alumnoForm.value;
      if (alumno_actualizado.Fecha_nacimiento) {
    alumno_actualizado.Fecha_nacimiento = new Date(alumno_actualizado.Fecha_nacimiento)
      .toISOString()
      .split('T')[0];
  }

  // Llamamos al servicio para actualizar

    const RESPONSE = await this.servicioAlumnos.editAlumno(this.alumno.id_alumno, alumno_actualizado).toPromise();

    if (!RESPONSE) {
      this.snackbar.open(INVALID_FORM, CLOSE, { duration: 5000 });
      return;
    } else {
      this.snackbar.open("Alumno actualizado correctamente", CLOSE, { duration: 5000 });
      this.dialogRef.close({ ok: true });
    }
  }

  async getProvincias() {
    const RESPONSE = await this.servicioProvincias.getAllProvincias().toPromise();
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
