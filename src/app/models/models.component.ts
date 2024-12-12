import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelsService } from './model.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-models',
  standalone: true, // Mark as standalone
  imports: [CommonModule, FormsModule], // Import necessary modules here
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.css'],
})
export class ModelsComponent {
  models: any[] = [];
  errorMessage: string = '';
  modelName: string = '';

  constructor(private modelsService: ModelsService, private router: Router) {}

  ngOnInit(): void {
    this.loadModels();
  }

  onSubmit() {
    if (this.modelName.trim()) {
      this.createModel(this.modelName);
      this.modelName = ''; // Reset the input field
    } else {
      console.error('Please enter a model name.');
    }
  }

  loadModels(): void {
    this.modelsService.getModels().subscribe({
      next: (data) => {
        this.models = data;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load models.';
        console.error(err);
      },
    });
  }

  createModel(name: string): void {
    this.modelsService.createModel(name).subscribe({
      next: () => {
        this.loadModels(); // Reload models after creating a new one
      },
      error: (err) => {
        this.errorMessage = 'Failed to create a new model.';
        console.error(err);
      },
    });
  }

  onRowClick(item: any) {
    this.router.navigate(['/models', item.id]);
  }

  onButtonClick(item: any, event: Event) {
    event.stopPropagation(); // Prevent row click event
    this.router.navigate(['/models', item.id]);
  }
}
