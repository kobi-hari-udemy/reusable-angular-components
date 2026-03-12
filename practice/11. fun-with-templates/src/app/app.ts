import { Component, signal } from '@angular/core';
import { COLOR_NAMES, FONT_NAMES, SIZES } from './data/constants';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly possibleColors = signal(COLOR_NAMES);
  readonly possibleFonts = signal(FONT_NAMES);
  readonly possibleSizes = signal(SIZES);

  readonly selectedColor = signal(this.possibleColors()[0]);
  readonly selectedFont = signal(this.possibleFonts()[0]);
  readonly selectedSize = signal(this.possibleSizes()[0]);

  onColorChange(color: string): void {
    this.selectedColor.set(color);
  }

  onFontChange(font: string): void {
    this.selectedFont.set(font);
  }

  onSizeChange(size: string): void {
    this.selectedSize.set(size);
  }
}
