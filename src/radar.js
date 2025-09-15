const a = 2 * Math.PI / 6;
export function drawHexagon(ctx, x, y, r=30) {
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
      ctx.lineTo(x+ r * Math.sin(a * i), y + r * Math.cos(a * i));
    }
    ctx.closePath();
    ctx.stroke();
  }

export function drawRadar(ctx, x, y, r=[30,40,20,30,30,30], color="black", fillcolor="rgba(255, 255, 255, 1)") {
    ctx.strokeStyle = color;
    ctx.fillStyle = fillcolor;
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
      ctx.lineTo(x+ r[i] * Math.sin(a * i), y + r[i] * Math.cos(a * i));
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }


