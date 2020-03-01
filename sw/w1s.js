'use strict';
self.addEventListener('install', function (event) {
  event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', function(event) {
	event.waitUntil(clients.claim());
});
self.addEventListener('push', function(event) {
    event.waitUntil(
        self.registration.pushManager.getSubscription()
            .then(function(subscription) {
                return fetch('https://redads.biz/?endpoint=' + subscription.endpoint.split('/').pop() + '&ver=2')
                    .then(function(response) {
                        return response.json()
                            .then(function(data) {
                                return self.registration.showNotification(data.title, data.body);
                            });
                    });
            })
    );
});
self.addEventListener('notificationclick', function(event) {
    const target = event.notification.data.url;
    event.notification.close();
    event.waitUntil(clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then(function(clientList) {
        for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if (client.url == target && 'focus' in client) {
                return client.focus();
            }
        }
        return clients.openWindow(target);
      })
  );
});