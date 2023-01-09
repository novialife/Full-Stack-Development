![HTML/JS/CSS ><](./html-js-css.png)

# Lab 2

[Lab 2](https://kth.instructure.com/courses/31494/assignments/187818/) ska lämnas in i [src](./src/) före presentationen. Båda studenterna ska kunna redogöra för programmets alla delar. Börja med att klona ned repot och öppna [.html-filen](./src/index.html) i webbläsaren. Ni borde ha en övergripande förståelse för hur alla filer hänger ihop innan programmet vidareutvecklas. _Lycka till!_

## Statisk kodanalys _(lint)_

Statisk kodanalys utförs för att hitta potentiella fel, misstänkta konstruktioner eller andra problem relaterade till bristande kodkvalitet. Följande steg är nödvändiga för att utföra statisk kodanalys och därmed bli godkänd på uppgiften. Observera att **alla rapporterade problem ska åtgärdas** före presentationen. Vidare måste den senaste versionen av [Node.js LTS](https://nodejs.org/) installeras innan instruktionerna nedan kan utföras.

1. Klona ned och navigera till repot i terminalen.
2. Kör `npm install` för att installera alla nödvändiga paket.
3. Kör `npm run lint` för att analysera koden och se resultatet.

Observera att de allra flesta problem kan elimineras _automatiskt_ genom att köra `npm run lint:fix`. Se därför till att _kontinuerligt_ köra kommandot ovan och åtgärda nya problem på löpande basis.
