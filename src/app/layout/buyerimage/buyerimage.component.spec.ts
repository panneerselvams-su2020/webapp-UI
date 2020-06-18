import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerimageComponent } from './buyerimage.component';

describe('BuyerimageComponent', () => {
  let component: BuyerimageComponent;
  let fixture: ComponentFixture<BuyerimageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerimageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerimageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
