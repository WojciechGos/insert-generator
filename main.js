const fs = require('fs')

const quantityOfFacts = 100
const quantityOfDimension = 200
const quantityOfGrades = 4
const quantityOfDates = 9
const batFile = 'script.bat'

////////////////////////////////// g1 //////////////////////////////////

const g1_wykladowcy = {
    nr_wykl: [],
    nazwisko: ['Kowalski','Bratan', 'Suchodolski', 'Perlicki', 'Podolski', 'Chopin', 'Curie', 'Gos', 'Grochowski', 'Owca', 'Kot', 'Czech', 'Polak', 'Nożyk', 'Gruszka', 'Pietruszka'],
    imie: ["Adam", "Barbara", "Cezary", "Dorota", "Edward", "Felicja", "Grzegorz", "Halina", "Ireneusz", "Joanna", "Karol", "Lidia","Mariusz", "Natalia", "Oskar", "Paulina", "Robert", "Sylwia","Tomasz", "Urszula", "Janusz", "Barnaba"],
    stopien: ['mgr', 'dr', 'prof']
}
const g1_student = {
    nr_albumu: [],
    nazwisko: ["Kowalski", "Nowak", "Smith", "Johnson", "Garcia", "Lee", "Chen", "Kim", "Wang", "Lopez", "Gonzalez", "Brown", "Davis", "Miller", "Taylor", "Anderson", "Harris", "Clark", "Lewis", "Young"],
    imie: ["Jan", "Anna", "John", "Emily", "David", "Sophia", "Michael", "Emma", "Matthew", "Olivia", "Daniel", "Isabella", "Alexander", "Mia", "James", "Ava", "Andrew", "Sofia", "Joseph", "Charlotte"],
    wiek: {first:'R', second:[18, 25]}
};

const g1_przedmiot = {
    id_przed: [],
    nazwa: ['Matematyka', 'Fizyka', 'Chemia', 'Biologia', 'Informatyka', 'Historia', 'Geografia', 'Język polski', 'Angielski', 'Hiszpański', 'Francuski', 'Niemiecki', 'Wiedza o społeczeństwie', 'Wychowanie fizyczne', 'Muzyka', 'Plastyka', 'Technika', 'Przyroda', 'Religia', 'Etyka'],
    typ: ['W', 'L', 'P']
};

const g1_termin = {
    id_termin: [],
    data:{first: 'ON', second: ["TO_date('01.01. 2019','dd.mm.yyyy')","TO_date('04.01. 2019','dd.mm.yyyy')","TO_date('06.01. 2019','dd.mm.yyyy')", "TO_date('06.01. 2019','dd.mm.yyyy')",  "TO_date('01.01. 2019','dd.mm.yyyy')","TO_date('04.01. 2020','dd.mm.yyyy')","TO_date('06.01. 2020','dd.mm.yyyy')", "TO_date('06.01. 2020','dd.mm.yyyy')", "TO_date('01.01. 2019','dd.mm.yyyy')","TO_date('04.01. 2021','dd.mm.yyyy')","TO_date('06.01. 2021','dd.mm.yyyy')", "TO_date('06.01. 2021','dd.mm.yyyy')",] }
};
const g1_oceny = {
    ocena : {first: 'ON', second:[2,3,4,5]}
}
const g1_zaliczenie = {
    id_zaliczenia: [],
    id_przed: {first: 'R', second: [0, quantityOfDimension-1] },
    nr_wykl : {first: 'R', second: [0, quantityOfDimension-1] },
    nr_albumu : {first: 'R', second: [0, quantityOfDimension-1]},
    id_termin :{first: 'R', second: [0, quantityOfDates-1] },
    id_oceny : {first: 'R', second: [2, 5] }
}

//////////////////////////////// g2 ///////////////////////////////////////

const g2_stopien = {
    stopien : {first: 'O', second: ['dr', 'mgr', 'prof']}
}
const g2_rok ={
    rok:{first:'ON', second:[2019, 2020, 2021]}
}
const g2_miesiac = {
    miesiac: [1],
    rok:{first:'ON', second:[2019, 2020, 2021]}
}
const g2_dzien = {
    dzien : {first:'ON', second:[1, 4, 6]},
    miesiac: [1]   
}

const g2_oceny = g1_oceny
const g2_przedmiot = g1_przedmiot
const g2_wykladowcy = g1_wykladowcy
const g2_student = g1_student


const g2_grupa = {
    nr_gr : [],
    nazwa : {first:'O', second:['Grupa 01', 'Grupa 02','Grupa 03','Grupa 04','Grupa 05','Grupa 06','Grupa 07','Grupa 08']},
    liczba_st : {first:'R', second:[10, 20]}   
}

const g2_zaliczenie = {
    id_przed: {first: 'R', second: [0, quantityOfDimension-1] },
    nr_wykl : {first: 'R', second: [0, quantityOfDimension-1] },
    nr_albumu : {first: 'R', second: [0, quantityOfDimension-1]},
    nr_gr : {first: 'R', second: [0, 7] },
    dzien : {first: 'N', second: [1, 4, 6] },
    id_oceny : {first: 'R', second: [2, 5] }
}

// Funkcja generuje liczbe losową z zakresu od min do max
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max + 1 - min)) + min;
}

/* 
 Funkcja ta generuje składnie INSERT w formacie sql.
 
 @param data: dane do wylosowania
 @param quantity: ilość insertów do wygenerowania
 @param name: nazwa tablicy


 Przyjmuje obiekt danych w formacie klucz -> wartość, gdzie:
 klucz jest nazwą atrybutu,
 wartość jest tablicą danych z których może wylosować wartość dla atrybutu
 np.
 data = {
    nr_wykl: []
    nazwisko : ['Kot', 'Podolski']
 }

 WAŻNE! klucz główny który jest numeryczny powinien być pusty
 WAŻNE!!! jeżeli atrybut zamiast tablicy ma obiekt z atrybutami {first: '', second:[]} to oznacza,
    że jest to obiekt specjalny, który podlega innym ustalonym zasadom losowania.
 
    Typy atrybutów specjalnych:
    O -> Ordered - po kolei wypisze wartości które znajdują się w tablicy second
    ON -> Ordered Numerical  - wypisze po kolei wartości z tablicy wartości bez ''
    N -> Numerical - wypisze wartość z tablicy bez ''
    R -> Range - tablica second zawiera zakres losowania 
 */
const generate_insert = (name, data, quantity)=>{
    let result = ''
    let values = ''
    let insert = ''
    let iterator = 0
    // iterowanie po ilości 
    for(let id=0; id<quantity; ++id){
        values = '' 
        insert = ''

        // iterowanie po atrybutach obiektu data
        for(let [key, arr] of Object.entries(data)){
            
            // sprawdzenie czy atrybut jest tablicą 
            if(!Array.isArray(arr)){
                // tutaj rozważamy obiekty specjalne
                if(arr.first === 'O'){
                    quantity = arr.second.length  
                    values += `'${arr.second[iterator]}',`
                    iterator++
                }
                else if(arr.first === 'ON'){
                    quantity = arr.second.length
                    values += `${arr.second[iterator]},`
                    iterator++
                }
                else if(arr.first === 'N'){
                    let random = getRandomInt(0, arr.second.length-1)
                    values += `${arr.second[random]},`
                }
                // jeżeli w atrybucie podano zakres losowania 
                else if (arr.first === 'R'){
                    let random = getRandomInt(arr.second[0], arr.second[1]-1)
                    values += `${random},`
                }
            }
            // jeżeli atrybut posiada dane z których można coś wylosować
            else if(arr.length !== 0){
                let randIndex = getRandomInt(0,arr.length-1)
                values += `${arr[randIndex]},`
            }
            // w przeciwnym wypadku jest to pole id
            else{
                values += `${id},`
            }
        }

        // usunięcie ostatniego przecinka
        values = values.slice(0, values.length-1)

        // dodanie rekordu do wyniku
        result += `${values}\n`
    }

    // wyłuskanie nazw atrybutów z obiektu
    let attributes = '' 
    Object.keys(data).map(attr=>{
        attributes += `${attr},\n`
    })
    // usunięcie ostatniego przecinka
    attributes = attributes.slice(0, attributes.length-2)

    const ctl_file = `
LOAD DATA
INFILE '.\\DATA\\${name}.txt'
INSERT INTO TABLE ${name}
FIELDS TERMINATED BY ","
(
${attributes}
)
`

    const script = `sqlldr 'sys/.orcl as sysdba' CONTROL='.\\DATA\\${name}.ctl' LOG='.\\LOG\\${name}.log' BAD='.\\BAD\\${name}.bad'\n`
    
    fs.writeFileSync(`./DATA/${name}.ctl`, ctl_file)
    fs.writeFileSync(`./DATA/${name}.txt`, result)
    fs.appendFileSync(batFile,script)
}

/*
    Główna funckja która wywołuje funkcje generującą 
*/
const main = ()=>{
    fs.writeFileSync(batFile, '')

    generate_insert('g1_wykladowca', g1_wykladowcy, quantityOfDimension)
    generate_insert('g1_student', g1_student, quantityOfDimension)
    generate_insert('g1_przedmiot', g1_przedmiot, quantityOfDimension)
    // generate_insert('g1_termin', g1_termin, quantityOfDates)
    // generate_insert('g1_oceny', g1_oceny, quantityOfGrades)
    // generate_insert('g1_zaliczenie', g1_zaliczenie, quantityOfFacts)

    // generate_insert('g2_rok', g2_rok, quantityOfDates)
    // generate_insert('g2_miesiac', g2_miesiac, 10)
    // generate_insert('g2_dzien', g2_dzien, quantityOfDates)

    // generate_insert('g2_stopien', g2_stopien, 3)
    // generate_insert('g2_grupa', g2_grupa, 8)
    // generate_insert('g2_wykladowca', g2_wykladowcy, quantityOfDimension)
    // generate_insert('g2_student', g2_student, quantityOfDimension)
    // generate_insert('g2_przedmiot', g2_przedmiot, quantityOfDimension)
    // generate_insert('g2_oceny', g2_oceny, quantityOfGrades)
    // generate_insert('g2_zaliczenie', g2_zaliczenie, quantityOfFacts)
}
main()
