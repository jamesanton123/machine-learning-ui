import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule], // Import RouterModule to enable routing features
  template: `
    <header>
      <h1>MachLearner</h1>
      <nav>
        <a routerLink="/sessions" routerLinkActive="active">Sessions</a>
      </nav>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}
