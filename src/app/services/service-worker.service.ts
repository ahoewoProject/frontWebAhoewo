import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceWorkerService {

  constructor() { }

  requestPermission() {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      } else {
        console.log('Notification permission denied.');
      }
    });
  }

  showNotification(title: string, body: string, iconUrl?: string) {
    if (!('Notification' in window)) {
      console.log('Notifications not supported in this browser.');
      return;
    }

    if (Notification.permission === 'granted') {
      const notificationOptions: NotificationOptions = {
        body: body
      };

      if (iconUrl) {
        notificationOptions.icon = iconUrl;
      }

      new Notification(title, notificationOptions);
    } else if (Notification.permission !== 'denied') {
      this.requestPermission();
    }
  }
}
