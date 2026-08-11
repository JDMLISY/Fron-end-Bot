import { Component, ElementRef, ViewChild, AfterViewInit, Input } from '@angular/core';
import Drawflow from 'drawflow';
import { AuthService } from '../_services/auth.service';
import { ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-flujo-conversacional',
  templateUrl: './flujo-conversacional.component.html',
  styleUrls: ['./flujo-conversacional.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FlujoConversacionalComponent implements AfterViewInit {
  @ViewChild('editorRef') editorRef!: ElementRef;
  @Input() modo: 'edit' | 'view' = 'edit';

  editor!: any;
  nodos = [
    { tipo:"Aceptacion", nombre:"Inicio y politica tratamiento de datos", descripcion:"Punto inicial del bot" },
    { tipo:"menu", nombre:"Menú ", descripcion:"Mostrar 10 opciones" },
    { tipo:"archivo", nombre:"Archivo", descripcion:"Enviar documento o PDF" },
    { tipo:"imagen", nombre:"Imagen", descripcion:"Enviar imagen" },
    { tipo:"Texto", nombre:"mensaje", descripcion:"Enviar mensaje" },
  
  ];
  
   constructor(private authService: AuthService ) {
 
 

   }

  ngAfterViewInit() {
    const container = document.getElementById("drawflow") as HTMLElement;
    this.editor = new Drawflow(container);
    
    this.editor.start();
    setTimeout(() => {
      
      this.editor.zoom_reset();
    }, 200);
    
    // (window as any).agregarOpcion = (btn:any)=>{
    //   this.agregarOpcion(btn);
    //   };
      (window as any).agregarOpcion = this.agregarOpcion.bind(this);
     
  
   this.editor.reroute = true;
this.editor.reroute_fix_curvature = true;
this.editor.reroute_width = 6;
this.editor.curvature = 0;

    // this.editor.on('nodeMoved', (id: any) => {

    //   const grid = 25;
    
    //   const node = this.editor.getNodeFromId(id);
    
    //   const x = Math.round(node.pos_x / grid) * grid;
    //   const y = Math.round(node.pos_y / grid) * grid;
    
    //   this.editor.updateNodePosition(id, x, y);
    
    // });
    this.setModo(this.modo);
    this.cargarFlujoGuardado();
  
  }


  // async cargarFlujoGuardado() {
  //   try {
  //     // Aquí llamas a tu API que devuelve el flujo guardado
  //     const flujo: any = await this.authService.RequestDataobject({}, 'cargarflujo', 'Call center').toPromise();

  //     if (!flujo) {
  //       console.log('⚠️ No se encontró flujo guardado');
  //       return;
  //     }

  //     // 3️⃣ Importar el JSON al editor
  //     const flujoObj = JSON.parse(flujo);
  //     this.editor.import(flujoObj);

  //     console.log('✅ Flujo cargado y visualizado correctamente');

  //   } catch (err) {
  //     console.error('❌ Error cargando flujo:', err);
  //   }
  // }

  async cargarFlujoGuardado() {
    try {
  
      const flujo: any = await this.authService
        .RequestDataobject({}, 'cargarflujo', 'Call center')
        .toPromise();
  
      if (!flujo) {
        console.log('⚠️ No se encontró flujo guardado');
        return;
      }
  
      const flujoObj = JSON.parse(flujo);
  
      this.editor.import(flujoObj);
  
      // reconstruir opciones
      setTimeout(() => {
        this.reconstruirMenus(flujoObj);
      }, 100);
      this.ordenarFlujo()
      console.log('✅ Flujo cargado');
  
    } catch (err) {
      console.error('❌ Error cargando flujo:', err);
    }
  }

  reconstruirMenus(flujo: any) {

    const nodos = flujo.drawflow.Home.data;
    
    Object.values(nodos).forEach((nodo: any) => {
    
    if (nodo.name !== "menu") return;
    
    const container = document.querySelector(
    `#node-${nodo.id} .menu-opciones`
    ) as HTMLElement;
    
    if (!container) return;
    
    container.innerHTML = "";
    
    /* -------------------------
    NUEVO FORMATO (opciones[])
    ------------------------- */
    
    if (Array.isArray(nodo.data.opciones)) {
    
    nodo.data.opciones.forEach((op:any,i:number)=>{
    
    const div = document.createElement("div");
    
    div.className = "menu-item";
    
    div.innerHTML = `
    <input type="text" class="opcion-titulo" value="${op.titulo || ""}" placeholder="Título opción">
    
    <textarea class="opcion-descripcion" placeholder="Descripción (opcional)">${op.descripcion || ""}</textarea>
    
    <button onclick="this.parentElement.remove()">❌</button>
    `;
    
    container.appendChild(div);
    
    // asegurar outputs
    if(!nodo.outputs[`output_${i+1}`]){
    this.editor.addNodeOutput(nodo.id);
    }
    
    });
    
    return;
    
    }
    
    /* -------------------------
    FORMATO ANTIGUO (op1,op2)
    ------------------------- */
    
    const opciones = Object.keys(nodo.data)
    .filter(key => /^op\d+$/.test(key))
    .sort((a, b) => {
    const numA = parseInt(a.replace("op", ""));
    const numB = parseInt(b.replace("op", ""));
    return numA - numB;
    });
    
    opciones.forEach((key) => {
    
    const texto = nodo.data[key];
    
    if (!texto) return;
    
    const btn = document.createElement("button");
    btn.className = "btn-opcion";
    btn.innerText = texto;
    
    container.appendChild(btn);
    
    });
    
    /* sincronizar outputs */
    
    const totalOpciones = opciones.length;
    const totalOutputs = Object.keys(nodo.outputs).length;
    
    if (totalOutputs > totalOpciones) {
    
    for (let i = totalOutputs; i > totalOpciones; i--) {
    
    this.editor.removeNodeOutput(nodo.id, `output_${i}`);
    
    }
    
    }
    
    });
    
    }

  // reconstruirMenus(flujo: any) {

  //   const nodos = flujo.drawflow.Home.data;
  
  //   Object.values(nodos).forEach((nodo: any) => {
  
  //     if (nodo.name !== "menu") return;
  
  //     const container = document.querySelector(
  //       `#node-${nodo.id} .menu-opciones`
  //     ) as HTMLElement;
  
  //     if (!container) return;
  
  //     container.innerHTML = "";
  
  //     const opciones = Object.keys(nodo.data)
  //       .filter(key => /^op\d+$/.test(key))
  //       .sort((a, b) => {
  //         const numA = parseInt(a.replace("op", ""));
  //         const numB = parseInt(b.replace("op", ""));
  //         return numA - numB;
  //       });
  
  //     // crear botones
  //     opciones.forEach((key) => {
  
  //       const texto = nodo.data[key];
  
  //       if (!texto) return;
  
  //       const btn = document.createElement("button");
  //       btn.className = "btn-opcion";
  //       btn.innerText = texto;
  
  //       container.appendChild(btn);
  
  //     });
  
  //     // 🔥 sincronizar outputs con opciones
  //     const totalOpciones = opciones.length;
  //     const totalOutputs = Object.keys(nodo.outputs).length;
  
  //     if (totalOutputs > totalOpciones) {
  
  //       for (let i = totalOutputs; i > totalOpciones; i--) {
  
  //         this.editor.removeNodeOutput(nodo.id, `output_${i}`);
  
  //       }
  
  //     }
  
  //   });
  
  // }

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






  crearNodo(tipo:any){
    
    switch(tipo){
     
    case "Aceptacion":
    
    this.editor.addNode(
      "Aceptacion",
      1,
      2,
      300,
      200,
      "Aceptacion",
      {texto:"Seleccione",
      esperarespuesta: "",
      op1:"Opción 1",op2:"Opción 2",
      AccionIA:"Seleccione" },
      `
      <div class="nodo nodo-aceptacion">
      
      <div class="nodo-header">
      ✔ Aceptación
      </div>
      
      <div class="nodo-body">
      
      <textarea df-texto placeholder="Mensaje al usuario"></textarea>
      
      <input type="text" df-op1 placeholder="Botón 1">
      
      <input type="text" df-op2 placeholder="Botón 2">
      
      </div>
      <label>Esperar respuesta:</label>
      <select df-esperaRespuesta>
        <option value="si">Sí</option>
        <option value="no">No</option>
      </select>
      <label>Acción IA:</label>
      <select df-AccionIA>
      <option value="Politicas">Politicas</option>
      <option value="Menù principal">Menù principal</option>
     </select>
      </div>
      `
      );
    break;
    
    case "Texto":
      this.editor.addNode(
        "mensaje",
        1,
        1,
        200,
        200,
        "mensaje",
        {
          texto: "Ingresa tu identificación",
          tipodato: "",
          esperarespuesta: "",
          esconfirmacion: "no",
          AccionIA:"Seleccione" 
        },
        `
        <div class="nodo nodo-aceptacion">
      
          <div class="nodo-header">
            📥Mensaje
          </div>
      
          <textarea df-texto placeholder="Pregunta al usuario"></textarea>
      
          <label>Tipo de dato:</label>
          <select df-tipoDato>
            <option value="">Seleccionar</option>
            <option value="Identificacion">Identificación</option>
            <option value="Nombre">Nombre</option>
            <option value="Valor">Valor</option>
            <option value="TipoAhorro">Tipo ahorro</option>
            <option value="Correo">Correo</option>
            <option value="Telefono">Telefono</option>
            <option value="Convenio">Convenio</option>
            <option value="Entradas">Entradas</option>
            <option value="Combo1">Combo1</option>
            <option value="Combo2">Combo2</option>
            <option value="Imagen">Imagen</option>
            <option value="Año">Año</option>
            <option value="Documento">Documento</option>
            <option value="Radicado">Radicado</option>
            <option value="Radicado y Asesor">asesor</option>
            <option value="Cierre atención">Cierre atención</option>
          </select>
      
          <label>Esperar respuesta:</label>
          <select df-esperaRespuesta>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
      
          <label>¿Es Confirmación de datos?</label>
          <select df-esconfirmacion>
            <option value="no">No</option>
            <option value="si">Sí</option>
          </select>
      
          <label>Acción IA:</label>
      <select df-AccionIA>
      <option value="Politicas">Politicas</option>
      <option value="Menù principal">Menù principal</option>
     </select>
   
        </div>
        `
      );
//       this.editor.addNode(
//         "mensaje",
//         1,
//         1,
//         200,
//         200,
//         "mensaje",
//         {
//           texto: "Ingresa tu identificación",
//           tipodato: "",
//           esperarespuesta: "",
//           esconfirmacion: "no"
//         },
//         `
//            <div class="nodo nodo-aceptacion">
      
//           <div class="nodo-header">
//             📥Mensaje
//           </div>
      
//           <textarea df-texto placeholder="Pregunta al usuario"></textarea>
      
//           <label>Tipo de dato:</label>
//           <select df-tipoDato>
//             <option value="">Seleccionar</option>
//             <option value="Identificacion">Identificación</option>
//             <option value="Nombre">Nombre</option>
//             <option value="Valor">Valor</option>
//             <option value="TipoAhorro">Tipo ahorro</option>
//             <option value="Correo">Correo</option>
//             <option value="Telefono">Telefono</option>
//             <option value="Convenio">Convenio</option>
//             <option value="Entradas">Entradas</option>
//             <option value="Combo1">Combo1</option>
//             <option value="Combo2">Combo2</option>
//             <option value="Imagen">Imagen</option>
//             <option value="Año">Año</option>
//             <option value="Documento">Documento</option>
//             <option value="Radicado">Radicado</option>
//             <option value="Radicado y Asesor">asesor</option>
//             <option value="Cierre atención">Cierre atención</option>
//           </select>
          
//           <label>Esperar respuesta:</label>
//           <select df-esperaRespuesta>
//             <option value="si">Sí</option>
//             <option value="no">No</option>
//           </select>
          
//           <label>¿Es Confirmación de datos?</label>
//           <select df-esconfirmacion>
//             <option value="no">No</option>
//             <option value="si">Sí</option>
//           </select>
      
//         </div>
//         `
//       );
//       // this.editor.addNode(
//       //   "mensaje",
//       //   1,
//       //   1,
//       //   200,
//       //   200,
//       //   "mensaje",
//       //   {
//       //     texto: "Mensaje",
//       //     esperarespuesta: "no"
//       //   },
//       //   `
//       //   <div class="nodo nodo-aceptacion">
      
//       //     <div class="nodo-header">
//       //       💬 Mensaje
//       //     </div>
      
//       //     <textarea df-texto placeholder="Mensaje al usuario"></textarea>
      
//       //     <label>Esperar respuesta:</label>
//       //     <select df-esperaRespuesta>
//       //       <option value="no">No (continuar flujo)</option>
//       //       <option value="si">Sí (esperar usuario)</option>
//       //     </select>
      
//       //   </div>
//       //   `
//       // );
     break;
    
     case "menu":
this.editor.addNode(
  "menu",
  1,
  1,
  300,
  400,
  "menu",
  {
    texto: "Seleccione",
    opciones: [
      { titulo: "Opción 1", descripcion: "" },
      { titulo: "Opción 2", descripcion: "" }
    ],
    esperarespuesta: "",
    esconfirmacion: "no",
    esmenuprincipal: "no",
    tipodato: "",
    AccionIA:"Seleccione" 
  },
  `
<div class="nodo nodo-aceptacion">

<div class="nodo-header">
📋 Menú
</div>

<textarea df-texto></textarea>

<div class="nodo menu-opciones" id="menu-opciones">
</div>

<button class="btn-opcion" onclick="agregarOpcion(this)">
+ Agregar opción
</button>

<hr>

<label>Esperar respuesta:</label>
<select df-esperarespuesta>
<option value="si">Sí</option>
<option value="no">No</option>
</select>

<label>¿Es Confirmación de datos?</label>
<select df-esconfirmacion>
<option value="no">No</option>
<option value="si">Sí</option>
</select>

<label>¿Es Menú principal?</label>
<select df-esmenuprincipal>
<option value="no">No</option>
<option value="si">Sí</option>
</select>

<label>Tipo de dato:</label>
<select df-tipoDato>
<option value="">Seleccionar</option>
<option value="Identificacion">Identificación</option>
<option value="Nombre">Nombre</option>
<option value="Valor">Valor</option>
<option value="TipoAhorro">Tipo ahorro</option>
<option value="Correo">Correo</option>
<option value="Telefono">Telefono</option>
<option value="Convenio">Convenio</option>
<option value="Entradas">Entradas</option>
<option value="Combo1">Combo1</option>
<option value="Combo2">Combo2</option>
<option value="Imagen">Imagen</option>
<option value="Año">Año</option>
<option value="Documento">Documento</option>
<option value="Radicado">Radicado</option>
<option value="Radicado y Asesor">asesor</option>
<option value="Cierre atención">Cierre atención</option>
</select>

<label>Acción IA:</label>
<select df-AccionIA>
<option value="Politicas">Politicas</option>
<option value="Menù principal">Menù principal</option>
</select>

</div>
`
);
//       this.editor.addNode(
//         "menu",
//         1,
//         1,
//         300,
//         400,
//         "menu",
//         {
//         texto:"Seleccione",
//         opciones:[
//           {titulo:"Opción 1", descripcion:""},
//           {titulo:"Opción 2", descripcion:""}
//          ],
//          esperarespuesta: "" ,
//          esconfirmacion:"no",  
//          esmenuprincipal:"no", 
//          tipodato: "",    
//         },
//         `
//         <div class="nodo nodo-aceptacion">
        
//         <div class="nodo-header">
//         📋 Menú
//         </div>
        
//         <textarea df-texto></textarea>
        
//         <div class="nodo menu-opciones" id="menu-opciones">
//         </div>
        
//         <button class="btn-opcion" onclick="agregarOpcion(this)">
//         + Agregar opción
//         </button>
        
//         <hr>
        
        
//         <label>Esperar respuesta:</label>
//         <select df-esperarespuesta>
//           <option value="si">Sí</option>
//           <option value="no">No</option>
//         </select>
//         <label>¿Es Confirmación de datos?</label>
//         <select df-esconfirmacion>
//         <option value="no">No</option>
//         <option value="si">Sí</option>
//         </select>
//         <label>¿Es Menú principal?</label>
//         <select df-esmenuprincipal>
//         <option value="no">No</option>
//         <option value="si">Sí</option>
//         </select>
//         <label>Tipo de dato:</label>
//         <select df-tipoDato>
//           <option value="">Seleccionar</option>
//           <option value="Identificacion">Identificación</option>
//           <option value="Nombre">Nombre</option>
//           <option value="Valor">Valor</option>
//           <option value="TipoAhorro">Tipo ahorro</option>
//           <option value="Correo">Correo</option>
//           <option value="Telefono">Telefono</option>
//           <option value="Convenio">Convenio</option>
//           <option value="Entradas">Entradas</option>
//           <option value="Combo1">Combo1</option>
//           <option value="Combo2">Combo2</option>
//           <option value="Imagen">Imagen</option>
//           <option value="Año">Año</option>
//           <option value="Documento">Documento</option>
//           <option value="Radicado">Radicado</option>
//           <option value="Radicado y Asesor">asesor</option>
//           <option value="Cierre atención">Cierre atención</option>
//         </select>
                        
//         </div>
//         `
//         );
//     // this.editor.addNode(
//     //   "menu",
//     //   1,
//     //   1,
//     //   300,
//     //   400,
//     //   "menu",
//     //   {
//     //   texto:"Seleccione",
//     //   opciones:["Opción 1","Opción 2"]
//     //   },
//     //   `
//     //   <div class="nodo nodo-aceptacion">
//     //   <div class="nodo-header">
//     //   📋 Menú
//     //   </div>
      
      
      
//     //   <textarea df-texto></textarea>
      
//     //   <div class=" nodo menu-opciones" id="menu-opciones">
//     //   </div>
      
//     //   <button class="btn-opcion" onclick="agregarOpcion(this)">
//     //   + Agregar opción
//     //   </button>
      
//     //   </div>
//     //   `
//     //   );
     break;
    
    case "archivo":
      this.editor.addNode(
        "Archivo",
        1,
        1,
        500,
        200,
        "Archivo",
        {
          texto: "Aquí está tu archivo",
          documento: "https://mi-servidor.com/archivo.pdf",
          filename: "archivo.pdf",
          esperarespuesta: "",
          AccionIA: ""
        },
        `
      <div class="nodo nodo-aceptacion">
      
      <div class="nodo-header">
      📄 Archivo
      </div>
      
      <input type="text" df-texto placeholder="Mensaje al usuario">
      
      <input type="text" df-documento placeholder="URL del archivo">
      
      <input type="text" df-filename placeholder="Nombre del archivo">
      
      <label>Esperar respuesta:</label>
      <select df-esperaRespuesta>
      <option value="si">Sí</option>
      <option value="no">No</option>
      </select>
      
      <label>Acción IA:</label>
      <input type="text" df-accionia placeholder="Ej: CERTIFICADO_LABORAL">
      
      </div>
      `
      );
//     this.editor.addNode(
//       "Archivo",
//       1, // entrada
//       1, // salida
//       500, 200,
//       "Archivo",
//       { 
//         texto: "Aquí está tu archivo",
//         documento: "https://mi-servidor.com/archivo.pdf",
//         filename: "archivo.pdf",
//         esperarespuesta: "",
       
//       },
//       `
//       <div class="nodo nodo-aceptacion">
//       <div class="nodo-header">
//       📄 Archivo
//       </div>
        
//         <input type="text" df-texto placeholder="Mensaje al usuario" value="Aquí está tu archivo">
//         <input type="text" df-documento placeholder="URL del archivo" value="https://mi-servidor.com/archivo.pdf">
//         <input type="text" df-filename placeholder="Nombre del archivo" value="archivo.pdf">

        
//         <label>Esperar respuesta:</label>
//         <select df-esperaRespuesta>
//           <option value="si">Sí</option>
//           <option value="no">No</option>
//         </select>

    
//       </div>

    
//       `
//     );
    
    break;
    
     case "imagen":

     this.editor.addNode(
      "imagen",
      1,
      1,
      600,
      300,
      "imagen",
      {
        url: "",
        esconfirmacion: "no",
        esperarespuesta: "",
        accionia: ""
      },
      `
    <div class="nodo nodo-aceptacion">
    
    <div class="nodo-header">
    🖼 Imagen
    </div>
    
    <strong>Imagen</strong>
    
    <input type="text" df-url placeholder="URL Imagen">
    
    <label>¿Espera respuesta?</label>
    
    <select df-esperaRespuesta>
    <option value="si">Sí</option>
    <option value="no">No</option>
    </select>
    
    <label>Acción IA:</label>
    <input type="text" df-accionia placeholder="Ej: ENVIAR_IMAGEN">
    
    </div>
    `
    );
    
//     this.editor.addNode(
//     "imagen",
//     1,
//     1,
//     600,
//     300,
//     "imagen",
//     {url:"",
//     esconfirmacion:"no",  
//     esperarespuesta: "",
    
//     },
//     `
//     <div class="nodo nodo-aceptacion">
//     <div class="nodo-header">
//     🖼  Imagen
//     </div>
//     <strong>Imagen</strong>
//     <input type="text" df-url placeholder="URL Imagen">
//     <label>¿Espera respuesta?</label>    
//         <select df-esperaRespuesta>
//           <option value="si">Sí</option>
//           <option value="no">No</option>
//         </select>
//     </div>

// </div>
//     `
//     );
         break;
    
 
    }
    
    }
 
    // ordenarFlujo() {

    //   const nodos = this.editor.drawflow.drawflow.Home.data;
    
    //   let x = 50;
    //   let y = 50;
    
    //   const espacioVertical = 180;
    //   const espacioHorizontal = 450;
    
    //   let contador = 0;
    
    //   Object.keys(nodos).forEach((id: any) => {
    
    //     nodos[id].pos_x = x;
    //     nodos[id].pos_y = y;
    
    //     // mover nodo visualmente
    //     const nodoHtml = document.querySelector(`#node-${id}`) as HTMLElement;
    
    //     if (nodoHtml) {
    //       nodoHtml.style.left = x + "px";
    //       nodoHtml.style.top = y + "px";
    //     }
    
    //     y += espacioVertical;
    //     contador++;
    
    //     if (contador % 8 === 0) {
    //       y = 50;
    //       x += espacioHorizontal;
    //     }
    
    //   });
    
    //   this.editor.updateConnectionNodes('node-1'); // refrescar conexiones
    // }

    ordenarFlujo() {

      const nodos = this.editor.drawflow.drawflow.Home.data;
    
      let x = 50;
      let y = 50;
    
      const espacioVertical = 180;
      const espacioHorizontal = 450;
    
      let contador = 0;
    
      Object.keys(nodos).forEach((id: any) => {
    
        nodos[id].pos_x = x;
        nodos[id].pos_y = y;
    
        const nodoHtml = document.querySelector(`#node-${id}`) as HTMLElement;
    
        if (nodoHtml) {
          nodoHtml.style.left = x + "px";
          nodoHtml.style.top = y + "px";
        }
    
        this.editor.updateConnectionNodes(`node-${id}`);
    
        y += espacioVertical;
        contador++;
    
        if (contador % 8 === 0) {
          y = 50;
          x += espacioHorizontal;
        }
    
      });
    
      // 🔹 reducir zoom
      this.editor.zoom = 0.3;
      this.editor.zoom_refresh();
    
      // 🔹 centrar flujo
    //  this.editor.fit_view();
    
    }


    agregarOpcion(btn: HTMLElement){

      const nodoHTML = btn.closest(".drawflow-node") as HTMLElement;
      const contenedor = nodoHTML.querySelector(".menu-opciones") as HTMLElement;
      
      const nodeId = nodoHTML.id.replace("node-","");
      
      // crear nuevo output en drawflow
      this.editor.addNodeOutput(nodeId);
      
      // crear opción visual
      const div = document.createElement("div");
      
      div.classList.add("menu-item");
      
      div.innerHTML = `
      <input type="text" placeholder="Título opción" class="opcion-titulo">
      
      <textarea placeholder="Descripción (opcional)" class="opcion-descripcion"></textarea>
      
      <button onclick="this.parentElement.remove()">❌</button>
      `;
      
      contenedor.appendChild(div);
      
      }



      obtenerOpcionesMenu(nodoHTML: HTMLElement){

        const items = nodoHTML.querySelectorAll(".menu-item");
        
        const opciones:any = [];
        
        items.forEach((item:any)=>{
        
        const titulo = item.querySelector(".opcion-titulo")?.value || "";
        const descripcion = item.querySelector(".opcion-descripcion")?.value || "";
        
        opciones.push({
        titulo: titulo,
        descripcion: descripcion
        });
        
        });
        
        return opciones;
        
        }
    // agregarOpcion(btn: HTMLElement){

    //   const nodo = btn.closest(".drawflow-node") as HTMLElement;
      
    //   const contenedor = nodo.querySelector(".menu-opciones") as HTMLElement;
      
    //   const index = contenedor.children.length + 1;
      
    //   const input = document.createElement("input");
      
    //   input.placeholder = "Opción " + index;
      
    //   input.setAttribute("df-op"+index,"");
      
    //   contenedor.appendChild(input);
      
    //   /* crear output */
      
    //   const id = nodo.id.replace("node-","");
      
    //   this.editor.addNodeOutput(id);
      
    //   }
    guardarFlujo() {
      if (!this.editor) {
        alert('Editor no inicializado');
        return;
      }
    


      const nodos = document.querySelectorAll(".drawflow-node");

      nodos.forEach((nodo:any)=>{
      
      if(nodo.querySelector(".menu-opciones")){
      
      const nodeId = nodo.id.replace("node-","");
      const node = this.editor.getNodeFromId(nodeId);
      
      node.data.opciones = this.obtenerOpcionesMenu(nodo);
      
      this.editor.updateNodeDataFromId(nodeId,node.data);
      
      }
      
      });



      // Exporta el flujo actual desde Drawflow
      const flujo = this.editor.export();
    
      // Aquí puedes enviar también el usuario o algún identificador si quieres
      const numeroUsuario = '573001112233'; // o '' si no tienes uno
    
      // Prepara el objeto con datos que enviarás
      const dataEnviar = {
        flujo: flujo,
        usuario: numeroUsuario
      };
    
      // Llama a tu servicio para guardar, suponiendo que RequestDataobject recibe (data, acción, otroParametro)
      this.authService.RequestDataobject(dataEnviar, 'guardarflujo', "Call center")
        .subscribe({
          next: (res) => {
            console.log('✅ Flujo guardado:', res);
            alert('Flujo guardado correctamente');
          },
          error: (err) => {
            console.error('❌ Error al guardar flujo:', err);
            alert('Error al guardar el flujo');
          }
        });
    }
    // reiniciarFlujo() {
    //   if (!this.editor) return;
    
    //   // 1️⃣ Limpiar todos los nodos y conexiones
    //   this.editor.clear();
    
    //   // 2️⃣ Limpiar workspace "Home"
    //   if (!this.editor.drawflow) this.editor.drawflow = {};
    //   if (!this.editor.drawflow.Home) this.editor.drawflow.Home = { data: {} };
    //   else this.editor.drawflow.Home.data = {};
    
    //   // 3️⃣ Reiniciar el contador de nodos
    //   this.editor.precanvas = null;      // limpia la referencia del canvas temporal
    //   this.editor.nodenum = 0;           // el contador de ids vuelve a 0

    //   this.authService.RequestDataobject({}, 'Eliminarflujo', "Call center")
    //   .subscribe({
    //     next: (res) => {
    //       this.ngAfterViewInit()
    //       console.log('✅ Flujo Eliminado:', res);
    //       alert('Flujo eliminado correctamente');
    //     },
    //     error: (err) => {
    //       console.error('❌ Error al eliminar flujo:', err);
    //       alert('Error al eliminar el flujo');
    //     }
    //   });
     
    //   console.log('✅ Flujo reiniciado y ids reseteados');
    // }
    reiniciarFlujo() {

      const confirmar = confirm("⚠️ ¿Estás seguro de que deseas eliminar el flujo? Esta acción no se puede deshacer.");
    
      if (!confirmar) {
        return; // si el usuario cancela, no hace nada
      }
    
      if (!this.editor) return;
    
      // 1️⃣ Limpiar todos los nodos y conexiones
      this.editor.clear();
    
      // 2️⃣ Limpiar workspace "Home"
      if (!this.editor.drawflow) this.editor.drawflow = {};
      if (!this.editor.drawflow.Home) this.editor.drawflow.Home = { data: {} };
      else this.editor.drawflow.Home.data = {};
    
      // 3️⃣ Reiniciar el contador de nodos
      this.editor.precanvas = null;
      this.editor.nodenum = 0;
    
      this.authService.RequestDataobject({}, 'Eliminarflujo', "Call center")
      .subscribe({
        next: (res) => {
          this.ngAfterViewInit()
          console.log('✅ Flujo Eliminado:', res);
          alert('Flujo eliminado correctamente');
        },
        error: (err) => {
          console.error('❌ Error al eliminar flujo:', err);
          alert('Error al eliminar el flujo');
        }
      });
    
      console.log('✅ Flujo reiniciado y ids reseteados');
    }
    
}


