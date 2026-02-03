import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { FormControl } from '@angular/forms';
import { Permises } from '../shared/interfaces/api-response';
import { combineLatest } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CLOSE, ERROR } from '../shared/messages';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';


import { Alumno } from '../shared/interfaces/alumno';
import { SelectionModel } from '@angular/cdk/collections';
import { AlumnosService } from '../services/alumnos.service';
import { ZonasService } from '../services/zonas.service';
import { EntidadesService } from '../services/entidades.service';
import { CiclosService } from '../services/ciclos.service';
import { AddAlumnoComponent } from './add-alumno/add-alumno.component';
import { EditAlumnoComponent } from './edit-alumno/edit-alumno.component';
import { DeleteAlumnoComponent } from './delete-alumno/delete-alumno.component';
import { Entidad } from '../shared/interfaces/entidad';
import { Ciclo } from '../shared/interfaces/ciclo';
import { ProvinciasService } from '../services/provincias.service';
import { Provincia } from '../shared/interfaces/provincia';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.scss']
})
export class AlumnosComponent implements OnInit {


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource: MatTableDataSource<Alumno> = new MatTableDataSource;

  listaEntidades: Entidad[];
  lsitaCiclos: Ciclo[];

  idAlumnoFilter = new FormControl();
  nie_nifFilter = new FormControl();
  nombreFilter = new FormControl();
  apellidosFilter = new FormControl();
  fechaNacimientoFilter = new FormControl();
  entidadFilter = new FormControl();
  cicloFilter = new FormControl();
  cursoFilter = new FormControl();

  isChecked = false;
  isCheckedAll = false;
  pageSizeChecked: number;
  pageIndexChecked: number;

  alumnosSelected: Alumno[] = [];
  selection: SelectionModel<Alumno>;
  alumno: Alumno;

  displayedColums: string[];
  private filterValues = { id_alumno: '', nif_nie: '', nombre: '', apellidos: '', fecha_nacimiento: '', entidad: '', ciclo: '', curso: '' }

  constructor(
    public dialog: MatDialog,
    private alumnosService: AlumnosService,
    private servicioEntidad: EntidadesService,
    private serviceCiclo: CiclosService,
    private servicioProvincia: ProvinciasService,


    private overlay: Overlay,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,



  ) { }

  ngOnInit(): void {
    this.getAlumnos();
  }

  async getAlumnos() {
    const alumnos = await this.alumnosService.getAllAlumno().toPromise();
    this.displayedColums = ['id_alumno', 'nif_nie', 'nombre', 'apellidos', 'fecha_nacimiento', 'entidad', 'ciclo', 'curso', 'actions'];
    const entidadesResponse = await this.servicioEntidad.getAllEntidades().toPromise();
    const ciclosResponse = await this.serviceCiclo.getAllCiclos().toPromise();
    this.dataSource.data = alumnos;
    if(entidadesResponse && ciclosResponse) {
      this.listaEntidades = entidadesResponse.data;
      this.lsitaCiclos = ciclosResponse.data;
      this.dataSource.data = alumnos.map(v => ({
        ...v,
        entidadNombre: this.listaEntidades.find(e => e.id_entidad === v.Entidad)?.entidad || 'Desconocida',
        cicloNombre: this.lsitaCiclos.find(c => c.id_ciclo === v.Ciclo)?.ciclo || 'Desconocido',
      }))
    }


    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.createFilter();
    this.selection = new SelectionModel<Alumno>(false, [this.alumno]);

    this.onChanges();

  }

  async addAlumno() {
    const dialogoRef = this.dialog.open(AddAlumnoComponent, {
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      disableClose: false,
      width: '600px'
    });

    const result = await dialogoRef.afterClosed().toPromise();

    if(result) {
      this.ngOnInit();
    }
  }

  async aditAlumno(alumno: Alumno) {
    const dialogoRef = this.dialog.open(EditAlumnoComponent, {data: alumno, scrollStrategy: this.overlay.scrollStrategies.noop(), disableClose: false, width: '600px' });
    const result = await dialogoRef.afterClosed().toPromise();

    if(result) {
      this.ngOnInit();
    }
  }

  async deleteAlumno(alumno: Alumno) {
    const dialogRef = this.dialog.open(DeleteAlumnoComponent, {data: alumno, scrollStrategy: this.overlay.scrollStrategies.noop(), disableClose: false, width: '600px' });
    const result = await dialogRef.afterClosed().toPromise();

    if(result) {
      this.ngOnInit();
    }
  }

  changePage() {
    if (this.isCheckedAll) {
      this.isChecked = true;
    } else {
      this.isChecked = (((this.pageIndexChecked + 1) * this.pageSizeChecked) /
      ((this.dataSource.paginator.pageIndex + 1) * this.dataSource.paginator.pageSize)) >= 1;
    }
  }

      chooseAllPublicacion(event: any) {
      this.isChecked = event.checked;

      const min = this.dataSource.paginator.pageSize * this.dataSource.paginator.pageIndex;
      const max = this.dataSource.paginator.pageSize * (this.dataSource.paginator.pageIndex + 1);

      if (event.checked) {
        this.pageIndexChecked = this.dataSource.paginator.pageIndex;
        this.pageSizeChecked = this.dataSource.paginator.pageSize;

        this.dataSource.filteredData.forEach((alumno, i) => {
          if (i >= min && i < max && !alumno.checked) {
            alumno.checked = true;
            this.alumnosSelected.push(alumno);
          }
        });

        if (this.alumnosSelected.length < this.dataSource.filteredData.length) {
          this.snackBar.open('Has seleccionado todos los elementos visibles, hay más en otras páginas.', 'Cerrar', { duration: 3000 });
        }
      } else {
        this.isCheckedAll = false;
        this.alumnosSelected = [];
        this.pageIndexChecked = 0;
        this.pageSizeChecked = 0;
        this.dataSource.filteredData.forEach(alumno => alumno.checked = false);
      }
    }


  /** Crear filtro por columnas */
  createFilter(): (alumno: Alumno, filter: string) => boolean {
    return (alumno: Alumno, filter: string) => {
      const search = JSON.parse(filter);
      return (!search.id_alumno || alumno.id_alumno.toString().includes(search.id_alumno))
          && (!search.nif_nie || alumno.nif_nie.toLowerCase().includes(search.nif_nie.toLowerCase()))
          && (!search.nombre || alumno.Nombre.toLowerCase().includes(search.nombre.toLowerCase()))
          && (!search.apellidos || alumno.Apellidos.toLowerCase().includes(search.apellidos.toLowerCase()));
    };
  }


    onChanges() {
      this.idAlumnoFilter.valueChanges.subscribe(value => {
        this.filterValues.id_alumno = value;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      });

      this.nie_nifFilter.valueChanges.subscribe(value => {
        this.filterValues.nif_nie = value;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      });

      this.nombreFilter.valueChanges.subscribe(value => {
        this.filterValues.nombre = value;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      });

      this.apellidosFilter.valueChanges.subscribe(value => {
        this.filterValues.apellidos = value;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      });
    }

      async getEntidades() {
        const RESPONSE = await this.servicioEntidad.getAllEntidades().toPromise();
        if(RESPONSE) {
          return RESPONSE.data as Entidad[];
        }
      }

      async getCiclos() {
        const RESPONSE = await this.serviceCiclo.getAllCiclos().toPromise();
        if(RESPONSE) {
          return RESPONSE.data as  Ciclo[];
        }
      }

      async getProvincias() {
        const RESPONSE = await this.servicioProvincia.getAllProvincias().toPromise();
      }
}
