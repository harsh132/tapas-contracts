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
            className="marquee-item h-32 w-32 rounded-lg transition-all duration-300"
          >
            <img
              alt=""
              className="face-wobble h-16 w-16 rounded-xl p-0.5"
              src={`/faces/${face}.svg`}
              style={
                {
                  "--speed": `${Math.random() * 10 + 10}s`,
                  animationDelay: `-${Math.random() * 5}s`,
                } as CSSProperties
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
