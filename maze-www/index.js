// Settings

const apiHost =
  document.location.host.replace(/^www\./, "api.")
const apiRoot =
  `${document.location.protocol}//${apiHost}`

// Framework

let pull = x => fetch(`${apiRoot}${x}`).then(x => x.json())
let meow = x => ReactDOM.render(x, document.querySelector("#app"))
let doze = x => new Promise(f => setTimeout(() => f(), x * 1000))
let yell = x => console.info(x)
let wait = x => x.promise
let race = x => Promise.race(x)
let nest = f => {
  let resolve
  let promise = new Promise(f => resolve = f)
  let g = x => f(x).then(resolve)
  g.promise = promise
  return g
}

// Maze app

let APP = async function() {
  meow(Loading("mazes"))
  let mazes = await pull("/mazes")
  await doze(0.5)
  meow(Loading("clips"))
  let clips = await pull("/clips")
  await doze(0.5)
  await OVERVIEW({ mazes, clips })
  yell("App exited")
}

setTimeout(APP)

let OVERVIEW = async function ({
  mazes, clips
}) {

  // Define the nested action for clicking on a clip
  let ADD_CLIP = nest(
    async function ({
      name,
      clipfiles,
    }) {
      // This should actually be an interactive chooser thingy
      meow(Splash("Adding clip..."))
      await doze(0.5)
    }
  )

  // Define a dummy nested action for testing
  let FOO = nest(
    async function ({
    }) {
      meow(Splash("Meow!"))
      await doze(0.5)
    }
  )

  // Define the maze renderer
  let Maze = ({
    name,
    slug,
    spots,
  }) => (
    <section>
      <h1>{name}</h1>
      {
        spots.length
          ? spots.map(() => <div>Spot</div>)
          : <i onClick={() => FOO({})}>
              This maze lacks spots.
              Add one by clicking a clip.
            </i>
      }
    </section>
  )

  // Define the clip renderer
  let Clip = clip => (
    <div className="clip">
      {
        jpegs(clip.clipfiles).length
          ?
            <img
             style={{ width: "8rem" }}
             src={`${apiRoot}/blobs/${jpegs(clip.clipfiles)[0].sha2}`}
             onClick={() => ADD_CLIP(clip)}
            />
          : `${name}`

      }
    </div>
  )

  // Render the overview
  meow(
    <div>
      {mazes.map(Maze)}
      <section>
        <h1>Clips</h1>
        <div className="clips">
          {clips.map(Clip)}
        </div>
      </section>
    </div>
  )

  // Wait for any of the nested actions
  await race([
    wait(ADD_CLIP),
    wait(FOO)
  ])

  // Show "Cool!" for a while
  meow(Splash("Cool!"))
  await doze(0.5)

  // Restart the overview
  await OVERVIEW({ mazes, clips })
}

let Splash = x =>
  <div className="centered">
    {x}
  </div>

let Loading = x =>
  <div className="centered">
    <div className="spinner"></div>
    Loading {x}...
  </div>

let array = x => [].slice.call(x)

// fetch(`${apiRoot}/mazes`).then(x => x.json()).then(x => {
//   sleep(0.5).then(() => {
//     update({
//       mazes: x,
//     })
//     fetch(`${apiRoot}/clips`).then(x => x.json()).then(x => {
//       update({
//         loading: null,
//         clips: x,
//       })
//     })
//  })
// })

// setInterval(
//   () =>
//     fetch(`${apiRoot}/clips`).then(x => x.json()).then(x => {
//       update({
//         clips: x,
//       })
//     }),
//   5000
// )

let testUploads = [{sent: 0, "name":"bridge.mov", "size":2323293, "progress":0}, {sent: 0, "name": "catdork.mov","size":2984696,"progress":0},{sent: 0, "name":"daugava.mov","size":3663837,"progress":0}]

let state = {
   loading: "mazes and clips",
   mazes: null,
   clips: null,
   uploads: [],
}

let update = x => { state = Object.assign({}, state, x); render() }

let App = ({
  state: {
    loading,
    mazes,
    clips,
    uploads,
  }
}) =>
  loading
    ? (
      <div className="centered">
        <div className="spinner"></div>
        Loading {loading}...
      </div>
    ) : (
      <div>
        {mazes.map(x => <Maze maze={x}/>)}

        <section>
          <h1>Clips</h1>
          <div className="clips">
            {clips.map(x => <Clip clip={x}/>)}
          </div>
          {uploads.filter(x => !x.done).length == 0
            ? (
                <form>
                   <label>
                     <span
                       style={{
                         cursor: "pointer",
                         borderBottom: "1px solid currentcolor",
                       }}
                     >
                       Upload clips
                     </span>
                     <input
                       type="file"
                       multiple={true}
                       onChange={uploadClips}
                       style={{ display: "none" }}
                     />
                   </label>
                </form>
            ) : (
              <table className="upload-table">
                <tbody>
                  {uploads.map(x =>
                    <tr>
                      <td>{x.name}</td>
                      <td>{x.size}</td>
                      <td>
                      {
                        x.done
                          ? "done"
                          : `${((x.sent / x.size) * 100).toFixed(2)}%`
                      }
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )
          }
        </section>
      </div>
    )

let jpegs = xs => xs.filter(x => x.kind == "JPEG")

function uploadClips(e) {
  update({
    uploads: array(e.target.files).map(x => ({
      name: x.name,
      size: x.size,
      progress: 0,
    }))
  })
  array(e.target.files).forEach((x, i) => {
    let xhr = new XMLHttpRequest()
    xhr.upload.addEventListener(
      "progress", e => {
        console.log(e)
        state.uploads[i].sent = e.loaded
        render()
      }, false
    )
    xhr.upload.addEventListener(
      "load", e => {
        console.log("ok", e)
        state.uploads[i].done = true
        render()
      }, false
    )

    xhr.open("POST", `${apiRoot}/clips`)

    let data = new FormData()
    data.append("file", x)
    xhr.send(data)
  })
}
