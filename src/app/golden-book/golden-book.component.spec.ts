import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldenBookComponent } from './golden-book.component';

describe('GoldenBookComponent', () => {
  let component: GoldenBookComponent;
  let fixture: ComponentFixture<GoldenBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoldenBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoldenBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
