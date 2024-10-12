console.log('Hello world');

fetch('/api/')
    .then(res => {
          if (!res.ok) {
              throw new Error('Bad response');
          }

          return res.json();
    })
    .then(console.log);
