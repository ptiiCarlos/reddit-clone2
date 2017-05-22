import { Component, Input, ViewEncapsulation } from '@angular/core';
/** The ViewEncapsulation enables us to apply css to only this component
 * this is done via the shadow DOM... If we want to use the styles everywhere
 * we can set the ViewEncapsulation.None meanin the class wil be everywhere
 * (as in the head of the document).
*/ 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.Emulated /** this is the default */
})
export class AppComponent {}
