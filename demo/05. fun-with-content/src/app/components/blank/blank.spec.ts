import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Blank } from './blank';

describe('Blank', () => {
  let component: Blank;
  let fixture: ComponentFixture<Blank>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Blank]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Blank);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
