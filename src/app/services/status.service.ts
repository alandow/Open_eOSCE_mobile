import {  OnInit, Input, Output, EventEmitter, Injectable } from '@angular/core';
import { Subject }    from 'rxjs';


@Injectable()

export class StatusService {

// observable source
  private _connected = new Subject<boolean>();

  private _is_connected:boolean = false;

  public is_connected():boolean{
    return this._is_connected;
  }
    // Observable string streams
  connectionChanged$ = this._connected.asObservable();

  // Service message commands
  announceConnectionChange(connected: boolean) {
    this._is_connected = connected;
    this._connected.next(connected);
  }
  
}
