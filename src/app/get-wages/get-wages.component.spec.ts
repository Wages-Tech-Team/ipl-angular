import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetWagesComponent } from './get-wages.component';

describe('GetWagesComponent', () => {
  let component: GetWagesComponent;
  let fixture: ComponentFixture<GetWagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetWagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetWagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
