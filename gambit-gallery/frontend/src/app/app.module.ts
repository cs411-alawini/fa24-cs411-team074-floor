import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [/* your components */],
  imports: [
    HttpClientModule, // Add this here
    // other imports...
  ],
  bootstrap: [/* your main component */]
})
export class AppModule { }

