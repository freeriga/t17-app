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

// XHR with progress stream

let upload = (file, path) => {
  let stream = {}
  let data = new FormData()
  data.append("file", file)

  let xhr = new XMLHttpRequest()
  xhr.upload.addEventListener(
    "progress",
    e => stream.resolve(e.loaded / file.size),
    false
  )
  xhr.upload.addEventListener(
    "load",
    () => stream.resolve(1),
    false
  )
  xhr.open("POST", `${apiRoot}${path}`)
  xhr.send(data)

  return stream
}

let progress = stream => new Promise(resolve => stream.resolve = resolve)

// Maze app

let APP = async function() {
  meow(Loading("Loading mazes..."))
  let mazes = await pull("/mazes")
  await doze(0.5)
  meow(Loading("Loading clips..."))
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

  // Define a nested action for uploading clips sequentially
  let UPLOAD_CLIPS = nest(
    async function (
      files
    ) {
      for (let file of files) {
        let stream = upload(file, "/clips")
        while (true) {
          let ratio = await progress(stream)
          if (ratio === 1) {
            break
          } else {
            meow(Loading(`Uploading ${file.name}: ${(ratio * 100).toFixed(2)}...`))
          }
        }
        meow(Splash("Done!"))
        await doze(0.5)
      }
    }
  )

  let REFRESH_CLIPS = nest(
    async function () {
      meow(Loading("Refreshing clips..."))
      clips = await pull("/clips")
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
        <label className="button">
          <span>
            Upload
          </span>
          <input
            type="file"
            multiple={true}
            onChange={e => UPLOAD_CLIPS(e.target.files)}
            style={{ display: "none" }}
          />
        </label>
        <span className="button" onClick={ () => REFRESH_CLIPS() }>
          Refresh
        </span>
      </section>
    </div>
  )

  // Wait for any of the nested actions
  await race([
    wait(ADD_CLIP),
    wait(FOO),
    wait(UPLOAD_CLIPS),
    wait(REFRESH_CLIPS),
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
    {x}
  </div>

let jpegs = xs => xs.filter(x => x.kind == "JPEG")