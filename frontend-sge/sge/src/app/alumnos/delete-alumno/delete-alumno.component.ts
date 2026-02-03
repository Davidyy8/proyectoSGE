import { Component, Inject, OnInit } from '@angular/core';
import { Alumno } from '../../shared/interfaces/alumno';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ALUMNO_ALUMNO, CLOSE } from 'src/app/shared/messages';

@Component({
  selector: 'app-delete-alumno',
  templateUrl: './delete-alumno.component.html',
  styleUrls: ['./delete-alumno.component.scss']
})
export class DeleteAlumnoComponent implements OnInit {

  ALUMNO: String;

  constructor(
    public dialogRef: MatDialogRef<DeleteAlumnoComponent>,
    @Inject(MAT_DIALOG_DATA) public alumno: Alumno,
    public servicioAlumno: AlumnosService,
    public snackbar: MatSnackBar,
  ) { }


  ngOnInit(): void {
    this.ALUMNO = ALUMNO_ALUMNO;
  }

  onNoClick(): void {
    this.dialogRef.close({ ok: false });
  }

  async confirmDelete() {
    const RESPONSE = await this.servicioAlumno.deleteAlumno(this.alumno.id_alumno).toPromise();
    this.snackbar.open("Alumno eliminado correctamente", CLOSE, { duration: 5000 });
    this.dialogRef.close({ ok: true })

  }

}
