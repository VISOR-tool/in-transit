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

    return this.download(process).then( oproc => {return oproc});
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
    return{
      "system": {
        "_comment": "Es handelt sich um die Systembeschreibung",
        "id": "https://oproc.dresden.org/",
        "type": "https://schema.oproc.org/0.1/system",
        "entrypoints": "https://process.stadt.de/process/",
        "name": "Beispiel-System"
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
        "id": "https://process.stadt.de/process/0",
        "initiator": "https://process.stadt.de/stakeholder/0",
        "connection": {
          "from": [],
          "to": []
        },
        "parent": "",
        "name": "mini winzig",
        "description": "Ein Prozess mit einigen Verzweigungen",
        "participation": "partial opened",
        "participants": [
          "https://process.stadt.de/stakeholder/1"
        ],
        "childs": [
          {
            "id": "https://process.stadt.de/process/1",
            "initiator": "https://process.stadt.de/stakeholder/1",
            "connection": {
              "from": [],
              "to": []
            },
            "parent": "https://process.stadt.de/process/0",
            "childs": [
            ],
            "name": "Foo-1",
            "start": "2015-01-01T11:11:00+01:00",
            "end": "2017-12-31T23:59:00+01:00",
            "participants": [
              "https://process.stadt.de/stakeholder/2"
            ]
          },
          {
            "id": "https://process.stadt.de/process/2",
            "initiator": "https://process.stadt.de/stakeholder/2",
            "connection": {
              "from": [],
              "to": []
            },
            "parent": "https://process.stadt.de/process/0",
            "childs": [
            ],
            "name": "Foo-2",
            "start": "2015-01-01T11:11:00+01:00",
            "end": "2017-12-31T23:59:00+01:00",
            "participants": [
              "https://process.stadt.de/stakeholder/2"
            ]
          },
          {
            "id": "https://process.stadt.de/process/3",
            "initiator": "https://process.stadt.de/stakeholder/3",
            "connection": {
              "from": [],
              "to": []
            },
            "parent": "https://process.stadt.de/p rocess/0",
            "childs": [
            ],
            "name": "Foo-3",
            "start": "2015-01-01T11:11:00+01:00",
            "end": "2017-12-31T23:59:00+01:00",
            "participants": [
              "https://process.stadt.de/stakeholder/2"
            ]
          }
        ]
      },
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
        }
      ]
    }
  }
}
