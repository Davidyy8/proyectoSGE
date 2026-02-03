import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service'; // Servicio para obtener los menús desde el backend
import { AuthService } from 'src/app/services/auth.service'; // Servicio para manejar autenticación/logout
import { Router } from '@angular/router'; // Servicio para navegación de rutas

@Component({
  selector: 'app-navbar', // Nombre del selector que se usará en el HTML
  templateUrl: './navbar.component.html', // Plantilla HTML asociada
  styleUrls: ['./navbar.component.scss'] // Estilos asociados al componente
})
export class NavbarComponent implements OnInit {

  // Variables del componente
  menu: any; // Almacena la estructura del menú que viene del backend
  username: string; // Nombre del usuario logueado
  grupo: string; // Grupo o sección actual seleccionada
  vista: string; // Opción actual seleccionada dentro del grupo
  href: string; // Puede usarse para enlaces dinámicos (no se usa en este código)
  url: string;  // Puede usarse para almacenar la URL actual (no se usa aquí)

  constructor(
    private menuService: MenuService, // Inyecta el servicio de menús
    private authService: AuthService, // Inyecta el servicio de autenticación
    private router: Router // Inyecta el router para navegar entre páginas
  ) {
    // Llama a getMenu() al crear el componente para cargar el menú desde el backend
    this.getMenu();
  }

  ngOnInit() {
    // Se ejecuta al inicializar el componente
    // Obtiene información del usuario y la última vista desde localStorage
    this.username = localStorage.getItem('nombre_publico'); // Nombre del usuario logueado
    this.grupo = localStorage.getItem('ultimoGrupo');       // Último grupo seleccionado
    this.vista = localStorage.getItem('ultimaOpcion');      // Última opción seleccionada
  }

  // Método para cerrar sesión
  salir() {
    // Llama al servicio de autenticación para hacer logout
    this.authService.doLogout()
      .subscribe( response => {}); // No se hace nada con la respuesta
    // Redirige al usuario a la página de inicio
    this.router.navigate(['home']);
  }

  // Método para obtener el menú desde el backend
  async getMenu() {
    const RESPONSE = await this.menuService.getMenu().toPromise(); // Llama al servicio
    this.menu = RESPONSE.data; // Guarda los menús en la variable 'menu'
    // NOTA: Actualmente solo carga los menús principales, no las opciones de cada menú
  }

  // Almacena el grupo seleccionado en localStorage
  almacenarGrupo(grupo) {
    localStorage.setItem('ultimoGrupo', grupo);
  }

  // Actualiza la vista y el grupo en el navbar
  actualizarVistaNavbar(opcion) {
    // Obtiene el grupo actual desde localStorage
    this.grupo = localStorage.getItem('ultimoGrupo');
    // Guarda la opción actual en localStorage
    localStorage.setItem('ultimaOpcion', opcion);
    // Actualiza la variable de la vista actual
    this.vista = opcion;
  }

  // Método para ir a la vista de perfil
  goPerfil() {
    // Actualiza localStorage para marcar que el grupo es "Inicio" y la opción es "Perfil"
    localStorage.setItem('ultimoGrupo', 'Inicio');
    localStorage.setItem('ultimaOpcion', 'Perfil');
    // Redirige a la ruta 'perfil'
    this.router.navigate(['perfil']);
    // Llama a ngOnInit para recargar datos del usuario
    this.ngOnInit();
  }

}
