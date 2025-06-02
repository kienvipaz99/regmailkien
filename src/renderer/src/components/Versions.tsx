function Versions(): JSX.Element {
  // const [versions] = useState(window.electron.process.versions)

  return (
    <ul className="versions">
      <li className="electron-version">Electron v</li>
      <li className="chrome-version">Chromium v</li>
      <li className="node-version">Node v</li>
    </ul>
  )
}

export default Versions
