import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ICONS, KnownIcon, UNKNOWN_ICON } from './icons';

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})
export class Icon {
  readonly name = input.required<KnownIcon>();

  protected readonly pathData = computed(() => ICONS[this.name()] ?? UNKNOWN_ICON);
}
