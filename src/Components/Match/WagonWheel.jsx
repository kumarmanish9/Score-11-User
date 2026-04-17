import React, { useEffect, useRef, useCallback } from 'react';

const WagonWheel = ({ shotData = {}, onShotChange, height = 400, replayShots = [] }) => {
  const canvasRef = useRef(null);
  const fieldCenter = { x: 0, y: 0 };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    fieldCenter.x = canvas.width / 2;
    fieldCenter.y = canvas.height / 2;
    
    drawField(ctx);
    if (shotData.direction) drawShot(ctx, shotData);
    replayShots.forEach(shot => drawShot(ctx, shot, 0.5));
  }, [shotData, replayShots]);

  const drawField = (ctx) => {
    const centerX = fieldCenter.x;
    const centerY = fieldCenter.y;
    const pitchLength = 60;
    const pitchWidth = 10;
    const boundaryRadius = 180;

    // Boundary circle
    ctx.strokeStyle = '#FF6B35';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(centerX, centerY, boundaryRadius, 0, 2 * Math.PI);
    ctx.stroke();

    // Pitch
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(centerX - pitchWidth/2, centerY - pitchLength/2, pitchWidth, pitchLength);

    // Wickets
    ctx.fillStyle = '#D2B48C';
    ctx.fillRect(centerX - 2, centerY - pitchLength/2 - 4, 4, 8);
    ctx.fillRect(centerX - 2, centerY + pitchLength/2 - 4, 4, 8);

    // Deep field markers
    ctx.fillStyle = '#90EE90';
    const sectors = 8;
    for (let i = 0; i < sectors; i++) {
      const angle = (i / sectors) * 2 * Math.PI;
      const x = centerX + Math.cos(angle) * boundaryRadius * 0.7;
      const y = centerY + Math.sin(angle) * boundaryRadius * 0.7;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const drawShot = (ctx, shot, opacity = 1) => {
    const { direction = 'straight', distance = 50 } = shot;
    const angleMap = {
      'straight': 0,
      'cover': -Math.PI/4,
      'midwicket': -Math.PI/6,
      'squareleg': -Math.PI/3,
      'finelog': -2*Math.PI/3,
      'thirdman': Math.PI/3,
      'point': -Math.PI/6,
      'offside': Math.PI/4,
      'silymid': Math.PI/2
    };
    
    const angle = angleMap[direction] || 0;
    const radius = Math.min(distance * 2.5, 180);
    
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = distance > 60 ? '#FFD700' : distance > 30 ? '#FFA500' : '#FF4500';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.setLineDash([5, 5]);
    
    ctx.beginPath();
    ctx.moveTo(fieldCenter.x, fieldCenter.y);
    ctx.lineTo(
      fieldCenter.x + Math.cos(angle) * radius,
      fieldCenter.y + Math.sin(angle) * radius
    );
    ctx.stroke();
    
    // Shot end marker
    ctx.fillStyle = ctx.strokeStyle;
    ctx.beginPath();
    ctx.arc(
      fieldCenter.x + Math.cos(angle) * radius,
      fieldCenter.y + Math.sin(angle) * radius,
      8, 0, 2 * Math.PI
    );
    ctx.fill();
    
    ctx.restore();
  };

  const handleCanvasClick = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const dx = x - fieldCenter.x;
    const dy = y - fieldCenter.y;
    const distance = Math.sqrt(dx*dx + dy*dy);
    const angle = Math.atan2(dy, dx);
    
    // Map angle to direction
    const directionMap = [
      'cover', 'point', 'offside', 'silymid', 
      'thirdman', 'finelog', 'squareleg', 'midwicket'
    ];
    const sector = Math.floor(((angle + Math.PI) / (2 * Math.PI)) * 8);
    const direction = directionMap[sector % 8] || 'straight';
    
    onShotChange({
      direction,
      distance: Math.min(distance / 2.5, 100)
    });
  }, [onShotChange]);

  return (
    <div className="wagon-wheel-container position-relative">
      <canvas
        ref={canvasRef}
        className="w-100 border rounded shadow-sm cursor-pointer"
        style={{ height: `${height}px`, cursor: 'crosshair' }}
        onClick={handleCanvasClick}
        title="Click to select shot direction"
      />
      <div className="position-absolute top-0 start-50 translate-middle-x mt-2 px-3 py-1 bg-dark bg-opacity-75 text-white small rounded-pill shadow">
        Drag/Click to set shot direction • Orange=Boundary • Yellow=4 • Red=6
      </div>
    </div>
  );
};

export default WagonWheel;

