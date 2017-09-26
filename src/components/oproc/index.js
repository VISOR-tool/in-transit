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
  constructor( json ) {
    super();
    this.oproc = json;
    console.log("loading Oproc..", this.test_loading_ok() );
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

  subprocessNames(){

    let names = this.oproc.process.childs.map(child => child.name);
    return names;

    return [
      { id: "test-a", shape: "circle", size: 28, title: "Housten", x:  0, y:  -0.5,},
      { id: "test-b", shape: "square", size: 28, title: "Bejing", x:  1, y:  -1,},
      { id: "test-c", shape: "square", size: 28, title: "Capital City", x:  2, y:  -1.5,},
      { id: "test-d", shape: "circle", size: 28, title: "Pretoria", x:  -2, y:  2,},
      ];
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
}
