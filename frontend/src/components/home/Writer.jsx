import React, { useState, useEffect } from "react";

const Writer = ({ text, speed = 10 }) => {
  const [typedText, setTypedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setTypedText((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [index, text, speed]);

  return (
    <div
      className="typed-text"
      style={{
        whiteSpace: "pre-wrap",
        borderRight: "2px solid #333",
        padding: "10px",
      }}
    >
      {typedText}
    </div>
  );
};

export default Writer;
