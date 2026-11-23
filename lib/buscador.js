/* Lógica del buscador de transición (migrada desde fuente/plantilla.html).
   Se ejecuta solo en el navegador, después de que el servidor verificó la
   sesión y entregó los datos. Planes, correlatividades y matriz de
   equivalencias están al principio de iniciar(). */
/* eslint-disable */
export function iniciar(datos) {
  /* ============ Plan 2014 (Res. 30/2014, mod. Res. CS 11/2022) ============ */
  const OLD = [
    ["V2101","Matemáticas I",1,1,[]],
    ["V2102","Sistemas de Información Contable",1,1,[]],
    ["V2103","Responsabilidad Social Universitaria Empresarial",1,1,[]],
    ["V2104","Matemáticas II",1,2,["V2101"]],
    ["V2105","Principios de Economía I",1,2,[]],
    ["V2106","Contabilidad Económica",1,2,["V2102"]],
    ["V2107","Estadística y Probabilidad",2,1,["V2104"]],
    ["V2108","Principios de Economía II",2,1,["V2105"]],
    ["V2109","Mediación y Psicología Social I",2,1,[]],
    ["V2110","Inferencia Estadística",2,2,["V2105","V2107"]],
    ["V2111","Mediación y Psicología Social II",2,2,["V2109"]],
    ["V2112","Derecho Constitucional y Construcción de Ciudadanía",2,2,["V2103"]],
    ["V2113","Inglés",2,2,[]],
    ["V2114","Economía Matemática",3,1,["V2104","V2108"]],
    ["V2115","Cálculo Financiero",3,1,["V2107"]],
    ["V2116","Macroeconomía I",3,1,["V2108"]],
    ["V2117","Metodología de las Ciencias Económico-Sociales",3,1,[]],
    ["V2118","Microeconomía",3,2,["V2114"]],
    ["V2119","Formulación y Evaluación de Proyectos Privados",3,2,["V2115"]],
    ["V2120","Economía Ecológica",3,2,["V2108"]],
    ["V2121","Derecho Económico",3,2,["V2112"]],
    ["V2122","Teoría del Crecimiento y Desarrollo",4,1,["V2116"]],
    ["V2123","Formulación y Evaluación de Proyectos Sociales",4,1,["V2111","V2115"]],
    ["V2124","Economía, Estado y Sociedad",4,1,["V2112","V2116","V2118"]],
    ["V2125","Econometría",4,2,["V2110","V2114","V2116"]],
    ["V2126","Macroeconomía II y Metodología de la Economía Aplicada",4,2,["V2116","V2118"]],
    ["V2127","Economía del Medio Ambiente",4,2,["V2118","V2120"]],
    ["V2128","Desarrollo Local y Regional",4,2,["V2122"]],
    ["V2129","Historia de las Doctrinas Económicas y Fundamentos Epistemológicos",5,1,["V2116","V2118"]],
    ["V2130","Economía Agropecuaria",5,1,["V2126","V2127"]],
    ["V2131","Problemática Económica Global",5,1,["V2128"]],
    ["V2132","Seminario de Economía Argentina",5,2,["V2122","V2124","V2126"]],
    ["V2133","Economía de la Regulación",5,2,["V2122","V2124"]],
    ["V2134","Mediación Institucional y Prácticas Profesionales",5,2,["V2123","V2131"]],
  ].map(([c,n,y,q,corr])=>({c,n,y,q,corr,code:c.slice(1)}));

  /* ============ Plan 2027 (créditos académicos) ============ */
  const NEW = [
    ["N2101","Matemática I",1,1,9],["N2102","Introducción a la Economía",1,1,9],
    ["N2103","Teoría Contable y Sistemas de Información",1,1,7],["N2104","Historia Económica",1,1,5],
    ["N2105","Matemática II",1,2,9],["N2106","Teoría Política y Principios de Derecho",1,2,9],
    ["N2107","Cuentas Nacionales",1,2,7],["N2108","Sociología Económica",1,2,5],
    ["N2109","Estadística I",2,1,9],["N2110","Microeconomía I",2,1,9],
    ["N2111","Cálculo Financiero",2,1,7],["N2112","Metodología de las Ciencias Sociales",2,1,5],
    ["N2113","Estadística II",2,2,9],["N2114","Macroeconomía I",2,2,9],
    ["N2115","Evaluación de Proyectos",2,2,5],["N2116","Procesamiento de Datos Económicos I",2,2,5],
    ["N2117","Taller Integrador I",2,2,2],
    ["N2118","Economía Matemática",3,1,9],["N2119","Macroeconomía II",3,1,9],
    ["N2120","Historia de las Doctrinas Económicas",3,1,7],["N2121","Economía del Medio Ambiente",3,1,5],
    ["N2122","Econometría I",3,2,9],["N2123","Microeconomía II",3,2,9],
    ["N2124","Crecimiento y Desarrollo Económico",3,2,7],["N2125","Economía Agropecuaria",3,2,5],
    ["N2126","Econometría II",4,1,9],["N2127","Finanzas Corporativas",4,1,9],
    ["N2128","Economía Internacional",4,1,7],["N2129","Economía Industrial",4,1,5],
    ["N2130","Historia Económica Argentina",4,2,9],["N2131","Finanzas Públicas",4,2,9],
    ["N2132","Problemática Económica Global",4,2,5],["N2133","Procesamiento de Datos Económicos II",4,2,5],
    ["N2134","Taller Integrador II",4,2,2],
  ].map(([c,n,y,q,cre])=>({c,n,y,q,cre,code:c.slice(1)}));

  const O = Object.fromEntries(OLD.map(s=>[s.c,s]));
  const N = Object.fromEntries(NEW.map(s=>[s.c,s]));

  /* ============ Matriz de equivalencias (Anexo I) ============
     total/parcial: lista de conjuntos de materias del plan 2014; alcanza con
     tener aprobado un conjunto completo. Las reglas marcadas "amb" dependen
     de un criterio configurable (pestaña Criterios). */
  const DEFAULT_SETTINGS = { socioSola: "parcial", proyAmbas: "parcial" };
  let SETTINGS = loadSettings();
  function rules(){
    const r = {
      N2101:{total:[["V2101"]]}, N2103:{total:[["V2102"]]}, N2105:{total:[["V2104"]]},
      N2102:{total:[["V2105"]]}, N2107:{parcial:[["V2106"]]}, N2109:{total:[["V2107"]]},
      N2114:{total:[["V2108"]]}, N2113:{total:[["V2110"]]},
      N2106:{total:[["V2112","V2121"]],parcial:[["V2112"],["V2121"]]},
      N2118:{total:[["V2114"]]}, N2111:{total:[["V2115"]]}, N2112:{total:[["V2117"]]},
      N2110:{total:[["V2118"]]}, N2124:{total:[["V2122","V2128"]],parcial:[["V2122"],["V2128"]]},
      N2131:{total:[["V2124"]]}, N2122:{total:[["V2125"]]}, N2119:{total:[["V2126"]]},
      N2121:{total:[["V2127"]]}, N2120:{total:[["V2129"]]}, N2125:{total:[["V2130"]]},
      N2132:{total:[["V2131"]]}, N2130:{total:[["V2132"]]},
    };
    r.N2108 = SETTINGS.socioSola==="total"
      ? {total:[["V2109"],["V2111"]], amb:true}
      : {total:[["V2109","V2111"]], parcial:[["V2109"],["V2111"]], amb:true};
    r.N2115 = SETTINGS.proyAmbas==="total"
      ? {total:[["V2119","V2123"]], parcial:[["V2119"],["V2123"]], amb:true}
      : {parcial:[["V2119"],["V2123"]], amb:true};
    return r;
  }
  // Materias del plan 2014 que no tienen equivalencia en el plan 2027
  const SIN_EQ = ["V2103","V2113","V2116","V2120","V2133","V2134"];

  /* ============ Lectura de nombres declarados en el formulario ============ */
  function norm(s){return String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[^a-z0-9ñ]+/g," ").trim();}
  const ALIAS = {};
  OLD.forEach(s=>{ALIAS[norm(s.n)]=s.c;});
  Object.assign(ALIAS,{
    [norm("Sistemas de Información Cont.")]:"V2102",
    [norm("Derecho Constitucional y Construcción Ciudadana")]:"V2112",
    [norm("Metodología de las Ciencias Económico – Sociales")]:"V2117",
    [norm("Hist. de las Doct. Económicas y Fundamentos Epistemológicos")]:"V2129",
    [norm("Historia de las Doctrinas Económicas")]:"V2129",
    [norm("Macroeconomía II y Metodología Aplicada")]:"V2126",
    [norm("Matematicas I")]:"V2101",[norm("Matemática I")]:"V2101",[norm("Matemática II")]:"V2104",
  });
  function parseSubjects(cell){
    if(cell==null||cell==="") return {codes:[],unknown:[]};
    let t = String(cell)
      .replace(/Responsabilidad Social\s*,\s*Universitaria/gi,"Responsabilidad Social Universitaria")
      .replace(/Econom[ií]a\s*,\s*Estado\s*,?\s*y\s+Sociedad/gi,"Economía Estado y Sociedad");
    const codes=[],unknown=[];
    t.split(/[,;\n]/).map(x=>x.trim()).filter(Boolean).forEach(tok=>{
      const c = ALIAS[norm(tok)];
      if(c) codes.push(c); else unknown.push(tok);
    });
    return {codes,unknown};
  }

  /* ============ Filas de la planilla → estudiantes ============ */
  // fila: {ts,email,nombre,dni,tel,cambio,ingreso,y:[a1..a5]}
  function buildStudents(rows){
    const byDni = new Map();
    rows.forEach(r=>{
      const dni = String(r.dni||"").replace(/\D/g,"");
      if(!dni) return;
      const prev = byDni.get(dni);
      if(!prev){ byDni.set(dni,{...r,dni,respuestas:1}); return; }
      const newer = String(r.ts||"") >= String(prev.ts||"");
      byDni.set(dni, newer ? {...r,dni,respuestas:prev.respuestas+1} : {...prev,respuestas:prev.respuestas+1});
    });
    return [...byDni.values()].map(r=>analyze(r)).sort((a,b)=>a.nombre.localeCompare(b.nombre,"es"));
  }

  // Códigos de actividad de SIU Guaraní (plan 21) → plan 2014
  const GUARANI = {"21-01":"V2109","21-02":"V2103","21-03":"V2117","21-04":"V2105","21-05":"V2111","21-06":"V2120",
    "21-07":"V2101","21-08":"V2108","21-09":"V2102","21-10":"V2104","21-11":"V2107","21-12":"V2106","21-13":"V2121",
    "21-14":"V2116","21-15":"V2110","21-16":"V2118","21-17":"V2115","21-18":"V2125","21-19":"V2126","21-20":"V2124",
    "21-21":"V2114","21-22":"V2122","21-23":"V2129","21-24":"V2119","21-25":"V2132","21-26":"V2128","21-27":"V2112",
    "21-28":"V2130","21-29":"V2123","21-30":"V2131","21-31":"V2134","21-32":"V2133","21-33":"V2127","21-34":"V2113"};
  let OFICIAL = null; // {fecha, alumnos:{dni:{a:{cod:"P"|"A"}, r:{cod:"aaaammdd"}}}}
  const HOY = (()=>{const d=new Date();return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();})();
  const fmtFecha = s=>s?`${s.slice(6,8)}/${s.slice(4,6)}/${s.slice(0,4)}`:"";

  function analyze(r){
    const R = rules();
    const declared = new Set(), unknown=[], misplaced=[];
    (r.y||[]).forEach((cell,i)=>{
      const p = parseSubjects(cell);
      p.codes.forEach(c=>{declared.add(c); if(O[c].y!==i+1) misplaced.push(c);});
      unknown.push(...p.unknown);
    });
    const of = OFICIAL && OFICIAL.alumnos[String(r.dni)];
    const approved = of ? new Set(Object.keys(of.a)) : declared;
    const promo = of ? new Set(Object.keys(of.a).filter(c=>of.a[c]==="P")) : new Set();
    const equiv = of ? new Set(Object.keys(of.a).filter(c=>of.a[c]==="E")) : new Set();
    // Regularidades sin final aprobado: cod → {vence, vigente}
    const regs = {};
    if(of) Object.entries(of.r).forEach(([c,v])=>{ if(!approved.has(c)) regs[c]={vence:v, vigente:+v>=HOY}; });
    const regV = c=>regs[c]&&regs[c].vigente;
    const okCursar = c=>approved.has(c)||regV(c);
    const nombre0 = String(r.nombre||"").trim().replace(/\s+/g," ");
    // "Apellido, Nombre/s" ya viene normalizado; lo demás se capitaliza
    const nombre = nombre0.includes(",") ? nombre0 : nombre0.replace(/(^|\s)(\p{L})/gu,(m,a,b)=>a+b.toUpperCase());
    const ingreso = r.ingreso ? parseInt(r.ingreso,10) : null;

    // Plan viejo
    const old = {};
    for(let y=1;y<=5;y++) old[y]={aprob:[],falta:[]};
    OLD.forEach(s=>{
      if(approved.has(s.c)) old[s.y].aprob.push(s);
      else old[s.y].falta.push({...s, habil: s.corr.every(okCursar), rendir: s.corr.every(c=>approved.has(c)), reg: regs[s.c]||null, sinDictado: s.y<=3});
    });

    // Plan nuevo
    const nw = {}; for(let y=1;y<=4;y++) nw[y]={total:[],parcial:[],falta:[]};
    const usados = new Set();
    NEW.forEach(s=>{
      const rule = R[s.c]||{};
      const tot = (rule.total||[]).find(set=>set.every(c=>approved.has(c)));
      if(tot){ tot.forEach(c=>usados.add(c)); nw[s.y].total.push({...s,from:tot,amb:rule.amb}); return; }
      const par = (rule.parcial||[]).filter(set=>set.every(c=>approved.has(c)));
      if(par.length){ const from=[...new Set(par.flat())]; from.forEach(c=>usados.add(c));
        // qué le faltaría para la equivalencia total (casos 2→1)
        const comp = (rule.total||[]).map(set=>set.filter(c=>!approved.has(c))).filter(x=>x.length).sort((a,b)=>a.length-b.length)[0]||null;
        nw[s.y].parcial.push({...s,from,amb:rule.amb,completa:comp,regs:(comp||[]).filter(regV)}); return; }
      // regularidades vigentes del plan 2014 que, aprobadas, darían la equivalencia
      const viaReg = [...new Set([...(rule.total||[]),...(rule.parcial||[])].flat())].filter(regV);
      nw[s.y].falta.push({...s, sinEq: !rule.total && !rule.parcial, regs:viaReg});
    });
    const sinEquivalencia = [...approved].filter(c=>!usados.has(c)).map(c=>O[c]);

    // Alertas
    const alerts=[];
    if(of){
      const noFig=[...declared].filter(c=>!approved.has(c)).sort(), noDecl=[...approved].filter(c=>!declared.has(c)).sort();
      if(noFig.length) alerts.push({lv:"warn",k:"of-nofig",t:`Declaró aprobada${noFig.length>1?"s":""} ${noFig.map(c=>"<b>"+O[c].n+"</b>"+(regs[c]?" (figura regularizada)":"")).join(", ")}, pero no figura${noFig.length>1?"n":""} aprobada${noFig.length>1?"s":""} en la historia académica.`});
      if(noDecl.length) alerts.push({lv:"info",k:"of-nodecl",t:`Figura${noDecl.length>1?"n":""} aprobada${noDecl.length>1?"s":""} en la historia académica y no la${noDecl.length>1?"s":""} declaró: ${noDecl.map(c=>"<b>"+O[c].n+"</b>").join(", ")}.`});
    } else if(OFICIAL) alerts.push({lv:"bad",k:"of-sin",t:`No se encontró en SIU Guaraní: la ficha usa lo declarado en el formulario.`});
    if(!of) OLD.forEach(s=>{ if(approved.has(s.c)){ const miss=s.corr.filter(c=>!approved.has(c));
      if(miss.length) alerts.push({lv:"warn",k:"corr",t:`Declaró <b>${s.n}</b> aprobada sin tener aprobada su correlativa ${miss.map(c=>"<b>"+O[c].n+"</b>").join(" y ")}.`}); }});
    const maxY = Math.max(0,...[...approved].map(c=>O[c].y));
    if(!of && ingreso && maxY > 2026-ingreso+2) alerts.push({lv:"warn",k:"ing",t:`Declaró materias de ${maxY}° año con año de ingreso ${ingreso}. Verificar si es reingreso, cambio de carrera o un error en el año.`});
    if(maxY>=4 && !approved.has("V2113")) alerts.push({lv:"info",k:"ingles",t:`Tiene materias de 4°/5° año pero no ${of?"tiene aprobada":"declaró"} <b>Inglés</b>, que el plan 2014 exige aprobada al finalizar 3° año.`});
    if(!of && unknown.length) alerts.push({lv:"bad",k:"unk",t:`No se reconocieron estas materias declaradas: ${unknown.map(u=>"«"+esc(u)+"»").join(", ")}.`});
    if(!of && misplaced.length) alerts.push({lv:"info",k:"col",t:`Declaró en otra columna de año: ${misplaced.map(c=>O[c].n).join(", ")}.`});
    if(r.respuestas>1) alerts.push({lv:"info",k:"dup",t:`Respondió el formulario ${r.respuestas} veces; se usa la respuesta más reciente.`});
    if(!approved.size) alerts.push({lv:"info",k:"vacio",t:of?`No tiene materias aprobadas en la historia académica.`:`No declaró materias aprobadas.`});

    const flat = o=>Object.values(o);
    const cnt = {
      aprob: approved.size,
      faltaViejo: flat(old).reduce((a,y)=>a+y.falta.length,0),
      faltaViejoSinDictado: flat(old).reduce((a,y)=>a+y.falta.filter(s=>s.sinDictado).length,0),
      habil2027: flat(old).reduce((a,y)=>a+y.falta.filter(s=>!s.sinDictado&&s.habil&&!s.reg).length,0),
      regVig: Object.values(regs).filter(x=>x.vigente).length,
      regVenc: Object.values(regs).filter(x=>!x.vigente).length,
      total: flat(nw).reduce((a,y)=>a+y.total.length,0),
      parcial: flat(nw).reduce((a,y)=>a+y.parcial.length,0),
      faltaNuevo: flat(nw).reduce((a,y)=>a+y.falta.length,0),
      creTotal: flat(nw).reduce((a,y)=>a+y.total.reduce((b,s)=>b+s.cre,0),0),
      creParcial: flat(nw).reduce((a,y)=>a+y.parcial.reduce((b,s)=>b+s.cre,0),0),
      creTec: [1,2].reduce((a,y)=>a+nw[y].total.reduce((b,s)=>b+s.cre,0),0),
      creTecPar: [1,2].reduce((a,y)=>a+nw[y].parcial.reduce((b,s)=>b+s.cre,0),0),
    };
    return {dni:r.dni,nombre,email:r.email||"",tel:r.tel?String(r.tel):"",cambio:String(r.cambio||"").trim(),ingreso,ts:r.ts,respuestas:r.respuestas,
      approved,declared,promo,equiv,regs,oficial:!!of,old,nw,sinEquivalencia,alerts,cnt,raw:r};
  }

  /* ============ Utilidades ============ */
  function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function $(id){return document.getElementById(id);}
  function loadSettings(){try{return {...DEFAULT_SETTINGS,...JSON.parse(localStorage.getItem("transicion.settings")||"{}")};}catch(e){return {...DEFAULT_SETTINGS};}}
  function saveSettings(){try{localStorage.setItem("transicion.settings",JSON.stringify(SETTINGS));}catch(e){}}
  const qLabel = q=>q===1?"1° cuat.":"2° cuat.";
  const ROMAN = ["","1°","2°","3°","4°","5°"];
  function cambioTag(c){const n=norm(c); if(n==="si")return `<span class="tag t-ok">Quiere cambiarse</span>`; if(n==="no")return `<span class="tag t-mut">No quiere cambiarse</span>`; if(n)return `<span class="tag t-warn">${esc(c)}</span>`; return "";}

  /* ============ Estado ============ */
  let ROWS = [], STUDENTS = [], SOURCE = "";
  function setRows(rows, source){ ROWS=rows; SOURCE=source; recompute(); }
  function recompute(){
    STUDENTS = buildStudents(ROWS);
    const nOf = STUDENTS.filter(s=>s.oficial).length;
    $("dataInfo").textContent = `${STUDENTS.length} estudiantes cargados (${SOURCE}).`+(OFICIAL?` ${nOf} con historia académica y regularidades de SIU Guaraní al ${OFICIAL.fecha}.`:"");
    renderTable(); renderRevision(); renderCriterios();
    if(CURRENT) openStudent(CURRENT,false);
  }

  /* ============ Búsqueda y ficha ============ */
  let CURRENT=null;
  function search(q){
    const d = q.replace(/\D/g,""), n = norm(q);
    if(!n) return [];
    return STUDENTS.filter(s => (d.length>=3 && s.dni.includes(d)) || (!/^\d+$/.test(q.trim()) && norm(s.nombre).includes(n)));
  }
  $("searchForm").addEventListener("submit",e=>{
    e.preventDefault();
    const q=$("q").value.trim(), res=search(q), box=$("results");
    box.innerHTML="";
    if(!q) return;
    const exact = STUDENTS.find(s=>s.dni===q.replace(/\D/g,""));
    if(exact){ openStudent(exact.dni); return; }
    if(res.length===1){ openStudent(res[0].dni); return; }
    if(!res.length){ box.innerHTML=`<p class="muted">No hay estudiantes con ese DNI o nombre.</p>`; $("ficha").innerHTML=""; return; }
    box.innerHTML = res.slice(0,30).map(s=>`<button data-dni="${s.dni}"><b>${esc(s.nombre)}</b> <span class="muted">· DNI ${s.dni}</span></button>`).join("");
  });
  $("results").addEventListener("click",e=>{const b=e.target.closest("button[data-dni]"); if(b) openStudent(b.dataset.dni);});

  function li(cls,title,sub){return `<li class="${cls}">${title}${sub?`<span class="sub">${sub}</span>`:""}</li>`;}
  function list(items,empty="Ninguna"){return items.length?`<ul class="subj">${items.join("")}</ul>`:`<p class="empty">${empty}</p>`;}
  function names(codes){return codes.map(c=>O[c].n).join(" + ");}

  function openStudent(dni, scroll=true){
    const s = STUDENTS.find(x=>x.dni===dni); if(!s) return;
    CURRENT=dni; showTab("ficha");
    $("results").innerHTML=""; $("q").value=dni;
    const c=s.cnt;
    const pctViejo = Math.round(c.aprob/OLD.length*100), pctNuevo = Math.round(c.creTotal/240*100);
    let h = `<div class="card section">
      <div class="head-student">
        <div><h2 style="font-size:22px">${esc(s.nombre)}</h2>
          <div class="muted small">DNI ${s.dni}${s.ingreso?` · Ingreso ${s.ingreso}`:""}${s.email?` · ${esc(s.email)}`:""}${s.tel?` · Tel. ${esc(s.tel)}`:""}</div>
          <div style="margin-top:6px">${cambioTag(s.cambio)} ${s.oficial?`<span class="tag t-ok">Datos oficiales SIU Guaraní${OFICIAL.fecha?" al "+esc(OFICIAL.fecha):""}</span>`:`<span class="tag t-warn">Datos declarados por el estudiante</span>`}</div></div>
        <button class="btn no-print" onclick="window.print()">Imprimir ficha</button>
      </div>
      <div class="grid kpis section">
        <div class="kpi"><b>${c.aprob}<small class="muted" style="font-size:14px"> / ${OLD.length}</small></b><span>Aprobadas plan 2014</span></div>
        ${s.oficial?`<div class="kpi"><b>${c.regVig}</b><span>Regularizadas vigentes (sin final)</span></div>`:""}
        <div class="kpi"><b>${c.total}</b><span>Equivalencias totales</span></div>
        <div class="kpi"><b>${c.parcial}</b><span>Coloquios a rendir</span></div>
        <div class="kpi"><b>${c.faltaNuevo}</b><span>Le faltan en plan 2027 (sin contar coloquios)</span></div>
        <div class="kpi"><b>${c.creTotal}<small class="muted" style="font-size:14px"> / 240</small></b><span>Créditos plan 2027 por equivalencia total${c.creParcial?` (+${c.creParcial} con coloquios)`:""}</span></div>
      </div>
    </div>`;

    // Comparación de escenarios
    h += `<div class="grid compare section">
      <div class="card"><h3>Si sigue en el plan 2014</h3>
        <p style="margin:6px 0">Le faltan <b>${c.faltaViejo}</b> materias.${c.faltaViejoSinDictado?` <b>${c.faltaViejoSinDictado}</b> son de 1° a 3° año, que <b>no se dictarán desde 2027</b>.`:""}</p>
        ${c.regVig?`<p style="margin:6px 0">Tiene <b>${c.regVig}</b> materia${c.regVig>1?"s":""} regularizada${c.regVig>1?"s":""} con la regularidad vigente: puede rendir el final sin volver a cursar.</p>`:""}
        ${c.habil2027?`<p style="margin:6px 0">Puede cursar en 2027 <b>${c.habil2027}</b> materia${c.habil2027>1?"s":""} de 4°/5° año (tiene las correlativas ${s.oficial?"regularizadas o aprobadas":"aprobadas"}).</p>`:""}
        <p class="muted small" style="margin:6px 0">El plan 2014 está vigente hasta el fin del año académico 2031; quienes no hayan terminado pasan al plan nuevo.</p>
        <div class="bar" title="${pctViejo}% del plan 2014"><i style="width:${pctViejo}%"></i></div><span class="muted small">${pctViejo}% del plan aprobado</span>
      </div>
      <div class="card"><h3>Si se cambia al plan 2027</h3>
        <p style="margin:6px 0">Reconoce <b>${c.total}</b> materias por equivalencia total y puede completar <b>${c.parcial}</b> más con coloquio. Le quedarían <b>${c.faltaNuevo}</b> materias por cursar.</p>
        <p style="margin:6px 0">Tecnicatura en Análisis de Datos Económicos (título intermedio, 1° y 2° año): <b>${c.creTec}</b> de 120 créditos${c.creTecPar?`, <b>${c.creTec+c.creTecPar}</b> si aprueba los coloquios`:""}.</p>
        ${s.sinEquivalencia.length?`<p style="margin:6px 0"><b>${s.sinEquivalencia.length}</b> materia${s.sinEquivalencia.length>1?"s aprobadas no se reconocen":" aprobada no se reconoce"} en el plan nuevo.</p>`:""}
        <div class="bar" title="${pctNuevo}% de los créditos"><i style="width:${pctNuevo}%"></i></div><span class="muted small">${pctNuevo}% de los 240 créditos</span>
      </div>
    </div>`;

    if(s.alerts.length){
      h += `<div class="card section"><h3 style="margin-bottom:8px">Para verificar en la tutoría</h3><div class="alerts">${s.alerts.map(a=>`<div class="alert a-${a.lv}">${a.t}</div>`).join("")}</div></div>`;
    }

    // Plan 2014 por año
    h += `<div class="card section"><h2>Plan 2014 · situación por año</h2>
      <div class="legend small" style="margin:8px 0"><span class="tag t-ok">Aprobada</span><span class="tag t-acc">Puede cursar en 2027</span>${s.oficial?`<span class="tag t-info">Regularizada: puede rendir</span>`:""}<span class="tag t-warn">Sin dictado desde 2027</span><span class="tag t-mut">Le faltan correlativas</span></div>`;
    for(let y=1;y<=5;y++){
      const Y=s.old[y];
      h += `<div class="year"><h3>${ROMAN[y]} año <span class="tag t-mut">${Y.aprob.length}/${Y.aprob.length+Y.falta.length} aprobadas</span>${y<=3?`<span class="tag t-warn">no se dicta en 2027</span>`:`<span class="tag t-acc">se dicta en 2027</span>`}</h3>
        <div class="cols">
          <div class="col"><h4>Aprobadas</h4>${list(Y.aprob.map(o=>li("s-ok",esc(o.n),qLabel(o.q)+(s.promo.has(o.c)?" · promocionada":s.equiv.has(o.c)?" · por equivalencia":""))))}</div>
          <div class="col"><h4>Le faltan</h4>${list(Y.falta.map(o=>{
            const miss=o.corr.filter(c=>!s.approved.has(c));
            let cls,sub;
            if(o.reg&&o.reg.vigente){cls="s-info";sub=`${qLabel(o.q)} · <b>regularizada</b>, vence ${fmtFecha(o.reg.vence)}`+(o.rendir?" · puede rendir el final":` · para rendir le falta aprobar ${names(miss)}`);}
            else if(o.sinDictado){cls="s-warn";sub=`${qLabel(o.q)} · sin dictado desde 2027`+(miss.length?` · correlativas: ${names(miss)}`:"");}
            else if(o.habil){cls="s-acc";sub=`${qLabel(o.q)} · puede cursarla en 2027`;}
            else {cls="";sub=`${qLabel(o.q)} · le falta ${s.oficial?"regularizar":"aprobar"} ${names(o.corr.filter(c=>!(s.approved.has(c)||(s.regs[c]&&s.regs[c].vigente))))}`;}
            if(o.reg&&!o.reg.vigente) sub+=` · regularidad vencida el ${fmtFecha(o.reg.vence)}`;
            return li(cls,esc(o.n),sub);}),"Completo")}</div>
        </div></div>`;
    }
    h += `</div>`;

    // Plan 2027 por año
    h += `<div class="card section"><h2>Plan 2027 · si se cambia</h2>
      <div class="legend small" style="margin:8px 0"><span class="tag t-ok">Equivalencia total</span><span class="tag t-info">Equivalencia parcial: rinde coloquio</span><span class="tag t-mut">Debe cursarla</span></div>`;
    for(let y=1;y<=4;y++){
      const Y=s.nw[y], tot=Y.total.length+Y.parcial.length+Y.falta.length;
      const cre = Y.total.reduce((a,x)=>a+x.cre,0);
      h += `<div class="year"><h3>${ROMAN[y]} año <span class="tag t-mut">${cre}/60 créditos reconocidos</span>${y===4?`<span class="tag t-warn">no se dicta en 2027</span>`:`<span class="tag t-acc">se dicta en 2027</span>`}${y<=2?`<span class="tag t-mut">Tecnicatura</span>`:""}</h3>
        <div class="cols">
          <div class="col"><h4>Equivalencia total</h4>${list(Y.total.map(x=>li("s-ok",esc(x.n),`${x.cre} CRE · por ${names(x.from)}`)))}</div>
          <div class="col"><h4>Equivalencia parcial · coloquio</h4>${list(Y.parcial.map(x=>li("s-info",`Coloquio de ${esc(x.n)}`,`${x.cre} CRE · tiene ${names(x.from)}`+(x.completa?` · o aprobar ${names(x.completa)} (plan 2014) para la total`:"")+(x.regs&&x.regs.length?` · <b>ya la tiene regularizada</b>`:""))))}</div>
          <div class="col"><h4>Le faltan</h4>${list(Y.falta.map(x=>li(x.regs.length?"s-info":"",esc(x.n),`${qLabel(x.q)} · ${x.cre} CRE`+(x.sinEq?" · sin equivalente en el plan 2014":"")+(x.regs.length?` · tiene regularizada ${names(x.regs)} (plan 2014): si la aprueba antes del cambio, obtiene la equivalencia`:""))),"Nada")}</div>
        </div></div>`;
    }
    if(s.sinEquivalencia.length){
      h += `<div class="year"><h3>Aprobadas en el plan 2014 que no se reconocen</h3>${list(s.sinEquivalencia.map(o=>li("s-warn",esc(o.n),`${ROMAN[o.y]} año plan 2014 · sin equivalencia en la matriz`)))}</div>`;
    }
    h += `<p class="muted small">Los temas de cada coloquio los fija la Comisión de Carrera según el programa con el que se aprobó la materia (Anexo I).</p></div>`;

    $("ficha").innerHTML = h;
    if(scroll) $("ficha").scrollIntoView({behavior:"smooth",block:"start"});
  }

  /* ============ Resumen ============ */
  const COLS = [
    ["nombre","Estudiante",s=>esc(s.nombre),s=>s.nombre],
    ["dni","DNI",s=>s.dni,s=>s.dni],
    ["ingreso","Ingreso",s=>s.ingreso||"",s=>s.ingreso||0,"num"],
    ["cambio","¿Cambio?",s=>esc(s.cambio),s=>s.cambio],
    ["aprob","Aprobadas",s=>s.cnt.aprob,s=>s.cnt.aprob,"num"],
    ["fv","Faltan 2014",s=>s.cnt.faltaViejo,s=>s.cnt.faltaViejo,"num"],
    ["sd","Sin dictado",s=>s.cnt.faltaViejoSinDictado,s=>s.cnt.faltaViejoSinDictado,"num"],
    ["reg","Regul.",s=>s.oficial?s.cnt.regVig:"–",s=>s.cnt.regVig,"num"],
    ["tot","Eq. total",s=>s.cnt.total,s=>s.cnt.total,"num"],
    ["par","Coloquios",s=>s.cnt.parcial,s=>s.cnt.parcial,"num"],
    ["fn","Faltan 2027",s=>s.cnt.faltaNuevo,s=>s.cnt.faltaNuevo,"num"],
    ["cre","CRE",s=>s.cnt.creTotal,s=>s.cnt.creTotal,"num"],
    ["al","Alertas",s=>{const n=s.alerts.filter(a=>a.lv!=="info").length;return n?`<span class="tag t-warn">${n}</span>`:"";},s=>s.alerts.filter(a=>a.lv!=="info").length,"num"],
  ];
  let SORT={k:"nombre",dir:1};
  function renderTable(){
    const t=norm($("fText").value), d=$("fText").value.replace(/\D/g,""), fc=$("fCambio").value;
    let rows = STUDENTS.filter(s=>(!t||norm(s.nombre).includes(t)||(d&&s.dni.includes(d)))&&(!fc||norm(s.cambio)===norm(fc)));
    const col=COLS.find(c=>c[0]===SORT.k);
    rows.sort((a,b)=>{const x=col[3](a),y=col[3](b);return (typeof x==="number"?x-y:String(x).localeCompare(String(y),"es"))*SORT.dir;});
    $("tabla").innerHTML = `<thead><tr>${COLS.map(c=>`<th data-k="${c[0]}" class="${c[4]||""}">${c[1]}${SORT.k===c[0]?(SORT.dir>0?" ▲":" ▼"):""}</th>`).join("")}</tr></thead>
    <tbody>${rows.map(s=>`<tr data-dni="${s.dni}">${COLS.map(c=>`<td class="${c[4]||""}">${c[2](s)}</td>`).join("")}</tr>`).join("")}</tbody>`;
  }
  $("tabla").addEventListener("click",e=>{
    const th=e.target.closest("th"); if(th){const k=th.dataset.k; SORT = SORT.k===k?{k,dir:-SORT.dir}:{k,dir:1}; renderTable(); return;}
    const tr=e.target.closest("tr[data-dni]"); if(tr) openStudent(tr.dataset.dni);
  });
  $("fText").addEventListener("input",renderTable); $("fCambio").addEventListener("change",renderTable);

  /* ============ Revisión ============ */
  function renderRevision(){
    const groups = [
      ["of-sin","No encontrados en SIU Guaraní"],
      ["of-nofig","Declararon materias que no figuran aprobadas en la historia académica"],
      ["of-nodecl","Tienen aprobadas en la historia académica materias que no declararon"],
      ["unk","Materias declaradas que no se reconocieron"],
      ["corr","Aprobadas sin la correlativa aprobada (plan 2014)"],
      ["ing","Año de ingreso inconsistente con lo declarado"],
      ["ingles","Inglés no declarado con materias de 4°/5° año"],
      ["dup","Respuestas duplicadas"],
      ["col","Materias declaradas en la columna de otro año"],
      ["vacio","Sin materias aprobadas"],
    ];
    let h="";
    groups.forEach(([k,title])=>{
      const items = STUDENTS.flatMap(s=>s.alerts.filter(a=>a.k===k).map(a=>({s,a})));
      if(!items.length) return;
      const bySt = new Map(); items.forEach(({s,a})=>{ if(!bySt.has(s.dni)) bySt.set(s.dni,{s,t:[]}); bySt.get(s.dni).t.push(a.t); });
      h += `<div class="section"><h3>${title} <span class="tag t-mut">${bySt.size}</span></h3><div class="tablewrap"><table><tbody>${
        [...bySt.values()].map(({s,t})=>`<tr data-dni="${s.dni}"><td style="width:30%"><b>${esc(s.nombre)}</b><br><span class="muted small">DNI ${s.dni}</span></td><td>${k==="vacio"||k==="dup"?t.join("<br>"):t.join("<br>")}</td></tr>`).join("")
      }</tbody></table></div></div>`;
    });
    $("revision").innerHTML = h || `<p class="muted">No se detectaron inconsistencias.</p>`;
  }
  $("revision").addEventListener("click",e=>{const tr=e.target.closest("tr[data-dni]"); if(tr) openStudent(tr.dataset.dni);});

  /* ============ Criterios ============ */
  function renderCriterios(){
    const nSoc = STUDENTS.filter(s=>s.approved.has("V2109")!==s.approved.has("V2111")).length;
    const nProy = STUDENTS.filter(s=>s.approved.has("V2119")&&s.approved.has("V2123")).length;
    const nMacro = STUDENTS.filter(s=>s.approved.has("V2116")).length;
    $("criterios").innerHTML = `<h2>Cómo se calcula cada ficha</h2>
    <ul>
      <li><b>Aprobadas</b>: ${OFICIAL?`historia académica de SIU Guaraní${OFICIAL.fecha?" al "+esc(OFICIAL.fecha):""} (aprobadas por examen, promoción o equivalencia). Si un estudiante no figura en Guaraní, se usa lo que declaró en el formulario, y la ficha lo avisa.`:`lo que cada estudiante declaró en el formulario de relevamiento (no es un dato oficial).`}</li>
      ${OFICIAL?`<li><b>Regularizadas</b>: regularidades de SIU Guaraní con condición “Regular” cuyo final todavía no está aprobado. Se consideran vigentes si la fecha de vigencia no pasó; las vencidas se muestran aparte.</li>`:""}
      <li><b>Plan 2014</b>: Res. CS 11/2022, con cuatrimestre y correlatividades (regularizadas para cursar, aprobadas para rendir). Se marca “puede cursar en 2027” cuando la materia es de 4° o 5° año y tiene ${OFICIAL?"regularizadas o aprobadas":"aprobadas"} todas sus correlativas.</li>
      <li><b>Dictado 2027</b>: según la propuesta de la coordinación, 1° a 3° año solo del plan 2027 y 4° y 5° año solo del plan 2014. El 4° año del plan 2027 no se dicta en 2027.</li>
      <li><b>Equivalencias</b>: matriz del Anexo I del plan 2027. Teoría Política y Principios de Derecho y Crecimiento y Desarrollo Económico son totales con las dos materias del plan 2014 aprobadas y parciales (coloquio) con una sola.</li>
      <li><b>Créditos</b>: los del plan 2027 (240 CRE la licenciatura, 120 CRE la tecnicatura de 1° y 2° año).</li>
    </ul>
    <h2 class="section">Puntos de la matriz que la comisión debería definir</h2>
    <label class="toggle"><input type="checkbox" id="optSoc" ${SETTINGS.socioSola==="total"?"checked":""}>
      <span><b>Sociología Económica con una sola Mediación y Psicología Social.</b> La tabla pone equivalencia total para MyPS I y para MyPS II por separado, pero el texto dice que la aprobación <i>en conjunto</i> de ambas constituye la equivalencia total. Por defecto se usa el texto: con una sola, coloquio. Marcá esta opción para aplicar la tabla (una sola alcanza). Afecta a <b>${nSoc}</b> estudiante${nSoc===1?"":"s"}.</span></label>
    <label class="toggle"><input type="checkbox" id="optProy" ${SETTINGS.proyAmbas==="total"?"checked":""}>
      <span><b>Evaluación de Proyectos con las dos Formulaciones aprobadas.</b> La matriz da equivalencia parcial por Proyectos Privados y por Proyectos Sociales, pero no dice qué pasa si tiene ambas. Por defecto sigue siendo coloquio; marcá esta opción para darla como total. Afecta a <b>${nProy}</b> estudiante${nProy===1?"":"s"}.</span></label>
    <div class="alerts section">
      <div class="alert a-info"><b>Macroeconomía I (plan 2014) no tiene equivalencia</b>, mientras que Principios de Economía II equivale a Macroeconomía I del plan nuevo. ${nMacro} estudiante${nMacro===1?"":"s"} la ${nMacro===1?"tiene":"tienen"} aprobada y no se les reconoce. Confirmar si es intencional.</div>
      <div class="alert a-info">Tampoco tienen equivalencia: Responsabilidad Social Universitaria Empresarial, Inglés, Economía Ecológica, Economía de la Regulación y Mediación Institucional y Prácticas Profesionales.</div>
      <div class="alert a-info">El documento del plan 2027 no incluye un régimen de correlatividades, así que la ficha no puede indicar qué materias del plan nuevo puede cursar primero.</div>
      <div class="alert a-info">La síntesis del plan nuevo dice “Plan: 2026” y el Anexo I “Plan 2027”.</div>
    </div>`;
    $("optSoc").onchange=e=>{SETTINGS.socioSola=e.target.checked?"total":"parcial";saveSettings();recompute();};
    $("optProy").onchange=e=>{SETTINGS.proyAmbas=e.target.checked?"total":"parcial";saveSettings();recompute();};
  }

  /* ============ Pestañas ============ */
  function showTab(t){
    document.querySelectorAll("nav.tabs button").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.tab===t)));
    ["ficha","resumen","revision","criterios"].forEach(x=>$("tab-"+x).classList.toggle("hidden",x!==t));
  }
  document.querySelectorAll("nav.tabs button").forEach(b=>b.addEventListener("click",()=>showTab(b.dataset.tab)));

  /* ============ Carga de planilla (local) ============ */
  function rowsFromTable(table){
    const head = table[0].map(h=>norm(h));
    const find = re=>head.findIndex(h=>re.test(h));
    const ix = {ts:find(/marca temporal|timestamp/),email:find(/correo|email/),nombre:find(/nombre/),dni:find(/^dni|documento/),
      tel:find(/telefono/),cambio:find(/cambiarte|cambiar/),ingreso:find(/ingreso/)};
    const yi = [1,2,3,4,5].map(n=>head.findIndex(h=>h.includes("aprobadas")&&new RegExp("\\b"+n+"\\s*a(n|ñ)o").test(h)));
    if(ix.dni<0||yi.some(i=>i<0)) throw new Error("No encontré las columnas esperadas (DNI y «Materias aprobadas - N° Año»).");
    return table.slice(1).filter(r=>r.some(v=>v!==""&&v!=null)).map(r=>({
      ts: r[ix.ts] instanceof Date ? r[ix.ts].toISOString() : String(r[ix.ts]??""),
      email:r[ix.email]??"", nombre:r[ix.nombre]??"", dni:String(r[ix.dni]??"").replace(/\.0+$/,""), tel:String(r[ix.tel]??"").replace(/\.0+$/,""),
      cambio:r[ix.cambio]??"", ingreso:String(r[ix.ingreso]??"").replace(/\.0+$/,""), y:yi.map(i=>r[i]??null)}));
  }
  function parseCSV(text){
    const out=[];let row=[],f="",q=false;
    for(let i=0;i<text.length;i++){const ch=text[i];
      if(q){ if(ch=='"'){ if(text[i+1]=='"'){f+='"';i++;} else q=false; } else f+=ch; }
      else if(ch=='"') q=true; else if(ch==','){row.push(f);f="";} else if(ch=='\n'){row.push(f);out.push(row);row=[];f="";} else if(ch!='\r') f+=ch;}
    if(f||row.length){row.push(f);out.push(row);}
    return out;
  }
  function loadScript(src){return new Promise((ok,ko)=>{const s=document.createElement("script");s.src=src;s.onload=ok;s.onerror=()=>ko(new Error("No se pudo cargar el lector de Excel (requiere internet). Probá con un .csv."));document.head.appendChild(s);});}
  async function handleFile(file){
    let table;
    if(/\.csv$/i.test(file.name)) table = parseCSV(await file.text());
    else { if(!window.XLSX) await loadScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js");
      const wb = XLSX.read(await file.arrayBuffer(),{type:"array",cellDates:true});
      table = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:1,raw:true,defval:""}); }
    setRows(rowsFromTable(table), `planilla cargada: ${file.name}`);
  }
  $("fileInput").addEventListener("change",async e=>{
    $("fileErr").textContent=""; const f=e.target.files[0]; if(!f) return;
    try{ await handleFile(f); showTab("resumen"); }catch(err){ $("fileErr").textContent=err.message; }
  });

  /* ============ Datos entregados por el servidor ============ */
  OFICIAL = (datos && datos.oficial) || null;
  setRows((datos && datos.rows) || [], (datos && datos.source) || "sin datos");
  $("q").focus();
}
