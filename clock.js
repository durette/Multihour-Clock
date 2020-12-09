// Multihour-Clock World Clock
// https://github.com/durette/Multihour-Clock


var earthImage = new Image();
earthImage.src = 'earth_from_north.png';
earthImage.width = 534;
earthImage.height = 534;


var canvas = document.getElementById("clockCanvas");
var ctx = canvas.getContext("2d");
var radius = canvas.height / 2;

ctx.translate(radius, radius);

setInterval(drawClock, 1000);

var clockHours = 24;
var clockDirection = -1;


function drawClock() {
   drawFace(ctx, radius);
   drawNumbers(ctx, radius);
   drawTime(ctx, radius);
}

function drawFace(ctx, radius) {
   var grad;
   var oldStrokeStyle;
   ctx.beginPath();
   ctx.arc(0, 0, radius, 0, 2*Math.PI);

   ctx.fillStyle = 'rgba(240, 240, 240, 1)';
   ctx.fill();

   ctx.translate(-74, -37);
   ctx.fill();
   ctx.translate(74, 37);

   grad = ctx.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);
   grad.addColorStop(0,    'rgb(128, 10, 41)');
   grad.addColorStop(0.39, 'rgb(128, 10, 41)');
   grad.addColorStop(0.4,  'rgb(211, 17, 69)');
   grad.addColorStop(0.6,  'rgb(211, 17, 69)');
   grad.addColorStop(0.69, 'rgb(128, 10, 41)');
   grad.addColorStop(0.70, 'rgb(0, 0, 0)');
   grad.addColorStop(1,    'rgb(0, 0, 0)');
   oldStrokeStyle = ctx.strokeStyle;
   ctx.strokeStyle = grad;
   ctx.lineWidth = radius*0.08;
   ctx.beginPath();
   ctx.fill();
   ctx.strokeStyle = oldStrokeStyle;
}

function drawNumbers(ctx, radius) {
   var ang;
   var num;
   ctx.fillStyle = 'rgb(62, 57, 53)';
   ctx.strokeStyle = 'rgb(62, 57, 53)';
   ctx.font = radius * 2 / clockHours + "px Franklin Gothic Book";
   ctx.textBaseline="middle";
   ctx.textAlign="center";
   for (num = 0; num < clockHours; num++) {
      ang = num * Math.PI * 2 * clockDirection / clockHours;
      ctx.rotate(ang);
      ctx.translate(0, -radius*0.85);
      ctx.rotate(-ang);
      ctx.fillText(num.toString(), 0, 0);
      ctx.rotate(ang);
      ctx.translate(0, radius*0.85);
      ctx.rotate(-ang);
   }
}

function drawTime(ctx, radius) {
   var nowUtc = new Date();

   function isEuDstObserved() {
      // BST and CEST begin at 01:00 GMT on the last Sunday of March
      var aprilFirst = new Date(nowUtc.getUTCFullYear(), 3, 1, 1, 0, 0, 0);
      var aprilFirstWeekday = aprilFirst.getDay();
      var aprilFirstWeekday = aprilFirstWeekday === 0 ? 7 : aprilFirstWeekday;
      var lastSundayOfMarch = aprilFirst;
      lastSundayOfMarch.setDate(aprilFirst.getDate() - aprilFirstWeekday);

      // BST and CEST end at 01:00 GMT (02:00 BST) on the last Sunday of October.
      var novemberFirst = new Date(nowUtc.getUTCFullYear(), 10, 1, 1, 0, 0, 0);
      var novemberFirstWeekday = novemberFirst.getDay();
      var novemberFirstWeekday = novemberFirstWeekday === 0 ? 7 : novemberFirstWeekday;
      var lastSundayOfOctober = novemberFirst;
      lastSundayOfOctober.setDate(novemberFirst.getDate() - novemberFirstWeekday);

      if (nowUtc.getTime() < lastSundayOfMarch.getTime()) {
         return false;
      } else if (nowUtc.getTime() > lastSundayOfOctober.getTime()) {
         return false;
      } else {
         return true;
      }
   }

   function isUsDstObserved() {
      // US Daylight Time starts on the second Sunday in March
      var marchFirst = new Date(nowUtc.getUTCFullYear(), 2, 1);
      var marchFirstWeekday = marchFirst.getDay();
      var daysAfterMarchFirst = marchFirstWeekday === 0 ? 8 : 15 - marchFirstWeekday;
      var secondSundayMarch = marchFirst;
      secondSundayMarch.setDate(secondSundayMarch.getDate() + daysAfterMarchFirst);

      // US Daylight Time ends on the first Sunday in November
      var novemberFirst = new Date(nowUtc.getUTCFullYear(), 2, 1);
      var novemberFirstWeekday = novemberFirst.getDay();
      var daysAfterNovemberFirst = novemberFirstWeekday === 0 ? 1 : 8 - novemberFirstWeekday;
      var firstSundayNovember = novemberFirst;
      firstSundayNovember.setDate(novemberFirst.getDate() + daysAfterNovemberFirst);

      if (nowUtc.getTime() < secondSundayMarch.getTime()) {
         return false;
      } else if (nowUtc.getTime() > firstSundayNovember.getTime()) {
         return false;
      } else {
         return true;
      }
   }

   utcHourAngle =
      ((nowUtc.getTime() % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60 * 24))
      * 2 * Math.PI
      * (24 / clockHours)
      * clockDirection;
   drawEarth(ctx, utcHourAngle, radius * 0.7);

   var timeZones = [
      {'showSeconds': false,
       'handColor': 'rgb(222, 41, 16)',
       'textColor': 'rgb(255, 255, 255)',
       'utcOffset': 8,
       'name': 'CN'},
      {'showSeconds': false,
       'handColor': 'rgb(236, 117, 0)',
       'textColor': 'rgb(255, 255, 255)',
       'utcOffset':5.5,
       'name':'LK'},
      {'showSeconds':false,
       'handColor': 'rgb(135, 62, 141)',
       'textColor': 'rgb(255, 255, 255)',
       'utcOffset':isUsDstObserved() ? -5 : -6,
       'name':'CT'},
      {'showSeconds':false,
       'handColor': 'rgb(0, 0, 102)',
       'textColor': 'rgb(255, 255, 255)',
       'utcOffset':isEuDstObserved() ?  1 :  0,
       'name':'UK'},
      {'showSeconds':false,
       'handColor': 'rgb(211, 17, 69)',
       'textColor': 'rgb(255, 255, 255)',
       'utcOffset':isUsDstObserved() ? -4 : -5,
       'name':'ET'},
      {'showSeconds':false,
       'handColor': 'rgb(0, 0, 0)',
       'textColor': 'rgb(0, 255, 0)',
       'utcOffset':-7,
       'name':'AZ'},
      {'showSeconds':true,
       'handColor': 'rgb(8, 94, 5)',
       'textColor': 'rgb(255, 255, 255)',
       'utcOffset':isUsDstObserved() ? -7 : -8,
       'name':'PT'}
   ];

   timeZones.forEach(drawTimeZone);
}

function drawTimeZone(timeZone) {
   Date.prototype.addHours = function(h) {
      this.setTime(this.getTime() + (h*60*60*1000));
      return this;
   }

   var nowUtc = new Date();
   localTime = nowUtc.addHours(timeZone['utcOffset']);

   local_time_string =
      (localTime.getUTCHours() % clockHours).toString().padStart(2, '0')
      + ':'
      + localTime.getUTCMinutes().toString().padStart(2, '0');

   if (timeZone['showSeconds']) {
      local_time_string += ':' + localTime.getUTCSeconds().toString().padStart(2, '0')
   }

   var localHourAngle = ((localTime.getTime() % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60 * 24)) * 2 * Math.PI * (24 / clockHours) * clockDirection;
   drawHand(ctx, localHourAngle, radius*0.5,  radius*0.09, timeZone['handColor']);
   drawHandText(ctx, localHourAngle, radius * 0.07, radius * 0.6, timeZone['name'] + ' ' + local_time_string, timeZone['textColor']);
}

function drawEarth(ctx, angle, radius) {
   //var img = document.getElementById("earth");
   drawAngle = angle + -150 * Math.PI / 180;
   ctx.moveTo(0,0);
   ctx.rotate(drawAngle);
   //ctx.drawImage(img, -radius, -radius, radius * 2, radius * 2);
   ctx.drawImage(earthImage, -radius, -radius, radius * 2, radius * 2);
   ctx.rotate(-drawAngle);
   ctx.fillStyle = 'rgba(62, 57, 53, 0.4)';
   ctx.beginPath();
   ctx.arc(0, 0, radius, Math.PI, 0);
   ctx.fill();
}

function drawHand(ctx, pos, length, width, strokeStyle) {
   ctx.strokeStyle = strokeStyle;
   ctx.beginPath();
   ctx.lineWidth = width;
   ctx.lineCap = "round";
   ctx.moveTo(0,0);
   ctx.rotate(pos);
   ctx.lineTo(0, -length);
   ctx.stroke();
   ctx.rotate(-pos);
}

function drawHandText(ctx, angle, fontSize, radius, text, strokeStyle) {
   ctx.strokeStyle = strokeStyle;
   ctx.fillStyle = strokeStyle;
   ctx.font = fontSize + "px Franklin Gothic Book";
   ctx.textBaseline="middle";
   ctx.rotate(angle);
   ctx.translate(0, -radius*0.85);
   if ((angle + Math.PI * 2) % (Math.PI * 2) < Math.PI) {
      // Right side of clock
      ctx.textAlign="right";
      ctx.rotate(Math.PI*3/2);
      ctx.fillText(text, 0, 0);
      ctx.rotate(-Math.PI*3/2);
   }
   else {
      // Left side of clock
      ctx.textAlign="left";
      ctx.rotate(Math.PI/2);
      ctx.fillText(text, 0, 0);
      ctx.rotate(-Math.PI/2);
   }
   ctx.translate(0, radius*0.85);
   ctx.rotate(-angle);
}
