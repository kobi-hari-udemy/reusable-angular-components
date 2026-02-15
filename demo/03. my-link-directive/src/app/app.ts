import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MyLink, provideMyLinkActiveClass } from './directives/my-link.directive';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MyLink],
  templateUrl: './app.html',
  styleUrl: './app.scss', 
  providers: [
    // provideMyLinkActiveClass('chosen')
  ]
})
export class App {
  protected readonly title = signal('my-link-directive');
}
