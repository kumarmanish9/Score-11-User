import React, { useEffect, useRef, useCallback, useState } from 'react';

const WagonWheel = ({ 
  shotData = {}, 
  onShotChange, 
  height = 450, 
  replayShots = [],
  batsmanStats = { runs: 0, balls: 0, fours: 0, sixes: 0 },
  onShotAdd,
  visualOnly = false // NEW: Disable API callbacks for visual use
}) => {
  const canvasRef = useRef(null);
  const [shots, setShots] = useState([]);
  const [selectedDirection, setSelectedDirection] = useState(null);
  const fieldCenter = useRef({ x: 0, y: 0 });
  const animationRef = useRef(null);

  // Shot direction mapping with angles and labels
  const shotZones = [
    { name: 'Third Man', angle: 135, region: 'thirdman', color: '#4CAF50', runs: [1, 2] },
    { name: 'Point', angle: -135, region: 'point', color: '#2196F3', runs: [1, 2] },
    { name: 'Cover', angle: -45, region: 'cover', color: '#FF9800', runs: [2, 3] },
    { name: 'Off Side', angle: -20, region: 'offside', color: '#9C27B0', runs: [1, 2, 3] },
    { name: 'Straight', angle: 0, region: 'straight', color: '#F44336', runs: [1, 2, 3, 4] },
    { name: 'Mid Wicket', angle: 30, region: 'midwicket', color: '#00BCD4', runs: [2, 4] },
    { name: 'Square Leg', angle: 60, region: 'squareleg', color: '#E91E63', runs: [1, 2] },
    { name: 'Fine Leg', angle: 120, region: 'finelog', color: '#8BC34A', runs: [1] },
    { name: 'Long On', angle: 10, region: 'longon', color: '#FF5722', runs: [4, 6] },
    { name: 'Long Off', angle: -10, region: 'longoff', color: '#3F51B5', runs: [4, 6] }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      fieldCenter.current.x = canvas.width / 2;
      fieldCenter.current.y = canvas.height / 2;
      drawFullField();
    });

    resizeObserver.observe(canvas);
    
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    drawFullField();
  }, [shots, replayShots, shotData, batsmanStats]);

  const drawFullField = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = fieldCenter.current.x;
    const centerY = fieldCenter.current.y;
    const radius = Math.max(50, Math.min(centerX, centerY) - 30);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grass gradient background
    const grassGrd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grassGrd.addColorStop(0, '#2E7D32');
    grassGrd.addColorStop(0.5, '#388E3C');
    grassGrd.addColorStop(1, '#1B5E20');
    ctx.fillStyle = grassGrd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grass lines (pitch patterns)
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 1;
    for (let i = -5; i <= 5; i++) {
      ctx.beginPath();
      ctx.moveTo(centerX + i * 20, centerY - radius);
      ctx.lineTo(centerX + i * 20, centerY + radius);
      ctx.stroke();
    }
    
    // Boundary rope
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#FF6B35';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 15]);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Boundary rope effect (inner shadow)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 2, 0, 2 * Math.PI);
    ctx.strokeStyle = '#FF8C42';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 30-yard circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.45, 0, 2 * Math.PI);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 10]);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // 15-yard circle (inner)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.25, 0, 2 * Math.PI);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 8]);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Pitch (green strip)
    ctx.fillStyle = '#6B8E23';
    ctx.shadowBlur = 0;
    ctx.fillRect(centerX - 25, centerY - radius * 0.35, 50, radius * 0.7);
    
    // Pitch lines
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - 25, centerY);
    ctx.lineTo(centerX + 25, centerY);
    ctx.stroke();
    
    // Bowling crease
    ctx.beginPath();
    ctx.moveTo(centerX - 35, centerY - radius * 0.3);
    ctx.lineTo(centerX + 35, centerY - radius * 0.3);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(centerX - 35, centerY + radius * 0.3);
    ctx.lineTo(centerX + 35, centerY + radius * 0.3);
    ctx.stroke();
    
    // Stumps at both ends
    drawStumps(ctx, centerX, centerY - radius * 0.35);
    drawStumps(ctx, centerX, centerY + radius * 0.35);
    
    // Shot zones (sectors)
    shotZones.forEach(zone => {
      const angleRad = (zone.angle * Math.PI) / 180;
      const startAngle = angleRad - Math.PI / 12;
      const endAngle = angleRad + Math.PI / 12;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius * 0.7, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = `${zone.color}15`;
      ctx.fill();
      
      // Zone label
      const labelRadius = radius * 0.55;
      const labelX = centerX + Math.cos(angleRad) * labelRadius;
      const labelY = centerY + Math.sin(angleRad) * labelRadius;
      
      ctx.font = 'bold 10px "Outfit", sans-serif';
      ctx.fillStyle = '#FFFFFFCC';
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'black';
      ctx.fillText(zone.name, labelX - 15, labelY - 5);
      ctx.shadowBlur = 0;
    });
    
    // Draw all shots
    [...shots, ...replayShots].forEach((shot, idx) => {
      if (shot.direction || shot.region) {
        drawShotOnField(ctx, shot, idx, radius);
      }
    });
    
    // Draw current shot if exists
    if (shotData && (shotData.direction || shotData.region)) {
      drawShotOnField(ctx, shotData, 'current', radius, true);
    }
    
    // Draw batsman at center
    drawBatsman(ctx, centerX, centerY);
    
    // Draw fielders (dots on field)
    drawFielders(ctx, centerX, centerY, radius);
  };

  const drawStumps = (ctx, x, y) => {
    ctx.fillStyle = '#D2B48C';
    ctx.shadowBlur = 0;
    for (let i = -1; i <= 1; i++) {
      ctx.fillRect(x + i * 2, y - 8, 2, 12);
    }
    // Bails
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - 3, y - 9, 7, 2);
  };

  const drawBatsman = (ctx, x, y) => {
    // Bat
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x + 8, y - 5, 4, 20);
    ctx.fillStyle = '#D2B48C';
    ctx.fillRect(x + 8, y + 5, 4, 12);
    
    // Helmet
    ctx.fillStyle = '#1565C0';
    ctx.beginPath();
    ctx.ellipse(x, y - 8, 10, 12, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Face
    ctx.fillStyle = '#FFCC80';
    ctx.beginPath();
    ctx.ellipse(x, y - 6, 7, 9, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Helmet grille
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - 5, y - 8);
    ctx.lineTo(x + 5, y - 8);
    ctx.stroke();
    
    // Eyes
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(x - 3, y - 8, 1, 0, 2 * Math.PI);
    ctx.arc(x + 3, y - 8, 1, 0, 2 * Math.PI);
    ctx.fill();
  };

  const drawFielders = (ctx, centerX, centerY, radius) => {
    const fielderPositions = [
      { angle: 0, dist: 0.5 },     // Long On/Off
      { angle: 45, dist: 0.55 },
      { angle: 90, dist: 0.6 },
      { angle: 135, dist: 0.5 },
      { angle: 180, dist: 0.55 },
      { angle: 225, dist: 0.6 },
      { angle: 270, dist: 0.5 },
      { angle: 315, dist: 0.55 },
    ];
    
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowBlur = 2;
    fielderPositions.forEach(pos => {
      const angleRad = (pos.angle * Math.PI) / 180;
      const x = centerX + Math.cos(angleRad) * radius * pos.dist;
      const y = centerY + Math.sin(angleRad) * radius * pos.dist;
      
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#E0E0E0';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
    });
  };

  const drawShotOnField = (ctx, shot, idx, radius, isCurrent = false) => {
    const centerX = fieldCenter.current.x;
    const centerY = fieldCenter.current.y;
    
    const zone = shotZones.find(z => 
      z.region === (shot.direction || shot.region)
    ) || shotZones[4];
    
    const angleRad = (zone.angle * Math.PI) / 180;
    const distance = Math.min((shot.distance || shot.runs === 6 ? 85 : shot.runs === 4 ? 75 : 40) / 100, 0.95);
    const endX = centerX + Math.cos(angleRad) * radius * distance;
    const endY = centerY + Math.sin(angleRad) * radius * distance;
    
    // Shot line
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(endX, endY);
    
    // Color based on runs
    let color;
    if (shot.runs === 6) color = '#FF4444';
    else if (shot.runs === 4) color = '#FFD700';
    else if (shot.runs === 3) color = '#FF9800';
    else if (shot.runs === 2) color = '#4CAF50';
    else color = '#2196F3';
    
    ctx.strokeStyle = color;
    ctx.lineWidth = isCurrent ? 5 : 3;
    ctx.setLineDash(isCurrent ? [8, 6] : []);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Shot end marker
    ctx.fillStyle = color;
    ctx.shadowBlur = 4;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.arc(endX, endY, isCurrent ? 10 : 7, 0, 2 * Math.PI);
    ctx.fill();
    
    // Run indicator
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px "Syne", sans-serif';
    ctx.shadowBlur = 2;
    ctx.fillText(shot.runs || '•', endX - 5, endY + 5);
    ctx.shadowBlur = 0;
  };

  const handleCanvasClick = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    const dx = x - fieldCenter.current.x;
    const dy = y - fieldCenter.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    // Find closest shot zone
    let closestZone = shotZones[0];
    let minDiff = 180;
    
    shotZones.forEach(zone => {
      let diff = Math.abs(angle - zone.angle);
      diff = Math.min(diff, 360 - diff);
      if (diff < minDiff) {
        minDiff = diff;
        closestZone = zone;
      }
    });
    
    // Calculate runs based on distance
    const maxRadius = Math.min(fieldCenter.current.x, fieldCenter.current.y) - 30;
    const distancePercent = distance / maxRadius;
    let runs = 1;
    if (distancePercent > 0.85) runs = 6;
    else if (distancePercent > 0.7) runs = 4;
    else if (distancePercent > 0.5) runs = 3;
    else if (distancePercent > 0.3) runs = 2;
    
    const newShot = {
      id: Date.now(),
      region: closestZone.region,
      direction: closestZone.region,
      distance: distancePercent * 100,
      runs: runs,
      angle: closestZone.angle,
      timestamp: new Date()
    };
    
    setSelectedDirection(closestZone.region);
    setShots(prev => [...prev, newShot]);
    
    if (!visualOnly) {
      if (onShotChange) {
        onShotChange(newShot);
      }
      
      if (onShotAdd) {
        onShotAdd(newShot);
      }
    }
    
    // Animate shot
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    drawFullField();
  }, [onShotChange, onShotAdd]);

  const clearShots = () => {
    setShots([]);
    setSelectedDirection(null);
    drawFullField();
  };

  const getShotStats = () => {
    const stats = {
      total: shots.length,
      runs: shots.reduce((sum, s) => sum + (s.runs || 0), 0),
      fours: shots.filter(s => s.runs === 4).length,
      sixes: shots.filter(s => s.runs === 6).length,
      ones: shots.filter(s => s.runs === 1).length,
      twos: shots.filter(s => s.runs === 2).length,
      threes: shots.filter(s => s.runs === 3).length,
    };
    stats.strikeRate = stats.total > 0 ? ((stats.runs / stats.total) * 100).toFixed(1) : 0;
    return stats;
  };

  const shotStats = getShotStats();

  return (
    <div className="wagon-wheel-container" style={{ width: '100%', maxWidth: '650px', margin: '0 auto' }}>
      <div className="position-relative">
        <canvas
          ref={canvasRef}
          className="w-100 rounded-4 shadow-lg cursor-pointer"
          style={{ 
            height: `${height}px`, 
            cursor: 'crosshair',
            backgroundColor: '#1B5E20',
            borderRadius: '20px'
          }}
          onClick={handleCanvasClick}
        />
        
        {/* Overlay instructions */}
        <div className="position-absolute top-0 start-50 translate-middle-x mt-3 px-3 py-1 bg-dark bg-opacity-75 text-white small rounded-pill shadow" style={{ fontSize: '11px', backdropFilter: 'blur(4px)', zIndex: 10 }}>
          🎯 Click on field to place shot • Colored dots show runs
        </div>
        
        {/* Shot zone indicator */}
        {selectedDirection && (
          <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 px-3 py-1 bg-primary text-white small rounded-pill shadow" style={{ fontSize: '12px', zIndex: 10 }}>
            Last shot: {selectedDirection.toUpperCase()} region
          </div>
        )}
      </div>
      
      {/* Shot Statistics */}
      <div className="mt-4 p-3 bg-white rounded-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0 fw-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
            🏏 Shot Analysis
          </h6>
          <button 
            onClick={clearShots}
            className="btn btn-sm btn-outline-danger rounded-pill px-3"
            style={{ fontSize: '12px' }}
          >
            Clear All
          </button>
        </div>
        
        <div className="row g-3">
          <div className="col-4 col-md-3">
            <div className="text-center p-2 bg-light rounded-3">
              <div className="fs-4 fw-bold text-primary">{shotStats.total}</div>
              <div className="small text-muted">Shots</div>
            </div>
          </div>
          <div className="col-4 col-md-3">
            <div className="text-center p-2 bg-light rounded-3">
              <div className="fs-4 fw-bold text-success">{shotStats.runs}</div>
              <div className="small text-muted">Runs</div>
            </div>
          </div>
          <div className="col-4 col-md-3">
            <div className="text-center p-2 bg-light rounded-3">
              <div className="fs-4 fw-bold text-warning">{shotStats.fours}</div>
              <div className="small text-muted">Fours</div>
            </div>
          </div>
          <div className="col-4 col-md-3">
            <div className="text-center p-2 bg-light rounded-3">
              <div className="fs-4 fw-bold text-danger">{shotStats.sixes}</div>
              <div className="small text-muted">Sixes</div>
            </div>
          </div>
          <div className="col-4 col-md-3">
            <div className="text-center p-2 bg-light rounded-3">
              <div className="fs-4 fw-bold text-info">{shotStats.strikeRate}</div>
              <div className="small text-muted">S/R</div>
            </div>
          </div>
          <div className="col-4 col-md-3">
            <div className="text-center p-2 bg-light rounded-3">
              <div className="fs-4 fw-bold text-secondary">{shotStats.ones}</div>
              <div className="small text-muted">1s</div>
            </div>
          </div>
          <div className="col-4 col-md-3">
            <div className="text-center p-2 bg-light rounded-3">
              <div className="fs-4 fw-bold text-secondary">{shotStats.twos}</div>
              <div className="small text-muted">2s</div>
            </div>
          </div>
          <div className="col-4 col-md-3">
            <div className="text-center p-2 bg-light rounded-3">
              <div className="fs-4 fw-bold text-secondary">{shotStats.threes}</div>
              <div className="small text-muted">3s</div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .wagon-wheel-container canvas {
          transition: transform 0.2s ease;
        }
        .wagon-wheel-container canvas:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default WagonWheel;