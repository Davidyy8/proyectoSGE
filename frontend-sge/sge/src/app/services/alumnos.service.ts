import { Injectable } from "@angular/core";
import { Alumno } from "../shared/interfaces/alumno";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../shared/common.service";
import { URL_LOCAL_API } from "src/environments/environment";

const ENDPOINT =  'sgi_alumnos';

@Injectable({
  providedIn: 'root'
})
export class AlumnosService {
  alumnos: Alumno[];
  alumno: Alumno;


  constructor(private http: HttpClient, private commonService: CommonService) { }

  login(usuario: string, password: string) {
    return this.http.post<{token: string}>(`${URL_LOCAL_API}/token`, {username: usuario, password})
      .subscribe(res => {
        localStorage.setItem('token', res.token);
      });
  }

  getAllAlumno() {
    return this.http.get<Alumno[]>(`${URL_LOCAL_API}/${ENDPOINT}`, {headers: this.commonService.getHeaders()});
  }

  addAlumno(alumno: Alumno) {
    return this.http.post<Alumno>(`${URL_LOCAL_API}/${ENDPOINT}`, alumno, { headers: this.commonService.getHeaders() });
  }

  editAlumno(id: number ,alumno: Alumno) {
    return this.http.put<Alumno>(`${URL_LOCAL_API}/${ENDPOINT}/${id}`, alumno, { headers: this.commonService.getHeaders() });
  }

  deleteAlumno(id: number) {
    return this.http.delete(`${URL_LOCAL_API}/${ENDPOINT}/${id}`, { headers: this.commonService.getHeaders() })
  }


}
