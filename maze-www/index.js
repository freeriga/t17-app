// Settings

const apiHost =
  document.location.host.replace(/^www\./, "api.")
const apiRoot =
  `${document.location.protocol}//${apiHost}`

// Framework

let get = (xs, id) => xs.filter(x => x.id == id)[0]

let pull = x => fetch(`${apiRoot}${x}`).then(x => x.json())
let push = (x, y) =>
  fetch(`${apiRoot}${x}`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(y),
  }).then(x => x.json())
let meow = x => ReactDOM.render(x, document.querySelector("#app"))
let doze = x => new Promise(f => setTimeout(() => f(), x * 1000))
let yell = x => console.info(x)
let wait = x => x.promise
let race = x => Promise.race(x)
let pick = x => race(x.map(wait))
let nest = f => {
  let resolve
  let promise = new Promise(f => resolve = f)
  let g = x => f(x).then(resolve)
  g.promise = promise
  return g
}

let defer = x => setTimeout(x, 0)

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

defer(APP)

let OVERVIEW = async function ({
  mazes, clips
}) {

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

  let CLICK_CLIP = nest(
    async function ({
      id, name, clipfiles
    }) {

      let MAKE = nest(
        async function ({
          name, maze
        }) {
          meow(Loading("Making new spot..."))
          await doze(0.5)
          await push(`/spots`, {
            clip: id,
            maze,
            name
          })
          meow(Loading("Refreshing mazes..."))
          mazes = await pull("/mazes")
        }
      )

      let CANCEL = nest(
        async function () {
          meow(Splash("Cancelled."))
          await doze(0.5)
        }
      )

      let $select, $name

      meow(
        <div className="dialog">
          <section>
            <h1>New spot</h1>
            <video
              autoPlay
              loop
              src={videoSource(clipfiles)}
            />
            <form
              onSubmit={e => {
                e.preventDefault()
                MAKE({
                  name: $name.value,
                  maze: $select.value,
                })
             }}
            >
              <select ref={x => $select = x}>
                {
                  mazes.map(
                    x => <option value={x.id}>{x.name}</option>
                  )
                }
              </select>
              <input
                ref={x => $name = x}
                autoFocus
                placeholder="Spot name"
              />
              <span
                className="button"
                onClick={
                  () => MAKE({
                    name: $name.value,
                    maze: $select.value,
                  })
                }
              >
                Make spot
              </span>
              <span className="button" onClick={CANCEL}>
                Cancel
              </span>
            </form>
          </section>
        </div>
      )

      await pick([MAKE, CANCEL])
    }
  )

  let ADD_EDGE = nest(
    async function ({
      src, dst,
    }) {
      meow(
        <div className="dialog">
          <section>
            <h1>
              <center>
                <b>{src.name}</b> → <b>{dst.name}</b>
              </center>
            </h1>
            <form>
              <input placeholder={"e.g., \"To the east is @.\""} />
            </form>
          </section>
        </div>
      )
      await doze(5)
    }
  )

  let Maze = ({
    name,
    slug,
    spots,
  }) => {
    let nodes = new vis.DataSet(spots.map(x => ({
      id: x.id,
      label: x.name,
      image: thumbnailUrl(x.clip),
    })))
    let edges = new vis.DataSet([])
    let $graph

    defer(
      () => new vis.Network(
        $graph,
        { nodes, edges },
        {
          height: "500px",
          physics: { enabled: true },
          nodes: {
            font: {
              size: 16,
              face: "source code pro",
            },
            shape: "circularImage",
            mass: 2.25,
          },
          manipulation: {
            enabled: true,
            addNode: false,
            initiallyActive: true,
            addEdge: (data, callback) => {
              ADD_EDGE({
                src: get(spots, data.from),
                dst: get(spots, data.to),
              })
            }
          },
        }
      )
    )

    return (
      <section>
        <h1>{name}</h1>
        {
          spots.length
            ? <div ref={x => $graph = x}/>
            : <i>
                This maze lacks spots.
                Add one by clicking a clip.
              </i>
        }
      </section>
    )
  }

  let Spot = ({
    name, clip
  }) => (
    <div>
      <b>{name}</b>
    </div>
  )

  let Clip = clip => (
    <div className="clip">
      {
        jpegs(clip.clipfiles).length
          ?
            <img
             style={{ width: "8rem" }}
             src={`${apiRoot}/blobs/${jpegs(clip.clipfiles)[0].sha2}`}
             onClick={() => CLICK_CLIP(clip)}
            />
          : `${name}`

      }
    </div>
  )

  let $files

  // Render the overview
  meow(
    <div>
      {mazes.map(Maze)}
      <section>
        <h1>Clips</h1>
        <div className="clips">
          {clips.map(Clip)}
        </div>
        <form>
          <label className="button">
            <span>
              Upload
            </span>
            <input
              ref={x => $files = x}
              type="file"
              multiple={true}
              onChange={() => UPLOAD_CLIPS($files.files)}
              style={{ display: "none" }}
            />
          </label>
          <span
            className="button"
            onClick={ () => REFRESH_CLIPS() }
          >
            Refresh
          </span>
        </form>
      </section>
    </div>
  )

  // Wait for any of the nested actions
  await pick([
    UPLOAD_CLIPS,
    REFRESH_CLIPS,
    CLICK_CLIP,
    ADD_EDGE,
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

let videoSource = xs =>
  `${apiRoot}/blobs/${xs.filter(x => x.kind == "MP4 H264 Vorbis")[0].sha2}`

let thumbnailUrl = x =>
  `${apiRoot}/blobs/${jpegs(x.clipfiles)[0].sha2}`