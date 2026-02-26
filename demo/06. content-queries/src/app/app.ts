import { Component, signal } from '@angular/core';
import { Container } from "./components/container/container";
import { Item } from "./components/item/item";

@Component({
  selector: 'app-root',
  imports: [Container, Item],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('content-queries');
}
