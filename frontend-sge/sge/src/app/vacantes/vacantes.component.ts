import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Vacante } from '../shared/interfaces/vacante';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { VacantesService } from '../services/vacantes.service';
import { AlumnosService } from '../services/alumnos.service';
import { Overlay } from '@angular/cdk/overlay';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddVacanteComponent } from './add-vacante/add-vacante.component';
import { EditVacanteComponent } from './edit-vacante/edit-vacante.component';
import { DeleteVacanteComponent } from './delete-vacante/delete-vacante.component';
import { EntidadesService } from '../services/entidades.service';
import { CiclosService } from '../services/ciclos.service';
import { Entidad } from '../shared/interfaces/entidad';
import { Ciclo } from '../shared/interfaces/ciclo';

@Component({
  selector: 'app-vacantes',
  templateUrl: './vacantes.component.html',
  styleUrls: ['./vacantes.component.scss']
})
export class VacantesComponent implements OnInit {


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource: MatTableDataSource<Vacante> = new MatTableDataSource;


  idVacanteFilter = new FormControl();
  entidadFilter = new FormControl();
  cicloFilter = new FormControl();
  cursoFilter = new FormControl();
  numVacantesFilter = new FormControl();
  numAlumnosFilter = new FormControl();

  isChecked = false;
  isCheckedAll = false;
  pageSizeChecked: number;
  pageIndexChecked: number;

  entidadesList: Entidad[] = [];
  ciclosList: Ciclo[] = [];


  vacantesSelected: Vacante[] = [];
  selection: SelectionModel<Vacante>;
  vacante: Vacante;

  displayedColumns: string[] = ['id_vacante', 'entidad', 'ciclo', 'curso', 'num_vacantes', 'num_alumnos', 'actions'];

  private filterValues = { id_vacante: '', entidad: '', ciclo: '', curso: '', num_vacantes: '', num_alumnos: '' }
  constructor(
    public dialog: MatDialog,
    private vacanteService: VacantesService,
    private alumnoService: AlumnosService,
    private entidadesService: EntidadesService,
    private ciclosService: CiclosService,

    private overlay: Overlay,
    private clipboard: Clipboard,
    private snackbar: MatSnackBar,

  ) { }

  ngOnInit(): void {
    this.getVacantes();
  }

async getVacantes() {
  const vacantes = await this.vacanteService.getAll().toPromise();
  const entidadesResponse = await this.entidadesService.getAllEntidades().toPromise();
  const ciclosResponse = await this.ciclosService.getAllCiclos().toPromise();

  if (entidadesResponse && ciclosResponse) {
    this.entidadesList = entidadesResponse.data;
    this.ciclosList = ciclosResponse.data;

    this.dataSource.data = vacantes.map(v => ({
      ...v,
      entidadNombre: this.entidadesList.find(e => e.id_entidad === v.Entidad)?.entidad || 'Desconocida',
      cicloNombre: this.ciclosList.find(c => c.id_ciclo === v.Ciclo)?.ciclo || 'Desconocido'
    }));
  }

  this.displayedColumns = ['id_vacante', 'entidad', 'ciclo', 'curso', 'num_vacantes', 'num_alumnos', 'actions'];
  this.dataSource.sort = this.sort;
  this.dataSource.paginator = this.paginator;
  this.dataSource.filterPredicate = this.createFilter();
  this.selection = new SelectionModel<Vacante>(false, [this.vacante]);

  this.onChanges();
}


  async addVacante() {
    const dialogoRef = this.dialog.open(AddVacanteComponent, {
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      disableClose: false,
      width: '600px'
    });

    const result = await dialogoRef.afterClosed().toPromise();

    if (result) {
      this.ngOnInit();
    }
  }

  async editVacante(vacante: Vacante) {
    const dialogoRef = this.dialog.open(EditVacanteComponent, {
      data: vacante,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      disableClose: false,
      width: '600px'
    });

    const result = await dialogoRef.afterClosed().toPromise();

    if (result) {
      this.ngOnInit();
    }
  }

  async deleteVacante(vacante: Vacante) {
    const dialogoRef = this.dialog.open(DeleteVacanteComponent, {
      data: vacante,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      disableClose: false,
      width: '400px'
    });

    const result = await dialogoRef.afterClosed().toPromise();

    if (result) {
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

      this.dataSource.filteredData.forEach((vacante, i) => {
        if (i >= min && i < max && !vacante.checked) {
          vacante.checked = true;
          this.vacantesSelected.push(vacante);
        }
    });

    if (this.vacantesSelected.length === this.dataSource.filteredData.length) {
      this.snackbar.open('Se han seleccionado todas las vacantes', 'Cerrar', { duration: 3000 });
    }
    } else {
      this.isCheckedAll = false;
      this.vacantesSelected = [];
      this.pageIndexChecked = 0;
      this.pageSizeChecked = 0;
      this.dataSource.filteredData.forEach(vacante => vacante.checked = false);
    }
  }

  createFilter(): (vacante: Vacante, filter: string) => boolean {
    return (vacante: Vacante, filter: string) => {
      const searchTerms = JSON.parse(filter);
      return (searchTerms.id_vacante === '' || vacante.id_vacante.toString().toLowerCase().indexOf(searchTerms.id_vacante.toLowerCase()) !== -1)
        && (searchTerms.entidad === '' || vacante.Entidad.toString().toLowerCase().indexOf(searchTerms.entidad.toLowerCase()) !== -1)
        && (searchTerms.ciclo === '' || vacante.Ciclo.toString().toLowerCase().indexOf(searchTerms.ciclo.toLowerCase()) !== -1)
        && (searchTerms.curso === '' || vacante.Curso.toString().toLowerCase().indexOf(searchTerms.curso.toLowerCase()) !== -1)
        && (searchTerms.num_vacantes === '' || vacante.Num_vacantes.toString().toLowerCase().indexOf(searchTerms.num_vacantes.toLowerCase()) !== -1)
        && (searchTerms.num_alumnos === '' || vacante.Num_alumnos.toString().toLowerCase().indexOf(searchTerms.num_alumnos.toLowerCase()) !== -1);
    };
  }

  onChanges() {
    this.idVacanteFilter.valueChanges.subscribe(id_vacante => {
      this.filterValues.id_vacante = id_vacante;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.entidadFilter.valueChanges.subscribe(entidad => {
      this.filterValues.entidad = entidad;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.cicloFilter.valueChanges.subscribe(ciclo => {
      this.filterValues.ciclo = ciclo;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.cursoFilter.valueChanges.subscribe(curso => {
      this.filterValues.curso = curso;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.numVacantesFilter.valueChanges.subscribe(num_vacantes => {
      this.filterValues.num_vacantes = num_vacantes;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });

    this.numAlumnosFilter.valueChanges.subscribe(num_alumnos => {
      this.filterValues.num_alumnos = num_alumnos;
      this.dataSource.filter = JSON.stringify(this.filterValues);
    });
  }

  async getEntidades() {
    const RESPONSE = await this.entidadesService.getAllEntidades().toPromise();
    if(RESPONSE) {
      return RESPONSE.data as Entidad[];
    }
  }

  async getCiclos() {
    const RESPONSE = await this.ciclosService.getAllCiclos().toPromise();
    if(RESPONSE) {
      return RESPONSE.data as  Ciclo[];
    }
  }


}

