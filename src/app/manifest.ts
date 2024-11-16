import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tapas",
    short_name: "Tapas",
    description:
      "Tapas makes your life easy by letting you pay in crypto anywhere!",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#FF6947",
    icons: [
      {
        src: "/logo.256.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
