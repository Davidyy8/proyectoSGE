export interface Alumno {
  id_alumno: number,
  nif_nie: string,
  Nombre: string,
  Apellidos: string,
  Fecha_nacimiento: Date,
  Entidad: number,
  Ciclo: number,
  Curso: number,
  Telefono: string,
  Direccion: string,
  CP: string,
  Localidad: string,
  Provincia: number,
  observaciones?: string,
  checked?: boolean;
}
