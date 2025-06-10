import { Component, ElementRef, ViewChild, AfterViewInit, Input } from '@angular/core';
import Drawflow from 'drawflow';

@Component({
  selector: 'app-flujo-conversacional',
  templateUrl: './flujo-conversacional.component.html',
  styleUrls: ['./flujo-conversacional.component.css']
})
export class FlujoConversacionalComponent implements AfterViewInit {
  @ViewChild('editorRef') editorRef!: ElementRef;
  @Input() modo: 'edit' | 'view' = 'edit';

  editor!: any;

  ngAfterViewInit() {
    const container = document.getElementById("drawflow") as HTMLElement;
    this.editor = new Drawflow(container);
    this.editor.start();
    this.setModo(this.modo);
  }

  setModo(modo: 'edit' | 'view') {
    this.editor.editor_mode = modo === 'edit' ? 'edit' : 'fixed';
  }

  seleccionarArchivo() {
    const input = document.getElementById('inputArchivo') as HTMLInputElement;
    input.click();
  }

  cargarFlujoDesdeArchivo(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const archivo = input.files[0];
      const lector = new FileReader();

      lector.onload = (e) => {
        try {
          const contenido = e.target?.result as string;
          const jsonFlujo = JSON.parse(contenido);
          this.editor.clear(); // Limpia el flujo anterior
          this.editor.import(jsonFlujo); // Importa nuevo flujo
        } catch (err) {
          alert("Error al cargar el archivo JSON: " + err);
        }
      };

      lector.readAsText(archivo);
    }
  }


  cargarFlujo() {
    const flujo = {
      "drawflow": {
        "Home": {
          "data": {
            "1": {
              "id": 1,
              "name": "node",
              "data": {},
              "class": "",
              "html": `<div style="padding:10px;background:cyan;border:1px solid black;border-radius:5px;">Hola Mundo</div>`,
              "typenode": false,
              "inputs": {
                "input_1": {
                  "connections": []
                }
              },
              "outputs": {
                "output_1": {
                  "connections": []
                }
              },
              "pos_x": 200,
              "pos_y": 100
            }
          }
        }
      }
    };

    this.editor.clear(); // Limpia el editor antes de cargar
    this.editor.import(flujo);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const json = JSON.parse(e.target.result);
          const flujoPreparado = this.prepararFlujo(json);
          this.editor.clear();
          this.editor.import(flujoPreparado);
        } catch (error) {
          console.error('Error al leer el archivo:', error);
        }
      };
      reader.readAsText(file);
    }
  }
  
  prepararFlujo(flujo: any): any {
    const nodos = flujo.drawflow?.Home?.data || {};
  
    for (const key in nodos) {
      const nodo = nodos[key];
      const tipo = nodo.name;
      const data = nodo.data;
  
      if (tipo === 'bienvenida') {
        nodo.html = `
          <div style="padding:10px;background:cyan;border:1px solid black;border-radius:5px">
            <p>${data.mensaje}</p>
            <button>${data.boton1_texto}</button>
            <button>${data.boton2_texto}</button>
          </div>`;
      } else if (tipo === 'mensaje') {
        nodo.html = `
          <div style="padding:10px;background:#ddf;border:1px solid #88c;border-radius:5px">
            <p>${data.mensaje}</p>
          </div>`;
      }
    }
  
    return flujo;
  }
  
}
