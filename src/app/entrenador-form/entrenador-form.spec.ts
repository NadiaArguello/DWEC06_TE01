import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrenadorForm } from './entrenador-form';

describe('EntrenadorForm', () => {
  let component: EntrenadorForm;
  let fixture: ComponentFixture<EntrenadorForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EntrenadorForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntrenadorForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
