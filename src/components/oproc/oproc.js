/*
 * OProc Loader soll aus JSON Dateien/ Objekten die für Oproc sinnvollen Daten extrahieren
 *
 * useage:
 *    ol = new OprocLoader( jsonObject )
 *      or
 *    ol = new OprocLoader( )
 *    ol.fromFile( path )
 *
 * than get some data from it:
 *    let allStakeholder = ol.getStakeholder();
 *    let allChildProcesses = ol.getProcesses();
 *
 */

import { h, Component } from 'preact';
export default class Oproc extends Component {
  constructor( ) {
    super();
  }

  // TESTS //
  test_loading_ok() {
    if( this.oproc.system.id  != '' && this.oproc.system.id != undefined) {
      return 'success';
    }
    else {
      return 'failed';
    }
  }
  // /TESTS //


  async download(oproc){
    const response = await fetch(oproc);
    const parsedResponse = await response.json();
    return parsedResponse;
  }

  reload(process) {
    let processes = [];
    let processIterator = 0;

    this.download(process)
      .then( oproc => oproc )
      ;
  }


  subprocessNames(){
    let names = this.oproc.process.childs.map(child => child.name);
    return names;
  }


  processHead(outputFlag) {
    var head = {
      "comment" : this.oproc.process._comment,
      "id": this.oproc.process.id,
      "initiator": this.oproc.process.initiator,
    }
    if( this.oproc.process.reference != '' && this.oproc.process.reference != undefined)
      head.reference = this.oproc.process.reference;

    if(outputFlag == 'str')
      return "comment: "+head.comment+"\nid: "+head.id+"\ninitiator: "+head.initiator;
    else
      return head;
  }

  dumbLoad(){
    return {
      "system": {
        "_comment": "Es handelt sich um die Systembeschreibung",
        "id": "https://oproc.dresden.org/",
        "type": "https://schema.oproc.org/0.1/system",
        "entrypoints": "https://process.stadt.de/process/",
        "name": "Beispiel-System",
        "email": "info@stadt.de",
        "contact": "John Doe, Rocket Science Inc.",
        "website": "http://www.stadt.de/"
      },
      "entrypoint": {
        "_comment": "Es handelt sich um die obersten Einstiegspunkte",
        "type": "https://process.stadt.de/entrypoint/",
        "list": [
          "https://process.stadt.de/process/1"
        ],
        "created": "2011-11-11T11:11:00+01:00",
        "modified": "2012-11-11T11:11:00+01:00"
      },
      "process": {
        "_comment": "Es handelt sich um Prozesse, diese beinhalten Struktur- und Metainformationen",
        "id": "https://process.stadt.de/process/1",
        "reference": "AZ1337/11",
        "initiator": "https://process.stadt.de/stakeholder/3",
        "connection": {
          "from": [],
          "to": []
        },
        "parent": "",
        "name": "Köln Chorweiler",
        "description": "TODO",
        "location": [
          "https://process.stadt.de/location/1"
        ],
        "start": "2015-01-01T11:11:00+01:00",
        "end": "2016-05-14T11:11:00+01:00",
        "participation": "partial opened",
        "participants": [],
        "transformation": {
          "type": "=",
          "info": "TODO",
          "decision": "false"
        },
        "results": [
          {
            "id": "https://process.stadt.de/results/1",
            "name": "Final_Chorweiler",
            "description": "Gesamtergebnisse Köln Chorweiler Prozess",
            "copyright": "",
            "text": "",
            "files": [],
            "created": "2011-11-11T11:11:00+01:00",
            "modified": "2012-11-11T11:11:00+01:00"
          }
        ],
        "childs": [
          {
            "id": "https://process.stadt.de/process/11",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/3",
            "connection": {
              "from": [],
              "to": [
                "https://process.stadt.de/process/12"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Antrag für NSP-Mittel",
            "description": "Erstellung Antrag für NSP-Mittel (Förderung von Institutionen in: Nationale Projekte des Städtebaus); Projekttitel: 'Lebenswertes Chorweiler – ein Zentrum im Wandel'",
            "location": [
              "https://process.stadt.de/location/1"
            ],
            "start": "2015-01-01T11:11:00+01:00",
            "end": "2015-01-01T11:11:00+01:00",
            "participation": "closed",
            "participants": [
              "https://process.stadt.de/stakeholder/5"
            ],
            "transformation": {
              "type": "<",
              "info": "Erstellen eines Antrages",
              "decision": "false"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/11",
                "name": "Antrag",
                "description": "Antrag für NSP Mittel",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/12",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/5",
            "connection": {
              "from": [
                "https://process.stadt.de/process/11"
              ],
              "to": [
                "https://process.stadt.de/process/13"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Unterstützung Antrag",
            "description": "Zusicherung Unterstützung Antrag",
            "location": [
              "https://process.stadt.de/location/1"
            ],
            "start": "2015-05-23T11:11:00+01:00",
            "end": "2015-05-23T11:11:00+01:00",
            "participation": "closed",
            "participants": [
              "https://process.stadt.de/stakeholder/3"
            ],
            "transformation": {
              "type": ">",
              "info": "Entscheidung über Antrag",
              "decision": "true"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/12",
                "name": "Beschluss",
                "description": "Beschluss für NSP Mittel",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/13",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/3",
            "connection": {
              "from": [
                "https://process.stadt.de/process/12"
              ],
              "to": [
                "https://process.stadt.de/process/14"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Einreichung Antrag",
            "description": "Einreichung Antrag",
            "location": [
              "https://process.stadt.de/location/1"
            ],
            "start": "2015-05-23T11:11:00+01:00",
            "end": "2015-05-23T11:11:00+01:00",
            "participation": "closed",
            "participants": [
              "https://process.stadt.de/stakeholder/4"
            ],
            "transformation": {
              "type": "=",
              "info": "Einreichung Antrag",
              "decision": "false"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/13",
                "name": "Email/Brief",
                "description": "Einreichen des Antrages",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/14",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/4",
            "connection": {
              "from": [
                "https://process.stadt.de/process/13"
              ],
              "to": [
                "https://process.stadt.de/process/15"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Positivbescheid",
            "description": "Positivbescheid",
            "location": [
              "https://process.stadt.de/location/4"
            ],
            "start": "2015-07-16T11:11:00+01:00",
            "end": "2015-07-16T11:11:00+01:00",
            "participation": "closed",
            "participants": [],
            "transformation": {
              "type": ">",
              "info": "Bescheid",
              "decision": "true"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/14",
                "name": "Bescheid",
                "description": "Bescheid",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/15",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/4",
            "connection": {
              "from": [
                "https://process.stadt.de/process/14"
              ],
              "to": [
                "https://process.stadt.de/process/16"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Zuwendungsbescheid",
            "description": "Erlass endgültiger Zuwendungsbescheid für das Projekt 'Lebenswertes Chorweiler - ein Zentrum im Wandel'",
            "location": [
              "https://process.stadt.de/location/4"
            ],
            "start": "2015-12-01T11:11:00+01:00",
            "end": "2015-12-01T11:11:00+01:00",
            "participation": "closed",
            "participants": [
              "https://process.stadt.de/stakeholder/3"
            ],
            "transformation": {
              "type": "=",
              "info": "(Zuwendungsbescheid)",
              "decision": "false"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/15",
                "name": "Zuwendungsbescheid",
                "description": "Zuwendungsbescheid",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/16",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/3",
            "connection": {
              "from": [
                "https://process.stadt.de/process/15"
              ],
              "to": [
                "https://process.stadt.de/process/17"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Ausschreibung für Moderationsleistungen",
            "description": "Erstellung von Ausschreibung für Moderationsleistungen für einen 'niedrigschwellig angelegtes Beteiligungsverfahen'",
            "location": [
              "https://process.stadt.de/location/1"
            ],
            "start": "2016-01-01T11:11:00+01:00",
            "end": "2016-01-01T11:11:00+01:00",
            "participation": "closed",
            "participants": [
              "https://process.stadt.de/stakeholder/6"
            ],
            "transformation": {
              "type": "<",
              "info": "(Ausschreibung für Moderationsleistungen)",
              "decision": "false"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/16",
                "name": "Ausschreibung",
                "description": "Ausschreibung",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/17",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/6",
            "connection": {
              "from": [
                "https://process.stadt.de/process/16"
              ],
              "to": [
                "https://process.stadt.de/process/18"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Angbebot für Beteiligungsverfahren",
            "description": "Erstellen von Angbebot für Beteiligungsverfahren",
            "location": [
              "https://process.stadt.de/location/11"
            ],
            "start": "2016-01-01T11:11:00+01:00",
            "end": "2016-03-31T11:11:00+01:00",
            "participation": "closed",
            "participants": [
              "https://process.stadt.de/stakeholder/3"
            ],
            "transformation": {
              "type": "<",
              "info": "(Angbebot für Beteiligungsverfahren)",
              "decision": "false"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/17",
                "name": "Angebot",
                "description": "Angebot",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/18",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/3",
            "connection": {
              "from": [
                "https://process.stadt.de/process/17"
              ],
              "to": [
                "https://process.stadt.de/process/19"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Vergabe Beteiligungsverfahren",
            "description": "Auswahl und Vergabe Beteiligungsverfahren",
            "location": [
              "https://process.stadt.de/location/1"
            ],
            "start": "2016-04-01T11:11:00+01:00",
            "end": "2016-05-15T11:11:00+01:00",
            "participation": "closed",
            "participants": [
              "https://process.stadt.de/stakeholder/1",
              "https://process.stadt.de/stakeholder/2"
            ],
            "transformation": {
              "type": ">",
              "info": "(Vergabe Beteiligungsverfahren)",
              "decision": "true"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/18",
                "name": "Vergabebescheid",
                "description": "Vergabebescheid",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/19",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/1",
            "connection": {
              "from": [
                "https://process.stadt.de/process/18"
              ],
              "to": [
                "https://process.stadt.de/process/110"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Konkretisierung Betiligungsverfahren",
            "description": "Konkretisierung Betiligungsverfahren: Prozessbausteine + bauliche Intervention (Platzstation)",
            "location": [
              "https://process.stadt.de/location/2",
              "https://process.stadt.de/location/3"
            ],
            "start": "2016-05-23T11:11:00+01:00",
            "end": "2016-05-31T11:11:00+01:00",
            "participation": "closed",
            "participants": [
              "https://process.stadt.de/stakeholder/2",
              "https://process.stadt.de/stakeholder/3"
            ],
            "transformation": {
              "type": "<",
              "info": "(Konkretisierung Betiligungsverfahren)",
              "decision": "false"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/191",
                "name": "Textdokument",
                "description": "Textdokument",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              },
              {
                "id": "https://process.stadt.de/results/192",
                "name": "Konzeptzeichnungen",
                "description": "Konzeptzeichnungen",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              },
              {
                "id": "https://process.stadt.de/results/193",
                "name": "Excelliste",
                "description": "Excelliste",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/110",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/1",
            "connection": {
              "from": [
                "https://process.stadt.de/process/19"
              ],
              "to": [
                "https://process.stadt.de/process/111"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Öffentlichkeitsarbeit",
            "description": "Öffentlichkeitsarbeit: Netzwerke aufbauen, Pressearbeit",
            "location": [
              "https://process.stadt.de/location/2",
              "https://process.stadt.de/location/1"
            ],
            "start": "2016-06-01T11:11:00+01:00",
            "end": "2016-08-01T11:11:00+01:00",
            "participation": "open",
            "participants": [
              "https://process.stadt.de/stakeholder/3"
            ],
            "transformation": {
              "type": "<",
              "info": "(Öffentlichkeitsarbeit)",
              "decision": "false"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/110",
                "name": "Trello-Board",
                "description": "Trello-Board",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/111",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/1",
            "connection": {
              "from": [
                "https://process.stadt.de/process/110"
              ],
              "to": [
                "https://process.stadt.de/process/112"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Diskursive Ortsbegehungen",
            "description": "Diskursive Ortsbegehungen: Vorbereitung, Durchführung, Dokumentation",
            "location": [
              "https://process.stadt.de/location/1"
            ],
            "start": "2016-06-01T11:11:00+01:00",
            "end": "2016-09-01T11:11:00+01:00",
            "participation": "open",
            "participants": [
              "https://process.stadt.de/stakeholder/3",
              "https://process.stadt.de/stakeholder/7",
              "https://process.stadt.de/stakeholder/8",
              "https://process.stadt.de/stakeholder/9",
              "https://process.stadt.de/stakeholder/10",
              "https://process.stadt.de/stakeholder/11",
              "https://process.stadt.de/stakeholder/12"
            ],
            "transformation": {
              "type": "<",
              "info": "(Diskursive Ortsbegehungen)",
              "decision": "false"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/1111",
                "name": "Auswertungstext",
                "description": "Dokumentation",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              },
              {
                "id": "https://process.stadt.de/results/1112",
                "name": "Lagepläne",
                "description": "Lagepläne mit Verortungen von Ideen",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              },
              {
                "id": "https://process.stadt.de/results/1113",
                "name": "Fotos von der Begehungen",
                "description": "Fotos von der Begehungen",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/112",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/1",
            "connection": {
              "from": [
                "https://process.stadt.de/process/111"
              ],
              "to": [
                "https://process.stadt.de/process/113"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Auftaktveranstalltung",
            "description": "Auftaktveranstaltung: Vorbereitung, Durchführung und Dokumentation",
            "location": [
              "https://process.stadt.de/location/4"
            ],
            "start": "2016-07-01T11:11:00+01:00",
            "end": "2016-07-01T11:11:00+01:00",
            "participation": "open",
            "participants": [
              "https://process.stadt.de/stakeholder/2",
              "https://process.stadt.de/stakeholder/3",
              "https://process.stadt.de/stakeholder/7",
              "https://process.stadt.de/stakeholder/8",
              "https://process.stadt.de/stakeholder/9",
              "https://process.stadt.de/stakeholder/10",
              "https://process.stadt.de/stakeholder/11",
              "https://process.stadt.de/stakeholder/12",
              "https://process.stadt.de/stakeholder/13"
            ],
            "transformation": {
              "type": "<",
              "info": "(auftaktveranstaltung)",
              "decision": "false"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/1121",
                "name": "Dokumenation, Akteurslisten",
                "description": "Dokumenation, Akteurslisten von potentiell Interessierten, Auflistung von Wünschen und Ideen",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              },
              {
                "id": "https://process.stadt.de/results/1122",
                "name": "Fotos",
                "description": "Fotos der Veranstaltung",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/113",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/1",
            "connection": {
              "from": [
                "https://process.stadt.de/process/112"
              ],
              "to": [
                "https://process.stadt.de/process/114"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Städetbauliche Analyse",
            "description": "Städtebauliche Analyse der Plätze sowie des Stadtquartiers: Bestandsaufnahme, Fotodokumenatation, Erstellung von Kartengrundlagen, Analyseskarten und -texte,",
            "location": [
              "https://process.stadt.de/location/2"
            ],
            "start": "2016-06-01T11:11:00+01:00",
            "end": "2016-10-01T11:11:00+01:00",
            "participation": "closed",
            "participants": [
              "https://process.stadt.de/stakeholder/3"
            ],
            "transformation": {
              "type": "<",
              "info": "(städetbauliche Analyse)",
              "decision": "false"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/1131",
                "name": "Dokument",
                "description": "Dokument",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              },
              {
                "id": "https://process.stadt.de/results/1132",
                "name": "Pläne",
                "description": "Pläne/Zeichnungen",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              },
              {
                "id": "https://process.stadt.de/results/1133",
                "name": "Fotos",
                "description": "Fotos",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/114",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/1",
            "connection": {
              "from": [
                "https://process.stadt.de/process/113"
              ],
              "to": [
                "https://process.stadt.de/process/115"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Platzstation",
            "description": "Platzstation: Vorbereitung und Durchführung",
            "location": [
              "https://process.stadt.de/location/5"
            ],
            "start": "2016-08-28T11:11:00+01:00",
            "end": "2016-09-04T11:11:00+01:00",
            "participation": "open",
            "participants": [
              "https://process.stadt.de/stakeholder/2",
              "https://process.stadt.de/stakeholder/3",
              "https://process.stadt.de/stakeholder/7",
              "https://process.stadt.de/stakeholder/8",
              "https://process.stadt.de/stakeholder/9",
              "https://process.stadt.de/stakeholder/10",
              "https://process.stadt.de/stakeholder/11",
              "https://process.stadt.de/stakeholder/12",
              "https://process.stadt.de/stakeholder/13"
            ],
            "transformation": {
              "type": "<",
              "info": "(Platzstation)",
              "decision": "false"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/114",
                "name": "bauliche Intervention",
                "description": "Platzstation, Konzeptionelle Interventionen",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/115",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/9",
            "connection": {
              "from": [
                "https://process.stadt.de/process/114"
              ],
              "to": [
                "https://process.stadt.de/process/116"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Ideenabgabe",
            "description": "Ideenabgabe",
            "location": [
              "https://process.stadt.de/location/5"
            ],
            "start": "2016-08-28T11:11:00+01:00",
            "end": "2016-09-04T11:11:00+01:00",
            "participation": "open",
            "participants": [
              "https://process.stadt.de/stakeholder/1",
              "https://process.stadt.de/stakeholder/7",
              "https://process.stadt.de/stakeholder/8",
              "https://process.stadt.de/stakeholder/10",
              "https://process.stadt.de/stakeholder/11"
            ],
            "transformation": {
              "type": "<",
              "info": "(Ideenabgabe)",
              "decision": "false"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/115",
                "name": "Ideenzettel A4",
                "description": "Ideenzettel A4",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/116",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/9",
            "connection": {
              "from": [
                "https://process.stadt.de/process/115"
              ],
              "to": [
                "https://process.stadt.de/process/117"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Abstimmung",
            "description": "Abstimmung: Punktvergabe auf Ideewand",
            "location": [
              "https://process.stadt.de/location/5"
            ],
            "start": "2016-09-01T11:11:00+01:00",
            "end": "2016-09-04T11:11:00+01:00",
            "participation": "open",
            "participants": [
              "https://process.stadt.de/stakeholder/1",
              "https://process.stadt.de/stakeholder/7",
              "https://process.stadt.de/stakeholder/8",
              "https://process.stadt.de/stakeholder/10",
              "https://process.stadt.de/stakeholder/11"
            ],
            "transformation": {
              "type": ">",
              "info": "(Ideenabgabe)",
              "decision": "true"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/116",
                "name": "Plane Ideenwand",
                "description": "Plane Ideenwand",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/117",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/1",
            "connection": {
              "from": [
                "https://process.stadt.de/process/116"
              ],
              "to": [
                "https://process.stadt.de/process/118"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Dokumentation",
            "description": "Dokumenation: Platzstation",
            "location": [
              "https://process.stadt.de/location/2"
            ],
            "start": "2016-09-05T11:11:00+01:00",
            "end": "2016-09-15T11:11:00+01:00",
            "participation": "closed",
            "participants": [
              "https://process.stadt.de/stakeholder/12",
              "https://process.stadt.de/stakeholder/3"
            ],
            "transformation": {
              "type": "<",
              "info": "(Dokumentation, Pläne, Fotos)",
              "decision": "false"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/117",
                "name": "Dokumentation",
                "description": "Dokumentation",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/118",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/1",
            "connection": {
              "from": [
                "https://process.stadt.de/process/117"
              ],
              "to": [
                "https://process.stadt.de/process/119"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Auswertung",
            "description": "Auswertung: Ergebnisse der Beteilung und der Abstimmung",
            "location": [
              "https://process.stadt.de/location/2"
            ],
            "start": "2016-09-01T11:11:00+01:00",
            "end": "2016-09-30T11:11:00+01:00",
            "participation": "closed",
            "participants": [
              "https://process.stadt.de/stakeholder/12",
              "https://process.stadt.de/stakeholder/3"
            ],
            "transformation": {
              "type": ">",
              "info": "(Liste)",
              "decision": "false"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/118",
                "name": "Liste",
                "description": "Liste",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/119",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/1",
            "connection": {
              "from": [
                "https://process.stadt.de/process/118"
              ],
              "to": [
                "https://process.stadt.de/process/120"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Ausweraumzonierungsplanrtung",
            "description": "Raumzonierungsplan: Potenzialanlyse aus den Erkennntnissen der Städtebaulichen Anayse und den Erkenntnissen",
            "location": [
              "https://process.stadt.de/location/2"
            ],
            "start": "2016-09-01T11:11:00+01:00",
            "end": "2016-09-30T11:11:00+01:00",
            "participation": "closed",
            "participants": [
              "https://process.stadt.de/stakeholder/12"
            ],
            "transformation": {
              "type": "<",
              "info": "(Analyse)",
              "decision": "true"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/119",
                "name": "Analyse",
                "description": "Analyse",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/120",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/12",
            "connection": {
              "from": [
                "https://process.stadt.de/process/119"
              ],
              "to": [
                "https://process.stadt.de/process/121"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Städtebaulicher Vorentwurf",
            "description": "Städtebaulicher Vorentwurf: Bestandsanalyse, 1 + 2 (Analyse) Potentialanalyse und Zonierungsplan",
            "location": [
              "https://process.stadt.de/location/2",
              "https://process.stadt.de/location/7"
            ],
            "start": "2016-09-01T11:11:00+01:00",
            "end": "2016-10-10T11:11:00+01:00",
            "participation": "closed",
            "participants": [
              "https://process.stadt.de/stakeholder/1",
              "https://process.stadt.de/stakeholder/3"
            ],
            "transformation": {
              "type": "<",
              "info": "(Analyse)",
              "decision": "true"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/1201",
                "name": "Analyse",
                "description": "Analyse / Dokument",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              },
              {
                "id": "https://process.stadt.de/results/1202",
                "name": "Analyse",
                "description": "Analyse / Pläne, Zeichnung",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/121",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/1",
            "connection": {
              "from": [
                "https://process.stadt.de/process/120"
              ],
              "to": [
                "https://process.stadt.de/process/122"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Ideenwerkstatt 1",
            "description": "Ideenwerkstatt 1: Vorbereitung, Durchführung",
            "location": [
              "https://process.stadt.de/location/8"
            ],
            "start": "2016-09-24T11:11:00+01:00",
            "end": "2016-09-24T11:11:00+01:00",
            "participation": "open",
            "participants": [
              "https://process.stadt.de/stakeholder/2",
              "https://process.stadt.de/stakeholder/3",
              "https://process.stadt.de/stakeholder/7",
              "https://process.stadt.de/stakeholder/8",
              "https://process.stadt.de/stakeholder/9",
              "https://process.stadt.de/stakeholder/10",
              "https://process.stadt.de/stakeholder/11",
              "https://process.stadt.de/stakeholder/12"
            ],
            "transformation": {
              "type": "<",
              "info": "(Präsentation, Modell)",
              "decision": "false"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/1211",
                "name": "Prsäentation",
                "description": "Präsentation Planungsstand",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              },
              {
                "id": "https://process.stadt.de/results/1212",
                "name": "Modell",
                "description": "Begehbares Modell",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/122",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/9",
            "connection": {
              "from": [
                "https://process.stadt.de/process/121"
              ],
              "to": [
                "https://process.stadt.de/process/123"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Ideenabgabe",
            "description": "Ideenabgabe",
            "location": [
              "https://process.stadt.de/location/8"
            ],
            "start": "2016-09-24T11:11:00+01:00",
            "end": "2016-09-24T11:11:00+01:00",
            "participation": "open",
            "participants": [
              "https://process.stadt.de/stakeholder/1",
              "https://process.stadt.de/stakeholder/3",
              "https://process.stadt.de/stakeholder/7",
              "https://process.stadt.de/stakeholder/8",
              "https://process.stadt.de/stakeholder/9",
              "https://process.stadt.de/stakeholder/10",
              "https://process.stadt.de/stakeholder/11",
              "https://process.stadt.de/stakeholder/12"
            ],
            "transformation": {
              "type": "<",
              "info": "(Vorschläge)",
              "decision": "false"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/122",
                "name": "Modell",
                "description": "Vorschläge beim begehbaren Modell",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/123",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/1",
            "connection": {
              "from": [
                "https://process.stadt.de/process/122"
              ],
              "to": [
                "https://process.stadt.de/process/124"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Dokumentation",
            "description": "Dokumentation Ideewerkstatt 1",
            "location": [
              "https://process.stadt.de/location/1"
            ],
            "start": "2016-09-25T11:11:00+01:00",
            "end": "2016-10-10T11:11:00+01:00",
            "participation": "closed",
            "participants": [
              "https://process.stadt.de/stakeholder/3"
            ],
            "transformation": {
              "type": "<",
              "info": "(Dokumentation)",
              "decision": "false"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/1231",
                "name": "Dokumentation",
                "description": "Dokumentation",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              },
              {
                "id": "https://process.stadt.de/results/1232",
                "name": "Bilder",
                "description": "Bilder",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/124",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/12",
            "connection": {
              "from": [
                "https://process.stadt.de/process/123"
              ],
              "to": [
                "https://process.stadt.de/process/125"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Städtebaulicher Entwurf",
            "description": "Städtebaulicher Entwurf",
            "location": [
              "https://process.stadt.de/location/1",
              "https://process.stadt.de/location/7"
            ],
            "start": "2016-10-11T11:11:00+01:00",
            "end": "2016-11-02T11:11:00+01:00",
            "participation": "",
            "participants": [
              "https://process.stadt.de/stakeholder/1",
              "https://process.stadt.de/stakeholder/3"
            ],
            "transformation": {
              "type": "<",
              "info": "(Pläne)",
              "decision": "true"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/124",
                "name": "Pläne",
                "description": "Pläne",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/125",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/1",
            "connection": {
              "from": [
                "https://process.stadt.de/process/124"
              ],
              "to": [
                "https://process.stadt.de/process/126"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Ideenwerkstatt 2",
            "description": "Ideenwerkstatt 2: Vorbereitung, Durchführung",
            "location": [
              "https://process.stadt.de/location/10"
            ],
            "start": "2016-11-03T11:11:00+01:00",
            "end": "2016-11-03T11:11:00+01:00",
            "participation": "open",
            "participants": [
              "https://process.stadt.de/stakeholder/2",
              "https://process.stadt.de/stakeholder/3",
              "https://process.stadt.de/stakeholder/7",
              "https://process.stadt.de/stakeholder/8",
              "https://process.stadt.de/stakeholder/9",
              "https://process.stadt.de/stakeholder/10",
              "https://process.stadt.de/stakeholder/12"
            ],
            "transformation": {
              "type": "<",
              "info": "(Präsentation, Begehbares Modell)",
              "decision": "false"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/1251",
                "name": "Präsentation",
                "description": "Präsentation",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              },
              {
                "id": "https://process.stadt.de/results/1252",
                "name": "Modell",
                "description": "Begehbares Modell",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/126",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/9",
            "connection": {
              "from": [
                "https://process.stadt.de/process/125"
              ],
              "to": [
                "https://process.stadt.de/process/127"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Ideenabgabe",
            "description": "Ideenabgabe",
            "location": [
              "https://process.stadt.de/location/10"
            ],
            "start": "2016-11-03T11:11:00+01:00",
            "end": "2016-11-03T11:11:00+01:00",
            "participation": "open",
            "participants": [
              "https://process.stadt.de/stakeholder/1",
              "https://process.stadt.de/stakeholder/3",
              "https://process.stadt.de/stakeholder/7",
              "https://process.stadt.de/stakeholder/8",
              "https://process.stadt.de/stakeholder/9",
              "https://process.stadt.de/stakeholder/10",
              "https://process.stadt.de/stakeholder/11",
              "https://process.stadt.de/stakeholder/12"
            ],
            "transformation": {
              "type": "<",
              "info": "(Vorschläge)",
              "decision": "false"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/126",
                "name": "Vorschläge",
                "description": "Vorschläge im begehbaren Modell",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/127",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/1",
            "connection": {
              "from": [
                "https://process.stadt.de/process/126"
              ],
              "to": [
                "https://process.stadt.de/process/128"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Dokumenation",
            "description": "Dokumentation Ideenwerkstatt 2",
            "location": [
              "https://process.stadt.de/location/2"
            ],
            "start": "2016-11-04T11:11:00+01:00",
            "end": "2016-11-20T11:11:00+01:00",
            "participation": "closed",
            "participants": [
              "https://process.stadt.de/stakeholder/3"
            ],
            "transformation": {
              "type": "<",
              "info": "(Dokumentation)",
              "decision": "false"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/1271",
                "name": "Dokumentation",
                "description": "Dokumentation",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              },
              {
                "id": "https://process.stadt.de/results/1272",
                "name": "Bilder",
                "description": "Bilder",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/128",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/1",
            "connection": {
              "from": [
                "https://process.stadt.de/process/127"
              ],
              "to": [
                "https://process.stadt.de/process/129"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Ideentuning",
            "description": "Ideentuning: Konkretisierung Verfügungsflächen und Betreibermodelle",
            "location": [
              "https://process.stadt.de/location/1"
            ],
            "start": "2016-11-21T11:11:00+01:00",
            "end": "2016-11-21T11:11:00+01:00",
            "participation": "open",
            "participants": [
              "https://process.stadt.de/stakeholder/7",
              "https://process.stadt.de/stakeholder/14"
            ],
            "transformation": {
              "type": ">",
              "info": "()",
              "decision": "false"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/128",
                "name": "Dokumentation",
                "description": "Dokumentation",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/129",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/1",
            "connection": {
              "from": [
                "https://process.stadt.de/process/128"
              ],
              "to": [
                "https://process.stadt.de/process/130"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Dokumentation",
            "description": "Dokumentation Ideentuning",
            "location": [
              "https://process.stadt.de/location/2"
            ],
            "start": "2016-11-22T11:11:00+01:00",
            "end": "2016-11-30T11:11:00+01:00",
            "participation": "closed",
            "participants": [
              "https://process.stadt.de/stakeholder/3"
            ],
            "transformation": {
              "type": "<",
              "info": "()",
              "decision": "false"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/1291",
                "name": "Dokumentation",
                "description": "Dokumentation",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              },
              {
                "id": "https://process.stadt.de/results/1292",
                "name": "Dokumentation",
                "description": "Bilder",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/130",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/1",
            "connection": {
              "from": [
                "https://process.stadt.de/process/129"
              ],
              "to": [
                "https://process.stadt.de/process/131"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Erstellung Publikation",
            "description": "Platzbuch: Erstellung Publikation",
            "location": [
              "https://process.stadt.de/location/2"
            ],
            "start": "2016-12-01T11:11:00+01:00",
            "end": "2017-03-15T11:11:00+01:00",
            "participation": "partial open",
            "participants": [
              "https://process.stadt.de/stakeholder/4"
            ],
            "transformation": {
              "type": "<",
              "info": "()",
              "decision": "true"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/130",
                "name": "Platzbuch",
                "description": "Platzbuch",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/131",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/1",
            "connection": {
              "from": [
                "https://process.stadt.de/process/130"
              ],
              "to": [
                "https://process.stadt.de/process/132"
              ]
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Abschlussveranstalltung",
            "description": "Abschlussveranstalltung: Vorbereitung und Dokumentation",
            "location": [
              "https://process.stadt.de/location/10"
            ],
            "start": "2017-05-13T11:11:00+01:00",
            "end": "2017-05-13T11:11:00+01:00",
            "participation": "open",
            "participants": [
              "https://process.stadt.de/stakeholder/2",
              "https://process.stadt.de/stakeholder/3",
              "https://process.stadt.de/stakeholder/4",
              "https://process.stadt.de/stakeholder/7",
              "https://process.stadt.de/stakeholder/8",
              "https://process.stadt.de/stakeholder/9",
              "https://process.stadt.de/stakeholder/10",
              "https://process.stadt.de/stakeholder/11",
              "https://process.stadt.de/stakeholder/13",
              "https://process.stadt.de/stakeholder/14"
            ],
            "transformation": {
              "type": "<",
              "info": "()",
              "decision": "false"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/1311",
                "name": "Fotos",
                "description": "Fotos",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              },
              {
                "id": "https://process.stadt.de/results/1312",
                "name": "Poster und Flyer",
                "description": "Poster und Flyer",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              },
              {
                "id": "https://process.stadt.de/results/1313",
                "name": "Präsentation",
                "description": "Präsentation",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              },
              {
                "id": "https://process.stadt.de/results/1314",
                "name": "Ausstellung",
                "description": "Ausstellung",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          },
          {
            "id": "https://process.stadt.de/process/132",
            "reference": "AZ1337/11",
            "initiator": "https://process.stadt.de/stakeholder/1",
            "connection": {
              "from": [
                "https://process.stadt.de/process/131"
              ],
              "to": []
            },
            "parent": "https://process.stadt.de/process/1",
            "childs": [],
            "name": "Dokumentation",
            "description": "Dokumentation Abschlussveranstalltung",
            "location": [
              "https://process.stadt.de/location/2"
            ],
            "start": "2017-05-14T11:11:00+01:00",
            "end": "",
            "participation": "closed",
            "participants": [
              "https://process.stadt.de/stakeholder/3"
            ],
            "transformation": {
              "type": "<",
              "info": "()",
              "decision": "false"
            },
            "results": [
              {
                "id": "https://process.stadt.de/results/1321",
                "name": "Dokumentation",
                "description": "Dokumentation",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              },
              {
                "id": "https://process.stadt.de/results/1322",
                "name": "Fotos",
                "description": "Fotos",
                "copyright": "",
                "text": "",
                "files": [],
                "created": "2011-11-11T11:11:00+01:00",
                "modified": "2012-11-11T11:11:00+01:00"
              }
            ]
          }
        ],
        "stakeholder": [
          {
            "id": "https://process.stadt.de/stakeholder/1",
            "name": "Urban Catalyst",
            "type": "group closed",
            "contact": {
              "contactPerson ": "TODO",
              "postAddress": "TODO",
              "phone": "TODO",
              "telefax": "TODO",
              "email ": "TODO",
              "website ": "TODO"
            },
            "participated": []
          },
          {
            "id": "https://process.stadt.de/stakeholder/2",
            "name": "Studio Umschichten",
            "type": "group closed",
            "contact": {
              "contactPerson ": "TODO",
              "postAddress": "TODO",
              "phone": "TODO",
              "telefax": "TODO",
              "email ": "TODO",
              "website ": "TODO"
            },
            "participated": []
          },
          {
            "id": "https://process.stadt.de/stakeholder/3",
            "name": "Stadtplanungsamt Köln",
            "type": "group closed",
            "contact": {
              "contactPerson ": "TODO",
              "postAddress": "TODO",
              "phone": "TODO",
              "telefax": "TODO",
              "email ": "TODO",
              "website ": "TODO"
            },
            "participated": []
          },
          {
            "id": "https://process.stadt.de/stakeholder/4",
            "name": "Bundesinstitut für Bau-, Stadt-, und Raumplanung",
            "type": "group closed",
            "contact": {
              "contactPerson ": "TODO",
              "postAddress": "TODO",
              "phone": "TODO",
              "telefax": "TODO",
              "email ": "TODO",
              "website ": "TODO"
            },
            "participated": []
          },
          {
            "id": "https://process.stadt.de/stakeholder/5",
            "name": "Rat der Stadt Köln",
            "type": "group closed",
            "contact": {
              "contactPerson ": "TODO",
              "postAddress": "TODO",
              "phone": "TODO",
              "telefax": "TODO",
              "email ": "TODO",
              "website ": "TODO"
            },
            "participated": []
          },
          {
            "id": "https://process.stadt.de/stakeholder/6",
            "name": "Bewerber Beteiligungsverfahren",
            "type": "group closed",
            "contact": {
              "contactPerson ": "TODO",
              "postAddress": "TODO",
              "phone": "TODO",
              "telefax": "TODO",
              "email ": "TODO",
              "website ": "TODO"
            },
            "participated": []
          },
          {
            "id": "https://process.stadt.de/stakeholder/7",
            "name": "Verein",
            "type": "group opened",
            "contact": {
              "contactPerson ": "TODO",
              "postAddress": "TODO",
              "phone": "TODO",
              "telefax": "TODO",
              "email ": "TODO",
              "website ": "TODO"
            },
            "participated": []
          },
          {
            "id": "https://process.stadt.de/stakeholder/8",
            "name": "Interessensverband",
            "type": "group opened",
            "contact": {
              "contactPerson ": "TODO",
              "postAddress": "TODO",
              "phone": "TODO",
              "telefax": "TODO",
              "email ": "TODO",
              "website ": "TODO"
            },
            "participated": []
          },
          {
            "id": "https://process.stadt.de/stakeholder/9",
            "name": "Bürger_Innen",
            "type": "group openend",
            "contact": {
              "contactPerson ": "TODO",
              "postAddress": "TODO",
              "phone": "TODO",
              "telefax": "TODO",
              "email ": "TODO",
              "website ": "TODO"
            },
            "participated": []
          },
          {
            "id": "https://process.stadt.de/stakeholder/10",
            "name": "Politische Vertreter",
            "type": "group closed",
            "contact": {
              "contactPerson ": "TODO",
              "postAddress": "TODO",
              "phone": "TODO",
              "telefax": "TODO",
              "email ": "TODO",
              "website ": "TODO"
            },
            "participated": []
          },
          {
            "id": "https://process.stadt.de/stakeholder/11",
            "name": "Bürgeramt Chorweiler",
            "type": "group closed",
            "contact": {
              "contactPerson ": "TODO",
              "postAddress": "TODO",
              "phone": "TODO",
              "telefax": "TODO",
              "email ": "TODO",
              "website ": "TODO"
            },
            "participated": []
          },
          {
            "id": "https://process.stadt.de/stakeholder/12",
            "name": "Interdisziplinäres Planungsamt",
            "type": "group closed",
            "contact": {
              "contactPerson ": "TODO",
              "postAddress": "TODO",
              "phone": "TODO",
              "telefax": "TODO",
              "email ": "TODO",
              "website ": "TODO"
            },
            "participated": []
          },
          {
            "id": "https://process.stadt.de/stakeholder/13",
            "name": "City-Center-Chorweiler",
            "type": "group closed",
            "contact": {
              "contactPerson ": "TODO",
              "postAddress": "TODO",
              "phone": "TODO",
              "telefax": "TODO",
              "email ": "TODO",
              "website ": "TODO"
            },
            "participated": []
          },
          {
            "id": "https://process.stadt.de/stakeholder/14",
            "name": "GAG Immobilien AG",
            "type": "group closed",
            "contact": {
              "contactPerson ": "TODO",
              "postAddress": "TODO",
              "phone": "TODO",
              "telefax": "TODO",
              "email ": "TODO",
              "website ": "TODO"
            },
            "participated": []
          }
        ],
        "locations": [
          {
            "id": "https://process.stadt.de/location/1",
            "address": "",
            "zip": "",
            "city": "Köln",
            "room": "",
            "geoCoords": {
              "lat": "",
              "lng": ""
            }
          },
          {
            "id": "https://process.stadt.de/location/2",
            "address": "",
            "zip": "",
            "city": "Berlin",
            "room": "",
            "geoCoords": {
              "lat": "",
              "lng": ""
            }
          },
          {
            "id": "https://process.stadt.de/location/3",
            "address": "",
            "zip": "",
            "city": "Stuttgart",
            "room": "",
            "geoCoords": {
              "lat": "",
              "lng": ""
            }
          },
          {
            "id": "https://process.stadt.de/location/4",
            "address": "",
            "zip": "",
            "city": "Bonn",
            "room": "",
            "geoCoords": {
              "lat": "",
              "lng": ""
            }
          },
          {
            "id": "https://process.stadt.de/location/5",
            "address": "City Center Chorweiler",
            "zip": "",
            "city": "Köln",
            "room": "",
            "geoCoords": {
              "lat": "",
              "lng": ""
            }
          },
          {
            "id": "https://process.stadt.de/location/6",
            "address": "Lyoner Passage",
            "zip": "",
            "city": "Köln",
            "room": "",
            "geoCoords": {
              "lat": "",
              "lng": ""
            }
          },
          {
            "id": "https://process.stadt.de/location/7",
            "address": "",
            "zip": "",
            "city": "Hannover",
            "room": "",
            "geoCoords": {
              "lat": "",
              "lng": ""
            }
          },
          {
            "id": "https://process.stadt.de/location/8",
            "address": "Oxforder Passage",
            "zip": "",
            "city": "Köln",
            "room": "",
            "geoCoords": {
              "lat": "",
              "lng": ""
            }
          },
          {
            "id": "https://process.stadt.de/location/9",
            "address": "Bürgerzentrum",
            "zip": "",
            "city": "Köln",
            "room": "",
            "geoCoords": {
              "lat": "",
              "lng": ""
            }
          },
          {
            "id": "https://process.stadt.de/location/10",
            "address": "Pariser Platz",
            "zip": "",
            "city": "Köln",
            "room": "",
            "geoCoords": {
              "lat": "",
              "lng": ""
            }
          },
          {
            "id": "https://process.stadt.de/location/11",
            "address": "unbekannt",
            "zip": "",
            "city": "unbekannt",
            "room": "",
            "geoCoords": {
              "lat": "",
              "lng": ""
            }
          }
        ],
        "created": "2011-11-11T11:11:00+01:00",
        "modified": "2012-11-11T11:11:00+01:00"
      }
    }
  }
}