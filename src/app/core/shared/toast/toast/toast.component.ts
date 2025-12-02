import { Component } from '@angular/core';
import { ToastService } from '../toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {

  messages = this.toastService.messages;

  constructor(private toastService: ToastService) {}

  remove(id: string) {
    this.toastService.remove(id);
  }

}
