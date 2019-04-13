import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureCategoriesComponent } from './picture-categories.component';

describe('PictureCategoriesComponent', () => {
  let component: PictureCategoriesComponent;
  let fixture: ComponentFixture<PictureCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PictureCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
