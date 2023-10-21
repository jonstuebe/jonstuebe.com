import React, { useRef, useCallback, PropsWithChildren } from "react";

export interface ParallaxCardProps {
  imageUrl: string;
  title: string;
  description: string;
  className?: string;
}

const ParallaxCard: React.FC<PropsWithChildren<ParallaxCardProps>> = ({
  imageUrl,
  title,
  description,
  className,
  children,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (cardRef.current) {
        const { left, top, width, height } =
          cardRef.current.getBoundingClientRect();
        const mouseX = event.clientX - left;
        const mouseY = event.clientY - top;
        const rotateY = (mouseX / width - 0.5) * 20;
        const rotateX = -(mouseY / height - 0.5) * 20;
        const transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        cardRef.current.style.transform = transform;
        cardRef.current.classList.add("hovered");

        const lightX = (mouseX / width) * 100;
        const lightY = (mouseY / height) * 100;
        const gradient = `radial-gradient(circle at ${lightX}% ${lightY}%, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0) 40%)`;
        cardRef.current.style.backgroundImage = gradient;
      }
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1.0)";
      cardRef.current.classList.remove("hovered");
      cardRef.current.style.backgroundImage = "none";
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className={
        "rounded-md bg-gray-800 md:h-64 sm:h-80 h-64 border border-solid border-gray-700 hover:shadow-sm motion-safe:transition motion-safe:transform overflow-hidden relative flex items-center justify-center" +
        " " +
        (className || "")
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute w-full h-full absolute-center">
        <img
          src={imageUrl}
          alt={description}
          className={"absolute w-full h-full absolute-center object-fit"}
          decoding="async"
        />
      </div>

      <div className="absolute w-full h-full bg-black opacity-50 pointer-events-none absolute-center"></div>
      <div className="absolute bottom-0 left-0 w-full pointer-events-none opacity-20 bg-gradient-to-t from-black via-black to-transparent h-1/2"></div>
      <h2 className="relative font-semibold w-3/4 text-4xl leading-none tracking-tight text-center text-white select-none">
        {title}
      </h2>
      {children}
      {/* <div
        style={{
          position: "absolute",
          bottom: "0",
          padding: "20px",
          background: "rgba(0, 0, 0, 0.5)",
          color: "white",
          width: "100%",
        }}
      >
        <p>{description}</p>
      </div> */}
    </div>
  );
};

export default ParallaxCard;
