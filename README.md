This is a React based example implementation of the printformer editor opened in a light-box and observation of the iframe.

## Getting Started

First, fill copy the `.env.example` into a `.env` and fill the credentials. Then run the development server:

```bash
npm install && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

```javascript
  const iframe = document.getElementById('editor-iframe');

  iframe.addEventListener('load', () => {
    try {
      const currentUrl = iframe.contentWindow.location.href;

      console.log('Iframe loaded:', currentUrl);

      // Detect when iframe navigates to your POST handler
      if (currentUrl.includes('/post-handler')) {
        console.log('Form was submitted and iframe navigated to our handler!');
        alert('Form submitted!');
      }
    } catch (e) {
      // Cross-origin iframe — can't access contentWindow
      console.warn('Still on third-party origin, cannot access iframe content');
    }
  });
```
For the callbacks to work you'll need something like ngrok:
```
docker run -it -e NGROK_AUTHTOKEN=YOUR_AUTH_TOKEN ngrok/ngrok:alpine http --host-header=rewrite host.docker.internal:3000
```
