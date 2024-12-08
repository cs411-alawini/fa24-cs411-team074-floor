import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteShopPurchaseComponent } from './complete-shop-purchase.component';

describe('CompleteShopPurchaseComponent', () => {
  let component: CompleteShopPurchaseComponent;
  let fixture: ComponentFixture<CompleteShopPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteShopPurchaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompleteShopPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
