import { Alumno } from './alumno';
export interface Vacante {
  id_vacante: number,
  Entidad: number,
  Ciclo: number,
  Curso: number,
  Num_vacantes: number,
  Num_alumnos: number,
  alumnos: Alumno[],
  checked?: boolean;

  fk_entidades;
  fk_cicloVacante;
}
