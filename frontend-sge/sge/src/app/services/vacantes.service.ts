import { Injectable } from "@angular/core";
import { Vacante } from "../shared/interfaces/vacante";
import { HttpClient } from "@angular/common/http";
import { CommonService } from '../shared/common.service';
import { URL_LOCAL_API } from "src/environments/environment";



const ENDPOINT = 'sgi_vacantes';

@Injectable({
  providedIn: 'root'
})
export class VacantesService {
  vacantes: Vacante[];
  vacante: Vacante;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  setVacante(vacante: Vacante) {
    this.vacante = vacante;
  }

  getAll() {
    return this.http.get<Vacante[]>(`${URL_LOCAL_API}/${ENDPOINT}`, {headers: this.commonService.headers});
  }

  addVacante(vacante: Vacante) {
    return this.http.post<Vacante>(`${URL_LOCAL_API}/${ENDPOINT}`, vacante, {headers: this.commonService.headers});
  }

  editVacante(id: number, vacante: Vacante) {
    return this.http.put<Vacante>(`${URL_LOCAL_API}/${ENDPOINT}/${id}`, vacante, { headers: this.commonService.headers });
  }

  deleteVacante(id: number) {
    return this.http.delete(`${URL_LOCAL_API}/${ENDPOINT}/${id}`, { headers: this.commonService.headers });
  }


}
