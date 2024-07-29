import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'art';
  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Importamos AOS solo si estamos en el navegador
      import('aos').then(AOS => {
        AOS.init();
      });
    }
  }
}
