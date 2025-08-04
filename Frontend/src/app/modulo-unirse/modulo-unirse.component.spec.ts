import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloUnirseComponent } from './modulo-unirse.component';

describe('ModuloUnirseComponent', () => {
  let component: ModuloUnirseComponent;
  let fixture: ComponentFixture<ModuloUnirseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuloUnirseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuloUnirseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
