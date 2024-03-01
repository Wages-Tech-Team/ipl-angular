import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetWagesReportComponent } from './get-wages-report.component';

describe('GetWagesReportComponent', () => {
  let component: GetWagesReportComponent;
  let fixture: ComponentFixture<GetWagesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetWagesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetWagesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
