var baudio = require('baudio');

// http://www.phy.mtu.edu/~suits/NoteFreqCalcs.html
var a = 1.059463094359;
function noteFreq(note, scale) {
   //A4 = 440Hz
   var n = halfStepsFromA4(note, scale);
   var freq = 440.0 * Math.pow(a, n);
   return freq;
}

function sin(freq, offset) {
   var offset = offset === undefined ? Math.random() * 999999: offset;
   return function(t) {
      return Math.sin((t + offset) * 2 * freq);
   };
}

function randomBetween(min, max) {
   return Math.random() * (max - min) + min;
}

function white(t) {
   return Math.random() * 2 - 1;
}


function combine(funcs) {
   return function(t) {
      var sum = funcs.reduce(function(sum, func) {
         return sum + func(t);
      }, 0);
      return sum / funcs.length;
   };
}

function volume(vol, func) {
   return function(t) {
      return vol * func(t);
   };
}

var notes = [
   'C', 'C#',
   'D', 'D#',
   'E',
   'F', 'F#',
   'G', 'G#',
   'A', 'A#',
   'B',
];

function halfStepsFromA4(note, scale) {
   return (scale - 4) * 12 + (notes.indexOf(note) - 9);
}



function redNoise(r) {
   var lastRed = undefined;
   var rM = Math.pow(1.0 - Math.pow(r, 2.0), 0.5);

   return function(t) {
      if (lastRed === undefined) {
         return lastRed = white(t);
      }

      return lastRed = r * lastRed + rM * white(t);
   }
}

var mySound = combine([
/*
   volume(0.9,
      combine([
         sin(noteFreq('C', 3)),
         sin(noteFreq('E', 3)),
         sin(noteFreq('G', 3)),

         sin(noteFreq('C', 4)),
         sin(noteFreq('E', 4)),
         sin(noteFreq('G', 4)),
      ])
   ),
   white,
*/
   redNoise(0.92),
]);

var b = baudio(mySound);
b.play()
