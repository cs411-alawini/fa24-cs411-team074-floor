import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
@NgModule({
  declarations: [/* your components */],
  imports: [
    HttpClientModule, // Add this here
    // other imports...
  ],
  bootstrap: [/* your main component */]
})
export class AppModule { }

