import React from "react";

function BallByBall({ timeline, loading }) {

  if (loading) return <p>Loading commentary...</p>;
  if (!Array.isArray(timeline) || timeline.length === 0)
    return <p>No commentary available</p>;

  return (
    <div>
      {timeline.map((item, i) => (
        <p key={i}>
          {item.over}.{item.ball} - {item.text}
        </p>
      ))}
    </div>
  );
}

export default BallByBall;