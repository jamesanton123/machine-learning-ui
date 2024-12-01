import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionsService } from './sessions.service';

@Component({
  selector: 'app-sessions',
  standalone: true, // Mark as standalone
  imports: [CommonModule], // Import necessary modules here
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css'],
})
export class SessionsComponent {
  sessions: any[] = [];
  errorMessage: string = '';

  constructor(private sessionsService: SessionsService) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.sessionsService.getSessions().subscribe({
      next: (data) => {
        this.sessions = data;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load sessions.';
        console.error(err);
      },
    });
  }

  createSession(): void {
    this.sessionsService.createSession().subscribe({
      next: () => {
        this.loadSessions(); // Reload sessions after creating a new one
      },
      error: (err) => {
        this.errorMessage = 'Failed to create a new session.';
        console.error(err);
      },
    });
  }
}
