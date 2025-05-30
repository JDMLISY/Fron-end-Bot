import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, merge, Subscription, timer } from 'rxjs';
import { TokenStorageService } from './token-storage.service';
import { UserService } from '../_services/user.service';

@Injectable({
  providedIn: 'root'
})
export class IdleTimeoutService {
  private idleTimeout = 2 * 60 * 60 * 1000; // ✅ 2 horas
//   private idleTimeout = 1 * 60 * 1000; // Para pruebas: 1 minuto
  private userActivityEvents$: Subscription | null = null;
  private timer$: Subscription | null = null;
  constructor(
    private userService: UserService,
    private router: Router,
    private ngZone: NgZone,
    private tokenStorage: TokenStorageService
  ) {}

  startWatching() {
    // Limpia el estado de sesión cerrada si es un nuevo inicio
    localStorage.removeItem('sessionClosed');

    this.ngZone.runOutsideAngular(() => {
      const events = merge(
        fromEvent(window, 'mousemove'),
        fromEvent(window, 'keydown'),
        fromEvent(window, 'mousedown'),
        fromEvent(window, 'scroll'),
        fromEvent(window, 'touchstart')
      );

      this.userActivityEvents$ = events.subscribe(() => this.resetTimer());
      this.resetTimer();
    });
  }

  private resetTimer() {
    if (this.timer$) {
      this.timer$.unsubscribe();
      this.timer$ = null;
    }

    this.timer$ = timer(this.idleTimeout).subscribe(() => {
      this.ngZone.run(() => {
        this.stopWatching();

        // ✅ Evita múltiples ejecuciones
        if (!localStorage.getItem('sessionClosed')) {
          localStorage.setItem('sessionClosed', 'true');
          localStorage.clear();
          this.userService.showSuccess("Sesión cerrada por inactividad.","Cierre de sesion","warning");
          this.tokenStorage.signOut();
         // this.router.navigate(['/login']);
         
      //    alert('Sesión cerrada por inactividad.');
        }
      });
    });
  }

  stopWatching() {
    if (this.userActivityEvents$) {
      this.userActivityEvents$.unsubscribe();
      this.userActivityEvents$ = null;
    }
    if (this.timer$) {
      this.timer$.unsubscribe();
      this.timer$ = null;
    }
  }
}
