import { serve } from "bun";

const PORT = 3000;

// Serve the HTML content
serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/") {
      return new Response(
        `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Twitch Embed</title>
        </head>
        <body>
          <!-- Add a placeholder for the Twitch embed -->
          <div id="twitch-embed" style="width: 100%; height: 600px;"></div>

          <!-- Load the Twitch embed script -->
          <script src="https://player.twitch.tv/js/embed/v1.js"></script>

          <!-- Create a Twitch.Player object -->
          <script type="text/javascript">
            const player = new Twitch.Player("twitch-embed", {
              channel: "inoriijr",
              autoplay: true,
              muted: true, // Start muted to ensure autoplay works in most browsers
            });

            // Wait for the player to be ready
            player.addEventListener(Twitch.Player.READY, () => {
              player.setMuted(true); // Ensure mute is applied
              player.setQuality("160p"); // Attempt to set low quality
            });
          </script>
        </body>
        </html>
        `,
        {
          headers: {
            "Content-Type": "text/html",
          },
        }
      );
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running at http://localhost:${PORT}`);
