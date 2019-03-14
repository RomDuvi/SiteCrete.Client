import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkalakiComponent } from './skalaki.component';

describe('SkalakiComponent', () => {
  let component: SkalakiComponent;
  let fixture: ComponentFixture<SkalakiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkalakiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkalakiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
