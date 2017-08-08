const apiHost =
  document.location.host.replace(/^www\./, "api.")
const apiRoot =
  `${document.location.protocol}//${apiHost}`

let sleep = secs =>
  new Promise(resolve => setTimeout(() => resolve(), secs * 1000))

let array = x => [].slice.call(x)

fetch(`${apiRoot}/mazes`).then(x => x.json()).then(x => {
  sleep(0.5).then(() => {
    update({
      mazes: x,
    })
    fetch(`${apiRoot}/clips`).then(x => x.json()).then(x => {
      update({
        loading: null,
        clips: x,
      })
    })
 })
})

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
        <section>
          <h1>Mazes</h1>
          {mazes.map(x => <Maze maze={x}/>)}
        </section>

        <section>
          <h1>Clips</h1>
          {clips.map(x => <Clip clip={x}/>)}
          {uploads.length == 0
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
                        x.sent >= x.size
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

let Maze = ({
  maze: {
    name,
    slug,
  }
}) => (
  <div>
    {name}
  </div>
)

let Clip = ({
  clip: {
    name,
  }
}) => (
  <div>
    {name}
  </div>
)

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
      }, false
    )

    xhr.open("POST", `${apiRoot}/clipfiles`)

    let data = new FormData()
    data.append("file", x)
    xhr.send(data)
  })
}

let render = () => {
  ReactDOM.render(<App state={state}/>, document.querySelector("#app"))
}

render()