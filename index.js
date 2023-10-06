const prompt = require('prompt-sync')({ sigint: true });
const fragor = require('./fragor.json');
const fs = require('fs');
let runFormAgain = true;

while (runFormAgain) {
  const userName = prompt('Vad heter du? ');

  console.log(`Välkommen ${userName}! Du kommer att göra ett test för att se vilket 
djur som passar dig bäst mellan hund, katt, kanin och fisk.
Svara genom att göra ett val mellan 1 och 2 tryck sedan enter när du gjort ditt val!

Nu börjar testet lycka till!`);

  let points = [0, 0, 0, 0];

  for (let i = 0; i < fragor.length; i++) {
    let igen = true;
    while (igen == true) {
      console.log(fragor[i].fragor);
      const svarsAlternativ = prompt('1.Ja 2.Nej ');

      switch (svarsAlternativ) {
        case '1':
          for (let a = 0; a < points.length; a++) {
            points[a] += fragor[i].ja[a];
          }
          igen = false;
          break;
        case '2':
          for (let a = 0; a < points.length; a++) {
            points[a] += fragor[i].nej[a];
          }
          igen = false;
          break;
        default:
          console.log('Valet finns inte! Skriv in 1 eller 2 för att fortsätta!');
      }
    }
    console.log(points);
  }

  const totalPoints = points.reduce((a, b) => a + b, 0);

  const djur = ['Hund', 'Katt', 'Kanin', 'Fisk'];
  const maxPointIndex = points.indexOf(Math.max(...points));
  const array = [];
  for (let i = 0; i < djur.length; i++) {
    const percentage = (points[i] / totalPoints * 100).toFixed(2);
    array[i] = {
      djur: djur[i],
      score: points[i],
      percentage: `${percentage}%`
    };
  }

  array.sort((a, b) => b.score - a.score);
  console.log(array);
  console.log(`${userName}, Det djuret som passar dig bäst är ${djur[maxPointIndex]}!`);
  console.log(`Dina resultat i procent: Hund: ${array[0].percentage} Katt: ${array[1].percentage} Kanin: ${array[2].percentage} Fisk: ${array[3].percentage}`);

  let allUsers;
  try {
    allUsers = JSON.parse(fs.readFileSync('./svar.json', 'utf8'));
    if (typeof allUsers !== 'object') {
      allUsers = {};
    }
  } catch {
    allUsers = {};
  }

  if (allUsers[userName]) {
    allUsers[userName].push({
      scores: array,
      date: new Date().toLocaleString()
    });
  } else {
    allUsers[userName] = [
      {
        scores: array,
        date: new Date().toLocaleString()
      }
    ];
  }
  fs.writeFileSync('./svar.json', JSON.stringify(allUsers, null, 2));

  console.log(`Tack för att du deltog ${userName}! Dina resultat har sparats.`);


  let korIgen = prompt("Vill du köra formuläret igen? (1.Ja/2.Nej)").trim().toLowerCase();
  if (korIgen !== '1') {
    runFormAgain = false;
  }
  
}