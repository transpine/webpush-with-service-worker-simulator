self.addEventListener('push', function (event) {
    const data = JSON.parse(event.data.text());
    
    event.waitUntil( async function() {
        self.registration.showNotification( data.title, {
            body: data.message
        })
    }());

});