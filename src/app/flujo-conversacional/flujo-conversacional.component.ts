import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
// @ts-ignore
import Drawflow from 'drawflow';


interface NodoDrawflow {
  id: number;
  name: string;
  data: any;
  html: string;
  inputs: { [key: string]: { connections: Array<{ node: number; input: string }> } };
  outputs: { [key: string]: { connections: Array<{ node: number; output: string }> } };
  pos_x: number;
  pos_y: number;
}

@Component({
  selector: 'app-flujo-conversacional',
  templateUrl: './flujo-conversacional.component.html',
  styleUrls: ['./flujo-conversacional.component.css']
})
export class FlujoConversacionalComponent implements AfterViewInit {
  @ViewChild('editorRef') editorRef!: ElementRef;
  @Input() modo: 'edit' | 'view' = 'edit';

  editor!: Drawflow;

  ngAfterViewInit() {
    this.editor = new Drawflow(this.editorRef.nativeElement);
    this.editor.start();
    this.setModo(this.modo);
  }

  setModo(modo: 'edit' | 'view') {
    this.editor.editor_mode = modo === 'edit' ? 'edit' : 'fixed';
  }

  exportFlow(): any {
    return this.editor.export();
  }

  loadFlow(json: any) {
    this.editor.clear();
    this.editor.import(json);
    setTimeout(() => this.bindEventsGlobal(), 300);
  }

  addWelcomeFlowNode() {
    const html = `
      <div style="width: 250px; font-family: sans-serif; padding: 10px;">
        <strong>Mensaje:</strong><br>
        <textarea df-name="mensaje" rows="4" style="width: 100%;"></textarea><br><br>

        <strong>Botón 1:</strong><br>
        <input type="text" df-name="btn1_texto" placeholder="Texto botón 1" style="width: 100%;" /><br>
        <input type="text" df-name="btn1_accion" placeholder="Acción botón 1" style="width: 100%;" /><br><br>

        <strong>Botón 2:</strong><br>
        <input type="text" df-name="btn2_texto" placeholder="Texto botón 2" style="width: 100%;" /><br>
        <input type="text" df-name="btn2_accion" placeholder="Acción botón 2" style="width: 100%;" />
      </div>
    `;

    const nodeId = this.editor.addNode(
      'mensaje_botones',
      1,
      2,
      200,
      200,
      'Mensaje + Botones',
      {
        mensaje: '',
        btn1_texto: '',
        btn1_accion: '',
        btn2_texto: '',
        btn2_accion: ''
      },
      html
    );

    setTimeout(() => this.bindInputSync(nodeId), 100);
  }

  addTextNode() {
    const html = `
      <div style="width: 200px; font-family: sans-serif; padding: 10px;">
        <strong>Mensaje:</strong><br>
        <textarea df-name="mensaje" rows="4" style="width: 100%;"></textarea>
      </div>
    `;

    const nodeId = this.editor.addNode(
      'nodo_texto',
      1,
      1,
      300,
      200,
      'Mensaje',
      { mensaje: '' },
      html
    );

    setTimeout(() => this.bindInputSync(nodeId), 100);
  }

  addListaEditableNode() {
    const html = `
      <div style="width: 260px; font-family: sans-serif;">
        <strong>📝 Menú de Opciones</strong><br><br>
        <input placeholder="Opción 1" df-name="opcion1" style="width: 100%; margin-bottom: 5px;" /><br>
        <input placeholder="Opción 2" df-name="opcion2" style="width: 100%; margin-bottom: 5px;" /><br>
        <input placeholder="Opción 3" df-name="opcion3" style="width: 100%; margin-bottom: 5px;" /><br>
        <input placeholder="Opción 4" df-name="opcion4" style="width: 100%; margin-bottom: 5px;" /><br>
        <button id="guardar-opciones">Guardar Opciones</button>
      </div>
    `;

    const nodeId = this.editor.addNode(
      'lista_editable',
      1,
      1,
      350,
      300,
      'Listado Editable',
      { opcion1: '', opcion2: '', opcion3: '', opcion4: '' },
      html
    );

    setTimeout(() => {
      this.bindInputSync(nodeId);
      this.bindGuardarLista(nodeId);
    }, 100);
  }

  bindInputSync(nodeId: number) {
    const el = document.querySelector(`#node-${nodeId}`);
    if (!el) return;

    const inputs = el.querySelectorAll('[df-name]');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        const nodo = this.editor.getNodeFromId(nodeId);
        this.sincronizarDatosNodo(nodeId, nodo);
      });
    });
  }

  sincronizarDatosNodo(nodeId: number, nodo: NodoDrawflow) {
    if (!nodo || !nodo.data) return;

    const domNode = document.querySelector(`#node-${nodeId}`);
    if (!domNode) return;

    const inputs = domNode.querySelectorAll('[df-name]');
    inputs.forEach(input => {
      const nombreCampo = input.getAttribute('df-name');
      if (nombreCampo) {
        const valor = (input as HTMLInputElement).value;
        nodo.data[nombreCampo] = valor;
      }
    });
  }

  bindGuardarLista(nodeId: number) {
    const el = document.querySelector(`#node-${nodeId}`);
    const btn = el?.querySelector('#guardar-opciones');
    btn?.addEventListener('click', () => {
      const nodo = this.editor.getNodeFromId(nodeId);
      this.sincronizarDatosNodo(nodeId, nodo);
      alert('Opciones guardadas correctamente.');
    });
  }

  bindEventsGlobal() {
    const allNodes = Object.values(this.editor.drawflow.Home.data) as NodoDrawflow[];
    for (const nodo of allNodes) {
      this.sincronizarDatosNodo(nodo.id, nodo);
    }
  }

  guardar() {
    const fullData = this.editor.export();

    if (!fullData.drawflow || !fullData.drawflow.Home) return;

    const dataHome = fullData.drawflow.Home.data;

    for (const idStr of Object.keys(dataHome)) {
      const nodeId = parseInt(idStr);
      this.sincronizarDatosNodo(nodeId, dataHome[idStr]);
    }

    const nodosFiltrados = Object.entries(dataHome as { [key: string]: NodoDrawflow })
    .filter(([_, nodo]) =>
      ['welcome_flow', 'mensaje_botones', 'nodo_texto', 'lista_editable'].includes(nodo.name)
    )
    .reduce((acc, [id, nodo]) => {
      acc[id] = nodo;
      return acc;
    }, {} as { [key: string]: NodoDrawflow });
  

    const dataReducido = {
      drawflow: {
        Home: {
          data: nodosFiltrados
        }
      }
    };

    localStorage.setItem('flujo-conversacional', JSON.stringify(dataReducido));
  }

  cargar() {
    const json = localStorage.getItem('flujo-conversacional');
    if (json) {
      this.loadFlow(JSON.parse(json));
    }
  }
}
