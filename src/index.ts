import printAnswers from './utils/printAnswers';
import { readdir } from 'fs';

const DayRegex = /[0-9]+/g;

readdir('src/days', async (err, files) => {
  // Handle directory scan error
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  } 
      
  // Print out all day answers attempted so far
  for (const file of files) {
    const day = file.match(DayRegex);
    const dayExistsInFileName = day.length > 0 && !isNaN(+day[0]);

    if (dayExistsInFileName) {
      const { default: pack } = await import(`../src/days/${file}`);
      await printAnswers(+day[0], pack);
    } else {
      return console.log(`Filename is incorrectly formatted under day attempts: ${file}`);
    }
  }
});
