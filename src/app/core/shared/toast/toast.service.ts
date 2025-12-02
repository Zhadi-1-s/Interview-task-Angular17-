import { Injectable, signal } from '@angular/core';
import { ToastMessage } from '../../interfaces/toast.interface';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _messages = signal<ToastMessage[]>([]);
  messages = this._messages.asReadonly();

  private idCounter = 0;

  private add(message: string, type: 'success' | 'error' | 'info' | 'warning') {
    const msg: ToastMessage = {
      id: (++this.idCounter).toString(), // id теперь строка
      message,
      type
    };
    this._messages.update(msgs => [...msgs, msg]);
    setTimeout(() => this.remove(msg.id), 3000);
  }

  success(text: string) {
    this.add(text, 'success');
  }

  error(text: string) {
    this.add(text, 'error');
  }

  info(text: string) {
    this.add(text, 'info');
  }

  warning(text: string) {
    this.add(text, 'warning');
  }

  remove(id: string) {
    this._messages.update(msgs => msgs.filter(m => m.id !== id));
  }
}
