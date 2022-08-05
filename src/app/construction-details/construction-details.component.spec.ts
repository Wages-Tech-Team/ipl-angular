import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructionDetailsComponent } from './construction-details.component';

describe('ConstructionDetailsComponent', () => {
  let component: ConstructionDetailsComponent;
  let fixture: ComponentFixture<ConstructionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstructionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
