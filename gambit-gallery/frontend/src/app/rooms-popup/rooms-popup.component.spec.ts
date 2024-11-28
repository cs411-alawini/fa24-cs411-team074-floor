import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RoomsPopupComponent } from './rooms-popup.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RoomsPopupComponent', () => {
  let component: RoomsPopupComponent;
  let fixture: ComponentFixture<RoomsPopupComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [RoomsPopupComponent],
      providers: [{ provide: Router, useValue: routerSpy }],
      schemas: [NO_ERRORS_SCHEMA], // To ignore any Angular-specific warnings about unknown elements
    }).compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(RoomsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back on navigateBack', () => {
    component.navigateBack();
    expect(router.navigate).toHaveBeenCalledWith(['/']); // Verifies that it navigates back to the root route
  });
});
