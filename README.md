# COMEDOR-TECH — Guía de trabajo colaborativo con Git, GitHub y P4Merge

Este repositorio contiene el prototipo funcional de **COMEDOR-TECH**
(login, reserva de ticket y control de acceso) y, sobre todo, la guía
paso a paso para cumplir los dos criterios de la práctica:

1. Flujo de trabajo con **al menos 3 colaboradores** y ramas `master`,
   `main` y `test`, terminando en un **conflicto provocado** entre
   `main` y `test`.
2. Resolución del conflicto con **P4Merge** y validación final por
   parte del `master`.

Sustituye `<usuario>` por tu usuario de GitHub y `<colab1>`, `<colab2>`
por los usuarios de tus dos compañeros en todos los comandos.

---

## 0. Estructura del proyecto

```
comedor-tech/
├── index.html        # Login (pantalla 1 del wireframe)
├── reserva.html       # Identificación + turno + generar ticket
├── acceso.html        # Escaneo, validación y "registrar servido"
├── css/style.css
├── js/
│   ├── config.js       # archivo compartido (aquí se provoca el conflicto)
│   ├── auth.js          # login e inicialización de usuarios -> rama TEST
│   ├── identidad.js      # identificación del estudiante -> rama MAIN
│   └── ticket.js          # generación/validación de tickets
└── README.md
```

Puedes abrir `index.html` directamente en el navegador (usa
`localStorage`, no necesita servidor ni base de datos real). Usuario
de prueba: código `221045`, contraseña `221045`.

---

## 1. Preparar el repositorio y a los colaboradores

```bash
cd comedor-tech
git init
git add .
git commit -m "chore: estructura inicial del prototipo COMEDOR-TECH"

# Crea el repo en GitHub (vacío) y enlázalo
git branch -M master
git remote add origin https://github.com/<usuario>/comedor-tech.git
git push -u origin master
```

En GitHub: **Settings → Collaborators → Add people** y agrega a tus
2 (o más) compañeros como *colaboradores* del repositorio. Con 3
colaboradores en total (tú + 2) ya cumples el mínimo pedido; si el
grupo tiene más integrantes, agrégalos igual.

Cada colaborador clona el repo en su máquina:

```bash
git clone https://github.com/<usuario>/comedor-tech.git
cd comedor-tech
```

---

## 2. Rol de cada rama (según la consigna)

| Rama    | Responsable          | Qué hace |
|---------|-----------------------|----------|
| `master`| Colaborador líder (Master) | Rama principal protegida. Sólo acepta *pull requests* ya revisados de `main`/`test`. |
| `main`  | Colaborador A          | Modifica **la identificación del comensal** (`identidad.js`, `reserva.html`). |
| `test`  | Colaborador B          | Construye el **login** e inicializa usuarios administrador/colaborador (`auth.js`, `index.html`). |

Ambas ramas parten de `master`:

```bash
git checkout master
git pull origin master

git checkout -b main
git push -u origin main

git checkout master
git checkout -b test
git push -u origin test
```

---

## 3. Iteración de trabajo (mínimo 5 commits por rama)

### 3.1 Rama `main` — Colaborador A (identificación del lector/estudiante)

```bash
git checkout main
git pull origin main
```

Realiza cambios reales en `js/identidad.js` y `reserva.html` en al
menos 5 confirmaciones separadas, por ejemplo:

```bash
# commit 1
git add js/identidad.js
git commit -m "feat(main): agrega validación de código vacío en identificarEstudiante"

# commit 2
git add reserva.html
git commit -m "feat(main): muestra mensaje cuando el estudiante no es encontrado"

# commit 3
git add js/identidad.js
git commit -m "feat(main): incluye estado 'No apto' cuando el comensal tiene deuda"

# commit 4
git add reserva.html
git commit -m "style(main): ajusta el badge de estado del comensal"

# commit 5 — aquí se toca el archivo compartido a propósito
git add js/config.js
git commit -m "chore(main): actualiza ULTIMA_FUNCIONALIDAD a 'Identificación de comensal mejorada'"

git push origin main
```

### 3.2 Rama `test` — Colaborador B (login e inicialización de usuarios)

```bash
git checkout test
git pull origin test
```

Igual que arriba, mínimo 5 commits reales sobre `auth.js` e
`index.html`:

```bash
# commit 1
git add js/auth.js
git commit -m "feat(test): agrega inicializarUsuarios con admin y colaborador"

# commit 2
git add js/auth.js
git commit -m "feat(test): permite login por código o correo institucional"

# commit 3
git add index.html
git commit -m "feat(test): conecta formulario de login con auth.js"

# commit 4
git add js/auth.js
git commit -m "feat(test): agrega requerirSesion para proteger reserva.html y acceso.html"

# commit 5 — mismo archivo y misma línea que tocó "main"
git add js/config.js
git commit -m "chore(test): actualiza ULTIMA_FUNCIONALIDAD a 'Login con roles administrador/colaborador'"

git push origin test
```

> Con esto, ambas ramas modificaron **la misma línea** del comentario
> `ULTIMA_FUNCIONALIDAD` en `js/config.js`, con contenido distinto:
> esa es la causa del conflicto que pide el punto 1.4.

---

## 4. Provocar y subir el conflicto

El **Master** intenta unir ambas ramas en una sola (por ejemplo,
fusionando `test` dentro de `main`, o ambas hacia una rama temporal
`integracion`):

```bash
git checkout main
git pull origin main
git merge origin/test
```

Git detendrá la fusión y mostrará:

```
Auto-merging js/config.js
CONFLICT (content): Merge conflict in js/config.js
Automatic merge failed; fix conflicts and then commit the result.
```

Confirma el conflicto y súbelo tal cual (sin resolver) para que quede
registrado en GitHub, tal como pide la consigna ("Hecho esta parte
debe de subir a su github"):

```bash
git status
git add -A
git commit -m "wip: conflicto pendiente entre main y test en js/config.js"
git push origin main
```

(GitHub mostrará el archivo con las marcas `<<<<<<<`, `=======`,
`>>>>>>>` sin resolver — eso es evidencia del conflicto para tu
sustentación.)

---

## 5. Resolver el conflicto con P4Merge

1. Instala **P4Merge** (Helix Visual Merge Tool, gratuito):
   https://www.perforce.com/downloads/visual-merge-tool
2. Configura Git para usarlo como *mergetool*:

```bash
git config --global merge.tool p4merge
git config --global mergetool.p4merge.cmd \
  "p4merge \"\$BASE\" \"\$LOCAL\" \"\$REMOTE\" \"\$MERGED\""
git config --global mergetool.keepBackup false
```

   *(En Windows, usa la ruta completa a `p4merge.exe`, por ejemplo
   `C:/Program Files/Perforce/p4merge.exe`.)*

3. Con el conflicto aún abierto (paso 4), lanza la herramienta:

```bash
git mergetool
```

   Se abrirá P4Merge con 3/4 paneles:
   - **Base**: versión común antes de divergir.
   - **Local (mío)**: tu versión (`main`).
   - **Remote (de ellos)**: la versión de `test`.
   - **Merged result**: donde eliges/edita la línea final.

4. En el panel central, decide el texto definitivo, por ejemplo:

```js
const ULTIMA_FUNCIONALIDAD =
  "Identificación de comensal + login con roles administrador/colaborador";
```

5. Guarda el archivo combinado desde P4Merge y cierra la herramienta.
6. Vuelve a la terminal y finaliza la fusión:

```bash
git add js/config.js
git commit -m "merge: resuelve conflicto de config.js usando P4Merge"
git push origin main
```

---

## 6. Validación final por el `master`

El colaborador con rol **Master** revisa la fusión ya resuelta y la
integra a la rama principal (vía Pull Request en GitHub o merge
directo):

```bash
git checkout master
git pull origin master
git merge origin/main --no-ff -m "master: valida e integra la fusión resuelta de main/test"
git push origin master
```

En GitHub, abre el **Pull Request** de `main → master`, revisa el
diff de `js/config.js` (ya sin marcas de conflicto) y aprieta
**"Merge pull request"**. Deja un comentario del Master indicando que
valida el conflicto resuelto, cerrando así el punto **2.1** de la
consigna.

---

## 7. Checklist para la entrega

- [ ] Repositorio en GitHub con mínimo 3 colaboradores agregados.
- [ ] Ramas `master`, `main` y `test` visibles en GitHub, cada una
      con ≥ 5 commits propios y significativos.
- [ ] Historial que muestre el conflicto sin resolver subido a GitHub
      (captura de pantalla del archivo con `<<<<<<<`/`=======`/`>>>>>>>`).
- [ ] Captura de P4Merge resolviendo el conflicto (los 3-4 paneles).
- [ ] Commit de merge final firmado/hecho por el Master.
- [ ] Pull Request de `main → master` aprobado y fusionado.
