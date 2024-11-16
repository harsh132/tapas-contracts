import { CSSProperties } from "react";

const faces = [
  "angy",
  "awe",
  "blep",
  "grin",
  "jawdrop",
  "smirk",
  "sweet",
  "unamused",
  "wink",
];

const Marquee = ({ direction }: { direction: "forwards" | "reverse" }) => {
  return (
    <div
      className="marquee fadeout-horizontal w-full"
      style={
        {
          "--num-items": 9,
          "--item-width": "4rem",
          "--item-gap": "2rem",
          "--speed": "60s",
          "--direction": direction,
        } as CSSProperties
      }
    >
      <div className="marquee-track h-16">
        {faces.map((face, index) => (
          <div
            key={index}
            style={
              {
                "--item-position": index + 1,
              } as CSSProperties
            }
            className="marquee-item h-16 w-16 overflow-hidden rounded-lg transition-all duration-300"
          >
            <img
              alt=""
              className="h-16 w-16 p-0.5"
              src={`/faces/${face}.svg`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
