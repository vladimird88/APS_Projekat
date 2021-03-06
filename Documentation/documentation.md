# Online Blackboard
#  
## Članovi tima:

- Lalić Aleksandra 14350
- Dinić Vladimir 14280

## Domen

**Online Blackboard** je web aplikacija čiji je osnovni cilj da omogući povezivanje predavača i onih koji žele da nauče nešto novo ili da obnove svoja znanja iz oblasti koja je predmet predavanja. Aplikacija je interaktivna, što znači da posetioci predavanja mogu da u realnom vremenu prate sve što predavač iscrtava na tabli, mogu postavljati pitanja u formi stikera dok traje predavanje, a takođe mogu putem četa razgovarati i međusobno, kao i sa predavačem. Takođe, posetioci portala mogu pratiti i ona predavanja koja su završena, ali koja su i dalje dostupna, budući da se čuvaju u bazi.

## Funkcionalnosti

- Predavač ima mogućnost slobodnog crtanja, kao i lakog iscrtavanja i povezivanja različitih grafičkih elemenata na tabli 
- Mogućnost izbora željenog predavanja 
- Uživo praćenje odabranog predavanja, tj. onog što predavač iscrtava na tabli
- Postavljanje pitanja predavaču u formi "stikera" koji se "lepe" na tablu.
- Čuvanje predavanja, tako da posetioci portala mogu slušati kurseve koji trenutno nisu aktivni ("live")
- Čet među učesnicima

## Korišćene tehnologije i framework-ci

Za izradu **Online Blackboard** web aplikacije kao osnovni framework korišćen je MeteorJS. Za razvoj MeteorJS aplikacija potrebno je koristiti NodeJS platformu, dok će se kao osnovna baza koristiti MongoDB. Za razvoj specifičnih funkcionalnosti će se koristiti odgovarajući MeteorJS paketi, npm (NodeJS) paketi ili druge pomoćne biblioteke/framework-ci.

### MeteorJS
MeteorJS je full-stack JavaScript web framework za izradu web i mobilnih aplikacija. Kao glavne prednosti korišćenja ovog framework-a možemo izdvojiti:

- MeteorJS spada u tzv. "reaktivne framework-e". Reaktivnost kao programerska paradigma označava programiranje sa asinhronim tokovima podataka. Drugim rečima, reaktivnost omogućuje real-time usklađivanje UI-a sa vrednostima u modelu podataka.
- MeteorJS aplikacije su real-time po defaultu (zbog reaktivnosti).
- Koristi se jedan programski jezik i za serverski i za klijentski deo apliklacije (JavaScript)
- Programiranje u MeteorJS-u je jednostavno i zgodno za početnike 
- Dostupne su brojni paketi za MeteorJS koji olakšavaju kreiranje MeteorJS aplikacija

Kao neka od ograničenja prilikom korišćenja ovog framework-a možemo izdvojiti:

- MeteorJS nije u potpunosti pogodan za velike i kompleksne aplikacije
- Zbog mnogo "magije" prilikom rada sa MeteorJS-om, tako da developeri mogu osećati da imaju ograničene mogućnosti prilikom rada sa ovim framework-om

### NodeJS
NodeJS je open-source, cross-platform JavaScript runtime okruženje za razvoj web aplikacija, sa sledećim karakteristikama:

- NodeJS je neblokirajući jednonitni ("single-threaded") sistem vođen događajima ("event-driven") koji pokušava da maksimalno iskoristi dodeljeno procesorsko vreme i resurse.
- Zasnovan je na Google-ovom V8 JavaScript engine-u koji je veoma brz. V8 engine kompajlira i izvršava JavaScript izvorni kod, hendluje alokaciju memorije za objekte i pomoću svoj "garbage collector"-a uništava one objekte koji više nisu potrebni. Smatra se da je upravo "garbage collector" ugrađen u V8 engine ključ dobrih performansi ovog engine-a. Takođe, budući da V8 engine u pozadini koristi C/C++, to omogućuje rad sa sistemom fajlova, pokretanje HTTP servera itd.

### MongoDB
MongoDB je NoSQL baza podataka orijentisana na dokumentima za koju se smatra da je lako skalabilna, visoko dostupna i da ima visoke performanse. MongoDB čuva podatke kao kolekcije dokumenata u BSON/JSON formatu. 

## Korišćeni paketi i biblioteke
Za realizaciju ovog projekta ćemo koristiti sledeće MeteorJS pakete:

- **jeremy:snapsvg** - Moderna JavaScript biblioteka koja se koristi za SVG grafiku, tj. manipulaciju i animaciju SVG grafike.

Takođe, za izradu ovog projekta će biti korišćene sledeće JavaScript biblioteke:

- **FabricJS** - Javascript HTML5 canvas biblioteka koja olakšava korišćenje canvasa i proširuje njegove mogućnosti.

Ukoliko bude bilo potrebe, biće korišćene i dodatne biblioteke / paketi.

## Zaduženja članova tima
- Lalić Aleksandra će biti zadužena za implementaciju većeg dela frontend funkcionalnosti (klijentski deo aplikacije)
- Dinić Vladimir će biti zadužen za implementaciju backend funkcionalnosti (serverski deo aplikacije i rad sa bazom podataka) i za implementaciju manjeg dela frontend funkcionalnosti.

## Napomene
- Navedena dokumentacija predstavlja samo generalni opis domena, funkcionalnosti i korišćenih tehnologija, framework-a i biblioteka / paketa. Moguće su sitne izmene, npr. u pogledu korišćenih biblioteka / paketa, a sve izvršene izmene će biti update-ovane u ovom dokumentu.
- Podela zaduženja je takođe izvršena okvirno. U skladu sa obimom posla i strukturom aplikacije može doći do manje korekcije koja će biti update-ovana u ovom dokumentu.