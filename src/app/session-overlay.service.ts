import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionOverlayService {
  private _showOverlay = new BehaviorSubject<boolean>(false);
  showOverlay$ = this._showOverlay.asObservable();

  show(ms: number = 3000) {
    this._showOverlay.next(true);
    setTimeout(() => this._showOverlay.next(false), ms);
  }
}
