import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPayToComponent } from './add-pay-to.component';

describe('AddPayToComponent', () => {
  let component: AddPayToComponent;
  let fixture: ComponentFixture<AddPayToComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPayToComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPayToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
